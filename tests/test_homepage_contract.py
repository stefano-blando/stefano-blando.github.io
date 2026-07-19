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

    def test_research_pillars_render_local_svg_assets(self):
        template = ROOT / "layouts/_partials/hbx/blocks/research-pillars/block.html"
        self.assertTrue(template.exists())
        source = template.read_text(encoding="utf-8")
        self.assertIn('resources.Get (printf "media/icons/%s.svg" .icon)', source)
        self.assertNotIn("icon_pack", source)

    def test_education_timeline_uses_native_details_and_author_data(self):
        template = ROOT / "layouts/_partials/hbx/blocks/education-timeline/block.html"
        self.assertTrue(template.exists())
        source = template.read_text(encoding="utf-8")
        self.assertIn("site.Data.authors", source)
        self.assertIn("<details", source)
        self.assertIn("<summary", source)

    def test_featured_projects_are_explicit_and_limited_to_three(self):
        template = ROOT / "layouts/_partials/hbx/blocks/featured-projects/block.html"
        self.assertTrue(template.exists())
        source = template.read_text(encoding="utf-8")
        self.assertIn("$block.content.slugs", source)
        self.assertIn('site.GetPage (printf "/projects/%s" $slug)', source)

    def test_evidence_queries_publications_and_blog_content(self):
        source = (ROOT / "layouts/_partials/hbx/blocks/portfolio-evidence/block.html").read_text(encoding="utf-8")
        self.assertIn('where site.RegularPages "Section" "publications"', source)
        self.assertIn('where site.RegularPages "Section" "blog"', source)
        self.assertIn("url_pdf", source)

    def test_contact_block_has_named_links(self):
        source = (ROOT / "layouts/_partials/hbx/blocks/portfolio-contact/block.html").read_text(encoding="utf-8")
        self.assertIn("$block.content.links", source)
        self.assertIn('id="contact"', source)

    def test_homepage_block_order_and_copy_are_synchronized(self):
        expected = [
            "portfolio-hero",
            "research-pillars",
            "education-timeline",
            "featured-projects",
            "portfolio-evidence",
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
