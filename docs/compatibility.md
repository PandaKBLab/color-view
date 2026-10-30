# Compatibility

[Project overview](../README.md) · [Hardware](hardware.md) · [Examples](../examples/README.md)

Controller suitability, keyboard wiring, driver integration, successful compilation, and hardware testing are separate checks. A keyboard name alone does not guarantee compatibility.

## Current documentation status

| Target | Status |
| --- | --- |
| Custom Helix keyboard + nice!nano v2 | A Color View reference integration exists in the development project. Its reusable public example is not published here yet. |
| Other nice!nano v2 keyboards | Integration candidates; check GPIO availability, supply control, and the keyboard revision. |
| Sofle | Planned example; no tested configuration or ready-made firmware is currently published here. |
| Lily58 | Planned example; no tested configuration or ready-made firmware is currently published here. |
| XIAO nRF52840 | Porting candidate; board-specific pin assignment and supply control require validation. |
| E73 nRF52840 modules | Porting candidate; the exact module, carrier circuit, board definition, and supply must be identified. |

## Check before choosing an example

- Exact keyboard PCB revision and connector pinout.
- Exact controller revision and available SCK, MOSI, and CS pins.
- Any GPIO conflicts with the key matrix, encoders, LEDs, or other peripherals.
- How display power is switched and whether that rail is shared.
- The ZMK, Zephyr, and UI-library revisions used by that example.
- Whether one display or two displays are installed, and the central/peripheral roles.
- Display mounting orientation and rotation in the firmware.

Each published example should state its compile status and hardware-test status separately. Builds for another keyboard must not be presented as interchangeable firmware.
