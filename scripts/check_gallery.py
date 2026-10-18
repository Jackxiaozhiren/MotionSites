"""Validate MotionSites' single-source catalog and static gallery.

Run: python3 scripts/check_gallery.py
No third-party Python dependencies required.
"""
from pathlib import Path
import json
import re

root = Path(__file__).resolve().parents[1]
site = root / "site"
projects = json.loads((site / "projects.json").read_text(encoding="utf-8"))
expected_tags = {"React", "GSAP", "Framer Motion", "Motion", "HTML"}

assert isinstance(projects, list) and len(projects) == 30, "Expected 30 catalog projects"
assert {p["id"] for p in projects} == set(range(1, 31)), "IDs must be unique and contiguous"
assert len({p["path"] for p in projects}) == len(projects), "Duplicate project paths"
for project in projects:
    assert isinstance(project["title"], str) and project["title"].strip(), project
    assert project["tag"] in expected_tags, project
    assert re.fullmatch(r"(?:[a-z0-9-]+/)*[a-z0-9-]+", project["path"]), project
    assert (root / project["path"]).is_dir(), project["path"]

for name in ("index.html", "app.js", "styles.css", "assets/favicon.svg", ".nojekyll"):
    assert (site / name).is_file(), name

html = (site / "index.html").read_text(encoding="utf-8")
js = (site / "app.js").read_text(encoding="utf-8")
css = (site / "styles.css").read_text(encoding="utf-8")
assert 'fetch(\'projects.json\'' in js, "Gallery must use the catalog as single source"
assert 'const projects=[' not in js, "Do not duplicate the catalog in app.js"
for tag in expected_tags | {"All"}:
    assert f'data-tag="{tag}"' in html, f"Missing filter: {tag}"
for element in ("grid", "search", "counter", "empty", "demo-only", "reset-filters",
                "share-view", "share-status", "gallery-status"):
    assert f'id="{element}"' in html, f"Missing gallery control: {element}"
for asset in ("styles.css", "app.js", "assets/favicon.svg"):
    assert (site / asset).is_file(), asset
assert "prefers-reduced-motion:reduce" in css, "Reduced motion support missing"

for readme in ("README.md", "README.zh-CN.md"):
    content = (root / readme).read_text(encoding="utf-8")
    for project in projects:
        url = f"tree/main/{project['path']}"
        assert url in content, f"{readme} is missing {project['path']}"

print("OK: 30 project paths, bilingual indexes, discovery controls and gallery assets verified")
