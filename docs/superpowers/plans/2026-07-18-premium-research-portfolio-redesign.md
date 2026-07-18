# Premium Research Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the fragile homepage styling and duplicate particle effect with a personal, accessible, premium dark research portfolio featuring Stefano's portrait, a modular network-science background, an education timeline, selected projects, publications, news, and clear navigation.

**Architecture:** Keep Hugo Blox and the existing Markdown data model. Build locally owned Go HTML blocks under `layouts/_partials/hbx/blocks/`, each with co-located scoped CSS, and load two small local JavaScript bundles for the network and progressive interactions. Preserve author, project, publication, and blog content as the single source of truth for English and Italian pages.

**Tech Stack:** Hugo Extended 0.154.5, Hugo Blox, Go templates, Tailwind-compatible co-located CSS, vanilla ES modules, Node's built-in test runner, Python `unittest`, GitHub Pages.

---

## File Structure

Create or modify these units. Each unit has one responsibility.

```text
assets/
  css/custom.css                                  # Site-wide background, navbar, focus, and reveal primitives
  js/
    portfolio-interactions.js                     # Reveal, card pointer glow, magnetic button enhancement
    research-network/
      topology.js                                 # Pure deterministic graph and responsive profile functions
      renderer.js                                 # Canvas lifecycle, physics, drawing, and input handling
      index.js                                    # Browser entrypoint and progressive initialization

layouts/_partials/
  hooks/body-end/custom.html                      # Hugo Pipes bundles for local JS only
  hbx/blocks/
    portfolio-hero/
      block.html                                  # Personal identity, portrait, affiliations, CTAs, canvas
      style.css                                   # Hero and canvas layout
    research-pillars/
      block.html                                  # Three research areas and grouped interest chips
      style.css                                   # Scoped gradient card styles
    education-timeline/
      block.html                                  # Accessible education timeline from author data
      style.css                                   # Horizontal desktop and vertical mobile timeline
    featured-projects/
      block.html                                  # Explicit three-project selection from content pages
      style.css                                   # Project image and card treatment
    portfolio-evidence/
      block.html                                  # Featured publications and latest news queries
      style.css                                   # Editorial rows and responsive two-column layout
    portfolio-contact/
      block.html                                  # Collaboration prompt and social links
      style.css                                   # Contact panel styling

content/
  _index.md                                       # English homepage block composition and copy
  _index.it.md                                    # Italian homepage block composition and copy

config/_default/
  menus.yaml                                      # English primary navigation
  languages.yaml                                  # Italian primary navigation
  params.yaml                                     # Muted portfolio palette for all site pages

tests/
  __init__.py
  test_homepage_contract.py                       # Source and built-HTML contracts
  network/
    topology.test.mjs                             # Pure network topology and profile tests
    interactions.test.mjs                         # Pure interaction math tests

scripts/
  audit_built_homepage.py                         # Post-build HTML accessibility and regression audit

.gitignore                                        # Ignore visual-companion artifacts
package.json                                      # Unified test and audit scripts
```

## Preflight

The current workspace does not have Hugo or `pnpm` on `PATH`. Before implementation, create an isolated worktree through the selected execution skill and make these tools available:

```bash
corepack pnpm --version
hugo version
```

Expected:

```text
pnpm 10.14.0
hugo v0.154.5+extended
```

If Hugo is absent, install the official Extended 0.154.5 binary outside the repository and use its absolute path. Do not commit binaries or generated `public/` output.

### Task 1: Establish the Test Harness and Ignore Mockups

**Files:**
- Create: `tests/__init__.py`
- Create: `tests/test_homepage_contract.py`
- Modify: `.gitignore`
- Modify: `package.json`

- [ ] **Step 1: Write the failing repository-hygiene test**

Create `tests/__init__.py` as an empty file and create `tests/test_homepage_contract.py`:

```python
from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]


class HomepageContractTests(unittest.TestCase):
    def test_visual_companion_artifacts_are_ignored(self):
        ignore = (ROOT / ".gitignore").read_text(encoding="utf-8")
        self.assertIn(".superpowers/", ignore.splitlines())


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```bash
python3 -m unittest tests.test_homepage_contract.HomepageContractTests.test_visual_companion_artifacts_are_ignored -v
```

Expected: `FAIL` because `.superpowers/` is not yet ignored.

- [ ] **Step 3: Add the ignore rule and unified scripts**

Append under generated/local artifacts in `.gitignore`:

```gitignore
# Visual brainstorming artifacts
.superpowers/
```

Add these scripts to `package.json`, preserving the existing scripts:

```json
"test:ui": "python3 -m unittest discover -s tests -p 'test_*.py' -v",
"test:network": "node --test tests/network/*.test.mjs",
"test": "python3 -m unittest discover -s tests -p 'test_*.py' -v && node --test tests/network/*.test.mjs",
"audit:homepage": "python3 scripts/audit_built_homepage.py public"
```

- [ ] **Step 4: Run the test and verify it passes**

Run:

```bash
python3 -m unittest tests.test_homepage_contract -v
```

Expected: `OK`.

- [ ] **Step 5: Commit**

```bash
git add .gitignore package.json tests/__init__.py tests/test_homepage_contract.py
git commit -m "test: add homepage redesign contract harness"
```

### Task 2: Build a Deterministic Modular Network Model

**Files:**
- Create: `tests/network/topology.test.mjs`
- Create: `assets/js/research-network/topology.js`

- [ ] **Step 1: Write failing topology tests**

Create `tests/network/topology.test.mjs`:

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createModularTopology,
  getNeighborIds,
  getNetworkProfile,
} from '../../assets/js/research-network/topology.js';

test('creates connected modular communities with valid degree metadata', () => {
  const graph = createModularTopology({ communitySizes: [4, 4, 4], seed: 19 });

  assert.equal(graph.nodes.length, 12);
  assert.equal(new Set(graph.nodes.map((node) => node.community)).size, 3);
  assert.ok(graph.edges.filter((edge) => edge.bridge).length >= 2);

  const ids = new Set(graph.nodes.map((node) => node.id));
  const edgeKeys = new Set();
  for (const edge of graph.edges) {
    assert.ok(ids.has(edge.source));
    assert.ok(ids.has(edge.target));
    assert.notEqual(edge.source, edge.target);
    const key = [edge.source, edge.target].sort().join(':');
    assert.ok(!edgeKeys.has(key), `duplicate edge ${key}`);
    edgeKeys.add(key);
  }

  for (const node of graph.nodes) {
    const measuredDegree = graph.edges.filter(
      (edge) => edge.source === node.id || edge.target === node.id,
    ).length;
    assert.equal(node.degree, measuredDegree);
  }
});

test('returns the immediate neighborhood including the selected node', () => {
  const graph = createModularTopology({ communitySizes: [4, 4, 4], seed: 7 });
  const neighbors = getNeighborIds(graph, 'c0-n0');

  assert.ok(neighbors.has('c0-n0'));
  assert.ok(neighbors.size > 1);
});

test('selects a reduced static profile for accessibility and small screens', () => {
  assert.deepEqual(
    getNetworkProfile({ width: 1440, saveData: false, reducedMotion: false }),
    { nodeCount: 30, animate: true, pointer: true },
  );
  assert.deepEqual(
    getNetworkProfile({ width: 600, saveData: false, reducedMotion: false }),
    { nodeCount: 18, animate: true, pointer: false },
  );
  assert.deepEqual(
    getNetworkProfile({ width: 1440, saveData: false, reducedMotion: true }),
    { nodeCount: 30, animate: false, pointer: false },
  );
});
```

- [ ] **Step 2: Run the tests and verify they fail**

Run:

```bash
node --test tests/network/topology.test.mjs
```

Expected: `ERR_MODULE_NOT_FOUND` for `topology.js`.

- [ ] **Step 3: Implement the pure network model**

Create `assets/js/research-network/topology.js`:

