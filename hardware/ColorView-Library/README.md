# Color View CAD libraries

[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md)

Version **0.2.0**. Five devices for keyboard PCB design, with symbols, footprints and three STEP models.

| Device | Use |
| --- | --- |
| `ColorView_5Pin_P2.54_M2` | 2.54 mm header plus four Ø2.2 mm M2 mounting holes |
| `ColorView_5Pin_P2.54_NoEars` | Header, without mounting ears |
| `ColorView_Mount_M2` | Module outline and four mounting holes; no electrical pads |
| `ColorView_Outline_NoEars` | Module body outline; no electrical pads |
| `ColorView_FPC_Interface` | Separate keyboard-side HC-FPC-05-10-5RLTAG connector, pads and model |

**Power:** VCC accepts a regulated **3.3 V or 5 V** supply. Use **3.3 V signal logic** for SCK, MOSI and CS. Supply support does not establish 5 V logic compatibility.

Header: **1 MOSI · 2 SCK · 3 VCC · 4 GND · 5 CS**. GND pin 4 is square; the triangle marks pin 1.
FPC signal contacts: **1 CS · 2 GND · 3 VCC · 4 SCK · 5 MOSI**. Pads 6/7 are mounting tabs MP1/MP2, not additional cable contacts. These names assume contact 1 connects to module J2 contact 1; verify the actual cable and contact faces before routing.

For FPC mounting, place `ColorView_FPC_Interface` and a separate `ColorView_Mount_M2` or `ColorView_Outline_NoEars`. The connector may be placed freely. Do not connect the five signals to the mounting holes.

Download: [EasyEDA ZIP](https://github.com/PandaKBLab/color-view/raw/refs/heads/main/downloads/ColorView-EasyEDA-v0.2.0.zip) · [KiCad ZIP](https://github.com/PandaKBLab/color-view/raw/refs/heads/main/downloads/ColorView-KiCad-v0.2.0.zip).

## EasyEDA professional

1. Extract the EasyEDA ZIP. Import `easyeda/ColorView.elibz` through **File → Import → 嘉立创EDA（专业版）**. Select your local library in half-offline mode, or your personal/team library online.
2. Import the three supplied files in `models/` as 3D models, units **mm**. The native archive contains five devices, three base symbols and five footprints; model binaries are supplied separately. It deliberately contains no path to the author's computer.
3. Bind the matching model through the 3D model manager. Keep the supplied transform settings, or use the [transform table](docs/3d-placement.md).
4. Press **S**, choose your target library, refresh and search `ColorView`. Place a **device**, connect its symbol and update the PCB.

## KiCad 7 or newer

1. Extract the KiCad ZIP and put the complete `ColorView-Library` folder beside your `.kicad_pro` project file.
2. In **Manage Symbol Libraries**, add `kicad/ColorView.kicad_sym` as a project library named **ColorView**.
3. In **Manage Footprint Libraries**, add `kicad/ColorView.pretty`, also named **ColorView**.
4. Place the required symbol and update the PCB. The model paths use `${KIPRJMOD}/ColorView-Library/models/…`. Keep the folder structure or change the paths to your chosen location.

Do not overwrite existing project library tables; the two supplied table files are examples. Mechanical outlines are assembly references, not keyboard Edge.Cuts and not copper keepouts. All four ears can be removed; use a NoEars variant when doing so.

Module models are simplified exterior/clearance models, without internal circuits or component detail. The module is 3 mm thick. The default header/mount model uses an example 3 mm gap from keyboard top to module PCB underside; adjust for the actual socket and spacers. This gap is not part of the module's 3 mm thickness. No physical mating test is claimed. [Validation](validation.json).

If you clone this repository instead of downloading a ZIP, first extract `models/ColorView_FPC_HC-FPC-05-10-5RLTAG.step.zip` into the same models folder. The two download ZIPs already include the expanded STEP file.
