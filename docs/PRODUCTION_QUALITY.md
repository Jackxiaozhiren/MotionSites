# Live production quality audit

The earlier [local Lighthouse baseline](QUALITY_AUDIT.md) reported CI-hosted static gallery scores. That test does **not** prove performance of the publicly deployed Pages site. This independent workflow audits **production URLs** and all 30 published demo routes.

## How to read the production reports

[Production Website Quality Audit](../.github/workflows/production-quality.yml) runs after changes to its scripts, on manual dispatch, on changes merged to `main` that affect the audit, **and after a successful `Publish MotionSites Gallery` workflow finishes on `main`**. The post-deploy trigger avoids accidentally measuring the previous website version before Pages has finished publishing. Failed or non-main deployments skip the jobs. It has two independent jobs.

### 1) Three Lighthouse samples for each public page

`lighthouserc.production.cjs` uses **published** pages, not a local Python web server:

- `https://jackxiaozhiren.github.io/MotionSites/`
- `https://jackxiaozhiren.github.io/MotionSites/project.html?id=20`

It collects **three** Lighthouse runs per page, with a common GitHub Actions Chromium environment and simulated throttling. The report prints **median and min–max range** for Performance, Accessibility, Best Practices and SEO, and stores all HTML/JSON reports in the `production-lighthouse-3-runs` Actions artifact.

**Not field metrics:** These synthetic samples do not represent physical iOS/Safari/Android devices, real-user Core Web Vitals, or a reliable year-to-year performance trend without consistent test conditions. Do not copy numbers into the README without identifying the run, page, settings and date.

### 2) Public mobile-width audit of 30 demos

`scripts/audit_public_demos.mjs` fetches the actual `projects.json` and deployed `previews/manifest.json`, requires all 30 IDs, and opens each published Demo twice in Chromium at **390×844**: once with **reduced motion** and once with **normal motion** (`no-preference`). This produces 60 observations so decorative-video behavior can be compared under both settings.

For each project it records:

- HTTP document status and visible text length;
- horizontal overflow in CSS pixels;
- uncaught JavaScript exceptions;
- broken `img` elements or HTML media errors;
- the count of video elements and the count of media elements actively playing with decoded data at a bounded snapshot (these are **not** proof of visible/audible playback);
- failed network requests grouped by **hostname**, without writing full external media URLs or query credentials.

A structural failure (non-200 page or unreadable content) fails the job. Other observations are **reported, not silently treated as proof of quality**—some experimental sites intentionally scroll sideways, and remote resources may fail independently of the source project.

The `production-demo-audit` artifact contains the full per-project JSON, with `summary` preserving reduced-motion reporting and `normalMotionSummary` reporting normal motion separately. The Actions summary compares both modes side by side. Read it before adjusting styles or relabeling any Demo as verified. Browser snapshots alone do **not** prove original media ownership, license, video playback on phones or accessibility with VoiceOver.

## Running and interpreting checks

The new scripts are read-only toward the public website. No browser history, customer data or form submissions are collected; no external URL query strings are stored.

For a one-off run, use **Actions → Production Website Quality Audit → Run workflow**. The audit is not used as an artificial Star count or marketing claim.

Real-world follow-up still requires manual Safari/Firefox, keyboard/screen-reader tests, and [per-project asset rights review](ASSET_PROVENANCE_AUDIT.md). GitHub Pages deploy is verified separately by the [production smoke test](../scripts/check_live_gallery.mjs).


## 2026-10-19: investigating seven media-error observations

The first deployed 390px reduced-motion audit recorded **7 projects with HTMLMediaElement errors** while all 30 pages still loaded. It also found one failed font-domain request from LinkFlow. Those findings do not establish that the whole page failed or that a user-facing service exists.

