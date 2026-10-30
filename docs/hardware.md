# Hardware and wiring

[Project overview](../README.md) · [Compatibility](compatibility.md) · [ZMK](zmk.md)

This guide describes the external interface of the Color View module used in the current project. Match the connector labels and module revision before applying it to another board revision.

## Display

| Item | Value |
| --- | --- |
| Size | 1.33-inch |
| Resolution | 128 × 128 |
| Colors | Black, white, red, green, blue, cyan, magenta, yellow |
| Communication | SPI writes; SCK, MOSI, and CS |
| Chip select | Active high; low when idle |
| Reference SPI configuration | Mode 0, 500 kHz, with the matching Color View driver |

## Connector pin numbers

These are **module-side pin numbers**, not a left-to-right view of the connector. J1 and J2 provide the same signals with different numbering. Use one input connector.

| Signal | J1 pin | J2 pin | Keyboard connection |
| --- | --- | --- | --- |
| MOSI | 1 | 5 | Assigned SPI data output |
| SCK | 2 | 4 | Assigned SPI clock output |
| VCC_IN | 3 | 3 | Controlled, regulated 3.3 V in the reference configuration |
| GND | 4 | 2 | Common ground on that keyboard half |
| CS | 5 | 1 | Assigned active-high chip select |

- Use 3.3 V signal levels for the keyboard-side connection.
- Check FPC contact orientation and each pin number before connecting a cable.
- Do not connect the module directly to a four-pin I²C OLED connector.
- Do not power the module simultaneously from different sources through J1 and J2.
- An OLED or nice!view connector is not evidence of electrical or firmware compatibility. Check the actual pin assignment.

## Power and validation

The reference project supplies this module with regulated **3.3 V** and uses **3.3 V logic**. This is a development reference, not a qualified operating range. Successful operation in the project does not establish performance across all module batches, temperatures, or controller power supplies.

Do not connect a raw battery, USB 5 V, or 5 V logic to this reference configuration. Use the supply requirements published for the purchased module revision.

No validated module-only current, battery-life figure, or guaranteed operating range for the 3.3 V implementation is published here yet. Verify the actual module supply during startup, radio activity, LED switching, and low-battery operation.

Use a suitable supply switch or the controller's supported peripheral-power output. A signal GPIO must not directly supply the module. Coordinate power control when LEDs and the display share a rail.

## Display maintenance and power-off

**Keep an image visible:** leave the module powered and keep the supported driver's background display maintenance running. UI redraws may stop when nothing changes; display maintenance must continue independently.

**Switch the screen off:** use the driver's suspend/power-off procedure, finish outstanding SPI transfers, place CS/SCK/MOSI in a state that prevents back-powering, and then switch off the supply. After power returns, reinitialize and redraw through the driver. This module revision has no separate external display-enable pin; keyboard-side power switching is required for a full power-off.

## Mechanical integration

Use the final mechanical drawing for your purchased module revision before designing a keyboard PCB or enclosure. Dimensions and FPC clearance from older prototypes are not a substitute for that drawing. A release drawing will be added when the product revision is finalized.
