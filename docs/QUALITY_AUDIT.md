# Quality audit: accessibility and Lighthouse

MotionSites is a collection of independent frontend experiments. Automated quality checks are split into two complementary layers:

1. **Browser Smoke and Featured Demo Builds** verifies gallery interactions and the selected source builds.
2. **Accessibility and Lighthouse Baseline** audits the *static gallery* and a representative project guide, not all independent demos.

## Accessibility

`scripts/audit_accessibility.mjs` runs [axe-core with Playwright](https://playwright.dev/docs/accessibility-testing) against four scenarios: gallery at 1440×900 and 390×844, and the Axion guide at the same desktop/mobile sizes, with the browser preference for reduced motion enabled. It reports WCAG A/AA tagged rule violations and counts inconclusive checks.

The job **fails on serious/critical automated findings**, writes `artifacts/accessibility/axe-results.json` for review, and publishes that file as an `axe-accessibility-results` GitHub Actions artifact. Moderate and minor issues remain visible in the report and are not permission to ignore them.

Not covered automatically: keyboard meaning/focus order in all flows, assistive technology usability, actual device testing, visual readability in a variety of environments, or the third-party media rights of individual demos.

## Lighthouse

`lighthouserc.cjs` starts the static gallery with a local Python HTTP server and collects **one** Lighthouse run for the root gallery and `project.html?id=20` under Chromium with simulated throttling. Each GitHub Actions run saves HTML and JSON reports to the `lighthouse-baseline` artifact; a Markdown summary in Actions displays the *actual measured scores*.

**This establishes a baseline, not pass/fail performance budgets.** One synthetic run is noisy. Do not interpret it as field Core Web Vitals or declare improvements without paired comparable measurements. Once baselines are stable, add justified warning/thresholds and measure multiple runs.

The reports are written to **Actions artifacts**, not posted to Lighthouse CI temporary public storage.

### Local commands

The gallery itself has no Node install step. These commands install *testing tools only*, on a machine with Node 22 and Python 3.

```bash
npm install --no-save --ignore-scripts --no-audit --no-fund playwright@1.56.1 @axe-core/playwright@4.14.0 @lhci/cli@0.15.1
npx playwright install chromium
node scripts/audit_accessibility.mjs
export CHROME_PATH="$(node -p "require('playwright').chromium.executablePath()")"
npx lhci collect --config=lighthouserc.cjs
npx lhci upload --config=lighthouserc.cjs
node scripts/summarize_lighthouse.mjs
```

Browser checks do not certify accessibility; human review and specific third-party asset verification remain necessary. See [launch readiness](../GITHUB_SETUP.md) and [asset audit](ASSET_PROVENANCE_AUDIT.md).


## Post-deployment real preview lifecycle

`scripts/check_live_gallery.mjs` now exercises the **already deployed** public gallery after verifying 30 cards, the Axion guide, five declared demo/screenshot URLs and the social image. When Axion (ID 20) appears in the published manifest, it checks:

- No interactive iframe document is fetched before a visitor requests a preview.
- The button opens the native dialog, the same-origin iframe loads meaningful rendered body content, and the loading notice disappears.
- Escape closes the dialog, removes the iframe source and restores keyboard focus to the invoking preview button.
- A 390px viewport contains the dialog; the Close button releases the iframe.

The same script is also invoked from the pull-request browser-smoke workflow to confirm that the **currently deployed baseline** still behaves as expected. A PR run against the live site is **not** a preview deployment of the proposed code. The Pages workflow runs it again **after** each release, making it a deployed-site regression gate.

These checks still do not prove that third-party videos, embedded images, media licenses, all device/browser combinations or Core Web Vitals meet production requirements.

## macOS WebKit preview-focus regression

The `Browser Smoke and Featured Demo Builds` PR workflow also runs `scripts/smoke_webkit_gallery.mjs` on a macOS runner with Playwright WebKit. It verifies the 390px gallery and representative project guide, the opt-in iframe preview, dialog cleanup, and **focus restoration to the preview opener on both pointer- and keyboard-initiated close**.

The test protects a specific real-world WebKit behavior: clicking a button with the pointer does not necessarily focus it on macOS, so native `<dialog>` can leave focus on `<body>` when closed. MotionSites explicitly remembers the trigger and refocuses it on the `close` event. The test does not rely on a published demo or third-party media; it runs on the PR's own local static gallery source with a same-origin fixture.

This is **Playwright WebKit**, not the Safari desktop application and not an iPhone. Testing macOS Safari 27 requires enabling Safari's Developer → Allow Remote Automation preference or human manual review; the setting has not been changed automatically. Browser-engine coverage does not establish full WCAG conformance or rights to third-party assets.


## Live gallery: actual footer visibility

`site/live-previews.js` scales each real demo to its card width. The iframe's document viewport height must also match the card's **visible crop height divided by its scale**. If an embedded iframe remained 800px high behind a 245–290px crop, `scrollTop = scrollHeight - clientHeight` would reach the internal scroll limit while still keeping the final part of the page **below the card's visible area**.

The Chromium and macOS WebKit fixture test `scripts/test_live_card_previews.mjs` now checks the full user-visible contract: the card and transformed iframe heights match on mobile and desktop, and the actual document footer comes into view after automatic scrolling. As before, at most one mobile/two desktop demo iframes are active, and reduced motion turns autoplay off.

Single-screen websites naturally have no vertical scrolling; their CSS/canvas/video effects remain visible in the card. Some examples use custom fixed-position scroll experiences that need separate per-demo validation. This check proves real DOM scrolling for the controlled browser fixture, not that every independent demo implements ordinary document scrolling or that outside media are licensed.
