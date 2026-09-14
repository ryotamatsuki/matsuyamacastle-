# Final release gate — NOT PASSED

Updated: 2026-09-15.

The rights-clean interior-evidence upgrade is merged to `main`, deployed to GitHub Pages, and its automated production verification is green. The repository owner enabled GitHub Actions as the Pages source, resolving the former `Resource not accessible by integration` blocker. The previous screenshot-timeout defect has also been repaired and verified in production.

The final declaration remains **NOT PASSED** because the requested release standard is stricter than automated deployment success: physical iPhone/iPad Safari remains unverified, and exact interior geometry is still C where rights-cleared multi-view camera registration is insufficient.

## Observed gate ledger

| Gate | Current observed result |
|---|---|
| GitHub Pages public | **PASS** — `https://ryotamatsuki.github.io/matsuyamacastle-/` |
| Pages configure/deploy permission | **PASS** |
| PR validation | **PASS** — PR #1, Actions run `34877470990` |
| Post-merge main build | **PASS** — Actions run `34877778166` |
| Production Pages deploy | **PASS** — Actions run `34877778166` |
| Production URL smoke | **PASS** — public readiness, attribution, movement, production test-API exclusion, required assets, HTTP/console audit and screenshot evidence all passed |
| Honmaru → keep | **PASS** in automated continuous route |
| Enter interior | **PASS** |
| Basement, 1F, 2F, 3F | **PASS** — continuous traversal, no floor teleport |
| Functional walkable stairs | **PASS as gameplay route**; historical/exact stair placement remains C |
| PC controls | **PASS** in Chromium/WebKit automation |
| iPhone/iPad touch automation | **PASS/PARTIAL** — mobile WebKit + simultaneous synthetic touch streams |
| Physical iPhone/iPad Safari | **NOT VERIFIED** |
| Collision | **PASS** for covered wall/gate/stair/fall-prevention cases; not a survey certification |
| `public/models/matsuyama_keep.glb` | **PASS/PRESENT** with evidence/provenance extras |
| Reproducible model | **PASS** — byte-identical regeneration |
| GLB image assets | **PASS** — zero image assets, self-contained |
| `RIGHTS_AUDIT.md` | **PASS/PRESENT** |
| `ACCURACY.md` | **PASS/PRESENT** |
| `INTERIOR_EVIDENCE_MATRIX.md` | **PASS/PRESENT** |
| `docs/evidence/*.svg` | **PASS/PRESENT** — audit diagrams, explicitly not floor plans |
| `ATTRIBUTION.md` | **PASS/PRESENT** — CC BY evidence attribution recorded |
| `THIRD_PARTY_NOTICES.md` | **PASS/PRESENT** |
| `source_manifest.json` | **PASS/PRESENT** — file-level rights/status/use metadata |
| Used evidence licences | **PASS** — official facts-only, Public Domain, CC BY and original output only |
| CC BY-SA / ShareAlike | **EXCLUDED** from reconstruction input under current policy |
| Unknown-rights assets | **NONE admitted** |
| Third-party photo textures | **NONE** — photographs are evidence only, not textures |
| Modern exhibits / people | **EXCLUDED** from reconstruction geometry |
| Non-open plan tracing | **NONE** |
| B evidence multiplicity | **PASS** — `tests/evidence.test.mjs` enforces multiple reusable sources/views |
| Stair exact geometry | **C** — not promoted without sufficient evidence |
| Column centres / partitions / exact window bays | **C** — camera registration insufficient |
| npm ci / npm test / production build | **PASS** |
| Chromium/WebKit/mobile-WebKit browser tests | **PASS** |
| Console fatal errors / asset 404 in production smoke | **NONE observed** |
| README / UI evidence viewer | **PASS/PRESENT** |
| Survey-grade claim | **NONE** |

## B-grade scope actually justified

Current B classifications are deliberately limited to:

- exposed timber / beam **morphology**;
- window / plastered lattice / raised shutter / inner sliding-door assembly **morphology**;
- top-floor outward-opening / view **relationship**.

These B labels do **not** promote exact coordinates. Exact column centres, beam sections/spacing, floor heights, window counts/bay positions, stair coordinates/directions and internal partitions remain C.

The generated `public/data/model-report.json` is the machine-readable record of this boundary: overall/geometry accuracy C, limited B scope, zero image assets, rights-cleared source IDs, physical iOS `NOT VERIFIED`, and `release_pass: false`.

## CI evidence

PR #1 (`feat/interior-evidence-bgrade`) passed run `34877470990`, including rights/evidence unit tests, Chromium/WebKit/mobile-WebKit, the continuous 3-floor route, production build, byte-identical GLB regeneration and GLB rights/provenance inspection.

After squash merge, main run `34877778166` repeated those checks and additionally passed real GitHub Pages deployment and `Verify published Pages URL and assets`. The repaired screenshot evidence path therefore has production evidence, not merely a local/PR test.

## Remaining blockers for the requested final declaration

1. **Physical iPhone/iPad Safari is still `NOT VERIFIED`.** Headless mobile WebKit and synthetic multi-touch are not equivalent to an actual device run.
2. **A project-wide B-grade interior geometry claim is not justified.** Rights-cleared evidence is sufficient for selected morphology/relationships, but not for exact stairs, column centres, partitions, floor heights or exact window bay coordinates. Multi-view camera registration / photogrammetric recovery is still incomplete.

Therefore the repository must **not** issue:

`MATSUYAMA CASTLE INTERIOR RECONSTRUCTION — B-GRADE VERIFICATION PASS`

Current strict verdict:

**NOT PASSED — automated rights/evidence/build/browser/reproducibility/deployment gates PASS; selected morphology/relationship elements are B; exact interior geometry remains C where evidence is insufficient; physical iOS remains NOT VERIFIED.**
