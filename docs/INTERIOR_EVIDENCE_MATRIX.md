# 松山城天守 内部復元 Evidence Matrix

更新日: 2026-09-15  
対象: `ryotamatsuki/matsuyamacastle-`

## 判定原則

この台帳の **B は測量精度を意味しない**。B は、複数の独立した再利用可能資料から建築要素の形態・存在・関係が相互に確認できる場合だけに付与する。写真のカメラ位置と対象階・柱芯を十分に登録できていない限り、座標・寸法・柱芯・階段位置などのジオメトリは C のままとする。

A-ratio = 公的資料に明示された間単位の比率。メートル換算は別判定。  
B = 複数の独立した PD / CC BY 資料と事実記述から確認した形態・関係。  
C = 推定、未登録、ゲームプレイ補間、または証拠不足。

第三者写真はテクスチャとして使用しない。現代展示・人物・説明板・写真・絵画等は復元対象外とする。

## Evidence Matrix

| Element | Floor | Evidence | Source IDs | Independent views | Confidence | Accuracy |
|---|---|---|---|---:|---|---|
| 最上階基本軸組比率 | 3F | 桁行6間×梁間4.5間の公式記述 | CITY-KEEP | 0 | high for ratio | A-ratio / metric C |
| 武者走り幅比率 | 1F/2F | 1F 1.5間、2Fはその半分の公式記述 | CITY-KEEP | 0 | high for ratio | A-ratio / metric C |
| 露出した木造軸組・梁の形態 | interior | 公式記述に加え、独立撮影者による内部写真で露出木部を相互確認 | CITY-KEEP, WM-PD-INSIDE, WM-CCBY-ARMOUR-4 | 2 | high for presence, medium for shape | **B morphology / geometry C** |
| 窓・格子・板戸・引き土戸の構成 | generic keep window | 公式記述と1963年の窓写真、最上階写真で窓開口形態を相互確認 | CITY-KEEP, DPLA-CCBY-WINDOW-1963, WM-PD-TOP | 2 | high for assembly concept | **B morphology / placement C** |
| 最上階の外向き開口の存在・眺望関係 | 3F | 最上階写真と別撮影者の中庭方向写真を公式構造記述と照合 | WM-PD-TOP, WM-CCBY-COURTYARD-1, CITY-KEEP | 2 | medium-high for relationship | **B relationship / bay coordinates C** |
| 柱芯・柱断面・柱間の正確な座標 | all | 公式比率と内部写真はあるが、複数視点のカメラ登録が未完了 | CITY-KEEP, WM-PD-INSIDE | 1 registered view equivalent | insufficient | C |
| 穴蔵→1F階段の正確な位置・方向 | B1→1F | 後補の観光階段である事実は確認。位置を固定できる独立2視点なし | CITY-KEEP | 0 | insufficient | C |
| 1F→2F階段の正確な位置・方向 | 1F→2F | 現行は歩行成立のための交互配置 | none admitted for exact location | 0 | insufficient | C — gameplay interpolation |
| 2F→3F階段の正確な位置・方向 | 2F→3F | 現行は歩行成立のための交互配置 | none admitted for exact location | 0 | insufficient | C — gameplay interpolation |
| 階高3.6m | all | 現行パラメータ。再利用可能資料からの実測拘束なし | none | 0 | insufficient | C |
| 内部間仕切り・部屋境界 | all | 公式記述だけでは正確な平面配置を確定できない | CITY-KEEP | 0 | insufficient | C |

## Source identity and rights boundary

- `WM-PD-INSIDE`: Urashimataro, *Matsuyama castle (Iyo) - Inside the keep.jpg*, Public Domain (PD-self).
- `WM-PD-TOP`: Urashimataro, *Matsuyama castle (Iyo) - Top of the keep.jpg*, Public Domain (PD-self).
- `WM-CCBY-COURTYARD-1`: Zairon, *Matsuyama Matsuyama-jo Keep View to the Courtyard 1.jpg*, CC BY 4.0.
- `WM-CCBY-ARMOUR-4`: Zairon, *Matsuyama Matsuyama-jo Keep Interior Armour 4.jpg*, CC BY 4.0. Armour/display material is explicitly excluded; only architectural background is observed.
- `DPLA-CCBY-WINDOW-1963`: Sherwin John Carlquist, 1963-06-26 window photograph, CC BY 4.0. It corroborates window morphology only; floor/bay placement is not inferred.
- `CITY-KEEP`: 松山市公式ページ。文章・写真は複製せず建築上の事実だけを参照。

個々のURL、ライセンスURL、archive URL、既知のCommons SHA-1、利用範囲は `public/data/source_manifest.json` を正本とする。取得できないSHA-256を推測して記録しない。

## Current-model difference audit

| Current model element | Audit result | Action |
|---|---|---|
| 露出梁・木造柱表現 | approximately correct at morphology level | 維持。正確な断面・座標はC表示 |
| 格子・板戸・内側建具の組合せ | approximately correct at morphology level | 維持。個数・寸法・配置はC表示 |
| 最上階の周囲開口 | broadly consistent with reusable photographs | 維持。bay数と座標はC表示 |
| 現行3本の階段位置 | unverifiable | 座標を変更せずC / gameplay interpolationを明示 |
| 柱グリッド | unverifiable at coordinate level | 公式6×4.5間比率以外はC |
| 間仕切り | unverifiable | 推定を史実配置と表示しない |

資料から確実に誤りと断定できない部位を「incorrect」とは扱わない。一方、確認不能な現行形状を「confirmed」とも扱わない。

## Ken sensitivity

現行の `1 ken = 1.82 m` はC判定の換算仮定である。コードでは 1.80 m、20/11 m（約1.81818 m）、1.82 m を感度候補として記録する。CITY-KEEPの6間×4.5間等は比率拘束として扱い、特定換算値を文化財の実測値とは表示しない。

## Camera / photogrammetry status

今回の公開資料監査ではファイル単位の権利・作者・対象を確認したが、各写真を同一柱・同一窓へ厳密にカメラ登録し、消失点と既知寸法から座標を解く段階には到達していない。このため exact column grid / exact stair coordinates / exact partitions はBへ昇格させない。

`docs/evidence/*.svg` は証拠状態を示す監査図であり、現存天守の平面図ではない。camera direction が未登録の箇所は `pending` と明記する。

## Independent B audit

B項目ごとに次を確認した。

| Claim | Multiple reusable sources | Independent authors/views | Licence clear | No exhibit copied | Exact coordinates promoted? | Result |
|---|---:|---:|---:|---:|---:|---|
| exposed timber morphology | yes | yes | yes | yes | no | B morphology |
| window assembly morphology | yes | yes | yes | yes | no | B morphology |
| top-floor outward opening relationship | yes | yes | yes | yes | no | B relationship |

この条件は `tests/evidence.test.mjs` でも機械検証する。

## Current gate

**NOT PASSED** for `MATSUYAMA CASTLE INTERIOR RECONSTRUCTION — B-GRADE VERIFICATION PASS`.

理由は、B認定が一部の形態・関係に限定され、柱芯・階段・間仕切り等の主要内部ジオメトリをBに上げるだけの登録済み独立証拠がまだないこと、また実機iPhone/iPad Safari検証が未実施であるため。これは失敗を隠すためではなく、証拠境界を維持するための判定である。
