# Final release gate — NOT PASSED

Updated: 2026-09-15.

Public Pages has been enabled and a Pages deployment has succeeded. The previous `Resource not accessible by integration` blocker is resolved. Baseline deployment run `34873484367` reported Pages deployment success, but its post-deploy evidence screenshot timed out; this branch fixes that evidence-capture path and must pass CI before it is merged.

The new interior-evidence work is intentionally conservative: exact geometry remains C overall. Only corroborated morphology/relationships are B.

| Gate | Current observed result |
|---|---|
| GitHub Pages public | PASS for baseline deployment: `https://ryotamatsuki.github.io/matsuyamacastle-/` |
| Pages configure/deploy permission | PASS after owner enabled GitHub Actions source |
| Production post-deploy smoke | BASELINE PARTIAL: model/site checks reached evidence capture; screenshot timed out. Fix present on this branch; CI validation required |
| Honmaru → keep | PASS in previous browser/navigation gates; must remain green on branch CI |
| Enter interior | PASS in previous gates |
| Basement, 1F, 2F, 3F | PASS in previous continuous traversal gate; no floor teleport |
| Functional walkable stairs | PASS as gameplay route; **historical/exact stair placement remains C** |
| PC controls | PASS in previous Chromium/WebKit gates |
| iPhone/iPad touch automation | PASS/PARTIAL: mobile WebKit and simultaneous synthetic touch streams; not physical device evidence |
| Physical iPhone/iPad Safari | **NOT VERIFIED** |
| Collision | PASS for covered wall, gate, stair and fall-prevention cases; not exhaustive survey validation |
| `public/models/matsuyama_keep.glb` | PRESENT; branch generator adds evidence/provenance extras |
| Reproducible model | Previous PASS; branch must retain byte-identical regeneration |
| `RIGHTS_AUDIT.md` | PRESENT and updated with file-level PD/CC BY evidence |
| `ACCURACY.md` | PRESENT; overall exact geometry C; limited B morphology/relationship only |
| `INTERIOR_EVIDENCE_MATRIX.md` | PRESENT |
| `docs/evidence/*.svg` | PRESENT; explicitly audit diagrams, not floor plans |
| `ATTRIBUTION.md` | PRESENT; CC BY evidence authors/licences/use recorded |
| `THIRD_PARTY_NOTICES.md` | PRESENT |
| `source_manifest.json` | PRESENT; per-file rights/status/use metadata |
| Used evidence licences | PASS at admission stage: facts-only official sources, PD, CC BY, original output |
| CC BY-SA / ShareAlike | EXCLUDED from reconstruction input under current policy |
| Unknown-rights assets | NONE admitted |
| Third-party photo textures | NONE; photos used only as architectural evidence |
| Modern exhibits / people | EXCLUDED from reconstruction geometry |
| Non-open plan tracing | NONE |
| B evidence multiplicity | Enforced by `tests/evidence.test.mjs`: B requires >=2 independent reusable views/sources |
| Stair exact geometry | C; not promoted without sufficient evidence |
| Column centres / partitions / exact window bays | C; camera registration not sufficient |
| npm ci / npm test / build / browser tests | PR CI required for this branch |
| Console fatal errors / asset 404 | PR preview + post-merge production smoke required |
| README / UI evidence viewer | Updated on branch |
| Survey-grade claim | NONE |

## B-grade scope

Current B classifications are deliberately limited to:

- exposed timber / beam morphology;
- window / plastered lattice / raised shutter / inner sliding-door assembly morphology;
- top-floor outward-opening / view relationship.

These B labels do **not** promote exact coordinates. Exact column centres, beam sections/spacing, floor heights, window counts/bay positions, stair coordinates/directions and internal partitions remain C.

## CI state for this branch

PR #1 (`feat/interior-evidence-bgrade`) runs the full build/navigation/evidence/browser/reproducibility/GLB audit without deploying a PR preview. Main-only merge then performs the real Pages deploy and production URL smoke test.

The post-deploy smoke test now checks page readiness, attribution, actual movement, production test-API exclusion, required assets, HTTP >=400 responses and console errors **before** evidence screenshot capture. Screenshot capture runs with reduced motion/animations disabled and a dedicated timeout, so screenshot behavior cannot conceal a functional/public-site failure.

## Remaining hard blockers for the requested final declaration

1. Branch CI and post-merge main CI must pass.
2. Production URL smoke must pass after the new code is deployed.
3. Physical iPhone/iPad Safari remains `NOT VERIFIED` unless actual device evidence is supplied.
4. A project-wide “B-grade interior geometry” claim is not justified: important exact geometry is still C because reusable multi-view camera registration is insufficient.

Therefore do **not** issue:

`MATSUYAMA CASTLE INTERIOR RECONSTRUCTION — B-GRADE VERIFICATION PASS`

until every requested gate is actually satisfied. The current correct final state is **NOT PASSED** even though selected morphology/relationship elements have defensible B evidence.
