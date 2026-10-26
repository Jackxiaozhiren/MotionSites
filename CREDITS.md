# Credits, origins & asset licenses

MotionSites contains multiple independent website experiments. This file tracks the origin of each project's design and third-party materials. An entry here is **not** permission to redistribute third-party code or assets.

> **Do not add a repository-wide license until the source, rights, and dependencies of every project have been reviewed.** A license for original code must not imply that third-party media, brands, or designs are covered by the same grant.

| Project path | Original design / inspiration link | External code / libraries | Image, video, icons & fonts (source/license) | Verified by / date |
|---|---|---|---|---|
| `projects/jack-3d-creator/` | Creator / inspiration to verify | See package files | Remote portrait from `figma.site`; animation GIF references from `motionsites.ai`. Original creator and reuse/hotlink terms **not verified**. | Pending owner evidence |
| `projects/prisma-creative-studio/` | Creator / inspiration to verify | See package files | Remote MP4 via `cloudfront.net`; images via `images.higgs.ai`. License, attribution and hotlink permission **not verified**. | Pending owner evidence |
| `projects/axion-studio/` | Creator / inspiration to verify | See package files | Remote MP4 via `cloudfront.net`, decoded into a canvas frame buffer. Media license and hotlink permission **not verified**. | Pending owner evidence |
| `projects/wanderful/` | Creator / inspiration to verify | See package files | Remote MP4 via `cloudfront.net`; concept UI is not an operational travel/booking service. Media license **not verified**. | Pending owner evidence |
| `projects/foundation-new-digital-epoch/` | Creator / inspiration to verify | See package files | Remote MP4 via `cloudfront.net` plus third-party brand logos in a concept presentation. Media and trademark usage terms **not verified**. | Pending owner evidence |
| `projects/duolingo-style-guide/` | Creator / inspiration to verify | Standalone HTML | Includes brand-style references; source and reuse terms **not verified**. | Pending owner evidence |

## Current coverage

The initial provenance review in [`docs/ASSET_PROVENANCE_AUDIT.md`](docs/ASSET_PROVENANCE_AUDIT.md) examined five featured demos. The table also records the Duolingo-style concept as an additional item. **This is not a complete inventory of the 30 projects in the gallery.** Unlisted projects must be treated as unaudited, not as cleared for redistribution.

For every project, add a row that records the original creator/source URL, third-party code and library licenses, direct media/font/icon sources, attribution requirements, allowed uses (including redistribution and hotlinking), verification evidence and date, and a replacement plan when rights are unclear.

## Release gate

Before wider promotion, redistribution, or selecting a repository-wide license:

1. Inventory every project and each externally sourced asset.
2. Verify the original source and the applicable license or written permission; a public URL, successful HTTP response, or visual similarity is not proof of permission.
3. Replace or remove assets whose rights cannot be established. Prefer owned or clearly licensed assets when feasible.
4. Record the evidence and required attribution here; do not mark an item verified without a source and a date.
5. Check brand references for attribution, trademark restrictions, and any risk of implying endorsement.
6. Test reduced-motion behavior, autoplay fallbacks, mobile performance, and external-host failure states for motion-heavy demos.
7. Only then decide which original code can be licensed, while documenting project-specific exceptions.

The absence of a repository-level `LICENSE` is intentional until this review is complete. Do not infer permission to reuse code or assets from public visibility alone.
