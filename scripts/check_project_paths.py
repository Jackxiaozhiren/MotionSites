"""Check that each source entry uses a unique, descriptive project directory.

No third-party Python dependencies. Keeps raw project source and live Gallery
paths separate; existing demo URLs and project IDs must not change.
"""
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
CATALOG = json.loads((ROOT / "site/projects.json").read_text(encoding="utf-8"))
EXPECTED = [
"jack-3d-creator", "mainframe", "prisma-creative-studio", "velorah",
"password-manager", "aethera", "venture-space-travel", "vex", "forma",
"asme", "orbis-nft", "vaultshield", "asme-motion", "securify", "cinematic",
"linkflow", "motion-sites-18", "rivr", "nexora", "axion-studio",
"axion-studio-subproject", "wanderful", "mindloop", "equilibrium", "xero",
"duolingo-style-guide", "newsletter-design", "foundation-new-digital-epoch",
"dot", "hero-liquid-glass",
]
assert len(CATALOG) == 30
assert len(set(EXPECTED)) == len(EXPECTED)
assert {p["id"] for p in CATALOG} == set(range(1, 31))
assert {p["path"] for p in CATALOG} == {"projects/" + slug for slug in EXPECTED}
assert all(re.fullmatch(r"projects/[a-z0-9]+(?:-[a-z0-9]+)*", p["path"]) for p in CATALOG)
assert all((ROOT / p["path"]).is_dir() for p in CATALOG)
assert len([p for p in (ROOT / "projects").iterdir() if p.is_dir()]) == 30
# Preserve two independent Axion codebases without a nested numbered folder.
assert (ROOT / "projects/axion-studio/package.json").is_file()
assert (ROOT / "projects/axion-studio-subproject/package.json").is_file()
assert not (ROOT / "projects/axion-studio/9").exists()
assert (ROOT / "projects/jack-3d-creator/.claude/launch.json").is_file()
for item in ["README.md", "README.zh-CN.md"]:
    data = (ROOT / item).read_text(encoding="utf-8")
    for project in CATALOG:
        assert "/tree/main/" + project["path"] in data, (item, project["path"])
readme = (ROOT / "docs/PROJECT_DIRECTORY_MIGRATION.md").read_text(encoding="utf-8")
for project in CATALOG:
    assert "`" + project["path"] + "/`" in readme
for path in ["scripts/capture_previews.mjs", "scripts/review_v3_candidate.mjs"]:
    data = (ROOT / path).read_text(encoding="utf-8")
    assert "dir: \"21\"" not in data
    assert "dir: '19'" not in data
    assert "projects/" in data
# Historical numeric source links are no longer valid on main.
# Scan actual source code, not the deliberate migration table or release notes.
legacy_link = re.compile(
    r"https?://(?:www\.)?github\.com/Jackxiaozhiren/MotionSites/"
    r"(?:tree|blob)/main/((?:[1-9]|[12][0-9]|30)|hero-liquid-glass)"
    r"(?=[/\"'\s<>)?#]|$)", re.IGNORECASE
)
stale = []
for project in CATALOG:
    for source in (ROOT / project["path"]).rglob("*"):
        if source.suffix.lower() not in {".tsx", ".ts", ".jsx", ".js", ".html"}:
            continue
        if any(part in {"node_modules", "dist", "build"} for part in source.parts):
            continue
        content = source.read_text(encoding="utf-8", errors="replace")
        for line_no, line in enumerate(content.splitlines(), 1):
            if legacy_link.search(line):
                stale.append(f"{source.relative_to(ROOT)}:{line_no}")
assert not stale, "Obsolete GitHub source links after migration: " + ", ".join(stale)

assert (ROOT / "site/project-notes.json").is_file()
legacy = {str(n) for n in [*range(1, 9), *range(10, 23), *range(24, 31)]}
assert all(not (ROOT / name).exists() for name in legacy | {"hero-liquid-glass"})
print("OK: 30 descriptive project directories, guide links and migration invariants")
