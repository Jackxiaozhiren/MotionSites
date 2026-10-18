"""Generate five source-backed, indexable editorial pages and an XML sitemap.

No placeholder/source-only projects are mass-produced as low-value SEO pages.
Run: python3 scripts/build_editorial_pages.py
"""
import argparse
from html import escape
import json
from pathlib import Path
import re
from string import Template
import unicodedata
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "site"
BASE = "https://jackxiaozhiren.github.io/MotionSites"
GITHUB = "https://github.com/Jackxiaozhiren/MotionSites"
CATALOG = json.loads((SITE / "projects.json").read_text(encoding="utf-8"))
NOTES = json.loads((SITE / "project-notes.json").read_text(encoding="utf-8"))

def slugify(text):
    ascii_name = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "-", ascii_name).strip("-")

def qpath(text):
    return "/".join(quote(part, safe="") for part in text.split("/"))

TEMPLATE = Template("""<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="theme-color" content="#100d19">
<meta name="description" content="$summary_attr">
<link rel="canonical" href="$page_url">
<meta property="og:type" content="article">
<meta property="og:title" content="$title_attr — MotionSites source walkthrough">
<meta property="og:description" content="$summary_attr">
<meta property="og:url" content="$page_url">
<meta property="og:image" content="$base_url/assets/social-preview.jpg">
<meta name="twitter:card" content="summary_large_image">
<title>$title_attr — Implementation Guide | MotionSites</title>
<style>
:root{color-scheme:dark}*{box-sizing:border-box}body{margin:0;font:16px/1.65 system-ui,sans-serif;background:radial-gradient(ellipse at 60% 0,#32213f,#100d19 48%);color:#eee8fa}a{color:#d6b9ff}a:focus-visible{outline:2px solid #e3c8ff;outline-offset:4px}.wrap{max-width:970px;margin:auto;padding:0 24px}.nav{display:flex;justify-content:space-between;align-items:center;padding:27px 0;border-bottom:1px solid #47384f;gap:12px}.nav a{text-decoration:none}.brand{font-size:22px;font-weight:800;color:#f3eaff}.brand span{color:#bda1ff}.eyebrow{color:#cbb0ec;letter-spacing:.17em;text-transform:uppercase;font-size:12px;font-weight:700}.hero{padding:74px 0 52px}h1{font-size:clamp(36px,7vw,68px);line-height:1.1;letter-spacing:-.05em;margin:14px 0}h2{letter-spacing:-.035em;font-size:30px}.summary{font-size:20px;color:#ccc3d6;max-width:760px}.links{display:flex;gap:22px;flex-wrap:wrap;margin:28px 0}.primary{background:#d8c5ff;color:#1e1427;text-decoration:none;border-radius:10px;padding:12px 19px;font-weight:700}.articles{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;padding:0;list-style:none}.articles li{padding:21px;border:1px solid #47384f;background:#1e1825;border-radius:13px}.articles li h3{margin:0 0 10px}.articles li p{color:#c9bdcf}.files{display:flex;gap:10px;flex-wrap:wrap}.files a{font-size:13px;overflow-wrap:anywhere}.caveat{border-left:3px solid #baa1e0;background:#201a26;padding:18px;margin:35px 0;color:#d1c4de}footer{border-top:1px solid #47384f;padding:30px 0;margin-top:50px;color:#ada3b6}@media(max-width:640px){.articles{grid-template-columns:1fr}.hero{padding-top:40px}h1{font-size:40px}}
</style>
</head>
<body>
<div class="wrap">
<nav class="nav" aria-label="Page navigation"><a class="brand" href="../../">Motion<span>Sites.</span></a><a href="../../#projects">← Browse collection</a></nav>
<main>
<section class="hero">
<div class="eyebrow">$tag · Source-backed guide</div>
<h1>$title_text</h1>
<p class="summary">$summary_text</p>
<div class="links">
<a class="primary" href="$source_url">Explore project source ↗</a>
<a href="../../project.html?id=$project_id">Interactive project guide ↗</a>
</div>
</section>
<section aria-labelledby="techniques-title">
<h2 id="techniques-title">How the motion is implemented</h2>
<p>The following notes refer to existing source files in this repository. They are not claims of production readiness or third-party media ownership.</p>
<ol class="articles">$feature_items</ol>
</section>
<section class="caveat" aria-label="External media and licensing considerations"><strong>Before reuse or redistribution:</strong> $caveat</section>
<section>
<h2>Study this experiment locally</h2>
<p>Clone the collection, open <code>$source_path</code>, install its dependencies and run the Vite development server. Check the project's README and package scripts before adapting it.</p>
<p><code>npm install</code> &nbsp;→&nbsp; <code>npm run dev</code></p>
</section>
</main>
<footer>MotionSites · Original explanatory notes derived from inspected source · <a href="$github">GitHub repository</a></footer>
</div>
</body></html>
""")

def expected():
    pages = {}
    urls = [BASE + "/"]
    lookup = {p["id"]: p for p in CATALOG}
    for id_str, note in sorted(NOTES.items(), key=lambda pair: int(pair[0])):
        id_num = int(id_str)
        project = lookup[id_num]
        slug = slugify(project["title"])
        assert slug and slug.replace("-", "").isalnum()
        dest = SITE / "projects" / slug / "index.html"
        url = BASE + "/projects/" + slug + "/"
        rows = []
        for feature in note["features"]:
            filelinks = " ".join(
                '<a href="' + GITHUB + '/blob/main/' + qpath(project["path"]) + '/' + qpath(f) +
                '">' + escape(f) + ' ↗</a>' for f in feature["files"])
            rows.append('<li><h3>' + escape(feature["title"]) + '</h3><p>' +
                        escape(feature["detail"]) + '</p><div class="files">' + filelinks + '</div></li>')
        text = TEMPLATE.substitute(
            base_url=BASE, page_url=escape(url, quote=True),
            title_attr=escape(project["title"], quote=True), title_text=escape(project["title"]),
            summary_attr=escape(note["description"], quote=True),
            summary_text=escape(note["description"]), tag=escape(project["tag"]),
            project_id=id_num,
            source_url=GITHUB + "/tree/main/" + qpath(project["path"]),
            feature_items="\n".join(rows),
            caveat=escape(note["caveat"]), source_path=escape(project["path"]),
            github=GITHUB)
        pages[dest] = text + "\n"
        urls.append(url)
    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for u in urls: lines.append('  <url><loc>' + escape(u) + '</loc></url>')
    lines.append('</urlset>')
    pages[SITE / "sitemap.xml"] = "\n".join(lines) + "\n"
    return pages

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true", help="Validate generated assets against source data")
    args=parser.parse_args()
    pages=expected()
    assert len(pages) == 6, "Expected five genuine technical articles plus sitemap"
    for path, content in pages.items():
        if args.check:
            assert path.exists() and path.read_text(encoding="utf-8") == content, path
        else:
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(content, encoding="utf-8")
    print(f"OK: {len(pages)-1} source-backed static guides and sitemap checked")

if __name__ == "__main__":
    main()
