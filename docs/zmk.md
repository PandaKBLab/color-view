# ZMK integration notes

[Project overview](../README.md) · [Hardware](hardware.md) · [Compatibility](compatibility.md)

## Current status

A Color View driver and ZMK integration exist in the custom Helix development project. A reusable public package is not yet included in this repository. The information below explains the integration requirements; it is not a complete build recipe.

## Required pieces

1. A Color View-compatible display driver and its build configuration.
2. A matching Devicetree binding and a display node selected by `zephyr,display`.
3. Keyboard-specific SPI, chip-select, and power-control definitions.
4. A status-screen implementation, including any state synchronization needed on the peripheral half.
5. Compatible, pinned ZMK/Zephyr/UI-library versions.

Enabling ZMK's display support does not automatically supply a Color View driver. Use the binding string, configuration options, and dependency versions supplied with the matching driver release. ZMK documents display configuration and driver selection in its [official guide](https://zmk.dev/docs/config/displays).

## Host configuration

The UI targets a 128 × 128 display with eight supported colors. Use the driver-supported UI pixel format and let the driver perform display conversion and transfer handling.

The reference connection uses SPI Mode 0 at 500 kHz, with active-high CS. Assign SCK, MOSI, and CS using the [connector table](hardware.md#connector-pin-numbers). MISO is not required. Keep the driver's documented transaction and controller settings; changing only a Devicetree label does not make another display driver compatible.

Keep the driver's background display maintenance running while the module is powered, including for a static image. Suspending the UI and physically switching off the display supply are different operations. Full power-off requires transfer completion, prevention of signal back-powering, and reinitialization/redraw after power returns.

## Reference dependency versions

The inspected Helix reference uses the following versions. These describe that reference, not a promise of support for current upstream `main`.

| Component | Reference |
| --- | --- |
| ZMK | v0.3.0, `edf5c0814fd3ea202e43aad2d68fd32e882a518c` |
| Zephyr | `dacab4875df72109b96cc8977547a0dc04875bcd` |
| LVGL | `8a6a2d1d29d17d1e4bdc94c243c146a39d635fdd` |
| Board target in that reference | `nice_nano_v2` |

The existing reference includes keyboard-specific power and UI integration. A reusable package must separate those dependencies. If LEDs and the display share a keyboard power rail, coordinate both loads before switching it. Copying only a display C file is insufficient.

When that package is ready, use ZMK's documented [module structure](https://zmk.dev/docs/development/module-creation), publish its build instructions, and add tested examples here. Until then, this repository does not provide a copy-and-paste firmware installation command.
