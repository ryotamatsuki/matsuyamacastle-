# Validation gate

Status: **NOT PASSED** for the requested full B-grade declaration. Automated implementation and deployment validation is green, but the project must not be labelled a surveyed reconstruction.

## Observed automated result

The rights-clean interior-evidence implementation passed:

- PR #1 Actions run `34877470990` — **PASS**
- post-merge main Actions run `34877778166` — **PASS**
- GitHub Pages configure/deploy — **PASS**
- real production URL smoke test — **PASS**
- production evidence screenshot capture — **PASS**

The build job covers:

- `npm ci`
- navigation/collision tests
- rights/evidence unit tests
- TypeScript + production model build
- Chromium / WebKit / mobile-WebKit browser checks
- simultaneous synthetic touch streams on the mobile project
- full continuous Honmaru → basement → 1F → 2F → 3F production-Walker route
- browser evidence/source/accuracy panel checks
- byte-identical model regeneration
- self-contained GLB audit with zero image assets
- GLB provenance / B-scope assertions
- production test mutation API exclusion
- screenshots/artifacts

Main-only deployment then publishes the Pages artifact and runs a real production URL smoke check.

## Rights / evidence gates

`tests/evidence.test.mjs` requires:

- explicit manifest status and rights metadata;
- reconstruction inputs to be `admitted` or `facts-only`;
- no BY-SA / ShareAlike source in the admitted reconstruction source set;
- every B element to have at least two independent reusable views and multiple source IDs;
- all B elements currently to retain `geometryAccuracy: C` unless registered geometry evidence is added later;
- stairs, exact column grid, floor height and partitions to remain C;
- physical iOS state to remain `NOT VERIFIED` unless actual evidence is added.

This prevents a documentation-only or cosmetic promotion from C to B.

## Browser gates

Browser tests verify:

- GLB load;
- source / rights viewer;
- visible `CITY-KEEP`, Public Domain and CC BY evidence entries;
- statement that exact model geometry remains C;
- reconstruction panel explaining limited B scope and C stair placement;
- keyboard input or two concurrent touch pointer streams;
- entire continuous route through the same production walking controller;
- third-floor wall constraint;
- console errors and HTTP errors;
- GLB signature, manifest and licence-notice endpoint;
- screenshots.

Run `34877470990` passed these gates before merge. Run `34877778166` repeated them on main and passed.

## Public deployment smoke gate

The production smoke test verifies, in this order:

1. the public page loads and `window.__castle.ready` becomes true;
2. the source panel contains attribution;
3. Start works and keyboard movement changes the actual player position;
4. production does not expose `__walkTest`;
5. GLB, source manifest, dependency notices and model report return HTTP 200;
6. there are no captured console errors or HTTP >=400 responses;
7. only after those functional gates pass, a published-page evidence screenshot is taken.

The old run `34873484367` had successfully deployed Pages but its final screenshot hit Playwright's 30-second timeout. The implementation now creates the evidence directory explicitly, requests reduced motion, disables CSS animations/transitions only for capture, and uses a dedicated screenshot timeout **after** all functional/public-site checks. Main run `34877778166` passed `Verify published Pages URL and assets` and preserved the published-page evidence, confirming that this defect is resolved in production.

## Accuracy validation boundary

Current B scope is intentionally limited to:

- exposed timber / beam morphology;
- window / plastered lattice / raised-shutter / inner sliding-door assembly morphology;
- top-floor outward-opening / view relationship.

Exact column centres, beam sections/spacing, floor heights, window counts/bay positions, stair coordinates/directions and internal partitions remain C. The evidence matrix, GLB provenance and generated model report agree with this boundary.

`public/data/model-report.json` records:

- overall accuracy: C;
- geometry accuracy: C;
- limited B morphology/relationship scope;
- zero image assets;
- self-contained GLB;
- rights-cleared source IDs;
- physical iOS: `NOT VERIFIED`;
- `release_pass: false`.

## Limits not solved by automated CI

- WebKit automation is not physical iOS Safari.
- Synthetic touch streams are not physical multi-touch evidence.
- Headless CI does not certify sustained physical-device FPS.
- Camera registration / photogrammetric recovery of exact interior coordinates has not been completed from multiple reusable views.
- Fixed-step route tests are not a complete visual/human heritage review.
- Auxiliary linked keep buildings and surrounding landscape remain conceptual C-grade geometry.

## Final strict interpretation

All requested automated rights/build/browser/reproducibility/Pages-production gates that are executable in CI now pass. That does **not** satisfy the user's all-or-nothing final declaration because physical iOS remains unverified and major exact interior geometry remains C by design.

Therefore:

`MATSUYAMA CASTLE INTERIOR RECONSTRUCTION — B-GRADE VERIFICATION PASS`

must **not** be issued yet.

Current verdict: **NOT PASSED**, with defensible B classifications only for the explicitly enumerated morphology/relationship elements.
