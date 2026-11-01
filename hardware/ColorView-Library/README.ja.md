# Color View CADライブラリ

[English](README.md) · [简体中文](README.zh-CN.md) · **日本語**

5種類のシンボル・フットプリントと、3つのSTEPモデルを収録しています。

- [EasyEDA用ZIP](https://github.com/PandaKBLab/color-view/raw/refs/heads/main/downloads/ColorView-EasyEDA-v0.2.0.zip)
- [KiCad用ZIP](https://github.com/PandaKBLab/color-view/raw/refs/heads/main/downloads/ColorView-KiCad-v0.2.0.zip)

VCCは安定化された **3.3Vまたは5V**、信号は **3.3Vロジック**です。
ヘッダ：1 MOSI、2 SCK、3 VCC、4 GND、5 CS。GNDの4番パッドは四角形です。
FPC：1 CS、2 GND、3 VCC、4 SCK、5 MOSI。6/7は固定端子MP1/MP2です。ケーブルの接点面とピン対応を確認してください。

EasyEDA専門版では `easyeda/ColorView.elibz` を自分のライブラリへインポートし、`models/` 内の3つのSTEPをmm単位で別途インポートして関連付けます。

KiCadでは `ColorView-Library` フォルダ全体をプロジェクトファイルと同じ場所に置き、`kicad/ColorView.kicad_sym` と `kicad/ColorView.pretty` をそれぞれライブラリ名 `ColorView` で登録してください。

FPCコネクタとモジュール取付用フットプリントは別々です。取付耳を外した場合はNoEarsを使用します。外形は組立参考で、基板の切り抜きではありません。実物の接続部品に合わせて3Dモデルの取付高さを調整してください。

詳しい手順と選び方：[English guide](README.md)。

リポジトリを直接クローンした場合は、`models/ColorView_FPC_HC-FPC-05-10-5RLTAG.step.zip` を同じmodelsフォルダへ展開してください。ダウンロードZIPには展開済みSTEPを収録しています。
