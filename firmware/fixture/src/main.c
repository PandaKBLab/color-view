#include <stdbool.h>
#include <stdint.h>

#include <zephyr/device.h>
#include <zephyr/devicetree.h>
#include <zephyr/drivers/gpio.h>
#include <zephyr/kernel.h>
#include <zephyr/sys/util.h>

enum {
    PIN_CS = 8,
    PIN_POWER = 13,
    PIN_LED = 15,
    PIN_MOSI = 17,
    PIN_SCK = 20,
    SIDE = 128,
    ROW_BYTES = SIDE * 3 / 8,
    ROWS_PER_TRANSFER = 16,
    COM_INTERVAL_MS = 500,
    POWER_SETTLE_MS = 20,
    DISCHARGE_MS = 1000,
    SWAP_MS = 8000,
    FRAME_MS = 1000,
};

enum pattern {
    BLACK = 0, RED = 1, GREEN = 2, BLUE = 4, WHITE = 7,
    HORIZONTAL = 8, VERTICAL, CHECKER, INVERTED, MARKERS, MARKERS_MOVED,
};

static const struct device *const port = DEVICE_DT_GET(DT_NODELABEL(gpio0));
static const enum pattern frames[] = {
    BLACK, WHITE, RED, GREEN, BLUE, GREEN | BLUE, RED | BLUE, RED | GREEN,
    HORIZONTAL, VERTICAL, CHECKER, INVERTED, MARKERS, MARKERS_MOVED,
};
static bool com_high;
static int64_t next_com;

static void write_byte(uint8_t byte)
{
    for (unsigned bit = 0; bit < 8; ++bit) {
        gpio_pin_set_raw(port, PIN_MOSI, (byte >> bit) & 1u);
        k_busy_wait(1);
        gpio_pin_set_raw(port, PIN_SCK, 1);
        k_busy_wait(1);
        gpio_pin_set_raw(port, PIN_SCK, 0);
    }
}

static void select_panel(void)
{
    gpio_pin_set_raw(port, PIN_CS, 1);
    k_busy_wait(3);
}

static void deselect_panel(void)
{
    k_busy_wait(1);
    gpio_pin_set_raw(port, PIN_CS, 0);
    gpio_pin_set_raw(port, PIN_MOSI, 0);
    k_busy_wait(2);
}

static void send_command(uint8_t command)
{
    select_panel();
    write_byte(command | (com_high ? 2u : 0u));
    write_byte(0);
    deselect_panel();
}

static void service_com(void)
{
    if (k_uptime_get() >= next_com) {
        com_high = !com_high;
        send_command(0);
        next_com = k_uptime_get() + COM_INTERVAL_MS;
    }
}

static uint8_t pixel(enum pattern pattern, unsigned x, unsigned y)
{
    switch (pattern) {
    case HORIZONTAL:
        return y % 2 ? WHITE : BLACK;
    case VERTICAL:
        return x % 2 ? WHITE : BLACK;
    case CHECKER:
    case INVERTED:
        return ((x ^ y ^ (pattern == INVERTED)) & 1u) ? WHITE : BLACK;
    case MARKERS:
    case MARKERS_MOVED: {
        if (x < 2 || y < 2 || x >= SIDE - 2 || y >= SIDE - 2) {
            return BLACK;
        }
        if (x < 15 && y < 15) { return RED; }
        if (x >= 113 && y < 15) { return GREEN; }
        if (x < 15 && y >= 113) { return BLUE; }
        if (x >= 113 && y >= 113) { return RED | GREEN; }
        if ((y >= 43 && y < 77 && x >= 63 && x <= 65) ||
            (y >= 43 && y <= 61 && (x == 64 - (y - 43) || x == 64 + (y - 43)))) {
            return BLACK;
        }
        const unsigned marker_x = pattern == MARKERS ? 22 : 94;
        return x >= marker_x && x < marker_x + 12 && y >= 90 && y < 102
            ? BLUE : WHITE;
    }
    default:
        return (uint8_t)pattern;
    }
}

static void send_frame(enum pattern pattern)
{
    for (unsigned first = 0; first < SIDE; first += ROWS_PER_TRANSFER) {
        service_com();
        select_panel();
        write_byte(1u | (com_high ? 2u : 0u));
        for (unsigned y = first; y < first + ROWS_PER_TRANSFER; ++y) {
            uint8_t row[ROW_BYTES] = {0};
            for (unsigned x = 0; x < SIDE; ++x) {
                const uint8_t color = pixel(pattern, x, y);
                for (unsigned channel = 0; channel < 3; ++channel) {
                    unsigned bit = x * 3 + channel;
                    row[bit / 8] |= ((color >> channel) & 1u) << (bit % 8);
                }
            }
            write_byte(y + 1);
            for (unsigned i = 0; i < ROW_BYTES; ++i) {
                write_byte(row[i]);
            }
            write_byte(0);
        }
        write_byte(0);
        deselect_panel();
    }
}

static void wait_with_com(int64_t deadline)
{
    for (;;) {
        service_com();
        int64_t now = k_uptime_get();
        if (now >= deadline) {
            return;
        }
        k_msleep((int32_t)MAX(1, MIN(deadline, next_com) - now));
    }
}

static void power_off(void)
{
    gpio_pin_set_raw(port, PIN_LED, 0);
    gpio_pin_set_raw(port, PIN_CS, 0);
    gpio_pin_set_raw(port, PIN_MOSI, 0);
    gpio_pin_set_raw(port, PIN_SCK, 0);
    gpio_pin_set_raw(port, PIN_POWER, 0);
}

int main(void)
{
    if (!device_is_ready(port)) {
        return 1;
    }
    const unsigned outputs[] = {PIN_POWER, PIN_CS, PIN_SCK, PIN_MOSI, PIN_LED};
    for (unsigned i = 0; i < ARRAY_SIZE(outputs); ++i) {
        if (gpio_pin_configure(port, outputs[i], GPIO_OUTPUT_LOW)) {
            return 1;
        }
    }

    for (;;) {
        power_off();
        k_msleep(DISCHARGE_MS);
        for (unsigned elapsed = 0; elapsed < SWAP_MS; elapsed += 1000) {
            gpio_pin_set_raw(port, PIN_LED, 1);
            k_msleep(500);
            gpio_pin_set_raw(port, PIN_LED, 0);
            k_msleep(500);
        }

        gpio_pin_set_raw(port, PIN_LED, 1);
        gpio_pin_set_raw(port, PIN_POWER, 1);
        k_msleep(POWER_SETTLE_MS);
        com_high = false;
        send_command(4);
        next_com = k_uptime_get() + COM_INTERVAL_MS;

        int64_t deadline = k_uptime_get();
        for (unsigned i = 0; i < ARRAY_SIZE(frames); ++i) {
            send_frame(frames[i]);
            deadline += FRAME_MS;
            wait_with_com(deadline);
        }
        send_command(4);
        k_busy_wait(30);
    }
}
