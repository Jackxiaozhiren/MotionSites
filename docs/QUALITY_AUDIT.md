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
