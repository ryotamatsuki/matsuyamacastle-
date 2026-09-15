# RIGHTS AUDIT — 2026-09-15

Status: rights-clean interior evidence admitted with per-element accuracy bounds; full B-grade release gate NOT PASSED.

## Scope and decision

このリポジトリは、松山城天守内部の再現性向上にあたり、Public Domain / CC0 / CC BY または公的ページの事実記述だけを復元入力として採用する。写真のピクセルをテクスチャとして使用せず、既存図面をトレースしない。現代展示・人物・説明板・絵画・写真等は復元対象外とする。

ライセンスの確認はカテゴリ単位ではなくファイル単位で行う。閲覧できることを再利用許諾とはみなさない。

## Admitted factual sources

- `CITY-KEEP`: 松山市公式「松山城天守 1棟」。1852年再建、石造穴蔵＋木造3層3階、最上階基本軸組6間×4.5間、武者走り1階1.5間・2階その半分、露出梁、塗籠角格子、外側突揚げ板戸、内側引き土戸、外壁仕上げ、内庭側アクセス、後補観光階段等の**事実だけ**を参照。ページ写真・文章は複製しない。
- `CITY-LIST`: 松山市指定文化財オープンデータの指定・建物一覧等の事実のみ。
- `CITY-OPEN`: オープンデータ方針確認用。松山市ウェブサイト全体をCC BY扱いしないための境界資料であり、天守ジオメトリ入力ではない。

## Admitted photographic evidence

### WM-PD-INSIDE

- Title: *Matsuyama castle (Iyo) - Inside the keep.jpg*
- Author: Urashimataro
- Source: Wikimedia Commons
- Licence: Public Domain (PD-self)
- Use: 内部の露出木部・構造形態の観察のみ
- Excluded: 人物・展示物等がある場合は利用しない
- Texture use: none

### WM-PD-TOP

- Title: *Matsuyama castle (Iyo) - Top of the keep.jpg*
- Author: Urashimataro
- Source: Wikimedia Commons
- Licence: Public Domain (PD-self)
- Use: 最上階の内部形態、開口・木部の観察
- Texture use: none

### WM-CCBY-COURTYARD-1

- Title: *Matsuyama Matsuyama-jo Keep View to the Courtyard 1.jpg*
- Author: Zairon
- Licence: CC BY 4.0
- Use: 中庭方向の眺望・開口関係の独立資料
- Texture use: none

### WM-CCBY-ARMOUR-4

- Title: *Matsuyama Matsuyama-jo Keep Interior Armour 4.jpg*
- Author: Zairon
- Licence: CC BY 4.0
- Use: 背景の建築木部の観察だけ
- **Excluded:** 甲冑、展示ケース、説明物、その他の現代展示
- Texture use: none

### DPLA-CCBY-WINDOW-1963

- Title: *[Matsuyama Castle, Japan]* — window photograph
- Creator: Sherwin John Carlquist
- Date: 1963-06-26
- Source: Botanical Research Institute of Texas / DPLA / Wikimedia Commons
- Licence: CC BY 4.0
- Use: 松山城の窓形態の歴史的相互確認
- Limitation: 対象階・bayは資料メタデータだけでは確定しないため、床別位置には使用しない
- Texture use: none

個別URL、license URL、archive URL、既知のCommons SHA-1、取得日、利用範囲は `public/data/source_manifest.json` を正本とする。取得していないSHA-256は推測しない。

## Explicit exclusions

- CC BY-SA / GFDL等のShareAlike素材: 今回は原則EXCLUDED。例 `WIKIMEDIA-CCBYSA-KEEP` は `excluded_pending_license_analysis` として記録し、モデル入力にしない。
- PLATEAU-2020: 2026-09-15の外観改修で、配布リソース・適用条件・建物IDを確認し外観LOD2に限りADMITTEDへ変更。内部の実測根拠には用いない。詳細は EXTERIOR_UPGRADE.md。
- Google Maps / Street View / Google画像検索
- 一般ブログ・観光サイト
- Instagram / X / Facebook / Pinterest
- YouTubeフレーム
- 市販書籍・雑誌・建築専門書・有料図面
- Sketchfab等の第三者3Dモデル
- ライセンス不明画像
- AI生成画像・AI補完画像
- 非公開資料

## Third-party subject matter inside admitted photos

写真そのものがPD/CC BYでも、写り込んだ現代展示物等について撮影者が第三者権利まで許諾できるとは限らない。そのため本モデルは、柱・梁・床・壁・階段・開口・窓・建具等の建築形態だけを観察対象とし、甲冑、説明板、写真、絵画、模型、映像、書籍、人物等を複製・モデル化しない。

## Output licensing

Application and generator source: MIT. Original generated geometry and procedural materials: CC BY 4.0, credit Matsuyama Castle 3D Walk contributors, link this repository and licence, state modifications. Third-party software retains upstream notices.

CC BY写真は3Dテクスチャとして再配布していないが、分析入力として作者・題名・Source・Licence・利用内容を `ATTRIBUTION.md` とmanifestに明示する。

## Accuracy / derivative boundary

写真から確認できる事実・形態を用いて**新規のprocedural geometry**を生成する。写真ピクセルを貼らず、写真そのものの表現を再現することを目的としない。

今回Bへ上げるのは次の範囲だけ。

- 露出木部・梁の形態的存在: B morphology
- 窓・格子・板戸・内側建具の構成: B morphology
- 最上階の外向き開口と眺望関係: B relationship

柱芯、柱断面、階高、窓の正確な数・bay割付、階段位置・方向・寸法、間仕切り等はCのまま。詳細は `docs/INTERIOR_EVIDENCE_MATRIX.md` と `docs/ACCURACY.md`。

## Reproducibility and provenance

- `src/data/interiorEvidence.mjs`: 部位別evidence/accuracyのコード正本
- `public/data/source_manifest.json`: 権利・出典正本
- `docs/INTERIOR_EVIDENCE_MATRIX.md`: 人間可読の証拠行列
- `docs/evidence/*.svg`: 証拠状態図。現存平面図ではない
- GLB root extras: evidence version / source IDs / B-grade scope / overall C
- `scripts/inspect_model.py`: GLBが画像を含まないこと、B scopeが限定されていることをCI検証
- `tests/evidence.test.mjs`: ShareAlikeの非採用、Bの独立資料要件、階段等のC維持を機械検証

GLBには生成時刻を埋め込まない。時刻はbyte-identical再生成を壊すためであり、source revisionはCI生成の `model-report.json` で追跡する。

## Current gate

Rights gate for admitted inputs: **PASS within the documented scope**.

Full `MATSUYAMA CASTLE INTERIOR RECONSTRUCTION — B-GRADE VERIFICATION PASS`: **NOT PASSED**. Bが主要内部座標全体には及んでおらず、実機iPhone/iPad Safari検証も未完了のため。


外観LOD2と松山市のCC BY公式写真の追加監査は `EXTERIOR_UPGRADE.md` と `public/data/exterior-rights-evidence.json` を参照。サイトポリシーはPDL1.0との表記だが、同第3項（3）はCC BYによる利用を明示的に許諾しているため、本成果はCC BY 4.0の条件で使用する。