```javascript
function createRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function distributeCount(total, communities = 3) {
  const base = Math.floor(total / communities);
  const remainder = total % communities;
  return Array.from(
    { length: communities },
    (_, index) => base + (index < remainder ? 1 : 0),
  );
}

export function getNetworkProfile({ width, saveData, reducedMotion }) {
  const compact = width < 768 || saveData;
  return {
    nodeCount: compact ? 18 : 30,
    animate: !reducedMotion,
    pointer: !compact && !reducedMotion,
  };
}

export function createModularTopology({
  communitySizes = distributeCount(30),
  seed = 20260718,
} = {}) {
  const random = createRandom(seed);
  const centers = [
    { x: 0.2, y: 0.28 },
    { x: 0.76, y: 0.3 },
    { x: 0.52, y: 0.73 },
  ];
  const nodes = [];
  const edges = [];
  const edgeKeys = new Set();
  const addEdge = (source, target, bridge = false) => {
    const key = [source, target].sort().join(':');
    if (source === target || edgeKeys.has(key)) return;
    edgeKeys.add(key);
    edges.push({ source, target, bridge });
  };

  communitySizes.forEach((size, community) => {
    const center = centers[community % centers.length];
    for (let index = 0; index < size; index += 1) {
      const angle = (Math.PI * 2 * index) / size + random() * 0.35;
      const radius = 0.055 + random() * 0.09;
      nodes.push({
        id: `c${community}-n${index}`,
        community,
        anchorX: center.x + Math.cos(angle) * radius,
        anchorY: center.y + Math.sin(angle) * radius,
        x: center.x + Math.cos(angle) * radius,
        y: center.y + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        degree: 0,
      });
    }

    for (let index = 0; index < size; index += 1) {
      const current = `c${community}-n${index}`;
      const next = `c${community}-n${(index + 1) % size}`;
      addEdge(current, next);
      if (size > 3 && index % 2 === 0) {
        const chord = `c${community}-n${(index + 2) % size}`;
        addEdge(current, chord);
      }
    }
  });

  for (let community = 0; community < communitySizes.length - 1; community += 1) {
    addEdge(`c${community}-n0`, `c${community + 1}-n0`, true);
  }

  const degreeById = new Map(nodes.map((node) => [node.id, 0]));
  for (const edge of edges) {
    degreeById.set(edge.source, degreeById.get(edge.source) + 1);
    degreeById.set(edge.target, degreeById.get(edge.target) + 1);
  }
  for (const node of nodes) node.degree = degreeById.get(node.id);

  return { nodes, edges };
}

export function getNeighborIds(graph, nodeId) {
  const result = new Set([nodeId]);
  for (const edge of graph.edges) {
    if (edge.source === nodeId) result.add(edge.target);
    if (edge.target === nodeId) result.add(edge.source);
  }
  return result;
}
```

- [ ] **Step 4: Run the tests and verify they pass**

Run:

```bash
node --test tests/network/topology.test.mjs
```

Expected: `3 tests`, all passing.

- [ ] **Step 5: Commit**

```bash
git add assets/js/research-network/topology.js tests/network/topology.test.mjs
git commit -m "feat: add modular research network model"
```

### Task 3: Render One Progressive Network Canvas

**Files:**
- Create: `assets/js/research-network/renderer.js`
- Create: `assets/js/research-network/index.js`
- Modify: `layouts/_partials/hooks/body-end/custom.html`
- Modify: `tests/test_homepage_contract.py`

- [ ] **Step 1: Add failing source-contract tests**

Add to `HomepageContractTests`:

```python
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
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```bash
python3 -m unittest tests.test_homepage_contract.HomepageContractTests.test_network_assets_are_local_and_unique -v
```

Expected: `FAIL` because the old hook contains jsDelivr and tsParticles.

- [ ] **Step 3: Implement the renderer**

Create `assets/js/research-network/renderer.js`:

```javascript
import { createModularTopology, getNeighborIds } from './topology.js';

export class ResearchNetworkRenderer {
  constructor(canvas, profile) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d', { alpha: true });
    this.profile = profile;
    this.graph = createModularTopology({
      communitySizes: profile.nodeCount === 18 ? [6, 6, 6] : [10, 10, 10],
    });
    this.nodesById = new Map(this.graph.nodes.map((node) => [node.id, node]));
    this.pointer = null;
    this.highlighted = new Set();
    this.frameId = null;
    this.hidden = document.hidden;
    this.resize = this.resize.bind(this);
    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerLeave = this.onPointerLeave.bind(this);
    this.onVisibilityChange = this.onVisibilityChange.bind(this);
    this.frame = this.frame.bind(this);
  }

  start() {
    this.resize();
    window.addEventListener('resize', this.resize, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibilityChange);
    if (this.profile.pointer) {
      window.addEventListener('pointermove', this.onPointerMove, { passive: true });
      window.addEventListener('pointerleave', this.onPointerLeave, { passive: true });
    }
    this.draw();
    if (this.profile.animate) this.frameId = requestAnimationFrame(this.frame);
  }

  resize() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = Math.round(this.width * ratio);
    this.canvas.height = Math.round(this.height * ratio);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.context.setTransform(ratio, 0, 0, ratio, 0, 0);
    this.draw();
  }

  onPointerMove(event) {
    this.pointer = { x: event.clientX / this.width, y: event.clientY / this.height };
    let nearest = null;
    let distance = Number.POSITIVE_INFINITY;
    for (const node of this.graph.nodes) {
      const measured = Math.hypot(node.x - this.pointer.x, node.y - this.pointer.y);
      if (measured < distance) {
        nearest = node;
        distance = measured;
      }
    }
    this.highlighted = nearest && distance < 0.16
      ? getNeighborIds(this.graph, nearest.id)
      : new Set();
  }

  onPointerLeave() {
    this.pointer = null;
    this.highlighted.clear();
  }

  onVisibilityChange() {
    this.hidden = document.hidden;
    if (!this.hidden && this.profile.animate && this.frameId === null) {
      this.frameId = requestAnimationFrame(this.frame);
    }
  }

  update() {
    for (const node of this.graph.nodes) {
      node.vx += (node.anchorX - node.x) * 0.0007;
      node.vy += (node.anchorY - node.y) * 0.0007;
      if (this.pointer) {
        const dx = this.pointer.x - node.x;
        const dy = this.pointer.y - node.y;
        const distance = Math.max(Math.hypot(dx, dy), 0.03);
        if (distance < 0.18) {
          node.vx += (dx / distance) * 0.00005;
          node.vy += (dy / distance) * 0.00005;
        }
      }
      node.vx *= 0.985;
      node.vy *= 0.985;
      node.x += node.vx;
      node.y += node.vy;
    }
  }

  draw() {
    if (!this.context || !this.width || !this.height) return;
    this.context.clearRect(0, 0, this.width, this.height);
    for (const edge of this.graph.edges) {
      const source = this.nodesById.get(edge.source);
      const target = this.nodesById.get(edge.target);
      const active = this.highlighted.has(source.id) && this.highlighted.has(target.id);
      this.context.beginPath();
      this.context.moveTo(source.x * this.width, source.y * this.height);
      this.context.lineTo(target.x * this.width, target.y * this.height);
      this.context.strokeStyle = active
        ? 'rgba(146, 190, 232, 0.68)'
        : edge.bridge
          ? 'rgba(104, 147, 196, 0.30)'
          : 'rgba(126, 151, 184, 0.18)';
      this.context.lineWidth = active ? 1.4 : 0.8;
      this.context.stroke();
    }
    for (const node of this.graph.nodes) {
      const active = this.highlighted.has(node.id);
      const radius = Math.min(2.2 + node.degree * 0.55, 6.5) + (active ? 1.2 : 0);
      this.context.beginPath();
      this.context.arc(node.x * this.width, node.y * this.height, radius, 0, Math.PI * 2);
      this.context.fillStyle = active
        ? 'rgba(181, 210, 239, 0.95)'
        : 'rgba(118, 151, 191, 0.58)';
      this.context.fill();
    }
  }

  frame() {
    this.frameId = null;
    if (this.hidden) return;
    this.update();
    this.draw();
    this.frameId = requestAnimationFrame(this.frame);
  }

  destroy() {
    if (this.frameId !== null) cancelAnimationFrame(this.frameId);
    window.removeEventListener('resize', this.resize);
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerleave', this.onPointerLeave);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
  }
}
```

Create `assets/js/research-network/index.js`:

```javascript
import { getNetworkProfile } from './topology.js';
import { ResearchNetworkRenderer } from './renderer.js';

