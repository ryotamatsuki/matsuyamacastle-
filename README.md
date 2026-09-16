# 松山城 3D WALK

MATSUYAMA CASTLE VIRTUAL WALK

松山城の連立天守群を、PLATEAUのLOD2外形を基準に、権利確認済み資料で補った推定内部と一体化した一人称3D Webアプリです。**実物の測量・文化財修理図面に基づく完全復元ではなく、モデル全体の正確なジオメトリはC判定です。**

公開先: https://ryotamatsuki.github.io/matsuyamacastle-/

## 現在の構成

散歩モードと見渡しモードは、同一の `public/models/matsuyama_keep.glb` を使います。PLATEAU外観から別の仮想建物へ切り替える方式ではありません。

- 外観: PLATEAU松山市LOD2を基準に使用
- 地面: 国土地理院「全国最新写真（シームレス）」を同じ水平座標系に配置
- 内部: 公式記述・Public Domain / CC BY写真で確認できる形態を参照し、未測定座標はC推定
- 入口・窓: 同一外壁メッシュに実際の幾何開口を生成
- 歩行: 内庭・穴蔵・木造各階・本壇側推定動線・本丸広場を連続移動

詳細は [`docs/UNIFIED_MODEL.md`](docs/UNIFIED_MODEL.md) を参照してください。

## 本丸広場から天守への動線

松山市の公式説明にある門の関係を優先します。一ノ門は本壇入口に西面し、一ノ門と二ノ門の間は枡形、一ノ門内で左折して九段を上ると二ノ門、その後三ノ門を経て筋鉄門から内庭へ入る関係です。

このため、本丸広場から天守正面へ独立した巨大階段を伸ばす表現は採用しません。旧実装の下部39段は、約8mの高低差を埋めるためだけのC補間で、史実の段数を示す根拠がありませんでした。現在は撤去し、本壇西側に寄せた狭いC推定の取付勾配を石垣状保持体の間に収めます。**明示的な段数を持つ外部石段は、公式記述で確認できる二ノ門付近の九段だけです。**

正確な門芯、取付路の幅・勾配、保持石垣形状はC推定です。根拠と推定の境界は `public/data/hondan-route-evidence.json` に記録します。

## スクリーンショット

CIでChromium / WebKitの実描画を生成します。

![外観](public/screenshots/chromium-exterior.png)
![天守内部](public/screenshots/chromium-interior.png)

追加証跡はGitHub Actionsの `browser-evidence` / `deployment-evidence` artifactに保存します。

## 操作

PC: WASD、マウス、Shift早歩き、Esc解除。  
iPhone/iPad相当: 左スティック＋右ドラッグ。同時操作対応。

物理iPhone/iPad Safariの実機確認は別途必要です。CIではWebKit/mobile viewportまで検証します。

## 精度区分

- A-ratio / A-count: 公式資料に明示された比率・段数等
- B: 複数資料で相互確認した形態・関係
- C: 推定座標、未測定寸法、ゲームプレイ補間、証拠不足

現在Bへ昇格している範囲は、露出木部・梁の形態、窓・格子・板戸・内側建具の構成、最上階の外向き開口と眺望関係などです。**正確な柱芯、階高、窓bay座標、内部階段位置、門芯、外部取付路の勾配・石垣形状はCのまま**です。Bはsurvey-gradeを意味しません。

詳細: [`docs/INTERIOR_EVIDENCE_MATRIX.md`](docs/INTERIOR_EVIDENCE_MATRIX.md) / [`docs/ACCURACY.md`](docs/ACCURACY.md)

## 技術

Vite / TypeScript / Three.js。静的メッシュを材質・部位ごとにmergeし、GLBへ自作PBR（色・法線・粗さ）を埋め込みます。第三者写真を壁・床テクスチャとして使用せず、外部フォントやCDNアセットにも依存しません。

歩行判定は描画と共通の床・開口・階段・外部取付路定義を使います。PLATEAU外壁、推定内壁・手摺、外部保持石垣も衝突判定へ反映します。

## 3Dモデルと再生成

成果物: `public/models/matsuyama_keep.glb`

```sh
npm ci
npm run model
npm run build
npm run dev
```

同じlockfile・ソースから、外部写真を再ダウンロードせずモデルを再生成できます。GLBには生成時刻を埋め込まず、byte-identical再生成をCIで検証します。

## データ・権利

[`docs/RIGHTS_AUDIT.md`](docs/RIGHTS_AUDIT.md)、[`ATTRIBUTION.md`](ATTRIBUTION.md)、[`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md)、[`public/data/source_manifest.json`](public/data/source_manifest.json) を参照してください。

採用方針は、Public Domain / CC0 / CC BY、行政オープンデータ、または行政資料の事実記述です。権利不明素材、Google由来画像、商用書籍・非オープン図面、SNS、YouTube、第三者3Dモデル等をモデル素材として取り込みません。

コード: MIT (`LICENSE`)。自作モデル・procedural素材: CC BY 4.0 (`LICENSE-ASSETS.md`)。PLATEAU・GSI等の第三者データは各原ライセンスと出典条件を維持します。

## 検証

```sh
npm ci
npm test
VITE_TEST=1 npm run build
npx playwright install chromium webkit
npm run test:browser
npm run build
node scripts/check-reproducibility.mjs
python3 scripts/inspect_model.py
```

`npm test` は歩行・collisionに加え、門開口、外部連続動線、公式九段のexact count、下部に追加の「推定段数」を作らないこと、権利状態を検証します。main pushではGitHub Pagesへdeployし、公開URL smoke testまで実行します。

## 最終ゲート

`MATSUYAMA CASTLE INTERIOR RECONSTRUCTION — B-GRADE VERIFICATION PASS` は未宣言です。Bは一部の形態・関係に限定され、主要内部座標・本壇外部動線とも測量級ではなく、物理iPhone/iPad Safariも未検証です。証拠が不足する部分は今後もCとして明示します。
