# Gallery deployment

The `site/` directory is a static, searchable index of source projects. Covers are concept artwork, **not screenshots of the source projects or live demos**.

## Local preview

Run `python3 scripts/check_gallery.py` and `python3 -m http.server 8000 --directory site`; visit http://localhost:8000.

## Publish

In the repository: Settings → Pages → Build and deployment → **GitHub Actions**. Merge the gallery PR into `main`; check Actions → **Publish MotionSites Gallery** for success. Then verify https://jackxiaozhiren.github.io/MotionSites/ and place it in the repository About website field.

Actual individual projects require independent builds and review of licensing/third-party assets before hosting.
