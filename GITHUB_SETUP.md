# MotionSites — repository owner setup and launch checklist

This checklist reflects the **current repository**, not an archive to extract. Do not overwrite files in `main` using an old ZIP. Use reviewed branches and pull requests.

## GitHub About (repository settings)

Under the repository title, select the **About** edit control. These account-level settings cannot be changed simply by committing a README:

**Description**

> A curated gallery of 30 motion-driven websites and creative frontend experiments. Explore working demos, source code and implementation notes with React, GSAP and Motion.

**Website**

https://jackxiaozhiren.github.io/MotionSites/

**Topics**

`creative-coding`, `web-animation`, `animated-website`, `react`, `gsap`, `framer-motion`, `motion`, `frontend`, `typescript`, `landing-page`, `web-design`, `ui-animation`

These are intended discovery labels, **not** a guarantee of GitHub Stars or search rankings. GitHub docs: [topics](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics).

## Social preview (manual upload)

**No ready-to-upload PNG social preview is currently tracked in `assets/`.** The existing `assets/motionsites-banner.svg` is a README banner, not a verified screenshot collage or uploaded repository social card. Create a preview from authorized real project captures; keep screenshots labeled honestly and check media rights first.

Upload the result at **Settings → General → Social preview → Edit**. GitHub recommends a 1280 × 640 PNG, JPG, or GIF below 1 MB ([GitHub instructions](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/customizing-your-repositorys-social-media-preview)).

## Deploy and verify

- GitHub Pages: **Settings → Pages → Source → GitHub Actions**.
- Pages workflow: `.github/workflows/pages.yml`; output is the static `site/` gallery and independently built, verified demos when those builds succeed.
- Visit [the gallery](https://jackxiaozhiren.github.io/MotionSites/) and a [guide example](https://jackxiaozhiren.github.io/MotionSites/project.html?id=20).
- Verify `python3 scripts/check_gallery.py`, `node --check site/app.js`, and `node --check site/project.js`.
- Review both desktop and mobile layouts and respect reduced-motion settings.
- Check the `previews/manifest.json` generated during deployment; do not treat unsuccessful builds as published demos.
- Confirm all screenshot/demo URLs from a browser after deployment.

## Provenance and licensing

Before selecting a blanket code license or promoting any third-party assets, perform the [source/media provenance review](docs/ASSET_PROVENANCE_AUDIT.md), update [CREDITS.md](CREDITS.md), and document exceptions. A successful webpage build does not establish rights to the code, images, brand assets or videos.

## Launch and community

- Pin the repository on your public GitHub profile, add an honest showcase clip and link the live gallery.
- Share actual technical walkthroughs in communities that welcome self-promotion.
- Track useful feedback and resolve issues rather than chasing artificial Stars.
- Read [the launch playbook](docs/LAUNCH_PLAYBOOK.md).
