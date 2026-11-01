# 3D placement / 模型位置

Use mm and zero rotation on all axes. 导入单位 mm，三个旋转角均为 0。

| Footprint | STEP model | EasyEDA size X/Y/Z, mm | EasyEDA offset X/Y/Z, mm |
| --- | --- | --- | --- |
| ColorView_5Pin_P2.54_M2 | ColorView_WithEars | 26.9946 / 45.4836 / 3 | 5.0787 / 16.6365 / 2 |
| ColorView_5Pin_P2.54_NoEars | ColorView_NoEars | 26.9946 / 36.3396 / 3 | 5.0787 / 16.6365 / 2 |
| ColorView_Mount_M2 | ColorView_WithEars | 26.9946 / 45.4836 / 3 | 0 / 0 / 2 |
| ColorView_Outline_NoEars | ColorView_NoEars | 26.9946 / 36.3396 / 3 | 0 / 0 / 2 |
| ColorView_FPC_HC-FPC-05-10-5RLTAG | ColorView_FPC_HC-FPC-05-10-5RLTAG | 4.28 / 3.92 / 1.01 | 0 / 0.45 / 0 |

EasyEDA normalizes the model bounding box; KiCad keeps the STEP origin. Their offset numbers therefore differ. KiCad files already contain the matching offsets. 嘉立创EDA会归一化模型包围盒，KiCad保留STEP原点，偏移数值因此不同。

Module height is 3 mm. Module placement uses an illustrative 3 mm keyboard-top to module-PCB-underside gap; change it to match actual headers and spacers. The FPC model sits on the keyboard PCB. These are assembly references, not enclosure tooling datums.
