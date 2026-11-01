# Color View 封装库

[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md)

版本 **0.2.0**，提供 5 个器件的符号、封装及 3 个 STEP 模型。

| 器件 | 用途 |
| --- | --- |
| `ColorView_5Pin_P2.54_M2` | 2.54 mm 五针接口，带四个 M2 安装孔 |
| `ColorView_5Pin_P2.54_NoEars` | 五针接口，安装耳朵已去掉 |
| `ColorView_Mount_M2` | 模块外形与四个安装孔，无电气焊盘 |
| `ColorView_Outline_NoEars` | 去耳模块外形，无电气焊盘 |
| `ColorView_FPC_Interface` | 键盘侧 HC-FPC-05-10-5RLTAG 连接器，带焊盘和模型 |

**供电：VCC 接稳压 3.3V 或 5V。SCK、MOSI、CS 使用 3.3V 逻辑。5V 供电不代表信号脚支持 5V。**

五针接口：1 MOSI、2 SCK、3 VCC、4 GND、5 CS；4 脚 GND 为方形，三角标记指向 1 脚。
FPC：1 CS、2 GND、3 VCC、4 SCK、5 MOSI；6/7 为固定焊脚 MP1/MP2，不是排线触点。该网络命名以连接器 1 脚连接模块 J2 的 1 脚为前提，请按实际排线接触面核对逐脚连接。

FPC 座和屏幕安装位置分开：放置 FPC 器件，再单独放置 Mount_M2 或 Outline_NoEars，连接器可自由布局。

下载：[嘉立创EDA包](https://github.com/PandaKBLab/color-view/raw/refs/heads/main/downloads/ColorView-EasyEDA-v0.2.0.zip) · [KiCad包](https://github.com/PandaKBLab/color-view/raw/refs/heads/main/downloads/ColorView-KiCad-v0.2.0.zip)。

## 嘉立创EDA专业版

1. 解压，选择“文件 → 导入 → 嘉立创EDA（专业版）”，导入 `easyeda/ColorView.elibz`。半离线模式选择自己的本地库；在线模式选择个人库或团队库。
2. 把 `models/` 中三个 STEP 文件单独导入 3D 模型库，单位 mm。elibz 中有 5 个器件、3 个基础符号、5 个封装，不含模型实体，也不含作者电脑路径。
3. 在器件或封装的 3D 管理器中绑定对应模型；保留已有变换参数，或参照[模型位置表](docs/3d-placement.md)。
4. 按 S，选择目标库，刷新并搜索 `ColorView`，从“器件”放到原理图，接线后更新 PCB。

## KiCad 7及以上

1. 解压后，将完整 `ColorView-Library` 文件夹放到工程根目录，与 `.kicad_pro` 并列。
2. 管理符号库：添加 `kicad/ColorView.kicad_sym`，库名 `ColorView`。
3. 管理封装库：添加 `kicad/ColorView.pretty`，库名同样为 `ColorView`。
4. 从符号放置并更新到 PCB。模型路径使用 `${KIPRJMOD}/ColorView-Library/models/…`，请保留目录结构。

不要覆盖工程已有的库表。外形仅作为装配参考，不会生成键盘板框或禁铜区。四个耳朵均可掰掉；去耳后选择 NoEars 版本。

模块模型是外形与空间参考，不含内部电路或元件细节。本体厚度 3 mm；默认模型中另留有模块 PCB 底面到键盘顶面约 3 mm 的示例安装间隙，需按实际排母、铜柱调整。该间隙不是模块本体厚度。已进行 CAD 校核，未做实物插接试装。

如果直接克隆仓库，请先将 `models/ColorView_FPC_HC-FPC-05-10-5RLTAG.step.zip` 解压到同一 models 目录。上面的两个下载包内已放好展开的 STEP 文件，无需这一步。
