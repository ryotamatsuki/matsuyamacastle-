# Release gate
Status: NOT PASSED. Do not label this repository a completed surveyed reconstruction.

Automated evidence: GitHub Actions runs npm ci, navigation tests, TypeScript/build, Chromium/WebKit/mobile-WebKit browser checks, production build and Pages deployment. Passing status must be read from the actual run, not inferred from this configuration.

Browser tests exercise:
- GLB load and source licence dialog
- keyboard input or two concurrent touch pointer event streams
- entire continuous route through the shared production walking controller
- third-floor wall constraint
- console errors and HTTP errors
- GLB signature and licence notice endpoint
- screenshots and trace artifacts

Limits:
- WebKit automation is not physical iOS Safari.
- Synthetic touch pointer streams are not a physical multi-touch test.
- Fixed-step route checks are not a complete visual or human usability review.
- Desktop 60fps / mobile 30fps cannot be certified by headless CI.
- Screenshot review remains necessary.
- Auxiliary linked keep buildings are conceptual exterior volumes; exact interiors and real geographic landscape are incomplete.
- Production test mutation API must not be shipped (VITE_TEST is unset on final build).

The final RELEASE PASS is forbidden until physical-device input/performance, visual quality, deployed assets and all user gates are actually confirmed.

## Observed run — 2026-09-14
https://github.com/ryotamatsuki/matsuyamacastle-/actions/runs/34872559405
npm ci, four navigation tests, TypeScript/build, Chromium, desktop WebKit, mobile WebKit, byte-identical GLB regeneration, self-contained/no-image GLB inspection and production test-API exclusion all passed.
Screenshots were generated and reviewed. A follow-up corrects initial pointer-lock deltas, top-gable height and interior bounce light; that source revision requires its own CI result.
GitHub Pages initial enablement FAILED: "Resource not accessible by integration" from actions/configure-pages. This is an API integration permission boundary, not a model/build failure.
Required repository-owner setting: Settings → Pages → Build and deployment → Source → GitHub Actions. Then rerun the failed deploy job or trigger the workflow. No token scopes or access controls have been modified to work around this restriction.
Physical iPhone/iPad Safari and target FPS remain unverified. RELEASE PASS remains forbidden.
