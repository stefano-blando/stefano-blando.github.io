#!/usr/bin/env python3

from __future__ import annotations

import argparse
import difflib
import fnmatch
from pathlib import Path


CONTENT_ROOT = Path("content")
SUFFIX = ".it.md"
DEFAULT_IGNORES = [
    "content/templates/**",
    "content/courses/**",
    "content/authors/index*.md",
    "content/slides/**",
    "content/events/example/**",
    "content/blog/_index*.md",
    "content/publications/_index*.md",
]


def list_markdown_files(root: Path) -> tuple[list[Path], list[Path]]:
    en_files = []
    it_files = []

    for path in sorted(root.rglob("*.md")):
        if path.name.endswith(SUFFIX):
            it_files.append(path)
        else:
            en_files.append(path)

    return en_files, it_files


def italian_peer(path: Path) -> Path:
    return path.with_name(path.stem + ".it.md")


def english_peer(path: Path) -> Path:
    return path.with_name(path.name.replace(SUFFIX, ".md"))


def similarity(a: Path, b: Path) -> float:
    return difflib.SequenceMatcher(
        None,
        a.read_text(encoding="utf-8"),
        b.read_text(encoding="utf-8"),
    ).ratio()


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Check English/Italian Hugo content synchronization."
    )
    parser.add_argument(
        "--threshold",
        type=float,
        default=0.98,
        help="Flag Italian files whose content similarity with English is above this threshold.",
    )
    parser.add_argument(
        "--strict",
        action="store_true",
        help="Do not ignore template/demo sections. By default, hidden template content is skipped.",
    )
    args = parser.parse_args()

    en_files, it_files = list_markdown_files(CONTENT_ROOT)
    ignored = [] if args.strict else DEFAULT_IGNORES

    def is_ignored(path: Path) -> bool:
        text = path.as_posix()
        return any(fnmatch.fnmatch(text, pattern) for pattern in ignored)

    en_files = [path for path in en_files if not is_ignored(path)]
    it_files = [path for path in it_files if not is_ignored(path)]

    missing_it = [path for path in en_files if not italian_peer(path).exists()]
    orphan_it = [path for path in it_files if not english_peer(path).exists()]

    highly_similar = []
    for en_path in en_files:
        it_path = italian_peer(en_path)
        if not it_path.exists():
            continue
        score = similarity(en_path, it_path)
        if score >= args.threshold:
            highly_similar.append((score, it_path))

    print("I18N sync report")
    print("================")
    print(f"English pages: {len(en_files)}")
    print(f"Italian pages: {len(it_files)}")
    if ignored:
        print(f"Ignored patterns: {', '.join(ignored)}")
    print()

    print(f"Missing Italian counterparts: {len(missing_it)}")
    for path in missing_it:
        print(f"  - {path}")
    print()

    print(f"Italian files without English counterpart: {len(orphan_it)}")
    for path in orphan_it:
        print(f"  - {path}")
    print()

    print(
        f"Italian files still very close to English (similarity >= {args.threshold:.2f}): {len(highly_similar)}"
    )
    for score, path in sorted(highly_similar, reverse=True):
        print(f"  - {path} ({score:.3f})")

    return 1 if missing_it or orphan_it or highly_similar else 0


if __name__ == "__main__":
    raise SystemExit(main())
