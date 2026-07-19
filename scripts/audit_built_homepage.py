#!/usr/bin/env python3
from html.parser import HTMLParser
from pathlib import Path
import sys


class PageFacts(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.classes = set()
        self.alts = set()

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if "id" in values:
            self.ids.append(values["id"])
        self.classes.update((values.get("class") or "").split())
        if tag == "img" and values.get("alt") is not None:
            self.alts.add(values["alt"])


def audit(path: Path) -> list[str]:
    html = path.read_text(encoding="utf-8")
    facts = PageFacts()
    facts.feed(html)
    failures = []
    if facts.ids.count("research-network-canvas") != 1:
        failures.append(f"{path}: expected one research-network-canvas")
    for forbidden in ("cdn.jsdelivr.net", "tsparticles", ">brain<", ">network-wired<", ">chart-line<"):
        if forbidden in html:
            failures.append(f"{path}: found forbidden token {forbidden}")
    for required_id in ("research", "work", "contact"):
        if required_id not in facts.ids:
            failures.append(f"{path}: missing id {required_id}")
    for removed_id in ("education", "publications", "projects"):
        if removed_id in facts.ids:
            failures.append(f"{path}: unexpected homepage id {removed_id}")
    if "portfolio-hero" not in facts.classes:
        failures.append(f"{path}: missing portfolio-hero class")
    expected_alt = "Portrait of Stefano Blando" if "/en/" in path.as_posix() else "Ritratto di Stefano Blando"
    if expected_alt not in facts.alts:
        failures.append(f"{path}: missing portrait alt text")
    return failures


def main() -> int:
    root = Path(sys.argv[1] if len(sys.argv) > 1 else "public")
    pages = [root / "en/index.html", root / "it/index.html"]
    failures = []
    for page in pages:
        if not page.exists():
            failures.append(f"missing {page}")
        else:
            failures.extend(audit(page))
    if failures:
        print("Homepage audit failed")
        print("\n".join(f"- {failure}" for failure in failures))
        return 1
    print("Homepage audit passed for English and Italian homepages")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