The following source demos have been updated in a focused branch to **not mount decorative remote video when `prefers-reduced-motion: reduce` is set** and to leave a local CSS background visible when an ordinary-mode video reports a loading error: Aethera, VEX, Asme (Motion), securify, LinkFlow, Axion Studio (subproject), Equilibrium. LinkFlow's canvas experiment also limits its video-frame buffer to **48 frames at up to 480px width** rather than keeping an unbounded array.

CI runs `scripts/check_media_fallbacks.mjs` on the freshly built demos after `scripts/capture_previews.mjs` and checks that reduced-motion visitors do not request decorative videos and that blocked remote media does not cause a JavaScript exception or remove the page's text content.

**Scope boundaries:** This only establishes a deterministic fallback for these projects. It does not determine whether media has been licensed, whether autoplay works on iOS Safari, whether the original media server is reliable, or whether every user should experience identical motion. For reusable media, obtain asset rights and attribution evidence separately.


## 2026-10-20: dual-mode media regression coverage

For normal-motion mode the same production script now collects a second complete set of 30 observations; it does **not** require zero remote-media errors. External CDN availability, user gesture autoplay rules, mobile browser policies and media ownership are outside what a single synthetic run can guarantee. A remote video may be loading slowly at the snapshot, or may have encountered a cross-origin error. Reports distinguish these findings from page readability, navigation and JavaScript stability.

The public mobile run is complemented by a separate, read-only **Mac Chrome** headless spot check when Remote Desktop Commander is online. Mac Chrome and GitHub Actions Chromium are different environments; do not claim Safari has been tested merely because Safari is installed on the Mac. For true Safari and iPhone/Android coverage, use actual device/browser test runs and record their versions and results.


## 2026-10-20: preserve evidence when videos fail

The first normal-motion 30-demo scan identified two media-element errors: **Axion Studio (ID 20)** and **Wanderful (ID 22)**. Each uses an externally hosted decorative video and already has an original CSS gradient behind it. The focused change unmounts failed videos rather than leaving broken elements in place. Both projects now expose an explicit `data-video-fallback="error"` marker on the background wrapper while the page remains readable.

The public audit independently counts **`pagesWithMediaFallbackErrors`** alongside currently broken media elements; otherwise unmounting an errored video could misleadingly turn a real asset failure into a clean report. The marker is not a marketing or UI failure indicator; it is a diagnostic that allows maintainers to see that a fallback occurred. A 1.2-second synthetic video observation can also miss transient failures or slow streams.

The captured-video regression tests simulate blocked remote media for **nine** projects (the original seven plus Axion Studio and Wanderful), assert that their text remains present and no uncaught exception occurs, and specifically check the two explicit fallback markers. No video is copied, mirrored, or relicensed.

## Normal-motion decorative video progress (October 2026)

The main mobile audit records video-element errors and fallback states after a short snapshot; this can miss playback that starts later. A focused **public Pages video progression probe** now visits Axion Studio (ID 20) and Wanderful (ID 22) at 390×844 under normal motion, takes snapshots at 0, 3 and 6.5 seconds after hydration, and records:

- HTMLVideoElement `currentTime`, `readyState`, error code and frame dimensions when a video exists;
- whether the existing `data-video-fallback="error"` marker shows a graceful CSS background fallback;
- readable content, horizontal overflow, runtime errors, and failed request **hostnames only**.

Results are published as `decorative-video-playback.json` in the production-demo-audit artifact. The probe distinguishes `playback-progress-observed`, `media-error-handled-by-fallback`, and `playback-not-confirmed-within-window`. Only unreadable pages, overflow and JavaScript exceptions fail the job; transient external video unavailability remains a recorded finding.

A passing time-progression check **does not prove** smooth frames, content licensing, iPhone/Safari compatibility, permanent CDN availability, or real-user performance. In a separate, independent Mac Chrome 155 spot check on October 20, Wanderful progressed from 0 to 8.5 seconds and Axion from 0 to 5.9 seconds over approximately 7.5 seconds, with no failed requests; the third-party video URL also returned an HTTP 206 range response and H.264 metadata. These are observations at that time, not permission to copy the video.
