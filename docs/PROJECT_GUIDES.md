# MotionSites project guides

The gallery now has a source-first guide for **every** catalog entry:

`https://jackxiaozhiren.github.io/MotionSites/project.html?id=20`

The guide shows the actual source link, a local setup snippet, and a screenshot **only when** the CI capture manifest contains a verified build. Other projects clearly use a concept cover rather than implying that a real screenshot exists.

## Featured source-verified walkthroughs

The structured notes in [`site/project-notes.json`](../site/project-notes.json) cover:

| Gallery ID | Project | Source-backed learning points |
|---|---|---|
| 1 | Jack · 3D Creator | FadeIn sequencing, Magnet portrait, Framer Motion scroll transformations |
| 3 | Prisma — Creative Studio | animated text, motion entrance, useInView feature cards |
| 20 | Axion Studio | video frame capture, canvas playback, GSAP parallax |
| 22 | Wanderful | video layers, mouse parallax, introductory transitions |
| 28 | Foundation | Motion entrance effects, floating navigation, marquee layout |

These are **code-reading notes**, not performance certification, feature guarantees, endorsement by brands, or permissions to reuse third-party media.

## Add or maintain a guide

1. Locate the relevant entry in [`site/projects.json`](../site/projects.json).
2. Inspect the actual component files and `package.json` in that subproject.
3. Add a key matching the numeric gallery ID to `site/project-notes.json`.
4. Write a concise accurate description, a few implementation features (`title`, `detail`, `files`), and a `caveat` about dependencies or functional boundaries.
5. Point `files` to *existing paths relative to that project's directory*. The CI check verifies those source paths.
6. Add the guide to the featured home section **only after verification**.
7. Run `python3 scripts/check_gallery.py`, `node --check site/app.js`, and `node --check site/project.js`. Review layout and navigation manually on desktop and mobile.

## Demo and screenshot policy

A guide's Demo button and real screenshot come from `previews/manifest.json` after the verified capture job runs. Notes do not grant a new project access to the screenshot manifest and do not cause new projects to deploy. Project guides must never present illustrative placeholder graphics as real screenshots.

## Reliability and accessibility

- Keep source guides dependency-free, usable by keyboard, and readable with reduced-motion enabled.
- Prefer accurate source paths and copyable local commands over unsupported claims.
- Do not add automatic embeds of third-party media on the guide itself.
- Report broken remote assets or copied content with [an issue](https://github.com/Jackxiaozhiren/MotionSites/issues/new/choose).
- Follow [asset provenance and rights review](ASSET_PROVENANCE_AUDIT.md) before choosing any repo-wide license.