function initializeResearchNetwork() {
  const canvas = document.getElementById('research-network-canvas');
  if (!canvas || !canvas.getContext) return;
  if (!canvas.getContext('2d')) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  const profile = getNetworkProfile({
    width: window.innerWidth,
    saveData,
    reducedMotion,
  });
  const renderer = new ResearchNetworkRenderer(canvas, profile);
  renderer.start();
  window.addEventListener('pagehide', () => renderer.destroy(), { once: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeResearchNetwork, { once: true });
} else {
  initializeResearchNetwork();
}
```

- [ ] **Step 4: Replace the old body-end hook with local bundles**

Replace `layouts/_partials/hooks/body-end/custom.html` with:

```go-html-template
{{ $network := resources.Get "js/research-network/index.js" | js.Build (dict "targetPath" "js/research-network.js" "format" "esm") | minify | fingerprint }}
<script type="module" src="{{ $network.RelPermalink }}" integrity="{{ $network.Data.Integrity }}"></script>

{{ $interactions := resources.Get "js/portfolio-interactions.js" }}
{{ with $interactions }}
  {{ $bundle := . | js.Build (dict "targetPath" "js/portfolio-interactions.js" "format" "esm") | minify | fingerprint }}
  <script type="module" src="{{ $bundle.RelPermalink }}" integrity="{{ $bundle.Data.Integrity }}"></script>
{{ end }}
```

The conditional `with` lets this task pass before `portfolio-interactions.js` is created.

- [ ] **Step 5: Remove the duplicate inline network sections from both homepage files**

Delete the complete `block: markdown` particle section from `content/_index.md` and `content/_index.it.md`. Do not yet change the other blocks.

- [ ] **Step 6: Run tests**

Run:

```bash
python3 -m unittest tests.test_homepage_contract -v
node --test tests/network/topology.test.mjs
```

Expected: all tests pass.

- [ ] **Step 7: Commit**

```bash
git add assets/js/research-network layouts/_partials/hooks/body-end/custom.html content/_index.md content/_index.it.md tests/test_homepage_contract.py
git commit -m "feat: replace particles with local modular network"
```

### Task 4: Create the Personal Hero Block

**Files:**
- Create: `layouts/_partials/hbx/blocks/portfolio-hero/block.html`
- Create: `layouts/_partials/hbx/blocks/portfolio-hero/style.css`
- Modify: `tests/test_homepage_contract.py`

- [ ] **Step 1: Add a failing hero contract test**

Add:

```python
    def test_personal_hero_uses_author_data_and_local_portrait(self):
        template = ROOT / "layouts/_partials/hbx/blocks/portfolio-hero/block.html"
        self.assertTrue(template.exists())
        source = template.read_text(encoding="utf-8")
        self.assertIn("site.Data.authors", source)
        self.assertIn("media/authors/%s.png", source)
        self.assertEqual(source.count('id="research-network-canvas"'), 1)
        self.assertNotIn("—", source)
```

- [ ] **Step 2: Run the test and verify it fails**

Run:

```bash
python3 -m unittest tests.test_homepage_contract.HomepageContractTests.test_personal_hero_uses_author_data_and_local_portrait -v
```

Expected: `FAIL` because the block does not exist.

- [ ] **Step 3: Create the complete hero template**

Create `layouts/_partials/hbx/blocks/portfolio-hero/block.html`:

```go-html-template
{{ $block := . }}
{{ $username := $block.content.username | default "me" }}
{{ $author := index site.Data.authors $username }}
{{ $portraitPath := printf "media/authors/%s.png" $username }}
{{ $portrait := resources.Get $portraitPath }}

<section id="home" class="portfolio-hero" aria-labelledby="portfolio-hero-title">
  <canvas id="research-network-canvas" class="research-network-canvas" aria-hidden="true"></canvas>
  <div class="portfolio-hero__inner">
    <div class="portfolio-hero__copy" data-reveal>
      <p class="portfolio-eyebrow">{{ $block.content.eyebrow }}</p>
      <h1 id="portfolio-hero-title">{{ $block.content.headline | markdownify }}</h1>
      <div class="portfolio-hero__summary">{{ $block.content.summary | markdownify }}</div>
      <div class="portfolio-actions">
        <a class="portfolio-button portfolio-button--primary" data-magnetic href="{{ $block.content.primary.url }}">{{ $block.content.primary.text }}</a>
        <a class="portfolio-button portfolio-button--secondary" data-magnetic href="{{ $block.content.secondary.url }}">{{ $block.content.secondary.text }}</a>
      </div>
      <div class="portfolio-affiliations" aria-label="{{ $block.content.affiliations_label }}">
        <span>{{ $block.content.affiliations_label }}</span>
        {{ range $author.affiliations }}
          <a href="{{ .url }}" rel="noopener">{{ .name }}</a>
        {{ end }}
      </div>
    </div>

    <div class="portfolio-portrait-wrap" data-reveal>
      <div class="portfolio-portrait">
        {{ with $portrait }}
          {{ $image := .Fill "744x804 webp q90 Center" }}
          <img src="{{ $image.RelPermalink }}" width="{{ $image.Width }}" height="{{ $image.Height }}" alt="{{ $block.content.portrait_alt }}" fetchpriority="high">
        {{ else }}
          <span class="portfolio-portrait__fallback" aria-label="{{ $author.name.display }}">SB</span>
        {{ end }}
      </div>
      <div class="portfolio-identity-card">
        <strong>{{ $author.role }}</strong>
        <span>{{ $block.content.identity_focus }}</span>
        <span class="portfolio-location">{{ $block.content.location }}</span>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 4: Add scoped hero CSS**

Create `layouts/_partials/hbx/blocks/portfolio-hero/style.css`:

```css
.portfolio-hero {
  position: relative;
  min-height: min(850px, 92vh);
  background: radial-gradient(circle at 82% 34%, rgb(55 73 116 / 22%), transparent 34%);
}

.research-network-canvas {
  position: fixed;
  inset: 0;
  z-index: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  opacity: 0.72;
}

.portfolio-hero__inner {
  position: relative;
  z-index: 1;
  width: min(1180px, calc(100% - 2rem));
  min-height: inherit;
  margin-inline: auto;
  padding-block: clamp(5rem, 10vw, 8rem);
  display: grid;
  grid-template-columns: minmax(0, 1.18fr) minmax(280px, 0.82fr);
  gap: clamp(2rem, 6vw, 5rem);
  align-items: center;
}

.portfolio-hero h1 {
  max-width: 16ch;
  margin: 0;
  color: #f5f3ef;
  font-family: Georgia, "Times New Roman", serif;
  font-size: clamp(2.8rem, 6vw, 5.4rem);
  font-weight: 600;
  line-height: 1.02;
  letter-spacing: -0.05em;
}

.portfolio-hero h1 em { color: #a8bddd; font-style: normal; }
.portfolio-hero__summary { max-width: 62ch; margin-top: 1.5rem; color: #a7afbc; font-size: clamp(1rem, 1.4vw, 1.15rem); line-height: 1.75; }
.portfolio-actions { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1.75rem; }
.portfolio-button { display: inline-flex; align-items: center; justify-content: center; min-height: 46px; padding: 0.75rem 1.15rem; border-radius: 0.65rem; font-weight: 750; text-decoration: none; }
.portfolio-button--primary { color: #fff; background: linear-gradient(135deg, #526fa8, #334d7c); box-shadow: 0 12px 30px rgb(38 60 102 / 28%); }
.portfolio-button--secondary { color: #c8cdd5; border: 1px solid #3a414f; background: rgb(17 22 31 / 65%); }
.portfolio-affiliations { display: flex; flex-wrap: wrap; gap: 0.65rem 1rem; margin-top: 1.5rem; color: #7f8998; font-size: 0.82rem; }
.portfolio-affiliations a { color: #b8c0cc; text-decoration: none; }

.portfolio-portrait-wrap { position: relative; width: min(100%, 390px); justify-self: end; }
.portfolio-portrait { overflow: hidden; aspect-ratio: 1 / 1.08; border: 1px solid rgb(208 218 232 / 20%); border-radius: 1.6rem; background: #131823; box-shadow: 0 25px 65px rgb(0 0 0 / 42%); }
.portfolio-portrait img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; filter: saturate(0.9) contrast(1.02); }
.portfolio-portrait__fallback { display: grid; width: 100%; height: 100%; place-items: center; color: #a8bddd; font-size: 4rem; }
.portfolio-identity-card { position: absolute; left: -2rem; bottom: 1.25rem; max-width: 240px; padding: 0.9rem 1rem; border: 1px solid rgb(189 201 217 / 18%); border-radius: 0.85rem; background: linear-gradient(145deg, rgb(25 31 43 / 96%), rgb(12 17 25 / 97%)); box-shadow: 0 16px 38px rgb(0 0 0 / 30%); backdrop-filter: blur(14px); }
.portfolio-identity-card strong, .portfolio-identity-card span { display: block; }
.portfolio-identity-card span { margin-top: 0.25rem; color: #98a3b2; font-size: 0.8rem; line-height: 1.45; }
.portfolio-location { color: #a8bddd !important; }

@media (max-width: 800px) {
  .portfolio-hero__inner { grid-template-columns: 1fr; padding-top: 5.5rem; }
  .portfolio-portrait-wrap { width: min(88%, 360px); justify-self: center; }
  .portfolio-identity-card { left: -0.75rem; }
}

@media (prefers-reduced-motion: reduce) {
  .research-network-canvas { opacity: 0.5; }
}
```

- [ ] **Step 5: Run the hero contract test**

Run:

```bash
python3 -m unittest tests.test_homepage_contract.HomepageContractTests.test_personal_hero_uses_author_data_and_local_portrait -v
```

Expected: `OK`.

- [ ] **Step 6: Commit**

```bash
git add layouts/_partials/hbx/blocks/portfolio-hero tests/test_homepage_contract.py
git commit -m "feat: add personal portfolio hero block"
```

### Task 5: Create Research Pillars and Interest Chips

**Files:**
- Create: `layouts/_partials/hbx/blocks/research-pillars/block.html`
- Create: `layouts/_partials/hbx/blocks/research-pillars/style.css`
- Modify: `tests/test_homepage_contract.py`

- [ ] **Step 1: Add a failing icon-rendering contract**

```python
    def test_research_pillars_render_local_svg_assets(self):
        template = ROOT / "layouts/_partials/hbx/blocks/research-pillars/block.html"
        self.assertTrue(template.exists())
        source = template.read_text(encoding="utf-8")
        self.assertIn('resources.Get (printf "media/icons/%s.svg" .icon)', source)
        self.assertNotIn("icon_pack", source)
```

- [ ] **Step 2: Run it and verify failure**

Run:

```bash
python3 -m unittest tests.test_homepage_contract.HomepageContractTests.test_research_pillars_render_local_svg_assets -v
```

Expected: `FAIL` because the block is absent.

- [ ] **Step 3: Create the block template**

Create `layouts/_partials/hbx/blocks/research-pillars/block.html`:

```go-html-template
{{ $block := . }}
<section id="research" class="research-pillars portfolio-section" aria-labelledby="research-title">
  <div class="portfolio-section__inner">
    <p class="portfolio-eyebrow">{{ $block.content.eyebrow }}</p>
    <h2 id="research-title">{{ $block.content.title }}</h2>
    <p class="portfolio-section__intro">{{ $block.content.text }}</p>
    <div class="research-pillars__grid">
      {{ range $block.content.items }}
        {{ $icon := resources.Get (printf "media/icons/%s.svg" .icon) }}
        <article class="research-card portfolio-card" data-pointer-glow data-reveal>
          <span class="research-card__icon" aria-hidden="true">
            {{ with $icon }}
              {{ .Content | safeHTML }}
            {{ else }}
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" fill="none" stroke="currentColor" stroke-width="2"/></svg>
            {{ end }}
          </span>
          <h3>{{ .name }}</h3>
          <p>{{ .description }}</p>
        </article>
      {{ end }}
    </div>
    <div class="research-interests" data-reveal>
      {{ range $block.content.interest_groups }}
        <div class="research-interest-group">
          <h3>{{ .name }}</h3>
          <div class="research-chips">
            {{ range .items }}<span>{{ . }}</span>{{ end }}
          </div>
        </div>
      {{ end }}
    </div>
  </div>
</section>
```

- [ ] **Step 4: Create scoped card CSS**

Create `layouts/_partials/hbx/blocks/research-pillars/style.css`:

```css
.research-pillars { background: rgb(10 13 21 / 76%); border-block: 1px solid rgb(181 191 207 / 8%); backdrop-filter: blur(6px); }
.research-pillars__grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; margin-top: 2rem; }
.research-card { position: relative; overflow: hidden; min-height: 250px; padding: 1.5rem; border: 1px solid rgb(179 192 211 / 13%); border-radius: 1rem; box-shadow: 0 18px 42px rgb(0 0 0 / 20%); transition: transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease; }
.research-card:nth-child(1) { background: radial-gradient(circle at var(--pointer-x, 80%) var(--pointer-y, 0%), rgb(102 118 183 / 20%), transparent 32%), linear-gradient(145deg, #182033, #101621 55%, #0c1119); }
.research-card:nth-child(2) { background: radial-gradient(circle at var(--pointer-x, 80%) var(--pointer-y, 0%), rgb(95 131 148 / 20%), transparent 32%), linear-gradient(145deg, #17222b, #111923 55%, #0c1118); }
.research-card:nth-child(3) { background: radial-gradient(circle at var(--pointer-x, 80%) var(--pointer-y, 0%), rgb(123 111 159 / 20%), transparent 32%), linear-gradient(145deg, #1d1d2d, #141622 55%, #0d1118); }
.research-card:hover, .research-card:focus-within { transform: translateY(-4px); border-color: rgb(143 164 198 / 42%); box-shadow: 0 20px 48px rgb(20 30 51 / 34%); }
.research-card__icon { display: grid; width: 3rem; height: 3rem; place-items: center; color: #b9c7da; border: 1px solid rgb(210 220 235 / 12%); border-radius: 0.75rem; background: rgb(210 220 235 / 8%); }
.research-card__icon svg { width: 1.5rem; height: 1.5rem; }
.research-card h3 { margin: 1.25rem 0 0.6rem; color: #edf0f4; font-size: 1.25rem; }
.research-card p { margin: 0; color: #979fac; line-height: 1.65; }
.research-interests { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1.5rem; margin-top: 2.5rem; }
.research-interest-group h3 { color: #cbd2dc; font-size: 0.9rem; }
.research-chips { display: flex; flex-wrap: wrap; gap: 0.5rem; }
.research-chips span { padding: 0.45rem 0.7rem; color: #aebaca; border: 1px solid #2b3748; border-radius: 999px; background: rgb(16 22 33 / 78%); font-size: 0.8rem; }
@media (max-width: 800px) { .research-pillars__grid, .research-interests { grid-template-columns: 1fr; } }
```

- [ ] **Step 5: Run the tests**

Run:

```bash
python3 -m unittest tests.test_homepage_contract -v
```

Expected: `OK`.

- [ ] **Step 6: Commit**

```bash
git add layouts/_partials/hbx/blocks/research-pillars tests/test_homepage_contract.py
git commit -m "feat: add research pillars and interest groups"
```

### Task 6: Create the Accessible Education Timeline

**Files:**
- Create: `layouts/_partials/hbx/blocks/education-timeline/block.html`
- Create: `layouts/_partials/hbx/blocks/education-timeline/style.css`
- Modify: `tests/test_homepage_contract.py`

- [ ] **Step 1: Add a failing semantic timeline test**

```python
    def test_education_timeline_uses_native_details_and_author_data(self):
        template = ROOT / "layouts/_partials/hbx/blocks/education-timeline/block.html"
        self.assertTrue(template.exists())
        source = template.read_text(encoding="utf-8")
        self.assertIn("site.Data.authors", source)
        self.assertIn("<details", source)
        self.assertIn("<summary", source)
```

- [ ] **Step 2: Run it and verify failure**

Run:

```bash
python3 -m unittest tests.test_homepage_contract.HomepageContractTests.test_education_timeline_uses_native_details_and_author_data -v
```

Expected: `FAIL` because the block is absent.

- [ ] **Step 3: Create the timeline template**

Create `layouts/_partials/hbx/blocks/education-timeline/block.html`:

```go-html-template
{{ $block := . }}
{{ $username := $block.content.username | default "me" }}
{{ $author := index site.Data.authors $username }}
<section id="education" class="education-timeline portfolio-section" aria-labelledby="education-title">
  <div class="portfolio-section__inner">
    <p class="portfolio-eyebrow">{{ $block.content.eyebrow }}</p>
    <h2 id="education-title">{{ $block.content.title }}</h2>
    <p class="portfolio-section__intro">{{ $block.content.text }}</p>
    <ol class="education-timeline__list">
      {{ range $index, $item := $author.education }}
        <li class="education-milestone" data-reveal>
          <details>
            <summary>
              <span class="education-milestone__dates">
                <time datetime="{{ $item.start }}">{{ time.Format "2006" $item.start }}</time>
                {{ with $item.end }}<span>–</span><time datetime="{{ . }}">{{ time.Format "2006" . }}</time>{{ else }}<span>– {{ $block.content.present }}</span>{{ end }}
              </span>
              <strong>{{ $item.degree }}</strong>
              <span>{{ $item.institution }}</span>
            </summary>
            {{ with $item.summary }}<div class="education-milestone__details">{{ . | markdownify }}</div>{{ end }}
          </details>
        </li>
      {{ end }}
    </ol>
  </div>
</section>
```

The en dash in the date range is UI punctuation, not prose. If the no-em-dash rule is extended to all punctuation, replace it with `to` or `a` in translated content.

- [ ] **Step 4: Add responsive timeline CSS**

Create `layouts/_partials/hbx/blocks/education-timeline/style.css`:

```css
.education-timeline { background: rgb(6 8 16 / 52%); }
.education-timeline__list { position: relative; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 1rem; margin: 3rem 0 0; padding: 2rem 0 0; list-style: none; }
.education-timeline__list::before { position: absolute; top: 0.35rem; left: 2%; right: 2%; height: 1px; content: ""; background: linear-gradient(90deg, #334155, #526fa8, #879bb9); }
.education-milestone { position: relative; min-width: 0; }
.education-milestone::before { position: absolute; top: -2.05rem; left: 0; width: 0.72rem; height: 0.72rem; content: ""; border: 2px solid #8ca7ca; border-radius: 50%; background: #060810; box-shadow: 0 0 14px rgb(82 111 168 / 70%); }
.education-milestone details { border: 1px solid rgb(179 192 211 / 12%); border-radius: 0.9rem; background: linear-gradient(145deg, rgb(20 25 35 / 94%), rgb(10 14 21 / 96%)); }
.education-milestone summary { min-height: 150px; padding: 1rem; cursor: pointer; list-style: none; }
.education-milestone summary::-webkit-details-marker { display: none; }
.education-milestone summary strong, .education-milestone summary span { display: block; }
.education-milestone summary strong { margin-top: 0.45rem; color: #eceff3; line-height: 1.35; }
.education-milestone summary > span:last-child { margin-top: 0.45rem; color: #909aa8; font-size: 0.83rem; }
.education-milestone__dates { display: flex !important; gap: 0.3rem; color: #9eb7db; font-size: 0.76rem; }
.education-milestone__details { padding: 0 1rem 1rem; color: #a3acba; font-size: 0.9rem; line-height: 1.6; }
.education-milestone details[open] { border-color: rgb(143 164 198 / 38%); }
@media (max-width: 800px) {
  .education-timeline__list { grid-template-columns: 1fr; gap: 1.25rem; padding: 0 0 0 1.6rem; }
  .education-timeline__list::before { top: 0; bottom: 0; left: 0.35rem; width: 1px; height: auto; }
  .education-milestone::before { top: 1.1rem; left: -1.6rem; }
  .education-milestone summary { min-height: auto; }
}
```

- [ ] **Step 5: Run tests**

```bash
python3 -m unittest tests.test_homepage_contract -v
```

Expected: `OK`.

- [ ] **Step 6: Commit**

```bash
git add layouts/_partials/hbx/blocks/education-timeline tests/test_homepage_contract.py
git commit -m "feat: add responsive education timeline"
```

### Task 7: Create Three Explicit Featured Project Cards

**Files:**
- Create: `layouts/_partials/hbx/blocks/featured-projects/block.html`
- Create: `layouts/_partials/hbx/blocks/featured-projects/style.css`
- Modify: `tests/test_homepage_contract.py`

- [ ] **Step 1: Add a failing selection contract**

```python
    def test_featured_projects_are_explicit_and_limited_to_three(self):
        template = ROOT / "layouts/_partials/hbx/blocks/featured-projects/block.html"
        self.assertTrue(template.exists())
        source = template.read_text(encoding="utf-8")
        self.assertIn("$block.content.slugs", source)
        self.assertIn('site.GetPage (printf "/projects/%s" $slug)', source)
```

- [ ] **Step 2: Run it and verify failure**

Run:

```bash
python3 -m unittest tests.test_homepage_contract.HomepageContractTests.test_featured_projects_are_explicit_and_limited_to_three -v
```

Expected: `FAIL` because the block is absent.

- [ ] **Step 3: Create the project template**

Create `layouts/_partials/hbx/blocks/featured-projects/block.html`:

```go-html-template
{{ $block := . }}
<section id="projects" class="featured-projects portfolio-section" aria-labelledby="projects-title">
  <div class="portfolio-section__inner">
    <p class="portfolio-eyebrow">{{ $block.content.eyebrow }}</p>
    <h2 id="projects-title">{{ $block.content.title }}</h2>
    <p class="portfolio-section__intro">{{ $block.content.text }}</p>
    <div class="featured-projects__grid">
      {{ range $slug := first 3 $block.content.slugs }}
        {{ $project := site.GetPage (printf "/projects/%s" $slug) }}
        {{ with $project }}
          {{ $image := .Resources.GetMatch "featured.*" }}
          <article class="featured-project portfolio-card" data-pointer-glow data-reveal>
            <a class="featured-project__media" href="{{ .RelPermalink }}" aria-label="{{ .Title }}">
              {{ with $image }}
                {{ $thumb := .Fill "720x405 webp q88 Center" }}
                <img src="{{ $thumb.RelPermalink }}" width="{{ $thumb.Width }}" height="{{ $thumb.Height }}" alt="" loading="lazy">
              {{ end }}
            </a>
            <div class="featured-project__body">
              <h3><a href="{{ .RelPermalink }}">{{ .Title }}</a></h3>
              <p>{{ .Params.summary }}</p>
              <div class="featured-project__tags">
                {{ range first 3 .Params.tags }}<span>{{ . }}</span>{{ end }}
              </div>
              <a class="featured-project__link" href="{{ .RelPermalink }}">{{ $block.content.view_project }}</a>
            </div>
          </article>
        {{ end }}
      {{ end }}
    </div>
    <a class="portfolio-text-link" href="{{ relLangURL "projects/" }}">{{ $block.content.view_all }}</a>
  </div>
</section>
```

- [ ] **Step 4: Create project CSS**

Create `layouts/_partials/hbx/blocks/featured-projects/style.css`:

```css
.featured-projects { background: rgb(10 13 21 / 76%); border-block: 1px solid rgb(181 191 207 / 8%); }
.featured-projects__grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; margin-top: 2rem; }
.featured-project { overflow: hidden; border: 1px solid rgb(179 192 211 / 13%); border-radius: 1rem; background: radial-gradient(circle at var(--pointer-x, 80%) var(--pointer-y, 0%), rgb(82 111 168 / 18%), transparent 32%), linear-gradient(145deg, #182033, #101621 62%, #0c1119); transition: transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease; }
.featured-project:hover, .featured-project:focus-within { transform: translateY(-4px); border-color: rgb(143 164 198 / 42%); box-shadow: 0 22px 50px rgb(20 30 51 / 34%); }
.featured-project__media { display: block; overflow: hidden; aspect-ratio: 16 / 9; background: #101621; }
.featured-project__media img { width: 100%; height: 100%; object-fit: cover; transition: transform 400ms ease; }
.featured-project:hover .featured-project__media img { transform: scale(1.035); }
.featured-project__body { padding: 1.25rem; }
.featured-project h3 { margin: 0; font-size: 1.2rem; }
.featured-project h3 a { color: #edf0f4; text-decoration: none; }
.featured-project p { color: #979fac; line-height: 1.6; }
.featured-project__tags { display: flex; flex-wrap: wrap; gap: 0.4rem; }
.featured-project__tags span { padding: 0.35rem 0.55rem; color: #aebaca; border: 1px solid #2b3748; border-radius: 999px; font-size: 0.72rem; }
.featured-project__link, .portfolio-text-link { display: inline-flex; margin-top: 1rem; color: #9eb7db; font-weight: 700; text-decoration: none; }
@media (max-width: 800px) { .featured-projects__grid { grid-template-columns: 1fr; } }
```

- [ ] **Step 5: Run tests**

```bash
python3 -m unittest tests.test_homepage_contract -v
```

Expected: `OK`.

- [ ] **Step 6: Commit**

```bash
git add layouts/_partials/hbx/blocks/featured-projects tests/test_homepage_contract.py
git commit -m "feat: add selected project showcase"
```

### Task 8: Create Publications, News, and Contact Blocks

**Files:**
- Create: `layouts/_partials/hbx/blocks/portfolio-evidence/block.html`
- Create: `layouts/_partials/hbx/blocks/portfolio-evidence/style.css`
- Create: `layouts/_partials/hbx/blocks/portfolio-contact/block.html`
- Create: `layouts/_partials/hbx/blocks/portfolio-contact/style.css`
- Modify: `tests/test_homepage_contract.py`

- [ ] **Step 1: Add failing content-query tests**

```python
    def test_evidence_queries_publications_and_blog_content(self):
        source = (ROOT / "layouts/_partials/hbx/blocks/portfolio-evidence/block.html").read_text(encoding="utf-8")
        self.assertIn('where site.RegularPages "Section" "publications"', source)
        self.assertIn('where site.RegularPages "Section" "blog"', source)
        self.assertIn("url_pdf", source)

    def test_contact_block_has_named_links(self):
        source = (ROOT / "layouts/_partials/hbx/blocks/portfolio-contact/block.html").read_text(encoding="utf-8")
        self.assertIn("$block.content.links", source)
        self.assertIn('id="contact"', source)
```

- [ ] **Step 2: Run the new tests and verify errors**

Run:

```bash
python3 -m unittest \
  tests.test_homepage_contract.HomepageContractTests.test_evidence_queries_publications_and_blog_content \
  tests.test_homepage_contract.HomepageContractTests.test_contact_block_has_named_links -v
```

Expected: both tests fail because the block files are absent.

- [ ] **Step 3: Create `portfolio-evidence/block.html`**

```go-html-template
{{ $block := . }}
{{ $publications := where site.RegularPages "Section" "publications" }}
{{ $publications = where $publications "Params.featured" true }}
{{ $news := where site.RegularPages "Section" "blog" }}
<section id="publications" class="portfolio-evidence portfolio-section" aria-labelledby="publications-title">
  <div class="portfolio-section__inner portfolio-evidence__grid">
    <div>
      <p class="portfolio-eyebrow">{{ $block.content.publications_eyebrow }}</p>
      <h2 id="publications-title">{{ $block.content.publications_title }}</h2>
      <div class="publication-list">
        {{ range first 3 $publications.ByDate.Reverse }}
          <article class="publication-row" data-reveal>
            <div>
              <h3><a href="{{ .RelPermalink }}">{{ .Title }}</a></h3>
              <p>{{ .Date.Format "2006" }}{{ with .Params.publication_short }} · {{ . }}{{ end }}</p>
            </div>
            <div class="publication-row__actions">
              {{ with .Params.url_pdf }}<a href="{{ . }}">{{ $block.content.view_pdf }}</a>{{ end }}
              <a href="{{ .RelPermalink }}">{{ $block.content.view_entry }}</a>
            </div>
          </article>
        {{ end }}
      </div>
    </div>
    <aside aria-labelledby="news-title">
      <p class="portfolio-eyebrow">{{ $block.content.news_eyebrow }}</p>
      <h2 id="news-title">{{ $block.content.news_title }}</h2>
      <div class="news-list">
        {{ range first 3 $news.ByDate.Reverse }}
          <article class="news-row" data-reveal>
            <time datetime="{{ .Date.Format "2006-01-02" }}">{{ time.Format ":date_medium" .Date }}</time>
            <h3><a href="{{ .RelPermalink }}">{{ .Title }}</a></h3>
          </article>
        {{ end }}
      </div>
    </aside>
  </div>
</section>
```

- [ ] **Step 4: Create `portfolio-evidence/style.css`**

```css
.portfolio-evidence { background: rgb(6 8 16 / 56%); }
.portfolio-evidence__grid { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(280px, 0.7fr); gap: 1.25rem; }
.publication-list, .news-list { margin-top: 1.5rem; border: 1px solid rgb(179 192 211 / 12%); border-radius: 1rem; background: linear-gradient(145deg, rgb(20 25 35 / 94%), rgb(10 14 21 / 96%)); }
.publication-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 1.2rem; border-bottom: 1px solid rgb(179 192 211 / 10%); }
.publication-row:last-child, .news-row:last-child { border-bottom: 0; }
.publication-row h3, .news-row h3 { margin: 0; font-family: Georgia, "Times New Roman", serif; font-size: 1rem; line-height: 1.4; }
.publication-row h3 a, .news-row h3 a { color: #e7e5e1; text-decoration: none; }
.publication-row p, .news-row time { margin: 0.35rem 0 0; color: #858e9d; font-size: 0.78rem; }
.publication-row__actions { display: flex; gap: 0.5rem; }
.publication-row__actions a { padding: 0.45rem 0.65rem; color: #9eb7db; border: 1px solid #3b4a60; border-radius: 0.5rem; font-size: 0.78rem; text-decoration: none; white-space: nowrap; }
.news-row { padding: 1.2rem; border-bottom: 1px solid rgb(179 192 211 / 10%); }
@media (max-width: 800px) { .portfolio-evidence__grid { grid-template-columns: 1fr; } .publication-row { align-items: flex-start; flex-direction: column; } }
```

- [ ] **Step 5: Create the contact block and CSS**

Create `layouts/_partials/hbx/blocks/portfolio-contact/block.html`:

```go-html-template
{{ $block := . }}
<section id="contact" class="portfolio-contact" aria-labelledby="contact-title">
  <div class="portfolio-contact__inner" data-reveal>
    <p class="portfolio-eyebrow">{{ $block.content.eyebrow }}</p>
    <h2 id="contact-title">{{ $block.content.title }}</h2>
    <p>{{ $block.content.text }}</p>
    <div class="portfolio-contact__links">
      {{ range $block.content.links }}
        <a href="{{ .url }}"{{ if strings.HasPrefix .url "http" }} rel="noopener"{{ end }}>{{ .label }}</a>
      {{ end }}
    </div>
  </div>
</section>
```

Create `layouts/_partials/hbx/blocks/portfolio-contact/style.css`:

```css
.portfolio-contact { position: relative; padding: clamp(5rem, 10vw, 8rem) 1rem; border-top: 1px solid rgb(181 191 207 / 10%); background: radial-gradient(circle at 50% 0, rgb(82 111 168 / 16%), transparent 38%), rgb(4 6 12 / 88%); text-align: center; }
.portfolio-contact__inner { width: min(780px, 100%); margin-inline: auto; }
.portfolio-contact h2 { margin: 0; color: #f5f3ef; font-family: Georgia, "Times New Roman", serif; font-size: clamp(2.2rem, 5vw, 4rem); letter-spacing: -0.04em; }
.portfolio-contact p { color: #9ba5b4; line-height: 1.7; }
.portfolio-contact__links { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.65rem; margin-top: 1.5rem; }
.portfolio-contact__links a { padding: 0.65rem 0.9rem; color: #c6cfdb; border: 1px solid #384558; border-radius: 0.65rem; text-decoration: none; }
```

- [ ] **Step 6: Run tests**

```bash
python3 -m unittest tests.test_homepage_contract -v
```

Expected: `OK`.

- [ ] **Step 7: Commit**

```bash
git add layouts/_partials/hbx/blocks/portfolio-evidence layouts/_partials/hbx/blocks/portfolio-contact tests/test_homepage_contract.py
git commit -m "feat: add research evidence and contact blocks"
```

### Task 9: Compose the English and Italian Homepages and Navigation

**Files:**
- Modify: `content/_index.md`
- Modify: `content/_index.it.md`
- Modify: `config/_default/menus.yaml`
- Modify: `config/_default/languages.yaml`
- Modify: `config/_default/params.yaml`
- Modify: `tests/test_homepage_contract.py`

- [ ] **Step 1: Add failing homepage composition tests**

Add:

```python
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
```

- [ ] **Step 2: Run tests and verify they fail**

Run:

```bash
python3 -m unittest \
  tests.test_homepage_contract.HomepageContractTests.test_homepage_block_order_and_copy_are_synchronized \
  tests.test_homepage_contract.HomepageContractTests.test_homepage_selects_three_featured_projects -v
```

Expected: `FAIL` because the homepage still uses the old Blox blocks.

- [ ] **Step 3: Replace the English homepage sections**

Set the top-level homepage spacing to `0rem`, then replace the `sections:` value in `content/_index.md` with:

```yaml
design:
  spacing: '0rem'
```

Use these sections:

```yaml
sections:
  - block: portfolio-hero
    content:
      username: me
      eyebrow: Stefano Blando | AI Researcher and PhD Candidate
      headline: Understanding complex systems through *adaptive intelligence.*
      summary: My research lies at the intersection of artificial intelligence, agent-based modeling, and economics. I develop adaptive simulations, statistical verification methods, and practical tools for studying complex economic systems.
      primary:
        text: Explore my work
        url: '#research'
      secondary:
        text: Download CV
        url: /uploads/resume.pdf
      affiliations_label: Affiliated with
      portrait_alt: Portrait of Stefano Blando
      identity_focus: Adaptive multi-agent systems and economic networks
      location: Based in Pisa, Italy

  - block: research-pillars
    content:
      eyebrow: Research profile
      title: Three connected research pillars
      text: My work combines adaptive agents, statistical verification, and robust quantitative methods to study complex economic systems.
      items:
        - name: Adaptive Multi-Agent Systems
          icon: brain
          description: I study populations of learning, heuristic, and deliberative agents interacting over evolving economic networks.
        - name: Statistical Verification
          icon: network-wired
          description: I use convergence diagnostics and statistical model checking to make simulation evidence more reliable and reproducible.
        - name: Robust Quantitative Methods
          icon: chart-line
          description: I apply econometrics, robust statistics, and graph learning to systemic risk and financial decision problems.
      interest_groups:
        - name: Artificial Intelligence
          items: [Multi-Agent Systems, Reinforcement Learning, Graph Neural Networks]
        - name: Economics and Quantitative Methods
          items: [Agent-Based Modeling, Robust Statistics, Financial Econometrics]
        - name: Network Science and Complex Systems
          items: [Economic Networks, Systemic Risk, Statistical Model Checking]

  - block: education-timeline
    content:
      username: me
      eyebrow: Background
      title: Academic journey
      text: A multidisciplinary path from philosophy and governance to quantitative finance, artificial intelligence, and complex systems.
      present: present

  - block: featured-projects
    content:
      eyebrow: Selected builds
      title: Research translated into technology
      text: Three projects that connect research questions with working simulations, interfaces, and agentic systems.
      slugs:
        - risk-sentinel
        - island-model-smc
        - multi-agent-orchestration
      view_project: View project
      view_all: Explore all projects

  - block: portfolio-evidence
    content:
      publications_eyebrow: Selected publications
      publications_title: Research outputs
      news_eyebrow: Latest
      news_title: News and recognition
      view_pdf: View PDF
      view_entry: View entry

  - block: portfolio-contact
    content:
      eyebrow: Contact
      title: Let us discuss research, systems, or collaboration.
      text: I am based in Pisa and open to academic and technical collaborations in artificial intelligence, economic networks, and complex systems.
      links:
        - label: Email
          url: mailto:stefano.blando@santannapisa.it
        - label: GitHub
          url: https://github.com/stefano-blando
        - label: LinkedIn
          url: https://www.linkedin.com/in/stefano-blando/
        - label: Google Scholar
          url: https://scholar.google.com/citations?user=dNbRRG0AAAAJ
```

- [ ] **Step 4: Replace the Italian homepage sections**

Set `design.spacing` to `0rem` in `content/_index.it.md`, then use the identical block structure with `username: me-it` and these translated strings:

```yaml
sections:
  - block: portfolio-hero
    content:
      username: me-it
      eyebrow: Stefano Blando | Ricercatore AI e Dottorando
      headline: Comprendere i sistemi complessi attraverso l'*intelligenza adattiva.*
      summary: La mia ricerca si colloca all'intersezione tra intelligenza artificiale, modellazione agent-based ed economia. Sviluppo simulazioni adattive, metodi di verifica statistica e strumenti applicativi per studiare sistemi economici complessi.
      primary: {text: Esplora il mio lavoro, url: '#research'}
      secondary: {text: Scarica il CV, url: /uploads/resume.pdf}
      affiliations_label: Affiliazioni
      portrait_alt: Ritratto di Stefano Blando
      identity_focus: Sistemi multi-agente adattivi e reti economiche
      location: Pisa, Italia
  - block: research-pillars
    content:
      eyebrow: Profilo di ricerca
      title: Tre linee di ricerca connesse
      text: Il mio lavoro combina agenti adattivi, verifica statistica e metodi quantitativi robusti per studiare sistemi economici complessi.
      items:
        - {name: Sistemi Multi-Agente Adattivi, icon: brain, description: Studio popolazioni di agenti che apprendono, applicano euristiche e deliberano all'interno di reti economiche in evoluzione.}
        - {name: Verifica Statistica, icon: network-wired, description: Uso diagnostica di convergenza e statistical model checking per rendere le evidenze delle simulazioni più affidabili e riproducibili.}
        - {name: Metodi Quantitativi Robusti, icon: chart-line, description: Applico econometria, statistica robusta e graph learning a problemi di rischio sistemico e decisioni finanziarie.}
      interest_groups:
        - {name: Intelligenza Artificiale, items: [Sistemi Multi-Agente, Reinforcement Learning, Graph Neural Networks]}
        - {name: Economia e Metodi Quantitativi, items: [Agent-Based Modeling, Statistica Robusta, Econometria Finanziaria]}
        - {name: Network Science e Sistemi Complessi, items: [Reti Economiche, Rischio Sistemico, Statistical Model Checking]}
  - block: education-timeline
    content: {username: me-it, eyebrow: Formazione, title: Percorso accademico, text: Un percorso multidisciplinare dalla filosofia e dalla governance alla finanza quantitativa, all'intelligenza artificiale e ai sistemi complessi., present: presente}
  - block: featured-projects
    content:
      eyebrow: Progetti selezionati
      title: La ricerca tradotta in tecnologia
      text: Tre progetti che collegano domande di ricerca a simulazioni, interfacce e sistemi agentici funzionanti.
      slugs:
        - risk-sentinel
        - island-model-smc
        - multi-agent-orchestration
      view_project: Vedi progetto
      view_all: Esplora tutti i progetti
  - block: portfolio-evidence
    content: {publications_eyebrow: Pubblicazioni selezionate, publications_title: Risultati della ricerca, news_eyebrow: Aggiornamenti, news_title: News e riconoscimenti, view_pdf: Vedi PDF, view_entry: Vedi scheda}
  - block: portfolio-contact
    content:
      eyebrow: Contatti
      title: Parliamo di ricerca, sistemi o collaborazioni.
      text: Vivo a Pisa e sono disponibile per collaborazioni accademiche e tecniche su intelligenza artificiale, reti economiche e sistemi complessi.
      links:
        - {label: Email, url: 'mailto:stefano.blando@santannapisa.it'}
        - {label: GitHub, url: 'https://github.com/stefano-blando'}
        - {label: LinkedIn, url: 'https://www.linkedin.com/in/stefano-blando/'}
        - {label: Google Scholar, url: 'https://scholar.google.com/citations?user=dNbRRG0AAAAJ'}
```

- [ ] **Step 5: Update navigation**

Replace the English `main` list in `config/_default/menus.yaml` with:

```yaml
main:
  - {name: Research, url: '/#research', weight: 10}
  - {name: Publications, url: '/#publications', weight: 20}
  - {name: Projects, url: 'projects/', weight: 30}
  - {name: Experience, url: 'experience/', weight: 40}
  - {name: Contact, url: '/#contact', weight: 50}
```

Replace the Italian `menu.main` list in `config/_default/languages.yaml` with:

```yaml
menu:
  main:
    - {name: Ricerca, url: '/#research', weight: 10}
    - {name: Pubblicazioni, url: '/#publications', weight: 20}
    - {name: Progetti, url: 'projects/', weight: 30}
    - {name: Esperienza, url: 'experience/', weight: 40}
    - {name: Contatti, url: '/#contact', weight: 50}
```

- [ ] **Step 6: Run source and i18n tests**

Before running tests, update the existing `hugoblox.theme` values in `config/_default/params.yaml`:

```yaml
theme:
  mode: dark
  pack: default
  colors:
    primary: "#526FA8"
    secondary: "#879BB9"
    neutral: "#F5F3EF"
  surfaces:
    background: "#060810"
    foreground: "#F5F3EF"
    header:
      background: "rgba(6, 8, 16, 0.76)"
      foreground: "#F5F3EF"
    footer:
      background: "#060810"
      foreground: "#A5ADBA"
```

Run:

```bash
python3 -m unittest tests.test_homepage_contract -v
python3 scripts/check_i18n_sync.py
```

Expected: both succeed.

- [ ] **Step 7: Commit**

```bash
git add content/_index.md content/_index.it.md config/_default/menus.yaml config/_default/languages.yaml config/_default/params.yaml tests/test_homepage_contract.py
git commit -m "feat: compose bilingual premium portfolio homepage"
```

### Task 10: Add Restrained Progressive Interactions and Global Polish

**Files:**
- Create: `tests/network/interactions.test.mjs`
- Create: `assets/js/portfolio-interactions.js`
- Modify: `assets/css/custom.css`

- [ ] **Step 1: Write failing interaction math tests**

Create `tests/network/interactions.test.mjs`:

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import { getMagneticOffset } from '../../assets/js/portfolio-interactions.js';

test('magnetic offset is capped at three pixels', () => {
  assert.deepEqual(getMagneticOffset({ x: 100, y: 50, width: 100, height: 50 }), { x: 3, y: 3 });
  assert.deepEqual(getMagneticOffset({ x: 0, y: 0, width: 100, height: 50 }), { x: -3, y: -3 });
});

test('magnetic offset is centered at zero', () => {
  assert.deepEqual(getMagneticOffset({ x: 50, y: 25, width: 100, height: 50 }), { x: 0, y: 0 });
});
```

- [ ] **Step 2: Run the tests and verify failure**

Run:

```bash
node --test tests/network/interactions.test.mjs
```

Expected: `ERR_MODULE_NOT_FOUND`.

- [ ] **Step 3: Implement the interaction module**

Create `assets/js/portfolio-interactions.js`:

```javascript
export function getMagneticOffset({ x, y, width, height }) {
  const normalize = (value, size) => Math.max(-3, Math.min(3, ((value / size) - 0.5) * 6));
  return { x: normalize(x, width), y: normalize(y, height) };
}

function initializePortfolioInteractions() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduced) document.documentElement.classList.add('portfolio-motion');

  document.querySelectorAll('[data-pointer-glow]').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const bounds = card.getBoundingClientRect();
      card.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
      card.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
    }, { passive: true });
  });

  if (!reduced) {
    document.querySelectorAll('[data-magnetic]').forEach((button) => {
      button.addEventListener('pointermove', (event) => {
        const bounds = button.getBoundingClientRect();
        const offset = getMagneticOffset({
          x: event.clientX - bounds.left,
          y: event.clientY - bounds.top,
          width: bounds.width,
          height: bounds.height,
        });
        button.style.transform = `translate(${offset.x}px, ${offset.y}px)`;
      }, { passive: true });
      button.addEventListener('pointerleave', () => { button.style.transform = ''; });
    });
  }

  const revealItems = document.querySelectorAll('[data-reveal]');
  if (reduced || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('portfolio-reveal--visible'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('portfolio-reveal--visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
    revealItems.forEach((item) => observer.observe(item));
  }

  const header = document.getElementById('site-header');
  const updateHeader = () => header?.classList.toggle('portfolio-header--scrolled', window.scrollY > 24);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if ('IntersectionObserver' in window) {
    const sections = document.querySelectorAll('section[id]');
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        document.querySelectorAll('#site-header a[aria-current="location"]').forEach((link) => link.removeAttribute('aria-current'));
        const active = document.querySelector(`#site-header a[href$="#${entry.target.id}"]`);
        active?.setAttribute('aria-current', 'location');
      });
    }, { rootMargin: '-35% 0px -55%', threshold: 0 });
    sections.forEach((section) => sectionObserver.observe(section));
  }
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePortfolioInteractions, { once: true });
  } else {
    initializePortfolioInteractions();
  }
}
```

- [ ] **Step 4: Replace broad custom CSS with stable global primitives**

Replace `assets/css/custom.css` with:

```css
:root {
  --portfolio-bg: #060810;
  --portfolio-surface: #101621;
  --portfolio-text: #f5f3ef;
  --portfolio-muted: #a5adba;
  --portfolio-focus: #9eb7db;
}

