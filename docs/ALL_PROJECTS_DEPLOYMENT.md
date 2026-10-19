# All 30 independent websites — verified build and hosting

The Gallery initially shipped five curated demo builds, leaving 25 real source projects labeled “Source only.” The directory audit found **30 nonempty independent site projects** (28 Vite apps, 2 standalone HTML sites). Empty project directories were **not found**, so none have been deleted.

## What the workflow does
1. Load the canonical 30-entry catalogue from `site/projects.json`; preserve all catalogue IDs and the five existing hosted demo URLs.
2. Build Vite apps from their own project root with `--base=./`, because each site is hosted within `/MotionSites/demos/<slug>/`. Install each app's declared dependencies with npm in an ephemeral CI runner. The build uses Vite directly; a separate TypeScript lint/typecheck failure does not necessarily prevent a functioning browser build.
3. Copy standalone HTML sites to their own demo subdirectory without repackaging remote assets.
4. Launch real Chromium, require a valid HTTP response and visible page text, check for uncaught JavaScript errors, and create a genuine screenshot for each project.
5. Fail the release if any of the **30** candidates is not verifiably rendered. The last successful Pages release remains public if this run fails.
6. Save a 30-entry `site/previews/manifest.json` only when all 30 pass. The Gallery builds its preview links exclusively from this manifest.
7. After deployment, verify all 30 screenshot URLs and demo routes and check the inline preview behavior.

## Local verification
Run `node scripts/capture_previews.mjs` after installing Playwright and Chromium in the repository root. On Mac, `CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" node scripts/capture_previews.mjs` supports the installed Chrome browser. Results are generated in `site/demos` and `site/previews`; these outputs should not be committed.

## Important limitations
A page rendering in a browser does **not** establish that every button performs a real-world service, that third-party video/GIF/CDN assets work everywhere, or that the code and media have a compatible redistribution license. Several projects are illustrative design concepts; some use trademarks or remote assets. Refer to `CREDITS.md` and `docs/ASSET_PROVENANCE_AUDIT.md` before reuse or broader promotion.

The former “Hero Liquid Glass” directory contained the default Vite starter page rather than a meaningful animation; it was replaced with a custom interactive CSS glass experiment. Venture's Tailwind initialization was fixed, and Mindloop's icons now resolve correctly under nested GitHub Pages demo URLs.
