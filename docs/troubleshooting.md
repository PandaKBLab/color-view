# Troubleshooting

[Project overview](../README.md) · [Hardware](hardware.md) · [ZMK](zmk.md)

| Symptom | Check first |
| --- | --- |
| Blank screen | Connector pin numbers, actual module supply, common ground, display-driver initialization, CS polarity |
| Colored lines or incorrect colors | Correct Color View driver/revision, supported SPI settings, wiring, and complete transfers |
| Upside-down image | The keyboard-specific orientation setting and the driver's pixel mapping |
| Fails after sleep | Supply switching, SPI back-powering, display restoration, and shared-rail coordination |
| Problems with radio or LED activity | Actual supply at the module, wiring, grounding, and load changes |
| Peripheral screen lacks status | Whether the keyboard firmware synchronizes that information to the peripheral half |
| Build errors after an update | The example's pinned ZMK, Zephyr, UI-library, and module revisions |

A multimeter can check DC supply and wiring, but cannot rule out fast supply transients or high-frequency ringing. Keep hardware observations separate from compile results.

When reporting an issue, include:

- Keyboard PCB revision, controller, and Color View module revision.
- Connector used and the actual GPIO-to-signal mapping.
- ZMK revision and any display-module revision.
- Whether the problem affects the left half, right half, or both.
- Reproduction steps and the relevant log or build error.
