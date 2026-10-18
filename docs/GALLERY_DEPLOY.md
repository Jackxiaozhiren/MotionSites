# Gallery deployment

The `site/` directory is a static, searchable index of source projects. For selected projects, deployment builds real source demos and takes actual browser screenshots; the remaining cards use explicit concept artwork, not fake screenshots.

## Local preview

Run `python3 scripts/check_gallery.py` and `python3 -m http.server 8000 --directory site`; visit http://localhost:8000.

## Publish

In the repository: Settings → Pages → Build and deployment → **GitHub Actions**. Merge the gallery PR into `main`; check Actions → **Publish MotionSites Gallery** for success. Then verify https://jackxiaozhiren.github.io/MotionSites/ and place it in the repository About website field.

Actual individual projects require independent builds and review of licensing/third-party assets before hosting.

## Real browser captures

The Pages workflow builds a curated list of independent Vite projects using `scripts/capture_previews.mjs`, opens them in Playwright Chromium, and writes `site/previews/manifest.json`, screenshot JPEGs and statically hosted demos under `site/demos/`. Failed projects are skipped, so the gallery still deploys. Re-run the `Capture Real Project Previews` PR check when changing the candidate list. Screenshots reflect actual rendering during the CI capture, but runtime assets hosted by third parties can still fail or change after publication.
