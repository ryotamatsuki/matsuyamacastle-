# RIGHTS AUDIT — 2026-09-14
Status: source-admission policy established; release gate NOT PASSED.

## Scope and decision
Only factual architectural descriptions are admitted as inputs for the first model. No third-party photographs, maps, textures, plans or models are copied, traced or embedded. All model geometry and materials will be generated from original code. This is a source-admission audit, not a certification of surveyed accuracy or a legal guarantee.

## Sources
- CITY-KEEP: https://www.city.matsuyama.ehime.jp/kanko/kankoguide/rekishibunka/bunkazai/kuni/matsuyamajou_tenshu.html — factual reference only. The page is NOT treated as CC BY. Do not copy its photograph or prose. Confirmed: 1852 reconstruction; stone basement and three timber storeys; upper core 6 by 4.5 ken; outer corridors 1.5 and 0.75 ken; exposed corridor beams, shutters, lattice, white upper plaster and black lower boarding; tiled roofs; courtyard access; later visitor stairs.
- CITY-LIST: https://www.city.matsuyama.ehime.jp/kanko/kankoguide/shitestukoen/matsuyamajyo/matsuyamajyobunkazai.html — designation facts only.
- CITY-OPEN: https://www.city.matsuyama.ehime.jp/shisei/opendata/top.html — confirms CC BY 4.0 applies only to designated open-data content, not all city pages. No photo admitted.
- PLATEAU-2020: https://www.geospatial.jp/ckan/dataset/plateau-38201-matsuyama-shi-2020 — dataset page retrieval failed. e-Gov metadata at https://data.e-gov.go.jp/data/dataset/mlit_20211007_0032/resource/600ba7a8-fc0d-4a98-bbfd-ea227eb70a9b reports Government of Japan Standard Terms of Use 2.0. Exact downloadable-resource terms and castle coverage NOT verified. EXCLUDED. No interior may be attributed to PLATEAU.
- Wikimedia: no individual file admitted. Category membership is not a licence.
- Google, commercial publications, restoration drawings, tourism/blog photos, Sketchfab and AI image assets: excluded.

## Output licensing
Application and generator source: MIT. Original generated geometry and procedural materials: CC BY 4.0, credit Matsuyama Castle 3D Walk contributors, link this repository and licence, state modifications. Third-party software retains upstream notices. No third-party asset is bundled by this admission decision.

## Accuracy boundary
Ken ratios are sourced facts; a metric ken conversion, elevations, opening coordinates, internal circulation, surrounding terrain and city silhouette are assumptions. No existing plan is traced. Courtyard and connecting structures are interpretive. The stair route is a modern interpretive visitor route, not an Edo-period staircase reconstruction.

## Gates
Build, generated GLB, browser collision/stair/touch checks, deployed URL, dependency notices, and physical iOS performance remain to be verified. Never infer completion from compilation alone.

## Observed asset verification
The committed GLB is self-contained and contains no image assets. Installed dependency inventory and upstream notices have been generated and reviewed. Model regeneration is byte-identical under the committed lockfile. Full observed release state is in docs/RELEASE_GATE.md; Pages and physical-device verification remain unresolved.
