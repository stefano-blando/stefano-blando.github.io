from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]


class HomepageContractTests(unittest.TestCase):
    def test_visual_companion_artifacts_are_ignored(self):
        ignore = (ROOT / ".gitignore").read_text(encoding="utf-8")
        self.assertIn(".superpowers/", ignore.splitlines())

    def test_network_assets_are_local_and_unique(self):
        hook = (ROOT / "layouts/_partials/hooks/body-end/custom.html").read_text(
            encoding="utf-8"
        )
        homes = "\n".join(
            (ROOT / path).read_text(encoding="utf-8")
            for path in ("content/_index.md", "content/_index.it.md")
        )
        self.assertNotIn("cdn.jsdelivr.net", hook)
        self.assertNotIn("tsparticles", hook.lower())
        self.assertNotIn("tsparticles", homes.lower())
        self.assertEqual(hook.count('resources.Get "js/research-network/index.js"'), 1)


if __name__ == "__main__":
    unittest.main()
