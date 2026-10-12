import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * Dev-only diagnostic sink.
 *
 * Browser-side failures are invisible from the terminal, so the page posts its
 * errors here and they surface in the dev server output. Remove once the
 * prototype is stable.
 */
function diagnosticsSink() {
  return {
    name: 'universe-diagnostics',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__diag', (req, res) => {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });
        req.on('end', () => {
          console.log(`\n===== BROWSER DIAG =====\n${body}\n========================\n`);
          res.statusCode = 204;
          res.end();
        });
      });
    },
  };
}

import fs from 'node:fs';
import path from 'node:path';

/**
 * Maps legacy Hugo URLs (which lived under `/en/` and had taxonomy/event routes)
 * to their current Astro destinations. In static output mode, Astro emits HTML
 * redirect stubs containing meta refresh and canonical links so GitHub Pages
 * answers crawlers with HTTP 200 rather than 404.
 */
function getLegacyRedirects() {
  const redirects = {
    '/en': '/',
    '/en/blog': '/blog/',
    '/en/experience': '/experience/',
    '/en/network': '/network/',
    '/en/projects': '/projects/',
    '/en/publications': '/publications/',
    '/en/research': '/research/',
    '/en/search': '/search/',
    '/en/events/compass-workshop': '/blog/compass-workshop-2026/',
    '/events/compass-workshop': '/blog/compass-workshop-2026/',
    '/it/events/compass-workshop': '/it/blog/compass-workshop-2026/',
    '/en/tags': '/',
    '/tags': '/',
    '/en/categories': '/',
    '/categories': '/',
  };

  const pillars = ['multi-agent', 'statistical-verification', 'robust-quant', 'text-analytics'];
  for (const pillar of pillars) {
    redirects[`/en/research/${pillar}`] = `/research/${pillar}/`;
  }

  const collections = ['blog', 'projects', 'publications'];
  for (const collection of collections) {
    const dir = path.join(process.cwd(), 'src/content', collection);
    if (fs.existsSync(dir)) {
      const items = fs.readdirSync(dir, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name);
      for (const item of items) {
        redirects[`/en/${collection}/${item}`] = `/${collection}/${item}/`;
      }
    }
  }

  return redirects;
}

export default defineConfig({
  /*
   * Where the site will be served from. Every absolute URL the build emits —
   * canonical, Open Graph, sitemap, RSS — is resolved against this, so a wrong
   * value here is a wrong value in the metadata of all 37 pages.
   *
   * The default is where the site lives today. Netlify builds Hugo with `-b
   * $URL`; the same override works here through SITE_URL, so a deploy preview
   * does not advertise the production URL as its canonical.
   */
  site: process.env.SITE_URL ?? 'https://stefano-blando.github.io',
  output: 'static',
  devToolbar: { enabled: false },
  build: { inlineStylesheets: 'auto' },
  integrations: [sitemap()],
  redirects: getLegacyRedirects(),
  vite: { plugins: [diagnosticsSink()] },
});
