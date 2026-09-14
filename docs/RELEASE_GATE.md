# Final release gate — NOT PASSED
Last validated application source: fa634a572aca90656cd0d78080c3a26a173d8980.
Generated-asset commit: 9abfca50d2e64a68307fa05984f62acfd3fb38fe.
Evidence: https://github.com/ryotamatsuki/matsuyamacastle-/actions/runs/34873003333

| Original gate | Observed result |
|---|---|
| GitHub Pages public | BLOCKED: initial Pages creation rejected by integration permission |
| Honmaru → keep | PASS: continuous controller route, both directions |
| Enter interior | PASS |
| Basement, 1F, 2F, 3F | PASS: continuous traversal, no floor teleport |
| Functional stairs | PASS: ascent and descent |
| PC controls | PASS: actual Start button and keyboard in Chromium/WebKit |
| iPhone/iPad touch | PARTIAL: mobile WebKit and simultaneous synthetic touch streams pass; physical devices unavailable |
| Collision | PASS for covered wall, gate, stair and fall-prevention cases; not a claim of exhaustive geometric testing |
| public/models/matsuyama_keep.glb | PRESENT, generated and committed |
| Reproducible model | PASS: byte-identical regeneration |
| RIGHTS_AUDIT.md | PRESENT |
| ACCURACY.md | PRESENT, overall C; no unsupported B classification |
| ATTRIBUTION.md | PRESENT |
| THIRD_PARTY_NOTICES.md | PRESENT with installed inventory and licence texts |
| source_manifest.json | PRESENT; unverified PLATEAU excluded |
| Used-asset licences | PASS within admitted inputs: original geometry/materials, facts-only references, MIT runtime |
| Unknown-rights assets | NONE admitted; no imported images, fonts, models or AI imagery |
| Non-open plan tracing | NONE |
| npm ci | PASS |
| npm run build | PASS |
| Console fatal errors | NONE in tested preview browser sessions |
| Asset 404 | NONE in tested preview browser sessions; public-URL check pending deployment |
| README | PRESENT with actual generated screenshots |
| Physical iOS Safari / FPS | UNVERIFIED |
| Visual quality | Screenshots reviewed and corrected; not certified as survey-quality heritage reconstruction |

## Concrete remaining action
The repository owner must set **Settings → Pages → Build and deployment → Source: GitHub Actions**:
https://github.com/ryotamatsuki/matsuyamacastle-/settings/pages

GitHub returned `Resource not accessible by integration` when actions/configure-pages tried to create the Pages site. The connected tools cannot administer this setting. Retrying the same denied call does not fix it. No access controls have been bypassed.

After enabling Pages, rerun the latest failed deploy job. The workflow now checks the real public URL for model loading, source attribution, keyboard movement, missing assets, fatal errors and production test-API exclusion, and preserves a published-page screenshot.

Physical iPhone/iPad Safari input and sustained FPS still require those devices. Mobile WebKit CI is explicitly not substituted for physical-device evidence. Do not issue RELEASE PASS before all required checks are actually met.

## Reconstruction limits
The core is a facts-constrained parametric interpretation. Auxiliary buildings, inner circulation, opening placements, terrain and skyline are C, not surveyed reconstructions. The exterior and interior are traversable, but this does not establish archaeological accuracy. Publicly documented confidence labels remain visible.
