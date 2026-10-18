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

## Social preview (original artwork + manual GitHub upload)

The repo now tracks an **editable, original 1280×640 SVG** at [`assets/motionsites-social-card.svg`](assets/motionsites-social-card.svg). It is a brand illustration—**not a real screenshot of any sample and not a third-party asset collage**.

Two actions produce an exportable JPG (1280×640, below 1 MB):

1. **Browser Smoke and Featured Demo Builds** runs `node scripts/render_social_card.mjs` and uploads the `motionsites-social-preview` workflow artifact. Download its `motionsites-social-preview.jpg` after a successful run.
2. **Publish MotionSites Gallery** generates `site/assets/social-preview.jpg` at deployment. The gallery Open Graph/Twitter metadata points to this hosted JPG.

To make this appear in *GitHub repository link previews* (which cannot be set by committing a file), open **Settings → General → Social preview → Edit**, then upload the generated JPG manually. Confirm the upload from an incognito link preview. Existing screenshot cards remain separate from this typographic brand artwork.

`npx playwright` is required only in the CI rendering workflow, not by visitors to the gallery.

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
