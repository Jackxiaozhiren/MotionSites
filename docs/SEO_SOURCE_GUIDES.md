# MotionSites v3 — source-first indexing

Five featured walkthroughs are based on previously inspected source notes (not mass-generated catalog filler). To keep each long-form article discoverable, `scripts/build_editorial_pages.py` builds independent HTML documents with accurate title, canonical URL, description, file references, implementation discussion and a licensing caveat.

- The five live routes are under `/projects/<project-slug>/`. The existing interactive `project.html?id=N` guides remain available and unchanged.
- The sitemap includes the root index and these five **substantive** articles, not thirty empty SEO doorway pages.
- GitHub Pages generates HTML **before upload**; the PR check also generates all five documents and validates the sitemap for consistency.
- The editorial articles do **not** reproduce remote videos, photos or branded logo assets. Their Open Graph preview is original MotionSites brand artwork. External materials are explicitly identified as pending verification.
- Search inclusion/ranking is not guaranteed by page generation. After deployment, validate the public HTML, sitemap and Search Console coverage before making SEO claims.

Local validation: `python3 scripts/build_editorial_pages.py && python3 scripts/build_editorial_pages.py --check`. Serve `site/` using `python3 -m http.server 8000 --directory site`.
