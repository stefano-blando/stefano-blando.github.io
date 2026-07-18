from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]


class HomepageContractTests(unittest.TestCase):
    def test_visual_companion_artifacts_are_ignored(self):
        ignore = (ROOT / ".gitignore").read_text(encoding="utf-8")
        self.assertIn(".superpowers/", ignore.splitlines())


if __name__ == "__main__":
    unittest.main()
