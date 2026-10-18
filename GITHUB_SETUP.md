# Publish checklist — MotionSites GitHub refresh

> **This file is for the repository owner.** You may keep it locally instead of committing it.

## 1. Upload files

Extract the archive into the **root** of your existing local `MotionSites` checkout, preserving the `.github/`, `assets/`, and `docs/` folders. The supplied `README.md` replaces the old root README; all other files are additional. Review the diff before committing. This archive does **not** contain your existing 30 projects.

```bash
cd MotionSites
git status
git diff -- README.md
git add README.md README.zh-CN.md CONTRIBUTING.md CREDITS.md GITHUB_SETUP.md assets/ docs/ site/ scripts/ .github/
git commit -m "feat: add MotionSites gallery and refresh repository"
git push origin main
```

Do not run these commands blindly. They assume you have merged the files into your local checkout and have appropriate Git permissions. The `GITHUB_SETUP.md` file is optional; omit it from `git add` if you only want it as an owner checklist.

## 2. Edit GitHub About (manual, owner action)

Repository page → **About** gear icon:

- **Description:** `30 creative animated websites and landing pages built with React, GSAP, Motion and Tailwind CSS. Explore source code, motion UI and frontend inspiration.`
- **Website:** after publishing and verifying the gallery, set `https://jackxiaozhiren.github.io/MotionSites/`. Leave empty until then.
- **Topics:** `animated-website`, `creative-coding`, `web-animation`, `landing-page`, `react`, `vite`, `tailwindcss`, `framer-motion`, `gsap`, `motion`, `frontend`, `web-design`, `portfolio`, `ui-animation`.

## 3. Upload a social preview (manual, owner action)

GitHub repository → **Settings** → **General** → **Social preview** → **Edit**. Upload the bundled **`assets/motionsites-social-preview.png`** (1280×640 px, PNG, under 1 MB). `assets/motionsites-banner.svg` is the editable README masthead.

## 4. Add 4–6 *real* site screenshots

Follow `docs/SHOWCASE_GUIDE.md`; put authentic preview files under `assets/previews/` and link the cards from the README. Verified screenshots / clips of actual motion effects are higher priority than adding more badges.

## 5. Verify licenses and permissions before adding a blanket LICENSE

There was no root LICENSE visible during the public review. A public GitHub repo is not automatically licensed for reuse. Audit original sources/designs and third-party assets across all subprojects. Fill in `CREDITS.md` and only then choose an appropriate license for code you own and can redistribute. Do not imply a single license applies to third-party assets without checking.

## 6. Optional distribution

- Publish a small static gallery of clickable, verified previews; then put its URL in the Website field.
- Pin MotionSites on your GitHub profile and share an animated clip with an accurate source link.
- Periodically add high-quality projects and improve documentation, not just the project count.

## 7. Validation before announcing

- [ ] README and Chinese translation render as expected in GitHub light/dark mode.
- [ ] Hero SVG appears and all table links open real folders.
- [ ] At least one React/Vite sample installs and starts cleanly.
- [ ] Issue templates appear in "New issue".
- [ ] The About description and Topics were saved.
- [ ] Any live demo and screenshot links are real and working.
- [ ] Attribution and license status are clear.

## 8. Publish the new gallery (recommended)

The updated package contains a working, static `site/` gallery and GitHub Actions publishing workflow. It does **not** deploy each individual sample. See [`docs/GALLERY_DEPLOY.md`](docs/GALLERY_DEPLOY.md) for instructions and the exact Pages settings. Enable **Settings → Pages → Source → GitHub Actions**, push the files, check Actions for success, and verify the site before adding the Website URL to About.

Run `python3 scripts/check_gallery.py` and optionally `python3 -m http.server 8000 --directory site` before uploading.

## 9. Distribution plan

After the gallery URL is verified, follow [`docs/LAUNCH_PLAYBOOK.md`](docs/LAUNCH_PLAYBOOK.md) for responsible, measured outreach, real screenshots, and feedback iteration.