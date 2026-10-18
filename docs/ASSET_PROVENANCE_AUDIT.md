# External media and source provenance — initial review

> **Scope:** first-pass, non-exhaustive code-reading review of five featured demos on 2026-10-18. This is not a legal opinion, an asset license inventory, or confirmation that a URL currently works. Other projects have not been audited here.

## Findings from featured source projects

| Project | Sources inspected | Potential external dependency | Action before reuse/distribution |
|---|---|---|---|
| `1/jack-portfolio/` | `src/components/HeroSection.tsx`, `MarqueeSection.tsx` | remote portrait at `figma.site`; animated GIFs referenced on `motionsites.ai` | Verify original creator, asset license, and whether hotlinking is authorized. Record each source in `CREDITS.md`. |
| `3/prisma-landing/` | `src/components/Hero.tsx`, `Features.tsx` | remote video on `cloudfront.net` and an image proxy at `images.higgs.ai` | Confirm media ownership and redistribute only when rights are clear. Check video fallback and external host availability. |
| `21/` | `src/App.tsx` | video hosted on `cloudfront.net`; in-memory canvas frame buffer | Review media rights and mobile memory usage; avoid shipping unbounded frame buffers. |
| `22/` | `src/Hero.tsx` | external `cloudfront.net` video | Verify rights; note that menu links and travel CTA are illustrative rather than working booking services. |
| `29/` | `src/App.tsx`, `src/components/Marquee.tsx` | external video; third-party brand logos used in concept presentation | Record all brand/asset sources, avoid endorsement claims, and confirm each logo/media permission. |

The appearance of a remote URL or brand name **does not establish permission** to republish, hotlink or commercially reuse the asset. A technically successful demo build is not a provenance check.

## Recommended resolution workflow

1. Build a complete per-project asset list from source references and static assets.
2. For each item record **source URL, creator, copyright holder, license/permission, attribution requirement, date verified, and proposed replacement if unclear**.
3. Replace or remove unauthorized and unreliable assets before wider release. Host owned/licensed assets locally when feasible.
4. Document the confirmed findings in [`CREDITS.md`](../CREDITS.md).
5. Only after code and assets are reviewed, choose an appropriate license for **code that may legally be redistributed**. A single repository-wide license must not falsely suggest control over third-party material.
6. For demos with heavy video/canvas motion, review `prefers-reduced-motion`, autoplay behavior, mobile performance and fallback images.

## Launch safety checklist

- [ ] All 30 projects have undergone a source and media attribution inventory.
- [ ] Remote assets have permission or replacement recorded.
- [ ] Real images and videos are distinguished from concept art.
- [ ] Brand references and sample UI are not presented as real endorsements or production services.
- [ ] Responsive, reduced-motion and offline/error states are tested where applicable.
- [ ] Root licensing decision is documented with project-specific exceptions.
