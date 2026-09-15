> 更新：散歩本体をPLATEAUと一体化しました。現在の寸法・推定値・開口・航空写真の扱いは [一体型モデル仕様](docs/UNIFIED_MODEL.md) を参照してください。以下の従来の階高3.6m・独立外観に関する記述は旧仕様です。

# 松山城 3D WALK
MATSUYAMA CASTLE VIRTUAL WALK

松山城大天守の構成を公的資料の事実と権利確認済みの公開写真資料から検証し、本丸・内庭・穴蔵・木造各階を一人称で歩く静的Webアプリです。**実物の測量モデルではありません。モデル全体の正確なジオメトリはC判定です。**

公開先: https://ryotamatsuki.github.io/matsuyamacastle-/

## スクリーンショット

CIで実描画画像を生成します。

![外観](public/screenshots/chromium-exterior.png)
![天守内部](public/screenshots/chromium-interior.png)

Chromiumの実描画。追加証跡はGitHub Actionsのbrowser-evidence / deployment-evidence artifactに保存します。

## 操作

PC：WASD、マウス、Shift早歩き、Esc解除。階段は歩いて昇降します。  
iPhone/iPad：左スティック＋右ドラッグ。同時操作対応。設定で軽量表示と昼/夕方を切替できます。

本丸中央の石段から内庭、入口を通って穴蔵へ進み、現行の推定階段で3階まで歩けます。**現在の階段位置・方向は史実配置として確認済みではなくC — gameplay interpolationです。**

## 技術

Vite / TypeScript / Three.js。静的メッシュを材質・部位ごとにmergeし、遠景はinstancing。GLB埋込PBR（色・法線・粗さ）、soft shadows、DPR制限。第三者写真の画像テクスチャ、外部フォント、CDNアセットは使用しません。

床・ランプ・壁AABBの共通定義と細分化した移動判定で階段と衝突を処理します。独自の歩行領域による落下防止を備えます。

## 3Dモデルと再生成

成果物：`public/models/matsuyama_keep.glb`  
入力：`src/data/castleDimensions.mjs` / `src/data/interiorEvidence.mjs`  
構築：`src/castle.mjs` / `scripts/build-castle-model.mjs`

```sh
npm ci
npm run model
npm run build
npm run dev
```

同じlockfile・ソースから、外部写真を再ダウンロードせずモデルを再生成できます。GLBには生成時刻を埋め込まず、byte-identical再生成を優先します。source revisionはCIの`public/data/model-report.json`で追跡します。

## 内部復元精度

内部復元では、松山市公式の建築事実に加え、ファイル単位で権利確認したPublic Domain / CC BY写真を**建築構造の証拠**として利用します。写真ピクセルを壁や床へ貼りません。

Accuracyは部位ごとに付与します。

- A-ratio：公式資料に明示された間単位の寸法比率。メートル座標は別判定。
- B：複数の独立した再利用可能資料から相互確認した形態・関係。
- C：推定、未登録座標、ゲームプレイ補間、または証拠不足。

現在Bへ昇格した範囲は、露出木部・梁の形態、窓・格子・板戸・内側建具の構成、最上階の外向き開口と眺望関係です。ただし**正確な柱芯、階高、窓bay座標、階段位置・方向、内部間仕切りはCのまま**です。Bはsurvey-gradeを意味しません。

詳細：[`docs/INTERIOR_EVIDENCE_MATRIX.md`](docs/INTERIOR_EVIDENCE_MATRIX.md) / [`docs/ACCURACY.md`](docs/ACCURACY.md)

証拠状態図：

- [`docs/evidence/basement-evidence.svg`](docs/evidence/basement-evidence.svg)
- [`docs/evidence/floor1-evidence.svg`](docs/evidence/floor1-evidence.svg)
- [`docs/evidence/floor2-evidence.svg`](docs/evidence/floor2-evidence.svg)
- [`docs/evidence/floor3-evidence.svg`](docs/evidence/floor3-evidence.svg)

これらは監査図であり、現存天守の平面図ではありません。

## データ・権利

[`docs/RIGHTS_AUDIT.md`](docs/RIGHTS_AUDIT.md)、[`ATTRIBUTION.md`](ATTRIBUTION.md)、[`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md)、[`public/data/source_manifest.json`](public/data/source_manifest.json)を参照。

採用方針：Public Domain / CC0 / CC BY、または行政資料の事実記述。CC BY-SA等のShareAlike素材は今回原則除外します。Google、商用書籍・非オープン図面、ブログ・観光写真、SNS、YouTube、権利不明素材、AI画像、権利未確認の第三者3Dモデルは使用しません。

写真に写る人物・甲冑等の展示・説明板・写真・絵画等はモデル化しません。採用したCC BY資料は作者・Source・Licence・利用方法をATTRIBUTIONとmanifestへ記録します。

コード：MIT（LICENSE）。自作モデル・procedural素材：CC BY 4.0（LICENSE-ASSETS.md）。依存ソフトウェアは元ライセンスを維持し、`public/data/dependency-notices.txt`へ収録します。

## 検証

```sh
npm ci
npm test
npm run build
VITE_TEST=1 npm run build
npx playwright install chromium webkit
npm run test:browser
npm run build
node scripts/check-reproducibility.mjs
python3 scripts/inspect_model.py
```

`npm test` は歩行・collisionに加えて、権利状態、ShareAlike素材の非採用、B判定の複数独立資料要件、階段等のC維持を検証します。最後のproduction buildはテスト用位置変更APIを除きます。

## GitHub Pages

`.github/workflows/deploy.yml` がmain pushで `npm ci`、navigation/evidence test、モデル生成、Chromium/WebKit browser test、再現性・GLB権利監査、Pages deploy、公開URL smoke testを実行します。

GitHub Pagesは `https://ryotamatsuki.github.io/matsuyamacastle-/` で有効化済みです。以前のPages enablement blockerは解消済みです。公開後検証ではモデル・manifest・notices・reportの200応答、操作、出典、404、fatal console error、本番test API非露出を確認し、その後に証拠スクリーンショットを保存します。

## 最終ゲート

`MATSUYAMA CASTLE INTERIOR RECONSTRUCTION — B-GRADE VERIFICATION PASS` は現時点では**未宣言**です。Bは一部形態・関係に限定され、主要内部座標をBへ昇格できる写真測量登録が未完了であり、実機iPhone/iPad Safariも未検証だからです。

全項目の状況は [`docs/RELEASE_GATE.md`](docs/RELEASE_GATE.md) を参照してください。証拠が不足する部分は今後もCのまま残します。


## 外観・質感の改修

「PLATEAUの外観を見る」で松山市の実LOD2連立天守群を回転・拡大表示できます。公式屋根・壁面と、追加した推定の窓・瓦・配色を区別しています。「散歩をはじめる」は開口部・階段を備えた別の推定内部モデルへ移ります。両モデルは同一の実測内外一体モデルではありません。

正面の三角破風／唐破風、厚みのある白い破風縁、垂木・軒裏、分割した丸瓦、瓦の重なり、最上階高欄、窓枠・建具金物、梁接合部、石の不規則な輪郭を追加しました。独自生成の木目・漆喰・石・瓦・地面・鉄のPBRマップをGLBに埋め込んでいます。

追加モデル：`public/models/matsuyama_plateau_lod2.glb`。出典・変換方法・精度の限界は [EXTERIOR_UPGRADE.md](docs/EXTERIOR_UPGRADE.md)。

素材の再生成：`npm run materials`（Python標準ライブラリのみ）。通常の `npm run model` / `npm run build` は同梱済みの素材と抽出LOD2からネットワーク不要で再生成します。
