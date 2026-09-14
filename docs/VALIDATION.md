# Validation gate

Status: **NOT PASSED** for the requested full B-grade declaration. Do not label this repository a surveyed reconstruction.

## Automated gates

GitHub Actions now runs validation on pull requests and deploys only from main. The build job covers:

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

Main-only deploy then runs GitHub Pages deployment followed by a real production URL smoke check.

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

Browser tests exercise:

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

## Public deployment smoke gate

The production smoke test verifies, in this order:

1. public page loads and `window.__castle.ready` becomes true;
2. source panel contains attribution;
3. Start works and keyboard movement changes the actual player position;
4. production does not expose `__walkTest`;
5. GLB, source manifest, dependency notices and model report return HTTP 200;
6. there are no captured console errors or HTTP >=400 responses;
7. only after those functional gates pass, a published-page evidence screenshot is taken.

A previous run (`34873484367`) successfully configured and deployed Pages after the repository owner enabled GitHub Actions as the Pages source. Its final evidence screenshot hit Playwright's 30-second screenshot timeout. The current branch changes evidence capture to create its directory explicitly, request reduced motion, disable CSS animations/transitions for capture, and use a dedicated screenshot timeout **after** functional/public-site checks. Thus an evidence-capture issue cannot conceal a load/404/console failure.

## Accuracy validation boundary

Current B scope is intentionally limited to:

- exposed timber / beam morphology;
- window / plastered lattice / raised-shutter / inner sliding-door assembly morphology;
- top-floor outward-opening / view relationship.

Exact column centres, beam sections/spacing, floor heights, window counts/bay positions, stair coordinates/directions and internal partitions remain C. The evidence matrix and GLB provenance must continue to agree with this boundary.

## Limits not solvable by headless CI

- WebKit automation is not physical iOS Safari.
- Synthetic touch streams are not physical multi-touch evidence.
- Headless CI does not certify sustained physical-device FPS.
- Camera registration / photogrammetric recovery of exact interior coordinates has not been completed from multiple reusable views.
- Fixed-step route tests are not a complete visual/human heritage review.
- Auxiliary linked keep buildings and surrounding landscape remain conceptual C-grade geometry.

## Current observed state

Baseline source before this PR had passing build/navigation/browser/reproducibility checks. Pages is now public and the old enablement blocker is resolved. PR #1 (`feat/interior-evidence-bgrade`) adds the rights/evidence/provenance gates described above and must obtain its own green Actions result before merge. After merge, main must obtain a green deployment + production smoke result.

Even if all automated gates pass, physical iPhone/iPad Safari remains `NOT VERIFIED` unless actual device evidence is supplied. Therefore the requested final `MATSUYAMA CASTLE INTERIOR RECONSTRUCTION — B-GRADE VERIFICATION PASS` must not be issued merely from CI success.
