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

    def test_personal_hero_uses_author_data_and_local_portrait(self):
        template = ROOT / "layouts/_partials/hbx/blocks/portfolio-hero/block.html"
        self.assertTrue(template.exists())
        source = template.read_text(encoding="utf-8")
        self.assertIn("site.Data.authors", source)
        self.assertIn("media/authors/%s.png", source)
        self.assertEqual(source.count('id="research-network-canvas"'), 1)
        self.assertNotIn("—", source)

    def test_research_pillars_render_local_svg_assets(self):
        template = ROOT / "layouts/_partials/hbx/blocks/research-pillars/block.html"
        self.assertTrue(template.exists())
        source = template.read_text(encoding="utf-8")
        self.assertIn('resources.Get (printf "media/icons/%s.svg" .icon)', source)
        self.assertNotIn("icon_pack", source)




if __name__ == "__main__":
    unittest.main()
