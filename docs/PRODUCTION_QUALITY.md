# Live production quality audit

The earlier [local Lighthouse baseline](QUALITY_AUDIT.md) reported CI-hosted static gallery scores. That test does **not** prove performance of the publicly deployed Pages site. This independent workflow audits **production URLs** and all 30 published demo routes.

## How to read the production reports

[Production Website Quality Audit](../.github/workflows/production-quality.yml) runs after changes to its scripts, on manual dispatch and on changes merged to `main` that affect the audit. It has two independent jobs.

### 1) Three Lighthouse samples for each public page

`lighthouserc.production.cjs` uses **published** pages, not a local Python web server:

- `https://jackxiaozhiren.github.io/MotionSites/`
- `https://jackxiaozhiren.github.io/MotionSites/project.html?id=20`

It collects **three** Lighthouse runs per page, with a common GitHub Actions Chromium environment and simulated throttling. The report prints **median and min–max range** for Performance, Accessibility, Best Practices and SEO, and stores all HTML/JSON reports in the `production-lighthouse-3-runs` Actions artifact.

**Not field metrics:** These synthetic samples do not represent physical iOS/Safari/Android devices, real-user Core Web Vitals, or a reliable year-to-year performance trend without consistent test conditions. Do not copy numbers into the README without identifying the run, page, settings and date.

### 2) Public mobile-width audit of 30 demos

`scripts/audit_public_demos.mjs` fetches the actual `projects.json` and deployed `previews/manifest.json`, requires all 30 IDs, and opens each published Demo in Chromium at **390×844** with **reduced motion** enabled.

For each project it records:

- HTTP document status and visible text length;
- horizontal overflow in CSS pixels;
- uncaught JavaScript exceptions;
- broken `img` elements or HTML media errors;
- failed network requests grouped by **hostname**, without writing full external media URLs or query credentials.

A structural failure (non-200 page or unreadable content) fails the job. Other observations are **reported, not silently treated as proof of quality**—some experimental sites intentionally scroll sideways, and remote resources may fail independently of the source project.

The `production-demo-audit` artifact contains the full per-project JSON. Read it before adjusting styles or relabeling any Demo as verified. Browser snapshots alone do **not** prove original media ownership, license, video playback on phones or accessibility with VoiceOver.

## Running and interpreting checks

The new scripts are read-only toward the public website. No browser history, customer data or form submissions are collected; no external URL query strings are stored.

For a one-off run, use **Actions → Production Website Quality Audit → Run workflow**. The audit is not used as an artificial Star count or marketing claim.

Real-world follow-up still requires manual Safari/Firefox, keyboard/screen-reader tests, and [per-project asset rights review](ASSET_PROVENANCE_AUDIT.md). GitHub Pages deploy is verified separately by the [production smoke test](../scripts/check_live_gallery.mjs).
