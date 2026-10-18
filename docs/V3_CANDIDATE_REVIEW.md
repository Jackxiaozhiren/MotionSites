# MotionSites v3 — candidate demo review (2026-10-18)

This is an **evaluation-only pipeline**. It does not add demos to the published Pages gallery, upload original third-party video assets, change the current 5 verified demo entries, or grant reuse rights.

## Candidate shortlist

| Gallery ID | Candidate | Source | Known review issue (pre-CI) | Publication gate |
|---|---|---|---|---|
| 18 | RIVR | `projects/rivr/` | Video referenced from an external CloudFront host; verify creator and permission. | Build + browser QA **and** rights |
| 29 | dot. | `projects/dot/` | Background MP4 referenced from CloudFront; verify origin and fallback. | Build + browser QA **and** rights |
| 30 | Hero Liquid Glass | `projects/hero-liquid-glass/` | `src/App.tsx` contains Vite/React starter branding and links; ensure the public title/description reflect what is actually built. | Verify meaningful custom project |
| 23 | Mindloop | `projects/mindloop/` | Media references and embedded third-party service branding require review. | Build + browser QA **and** rights |
| 15 | CINEMATIC | `projects/cinematic/` | Full-screen external CloudFront video, UI links appear illustrative; verify media permission and user expectations. | Build + browser QA **and** rights |

Run **V3 Candidate Demo Review** using a pull request or workflow dispatch. Every matrix job installs dependencies on an ephemeral runner, uses the project's own build script, runs Chromium at 1440×900 and 390×844 and uploads a JSON report plus actual screenshots if successful. The npm production-dependency audit is advisory: findings must be triaged rather than dismissed or treated as proof of compromise.

## Evidence standards

- **Build passes** does not establish that a page is useful or polished. Inspect screenshots for starter templates, blank videos, incorrect branding, broken assets and mobile overflows.
- **Dependency audit** is a point-in-time report, not a guarantee of safety. Validate severity, reachable code paths and patched versions before changing dependencies.
- **Source URLs** do not provide redistribution, commercial-use, hotlink or trademark permission. Confirm creators, license terms and media provenance for every publicly deployed candidate.
- **Source first:** prefer responsibly replacing unlicensed footage with original/owned media and meaningful CSS fallback. Do not automatically incorporate third-party demo captures in public README.
- Only after checks, add a candidate to the curated list in `scripts/capture_previews.mjs`, update relevant Pages/PR workflow path filters, update provenance and credits, and validate post-deploy URLs.

See [asset provenance audit](ASSET_PROVENANCE_AUDIT.md), [owner issue #5](https://github.com/Jackxiaozhiren/MotionSites/issues/5) and [showcase guide](SHOWCASE_GUIDE.md).
