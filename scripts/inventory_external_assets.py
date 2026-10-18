"""Inventory external URL references in MotionSites' independent projects.

Reports are for human source/permission review, not license verification.
The JSON intentionally omits full URLs to avoid echoing credentials/query tokens.
Usage: python3 scripts/inventory_external_assets.py --output external-assets.json
"""
import argparse
from collections import Counter
from pathlib import Path
import json
import re
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
SOURCE_EXTENSIONS = {".tsx", ".ts", ".jsx", ".js", ".css", ".html", ".svg"}
IGNORED_DIRS = {"node_modules", "dist", "build", ".git", ".cache", "coverage"}
URL = re.compile(r"https?://[^\s\"'<>\x60)\]}]+", re.IGNORECASE)
MEDIA_EXTS = {".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif", ".avif", ".mp4", ".webm", ".mov"}
FONT_EXTS = {".woff", ".woff2", ".ttf", ".otf", ".eot"}

def category(host, url_path):
    suffix = Path(url_path.lower()).suffix
    if suffix in MEDIA_EXTS or host in {"images.higgs.ai", "motionsites.ai"}:
        return "media"
    if suffix in FONT_EXTS or host.startswith("fonts."):
        return "font"
    if host.endswith("cloudfront.net"):
        return "media-cdn"
    return "other"

def scan():
    projects = json.loads((ROOT / "site" / "projects.json").read_text(encoding="utf-8"))
    rows = []
    visited = set()
    scanned = 0
    for project in projects:
        directory = ROOT / project["path"]
        for file in directory.rglob("*"):
            if not file.is_file() or file.suffix.lower() not in SOURCE_EXTENSIONS:
                continue
            if any(part in IGNORED_DIRS for part in file.relative_to(ROOT).parts):
                continue
            rel = file.relative_to(ROOT).as_posix()
            if rel in visited:
                continue
            visited.add(rel)
            scanned += 1
            try:
                contents = file.read_text(encoding="utf-8")
            except UnicodeDecodeError:
                continue
            for lineno, line in enumerate(contents.splitlines(), start=1):
                for match in URL.finditer(line):
                    raw = match.group().rstrip(".,;")
                    try:
                        parsed = urlsplit(raw)
                    except ValueError:
                        continue
                    host = (parsed.hostname or "").lower()
                    if not host or host in {"localhost", "127.0.0.1", "example.com"}:
                        continue
                    rows.append({
                        "source": rel,
                        "line": lineno,
                        "host": host,
                        "category": category(host, parsed.path),
                    })
    domains = Counter(row["host"] for row in rows)
    categories = Counter(row["category"] for row in rows)
    return {
        "scope": "All 30 catalog entries; duplicate nested source files scanned once",
        "disclaimer": "An occurrence is not an asset ownership/permission determination.",
        "scanned_source_files": scanned,
        "total_external_references": len(rows),
        "domains": dict(sorted(domains.items())),
        "categories": dict(sorted(categories.items())),
        "references": sorted(rows, key=lambda item: (item["source"], item["line"], item["host"])),
    }

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, help="Optional JSON path for the inventory artifact")
    args = parser.parse_args()
    report = scan()
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Scanned {report['scanned_source_files']} source files, found {report['total_external_references']} external URL references across {len(report['domains'])} domains.")
    print("Breakdown:", report["categories"])
    for host, count in sorted(report["domains"].items(), key=lambda item: -item[1])[:20]:
        print(f"  {host}: {count}")

if __name__ == "__main__":
    main()