html { scroll-behavior: smooth; }
body { background: radial-gradient(circle at 80% 10%, rgb(55 73 116 / 14%), transparent 28%), var(--portfolio-bg); color: var(--portfolio-text); }
main, .page-body { position: relative; z-index: 1; }
section[id] { scroll-margin-top: 5rem; }

.portfolio-section { position: relative; padding-block: clamp(4rem, 8vw, 7rem); }
.portfolio-section__inner { width: min(1180px, calc(100% - 2rem)); margin-inline: auto; }
.portfolio-section h2 { margin: 0; color: #eef0f3; font-size: clamp(2rem, 4vw, 3.2rem); letter-spacing: -0.04em; }
.portfolio-section__intro { max-width: 70ch; color: #9ba5b4; line-height: 1.7; }
.portfolio-eyebrow { margin: 0 0 1rem; color: #9eb7db; font-size: 0.78rem; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; }

::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #080b12; }
::-webkit-scrollbar-thumb { border-radius: 999px; background: #46566e; }
::-webkit-scrollbar-thumb:hover { background: #657fa8; }

#site-header { border-bottom: 1px solid rgb(181 191 207 / 8%); background: rgb(6 8 16 / 58%); backdrop-filter: blur(14px); transition: min-height 200ms ease, background-color 200ms ease; }
#site-header.portfolio-header--scrolled { background: rgb(6 8 16 / 90%); }
#site-header a { color: #c8cdd5; }
#site-header a:hover, #site-header a:focus-visible, #site-header a[aria-current="location"] { color: #f5f3ef; }
#site-header a[href$="#contact"] { padding: 0.45rem 0.7rem; border: 1px solid #424b5a; border-radius: 0.55rem; }

:where(a, button, summary):focus-visible { outline: 2px solid var(--portfolio-focus); outline-offset: 4px; }

.portfolio-motion [data-reveal] { opacity: 0; transform: translateY(20px); transition: opacity 650ms ease, transform 650ms ease; }
.portfolio-motion [data-reveal].portfolio-reveal--visible { opacity: 1; transform: none; }

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { scroll-behavior: auto !important; animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
  [data-reveal] { opacity: 1; transform: none; }
}
```

- [ ] **Step 5: Run tests**

```bash
node --test tests/network/*.test.mjs
python3 -m unittest tests.test_homepage_contract -v
```

Expected: all tests pass.

- [ ] **Step 6: Commit**

```bash
git add assets/js/portfolio-interactions.js assets/css/custom.css tests/network/interactions.test.mjs
git commit -m "feat: add restrained portfolio interactions"
```

### Task 11: Add a Post-Build Homepage Audit

**Files:**
- Create: `scripts/audit_built_homepage.py`
- Modify: `tests/test_homepage_contract.py`
- Modify: `package.json`

- [ ] **Step 1: Add a failing audit-script contract**

```python
    def test_built_homepage_audit_exists(self):
        audit = ROOT / "scripts/audit_built_homepage.py"
        self.assertTrue(audit.exists())
        source = audit.read_text(encoding="utf-8")
        for token in ("research-network-canvas", "cdn.jsdelivr.net", "tsparticles", "portfolio-hero"):
            self.assertIn(token, source)
```

- [ ] **Step 2: Run it and verify failure**

Run:

```bash
python3 -m unittest tests.test_homepage_contract.HomepageContractTests.test_built_homepage_audit_exists -v
```

Expected: `FAIL` because the audit does not exist.

- [ ] **Step 3: Create the build audit**

Create `scripts/audit_built_homepage.py`:

```python
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
    for required_id in ("research", "education", "projects", "publications", "contact"):
        if required_id not in facts.ids:
            failures.append(f"{path}: missing id {required_id}")
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
```

- [ ] **Step 4: Run source tests**

```bash
python3 -m unittest tests.test_homepage_contract -v
```

Expected: `OK`.

- [ ] **Step 5: Build and run the audit**

Run:

```bash
hugo --minify
python3 scripts/audit_built_homepage.py public
```

Expected:

```text
Homepage audit passed for English and Italian homepages
```

- [ ] **Step 6: Commit**

```bash
git add scripts/audit_built_homepage.py tests/test_homepage_contract.py package.json
git commit -m "test: audit generated portfolio homepages"
```

### Task 12: Verify Responsive Layout, Accessibility, and Performance

**Files:**
- Modify only if verification reveals a defect in files already listed above

- [ ] **Step 1: Run all automated checks**

```bash
corepack pnpm run test
python3 scripts/check_i18n_sync.py
hugo --minify
python3 scripts/audit_built_homepage.py public
git diff --check
```

Expected: every command exits `0` and the audit reports both languages passing.

- [ ] **Step 2: Serve the generated site**

Run in a persistent terminal:

```bash
python3 -m http.server 4173 --directory public
```

Expected: server listening on `http://127.0.0.1:4173`.

- [ ] **Step 3: Capture desktop and mobile screenshots**

Run with the server active:

```bash
firefox --headless --window-size 1440,1600 --screenshot /tmp/portfolio-home-desktop.png http://127.0.0.1:4173/en/
firefox --headless --window-size 390,1400 --screenshot /tmp/portfolio-home-mobile.png http://127.0.0.1:4173/en/
firefox --headless --window-size 1440,1600 --screenshot /tmp/portfolio-home-it.png http://127.0.0.1:4173/it/
```

Expected: three screenshots exist and show no horizontal overflow, clipped portrait, or low-contrast card text.

- [ ] **Step 4: Inspect screenshots**

Open each screenshot with the image viewer and verify:

- Portrait is visible and not covered by the identity card.
- Network is behind content and its edges remain connected.
- Research card icons are visible.
- Education is horizontal at 1440 pixels and vertical at 390 pixels.
- Featured Projects show exactly three items.
- Publications and News stack on mobile.
- Navbar does not obscure anchor headings.
- Italian strings fit without clipping.

- [ ] **Step 5: Verify reduced motion and keyboard behavior**

In Firefox DevTools or an equivalent browser session:

- Emulate `prefers-reduced-motion: reduce` and confirm the graph is static.
- Tab through navigation, buttons, project links, timeline summaries, publication actions, and contact links.
- Confirm every control has a visible focus ring.
- Open and close every education milestone using Enter and Space.
- Confirm the homepage remains usable with JavaScript disabled.

- [ ] **Step 6: Verify internal and external routes**

Check these routes in both languages:

```text
/en/#research
/en/#publications
/en/projects/
/en/experience/
/en/#contact
/it/#research
/it/#publications
/it/projects/
/it/experience/
/it/#contact
/uploads/resume.pdf
```

Expected: no 404 responses and anchor targets are visible below the sticky header.

- [ ] **Step 7: Confirm the final diff contains no generated output or mockups**

```bash
git status --short
git diff --stat HEAD~1
git ls-files .superpowers public resources
```

Expected: `.superpowers/`, `public/`, and `resources/` are not tracked.

- [ ] **Step 8: Final implementation commit if verification required fixes**

If Steps 1 through 7 required source changes, commit only those explicit files:

```bash
git add assets content config layouts scripts tests package.json .gitignore
git commit -m "fix: complete portfolio accessibility and responsive polish"
```

If no source changes were required, do not create an empty commit.

## Completion Criteria

Implementation is complete only when:

- All Node and Python tests pass.
- Hugo 0.154.5 Extended builds both languages successfully.
- The generated HTML audit passes.
- The old tsParticles markup and CDN dependency are absent.
- Exactly one network canvas exists on each homepage.
- Desktop and mobile screenshots match the approved dark, gradient, personal design.
- The portrait, timeline, icons, projects, publications, news, and contact block are readable and functional.
- Reduced motion, keyboard navigation, and no-JavaScript fallbacks work.
- `.superpowers/`, `public/`, and `resources/` remain untracked.
