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

# Independent project guides and audited implementation notes.
detail_html = (site / "project.html").read_text(encoding="utf-8")
detail_js = (site / "project.js").read_text(encoding="utf-8")
notes = json.loads((site / "project-notes.json").read_text(encoding="utf-8"))
assert isinstance(notes, dict) and len(notes) == 5, "Five featured guides are documented"
assert "project.html?id=${project.id}" in js, "Every project needs a guide link"
assert "fetch" in detail_js and "projects.json" in detail_js, "Guide must load the catalog"
assert "project-notes.json" in detail_js, "Guide must load notes"
for element in ("detail-status", "detail-content", "detail-number", "detail-title",
                "detail-notes", "detail-visual", "detail-command", "detail-caveat"):
    assert f'id="{element}"' in detail_html, f"Missing guide element: {element}"
for id_text, entry in notes.items():
    assert id_text.isdecimal() and int(id_text) in {p["id"] for p in projects}, id_text
    project = next(p for p in projects if p["id"] == int(id_text))
    assert isinstance(entry["description"], str) and entry["description"].strip(), project
    assert isinstance(entry["caveat"], str) and entry["caveat"].strip(), project
    assert isinstance(entry["features"], list) and 1 <= len(entry["features"]) <= 6, project
    for feature in entry["features"]:
        assert feature["title"] and feature["detail"], feature
        assert feature["files"], feature
        for file in feature["files"]:
            assert re.fullmatch(r"(?:[a-zA-Z0-9_.-]+/)*[a-zA-Z0-9_.-]+", file), file
            assert (root / project["path"] / file).is_file(), f"{project['path']}/{file}"
assert all(f'project.html?id={id_text}' in html for id_text in notes), "Home must link featured guides"

print("OK: 30 catalog entries, five source-checked guides, and bilingual gallery assets verified")
