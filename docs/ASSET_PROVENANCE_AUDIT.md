# External media and source provenance — initial review

> **Scope:** first-pass, non-exhaustive code-reading review of five featured demos on 2026-10-18. This is not a legal opinion, an asset license inventory, or confirmation that a URL currently works. Other projects have not been audited here.

## Findings from featured source projects

| Project | Sources inspected | Potential external dependency | Action before reuse/distribution |
|---|---|---|---|
| `projects/jack-3d-creator/` | `src/components/HeroSection.tsx`, `MarqueeSection.tsx` | remote portrait at `figma.site`; animated GIFs referenced on `motionsites.ai` | Verify original creator, asset license, and whether hotlinking is authorized. Record each source in `CREDITS.md`. |
| `projects/prisma-creative-studio/` | `src/components/Hero.tsx`, `Features.tsx` | remote video on `cloudfront.net` and an image proxy at `images.higgs.ai` | Confirm media ownership and redistribute only when rights are clear. Check video fallback and external host availability. |
| `projects/axion-studio/` | `src/App.tsx` | video hosted on `cloudfront.net`; in-memory canvas frame buffer | Review media rights and mobile memory usage; avoid shipping unbounded frame buffers. |
| `projects/wanderful/` | `src/Hero.tsx` | external `cloudfront.net` video | Verify rights; note that menu links and travel CTA are illustrative rather than working booking services. |
| `projects/foundation-new-digital-epoch/` | `src/App.tsx`, `src/components/Marquee.tsx` | external video; third-party brand logos used in concept presentation | Record all brand/asset sources, avoid endorsement claims, and confirm each logo/media permission. |

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

## External naming and media source check (public web, 2026-10-18)

The public website [motionsites.ai](https://motionsites.ai/) identifies itself as **MotionSites AI**, a commercial website-prompt and animated-background library. Its published [terms](https://motionsites.ai/terms) govern its service. The repository's `projects/jack-3d-creator/src/components/MarqueeSection.tsx` links directly to animated GIF URLs from `motionsites.ai`; other projects use third-party videos and images. An apparently similar name, design or URL **does not itself prove copied code or infringement**, nor does it establish that the repo has an affiliation with that service.

Before wider public promotion or releasing a blanket open-source license, the repository owner should:

- Verify the **original creation history or applicable licenses** of each demo, especially media hosted by `motionsites.ai` and branded visual references. A paid prompt, publicly viewable preview, or publicly accessible image URL is **not by itself** a grant to redistribute that provider's media.
- Confirm whether the project name and branding could cause confusion with existing services. If the repository is independent, make that clear without suggesting an official relationship. Consider a distinct collection name if its intended public branding conflicts with another service.
- Replace hotlinked media with rights-cleared, reliably hosted files or original equivalents where necessary. Record evidence in `CREDITS.md`; if permission is unknown, keep the verification status **pending**.
- Keep technical improvements separate from legal ownership assertions. This initial check cannot determine trademark ownership or settle license rights.

Web references checked: [MotionSites AI](https://motionsites.ai/), [MotionSites AI terms](https://motionsites.ai/terms). No legal conclusions were made.

## Automated source URL inventory (supporting evidence, not permission)

Every pull request and change to `main` runs [External Asset Reference Inventory](../.github/workflows/asset-inventory.yml). It scans source files for external URLs across **all 30 catalog entries** and uploads a `external-assets-inventory` GitHub Actions artifact (JSON: source path, line, hostname and category; intentionally no full URL with potential query tokens). Download this artifact from the workflow run to prioritize manual attribution checks.

Run locally:

```bash
python3 scripts/inventory_external_assets.py --output external-assets.json
```

This automated scan can miss dynamically assembled URLs or bundled assets. It reports references, **not ownership, permissions, network availability or whether source code was copied**. `external-assets.json` is a temporary review artifact, not a substitute for `CREDITS.md` or legal documentation.
