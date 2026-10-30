# Firmware examples

[Project overview](../README.md) · [Compatibility](../docs/compatibility.md) · [ZMK integration](../docs/zmk.md)

No ready-to-build firmware example or downloadable UF2 is published in this starter repository yet.

| Example | Publication status |
| --- | --- |
| Custom Helix + nice!nano v2 | Reference integration exists; public example preparation is pending. |
| Sofle | Planned; keyboard revision and pin mapping must be selected and tested. |
| Lily58 | Planned; keyboard revision and pin mapping must be selected and tested. |

Add an example directory when it contains useful, reviewable files. Each example should include:

- A README naming the exact keyboard/controller/module revisions.
- The wiring and GPIO map, central/peripheral roles, and display orientation.
- Actual configuration files and all required driver/module dependencies.
- Pinned dependency versions and reproducible build instructions.
- Separate records for build verification and physical display/power testing.
- A real display photo when hardware testing is complete.

Keep release firmware packages in GitHub Releases rather than committing successive UF2 files to this directory.
