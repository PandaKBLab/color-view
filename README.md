# Color View

### 8-color Memory LCD for ZMK split keyboards

**English** · [简体中文](README.zh-CN.md) · [日本語](README.ja.md)

Give your DIY keyboard a colorful place for layers, battery status, connection information, and your own display layouts.

Color View is a 1.33-inch, 128 × 128 Memory LCD module for DIY keyboards. It supports eight colors through a five-wire connection: power, ground, SCK, MOSI, and CS.

**Availability:** Not listed for sale yet. Purchase information will be added here when the product launches.

**Repository status:** Documentation starter. A Color View reference integration exists for a custom Helix keyboard with nice!nano v2; a reusable public driver package and ready-to-build keyboard examples have not been published here yet.

## Start here

| I want to… | Read |
| --- | --- |
| Check the connector and electrical requirements | [Hardware and wiring](docs/hardware.md) |
| Check PCB size, thickness, and removable M2 ears | [Dimensions and installation](docs/mechanical.md) |
| Check my controller or keyboard | [Compatibility](docs/compatibility.md) |
| Understand the ZMK integration | [ZMK integration notes](docs/zmk.md) |
| Plan a display layout | [Display layout ideas](docs/display-layouts.md) |
| Find firmware examples and their status | [Examples](examples/README.md) |

The detailed technical documents currently use English. The three README versions share the same hardware and support information.

## What you can build

- A compact status page for the active layer, battery, and USB/Bluetooth output.
- Color-coded layer indicators and small icons.
- A keymap preview with local key-press highlighting.
- A personal logo or a small animation driven by keyboard events.

These are firmware layout ideas, not functions built into the display module. Available information on the peripheral half depends on the keyboard's state synchronization.

## At a glance

| Item | Detail |
| --- | --- |
| Display | 1.33-inch, 128 × 128 pixels |
| Colors | Black, white, red, green, blue, cyan, magenta, yellow |
| Interface | SPI writes: SCK, MOSI, active-high CS; no MISO |
| Reference connection | Regulated 3.3 V supply and 3.3 V logic |
| Primary firmware audience | ZMK split-keyboard builders |
| Reference controller | nice!nano v2 in the custom Helix integration |

The 3.3 V connection describes the current reference setup; a guaranteed operating range and measured module power-consumption figures are not published yet. Read the [electrical notes](docs/hardware.md#power-and-validation) before integrating it.

## Size, mounting, and connectors

![Color View PCB dimensions and assembled thickness](assets/mechanical/color-view-dimensions.svg)

- **Connection options:** J1 is a 1 × 5, 2.54 mm header interface; J2 is a 5-pin, 0.50 mm FPC interface with bottom contacts for a 0.30 mm cable contact section. Use either connector.
- **PCB outline:** 26.99 × 45.48 mm with all four ears; nominal body 26.99 × 36.34 mm after removing the ears and dressing residual edges.
- **Mounting:** four removable ears with 2.20 mm holes for M2 screws; hole centers are 21.00 × 41.19 mm apart.
- **Thickness:** PCB 1.00 mm, components 1.00 mm, screen 0.85 mm, and an adhesive layer between the PCB and screen. Actual assembled thickness is 3.00 mm; the adhesive thickness is approximately 0.15 mm, inferred from those values.
- **Protective film:** the display surface has a removable film that can be peeled off before use.

See [dimensions and installation](docs/mechanical.md) for coordinates and [the connector diagram](assets/wiring/color-view-connectors.svg) for pin orientation. Outline values are CAD nominal dimensions; allow for the purchased revision and mating hardware.

## Before connecting

1. Identify your module revision and the connector's pin numbers.
2. Check that three suitable signal GPIOs are available on your keyboard.
3. Follow the wiring table; J1 and J2 have different pin-number orders.
4. Use a Color View-compatible driver and the correct keyboard-specific configuration.
5. Verify colors, orientation, sleep/wake behavior, and both halves before regular use.

Color View requires a matching color-display driver. A generic monochrome driver is not a drop-in replacement. Keep the supported driver's background display maintenance running while the module is powered, even for a static image.

## Follow the project

The launch page, product photos, wiring illustrations, and tested firmware examples will be added as they become available. You can star [PandaKBLab/color-view](https://github.com/PandaKBLab/color-view) to keep the project easy to find.

For integration questions, include your keyboard revision, controller, module revision, ZMK revision, GPIO mapping, and the relevant error or build log.

Maintained by **PandaKB / PandaKBLab**. ZMK configuration also requires a matching display driver; see the [official display configuration guide](https://zmk.dev/docs/config/displays).
