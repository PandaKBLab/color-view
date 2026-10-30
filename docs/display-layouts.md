# Display layout ideas

[Project overview](../README.md) · [Examples](../examples/README.md)

These are layout directions for 128 × 128 Color View screens. This page does not yet include downloadable artwork, screenshots, or runnable UI examples.

| Layout | Suggested content | Suitable starting point |
| --- | --- | --- |
| Basic status | Active layer, local battery, actual USB/BLE output | First integration and debugging |
| Color-coded layers | Layer name, a consistent color per layer, a few icons | Everyday keyboard use |
| Keymap preview | Local key labels and physical key-press highlighting | Keymap exploration and remapping |
| Personal layout | Logo, a small event-triggered animation, selected status items | Visual customization |

Start with a basic status page. Add animation and cross-half synchronization after display, keyboard input, sleep, and wake behavior have been verified.

## Design notes

- Use a clear hierarchy: a few large values are easier to read than many small labels.
- Design for the eight supported colors. The driver converts UI colors to the module's palette.
- Keep text and icons within the 128 × 128 area, including at the chosen rotation.
- Show an unknown or disconnected state when information is unavailable.
- The peripheral half needs explicit synchronization for central-only information; a second screen does not automatically receive every ZMK status.
- Update changed content and avoid unnecessary full-screen redraws. Let the display driver continue its background maintenance independently of UI activity.
- Compare layouts on the actual screen before publishing screenshots or power-consumption claims.

Published examples should include a real screen photo, the layout source, asset attribution where applicable, a short customization guide, and the exact firmware version used.
