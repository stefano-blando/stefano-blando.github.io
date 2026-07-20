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
        self.assertIn("portfolio-hero__social", source)
        self.assertIn("$author.links", source)
        self.assertIn('media/icons/social', source)
        self.assertNotIn("portfolio-identity-card", source)
        for icon in ("github", "linkedin", "google-scholar", "email"):
            self.assertTrue(
                (ROOT / f"assets/media/icons/social/{icon}.svg").exists(), icon
            )

    def test_research_pillars_render_editorial_numbered_list(self):
        template = ROOT / "layouts/_partials/hbx/blocks/research-pillars/block.html"
        self.assertTrue(template.exists())
        source = template.read_text(encoding="utf-8")
        self.assertIn("research-list__numeral", source)
        self.assertIn("research-list__topics", source)
        self.assertNotIn("media/icons", source)
        self.assertNotIn("interest_groups", source)
        for relative in ("content/_index.md", "content/_index.it.md"):
            home = (ROOT / relative).read_text(encoding="utf-8")
            self.assertIn("topics:", home)
            self.assertNotIn("interest_groups", home)
            self.assertNotIn("icon:", home)

    def test_featured_projects_are_case_study_rows(self):
        template = ROOT / "layouts/_partials/hbx/blocks/featured-projects/block.html"
        self.assertTrue(template.exists())
        source = template.read_text(encoding="utf-8")
        self.assertIn("$block.content.slugs", source)
        self.assertIn('site.GetPage (printf "/projects/%s" $slug)', source)
        self.assertIn('id="work"', source)
        self.assertIn("featured-case__meta", source)
        self.assertIn(".Params.links", source)
        self.assertNotIn('id="projects"', source)

    def test_contact_block_has_primary_email_and_named_links(self):
        source = (ROOT / "layouts/_partials/hbx/blocks/portfolio-contact/block.html").read_text(encoding="utf-8")
        self.assertIn("$block.content.links", source)
        self.assertIn('id="contact"', source)
        self.assertIn("portfolio-contact__email", source)

    def test_menu_links_survive_homepage_slimdown(self):
        menu = (ROOT / "config/_default/menus.yaml").read_text(encoding="utf-8")
        self.assertIn("'/#work'", menu)
        self.assertIn("'/#publications'", menu)

    def test_homepage_block_order_and_copy_are_synchronized(self):
        expected = [
            "portfolio-hero",
            "research-pillars",
            "featured-projects",
            "featured-publications",
            "portfolio-contact",
        ]
        for relative in ("content/_index.md", "content/_index.it.md"):
            source = (ROOT / relative).read_text(encoding="utf-8")
            found = [line.split(":", 1)[1].strip() for line in source.splitlines() if line.strip().startswith("- block:")]
            self.assertEqual(found, expected)
            self.assertIn("spacing: '0rem'", source)
            self.assertNotIn("tsparticles", source.lower())
            self.assertNotIn("—", source)

    def test_homepage_selects_three_featured_projects(self):
        for relative in ("content/_index.md", "content/_index.it.md"):
            source = (ROOT / relative).read_text(encoding="utf-8")
            for slug in ("risk-sentinel", "island-model-smc", "multi-agent-orchestration"):
                self.assertIn(f"- {slug}", source)

    def test_block_styles_are_mounted_into_css_pipeline(self):
        module = (ROOT / "config/_default/module.yaml").read_text(encoding="utf-8")
        self.assertIn("layouts/_partials/hbx/blocks", module)
        self.assertIn("assets/dist/community/blox", module)
        hook = ROOT / "layouts/_partials/hooks/head-end/block-styles.html"
        self.assertTrue(hook.exists())
        source = hook.read_text(encoding="utf-8")
        self.assertIn('readDir "layouts/_partials/hbx/blocks"', source)
        self.assertIn("resources.Concat", source)

    def test_design_tokens_and_fonts_are_defined(self):
        css = (ROOT / "assets/css/custom.css").read_text(encoding="utf-8")
        for token in (
            "--portfolio-bg",
            "--portfolio-surface",
            "--portfolio-surface-2",
            "--portfolio-text",
            "--portfolio-muted",
            "--portfolio-faint",
            "--portfolio-accent",
            "--portfolio-line",
        ):
            self.assertIn(token, css)
        self.assertIn("font-family: 'Fraunces'", css)
        self.assertIn("font-family: 'Instrument Sans'", css)
        self.assertIn("font-display: swap", css)
        for font in (
            "fonts/fraunces-italic.woff2",
            "fonts/instrument-sans-regular.woff2",
            "fonts/instrument-sans-600.woff2",
        ):
            self.assertTrue((ROOT / "static" / font).exists(), font)

    def test_built_homepage_audit_exists(self):
        audit = ROOT / "scripts/audit_built_homepage.py"
        self.assertTrue(audit.exists())
        source = audit.read_text(encoding="utf-8")
        for token in ("research-network-canvas", "cdn.jsdelivr.net", "tsparticles", "portfolio-hero"):
            self.assertIn(token, source)









if __name__ == "__main__":
    unittest.main()
