# Contributing to MotionSites

Thanks for helping make this collection more useful.

## Before you open a PR

1. Check existing [issues](https://github.com/Jackxiaozhiren/MotionSites/issues) to avoid duplicates.
2. Mention the **exact project path** you are changing, such as `projects/axion-studio/` or `projects/mindloop/`.
3. Keep changes inside the relevant project where possible. Projects are independent; don't assume shared tooling.
4. Test from that project's own directory. For Vite projects, run `npm install`, `npm run build` when available, and `npm run dev` to verify the page. For HTML-only projects, check in a browser.
5. Include before/after screenshots or a short recording for visual changes.
6. Do not commit generated `node_modules/`, `dist/`, secrets, or API keys.

## Adding a new website

- Choose a descriptive directory name and include an `index.html` or a complete project with `package.json` and working scripts.
- Explain the visual concept, key effects, dependencies, and how to start it.
- Update the index in **both** `README.md` and `README.zh-CN.md`, add a matching entry in [`site/projects.json`](site/projects.json), and update project counts in the gallery/README and [`scripts/check_gallery.py`](scripts/check_gallery.py).
- If possible, add **real** screenshots (`webp` or `png`) and short motion clips using the [showcase guide](docs/SHOWCASE_GUIDE.md).
- Include origins and licenses for external artwork, fonts, copied designs, code, and other assets in [CREDITS.md](CREDITS.md). Only submit materials you have rights to redistribute.
- Do not imply endorsement by a company simply because a project references its visual style.

## Updating the interactive gallery

- Edit `site/projects.json` for project title, real source directory, verified technology list, and `mood` (an **illustrated cover**, not a claim about actual visuals).
- Run `python3 scripts/check_gallery.py` after any catalog changes.
- Preview with `python3 -m http.server 8000 --directory site` and verify keyword search, stack filters, source links, mobile layout, and reduced-motion preferences.
- Real previews must be captured from a running project and attributed correctly. Never silently present conceptual artwork as a screenshot.
- Gallery-only changes should not add dependencies to individual subprojects.

## Reporting issues

Use the [issue templates](https://github.com/Jackxiaozhiren/MotionSites/issues/new/choose). For broken demos, include the project path, browser, OS, reproduction steps, expected result, and actual result. Remove private information from screenshots and logs.

## Pull requests

Small, focused PRs are easiest to review. Describe **what changed**, **why**, **which project**, and **how you tested it**. A reviewer may request asset credits or reproducible steps before merging.

## Licensing notes

Do not assume all projects or all third-party assets have a single blanket open-source license. The repository maintainer should confirm code and asset provenance before adopting a repository-wide license. See [CREDITS.md](CREDITS.md).
## Gallery discoverability checks

The project catalog has a **single source of truth**: `site/projects.json`. Do not copy its entries into `site/app.js`. Keep project IDs unique and sequential; use an existing supported stack tag (React, GSAP, Framer Motion, Motion, HTML). Gallery filters are reflected in the URL (`stack`, `q`, `demos`) so shared links should continue to work. Test keyboard focus, screen-reader labels and reduced-motion behavior in addition to the static validation script. If a new filter category is introduced, update both the gallery buttons and the validator.

## Writing a source-backed guide

New project guide content lives in `site/project-notes.json`. Read [the maintainer guide](docs/PROJECT_GUIDES.md) and verify every referenced source file before describing an interaction. Clearly label conceptual product UI, external asset dependencies and unverified features. Do not present a source-only project as a working hosted demo. The CI validator checks all note file references.

For third-party images, videos, fonts and brands follow [the provenance audit workflow](docs/ASSET_PROVENANCE_AUDIT.md) and update `CREDITS.md` after verification. A public repository is not automatically a grant of rights to redistribute those assets.
