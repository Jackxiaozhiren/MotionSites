# MotionSites source directory migration (2026-10-18)

Project source directories were reorganized into `projects/<readable-slug>/` to make GitHub browsing and local development easier. All 30 gallery IDs remain **unchanged**. Live Gallery and hosted demo URLs are independent and have not been renamed.

**Important:** GitHub does not guarantee automatic redirects for old source directory URLs. Update saved links, scripts, clone instructions and external references using the mapping below. Historical commits still contain the original numbered paths.

| Gallery ID | Project | Old source path | New source path |
|---:|---|---|---|
| 1 | Jack · 3D Creator | `1/jack-portfolio/` | `projects/jack-3d-creator/` |
| 2 | Mainframe | `2/` | `projects/mainframe/` |
| 3 | Prisma — Creative Studio | `3/prisma-landing/` | `projects/prisma-creative-studio/` |
| 4 | Velorah | `4/` | `projects/velorah/` |
| 5 | Password Manager | `5/` | `projects/password-manager/` |
| 6 | Aethera | `6/` | `projects/aethera/` |
| 7 | Venture — Space Travel | `7/` | `projects/venture-space-travel/` |
| 8 | VEX | `8/` | `projects/vex/` |
| 9 | Forma | `10/` | `projects/forma/` |
| 10 | Asme | `11/` | `projects/asme/` |
| 11 | Orbis.Nft | `12/` | `projects/orbis-nft/` |
| 12 | VaultShield | `13/` | `projects/vaultshield/` |
| 13 | Asme (Motion) | `14/` | `projects/asme-motion/` |
| 14 | securify | `15/` | `projects/securify/` |
| 15 | CINEMATIC | `16/` | `projects/cinematic/` |
| 16 | LinkFlow | `17/` | `projects/linkflow/` |
| 17 | Prosthetics Landing Page | `18/` | `projects/prosthetics-landing-page/` |
| 18 | RIVR | `19/` | `projects/rivr/` |
| 19 | Nexora | `20/` | `projects/nexora/` |
| 20 | Axion Studio | `21/` | `projects/axion-studio/` |
| 21 | Axion Studio (subproject) | `21/9/` | `projects/axion-studio-subproject/` |
| 22 | Wanderful | `22/` | `projects/wanderful/` |
| 23 | Mindloop | `24/mindloop/` | `projects/mindloop/` |
| 24 | Equilibrium | `25/` | `projects/equilibrium/` |
| 25 | Xero | `26/` | `projects/xero/` |
| 26 | Duolingo — Style Guide | `27/` | `projects/duolingo-style-guide/` |
| 27 | Newsletter Design | `28/newsletter-design/` | `projects/newsletter-design/` |
| 28 | Foundation — New Digital Epoch | `29/` | `projects/foundation-new-digital-epoch/` |
| 29 | dot. | `30/` | `projects/dot/` |
| 30 | Hero Liquid Glass | `hero-liquid-glass/` | `projects/hero-liquid-glass/` |

For Vite projects, run from its new source directory: `cd projects/axion-studio && npm install && npm run dev`. Static HTML projects have their own `index.html` files.

Two structural exceptions were deliberately flattened: `21/9` is now `projects/axion-studio-subproject` (separate from `projects/axion-studio`), and nested sources `1/jack-portfolio`, `3/prisma-landing`, `24/mindloop`, `28/newsletter-design` now live directly in their descriptive folders. The historical `1/.claude` auxiliary files were retained inside `projects/jack-3d-creator/.claude`.

Do not use this migration to infer copyright or third-party media permissions; consult `docs/ASSET_PROVENANCE_AUDIT.md`.
