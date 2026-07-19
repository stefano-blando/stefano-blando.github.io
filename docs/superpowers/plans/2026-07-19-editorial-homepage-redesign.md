# Editorial Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the homepage (EN + IT) as a calm 4-section editorial page — Hero with hero-scoped weighted network canvas, numbered-list Research, case-study Selected Work, simple Contact — per `docs/superpowers/specs/2026-07-19-editorial-homepage-redesign-design.md`.

**Architecture:** All rendering stays in the existing Hugo Blox block partials under `layouts/_partials/hbx/blocks/` (each block = `block.html` + `style.css`). Design tokens and fonts live in `assets/css/custom.css`. The network canvas becomes hero-scoped (absolute inside the hero section, no longer viewport-fixed) with an edge-weighted topology in `assets/js/research-network/`. Quality gates: `tests/test_homepage_contract.py`, `tests/network/*.test.mjs`, `scripts/audit_built_homepage.py`, `scripts/check_i18n_sync.py`.

**Tech Stack:** Hugo (Blox modules), Tailwind v4 (via theme; custom CSS in `assets/css/custom.css`), vanilla ES modules, Python unittest, node:test. Commands via `pnpm`.

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `static/fonts/fraunces-italic.woff2`, `static/fonts/instrument-sans-regular.woff2`, `static/fonts/instrument-sans-600.woff2` | Create | Self-hosted fonts |
| `assets/css/custom.css` | Modify | @font-face, design tokens, base styles, hero stagger animation |
| `assets/media/icons/social/{github,linkedin,google-scholar,email}.svg` | Create | Hero social icons |
| `layouts/_partials/hbx/blocks/portfolio-hero/block.html` + `style.css` | Modify | Hero rework (social under portrait, no identity card) |
| `assets/js/research-network/topology.js` | Modify | `createHeroTopology` (weighted anchors, depth, near-neighbor edges), new profile |
| `assets/js/research-network/renderer.js` | Modify | Hero-scoped sizing, per-node depth, viewport pause, reduced-motion static frame |
| `layouts/_partials/hbx/blocks/research-pillars/block.html` + `style.css` | Modify | Editorial numbered list |
| `layouts/_partials/hbx/blocks/featured-projects/block.html` + `style.css` | Modify | Horizontal case-study rows, section id `work` |
| `layouts/_partials/hbx/blocks/portfolio-contact/block.html` + `style.css` | Modify | Centered contact band |
| `content/_index.md`, `content/_index.it.md` | Modify | 4-section front matter (EN/IT parity) |
| `config/_default/menus.yaml` | Modify | Work anchor, Publications → `/publications/` |
| `tests/test_homepage_contract.py` | Modify | Updated contract |
| `tests/network/topology.test.mjs` | Modify | New topology/profile tests |
| `scripts/audit_built_homepage.py` | Modify | New required/forbidden ids |

Blocks `education-timeline` and `portfolio-evidence` stay in the repo but leave the homepage front matter.

---

### Task 1: Fonts and design tokens

**Files:**
- Create: `static/fonts/fraunces-italic.woff2`, `static/fonts/instrument-sans-regular.woff2`, `static/fonts/instrument-sans-600.woff2`
- Modify: `assets/css/custom.css`
- Test: `tests/test_homepage_contract.py`

- [ ] **Step 1: Write the failing test** — append to `tests/test_homepage_contract.py` (inside `HomepageContractTests`):

```python
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `python3 -m unittest tests.test_homepage_contract.HomepageContractTests.test_design_tokens_and_fonts_are_defined -v`
Expected: FAIL (`--portfolio-surface-2` missing).

- [ ] **Step 3: Download fonts** (google-webfonts-helper API, latin subset, woff2):

```bash
cd /tmp/claude-fonts-dl 2>/dev/null || mkdir -p /tmp/claude-fonts-dl && cd /tmp/claude-fonts-dl
curl -fL "https://gwfh.mranftl.com/api/fonts/fraunces?download=zip&subsets=latin&variants=italic&formats=woff2" -o fraunces.zip
curl -fL "https://gwfh.mranftl.com/api/fonts/instrument-sans?download=zip&subsets=latin&variants=regular,600&formats=woff2" -o instrument.zip
unzip -o fraunces.zip && unzip -o instrument.zip
mkdir -p /home/stefano/Scrivania/WEBSITE/static/fonts
cp fraunces-*-latin-italic.woff2 /home/stefano/Scrivania/WEBSITE/static/fonts/fraunces-italic.woff2
cp instrument-sans-*-latin-regular.woff2 /home/stefano/Scrivania/WEBSITE/static/fonts/instrument-sans-regular.woff2
cp instrument-sans-*-latin-600.woff2 /home/stefano/Scrivania/WEBSITE/static/fonts/instrument-sans-600.woff2
```

If the API is unreachable, download the same families from fonts.google.com manually; the CSS below already falls back to Georgia/system-ui so nothing else blocks.

- [ ] **Step 4: Replace the `:root` block and add fonts in `assets/css/custom.css`** — replace lines 1-7 (the current `:root { ... }`) with:

```css
@font-face {
  font-family: 'Fraunces';
  src: url('/fonts/fraunces-italic.woff2') format('woff2');
  font-style: italic;
  font-weight: 400;
  font-display: swap;
}
@font-face {
  font-family: 'Instrument Sans';
  src: url('/fonts/instrument-sans-regular.woff2') format('woff2');
  font-style: normal;
  font-weight: 400;
  font-display: swap;
}
@font-face {
  font-family: 'Instrument Sans';
  src: url('/fonts/instrument-sans-600.woff2') format('woff2');
  font-style: normal;
  font-weight: 600;
  font-display: swap;
}

:root {
  --portfolio-bg: #060810;
  --portfolio-surface: #101621;
  --portfolio-surface-2: #182338;
  --portfolio-text: #f5f3ef;
  --portfolio-muted: #a5adba;
  --portfolio-faint: #657fa8;
  --portfolio-accent: #9eb7db;
  --portfolio-line: rgba(158, 183, 219, 0.14);
  --portfolio-sans: 'Instrument Sans', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --portfolio-serif: 'Fraunces', Georgia, 'Times New Roman', serif;
}
```

Then update the shared base rules in the same file:

```css
body { font-family: var(--portfolio-sans); background: var(--portfolio-bg); color: var(--portfolio-text); }
.portfolio-section { position: relative; padding-block: clamp(4.5rem, 9vw, 8rem); }
.portfolio-section__inner { width: min(1120px, calc(100% - 2.5rem)); margin-inline: auto; }
.portfolio-section h2 { margin: 0; color: var(--portfolio-text); font-size: clamp(1.8rem, 3.5vw, 2.6rem); letter-spacing: -0.03em; font-weight: 600; }
.portfolio-section__intro { max-width: 62ch; margin-top: 1rem; color: var(--portfolio-muted); line-height: 1.7; }
.portfolio-eyebrow { margin: 0 0 1rem; color: var(--portfolio-accent); font-size: 0.78rem; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; }
.portfolio-serif-accent { font-family: var(--portfolio-serif); font-style: italic; font-weight: 400; color: var(--portfolio-accent); }
```

(Keep the existing radial body gradient, scrollbar, header, focus-visible, and `[data-reveal]` rules; only swap hard-coded colors for the matching tokens where they already exist: `#eef0f3`→`var(--portfolio-text)`, `#9ba5b4`→`var(--portfolio-muted)`, `#9eb7db`→`var(--portfolio-accent)`.)

- [ ] **Step 5: Run test to verify it passes**

Run: `python3 -m unittest tests.test_homepage_contract.HomepageContractTests.test_design_tokens_and_fonts_are_defined -v`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add static/fonts assets/css/custom.css tests/test_homepage_contract.py
git commit -m "feat: add self-hosted fonts and expanded design tokens"
```

---

### Task 2: Edge-weighted hero topology

**Files:**
- Modify: `assets/js/research-network/topology.js`
- Test: `tests/network/topology.test.mjs`

- [ ] **Step 1: Rewrite `tests/network/topology.test.mjs`** with the new contract:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createHeroTopology,
  getNeighborIds,
  getNetworkProfile,
  TEXT_ZONE,
} from '../../assets/js/research-network/topology.js';

test('profile scales density by viewport and honors save-data/reduced-motion', () => {
  assert.deepEqual(
    getNetworkProfile({ width: 1440, saveData: false, reducedMotion: false }),
    { nodeCount: 40, animate: true, pointer: true },
  );
  assert.deepEqual(
    getNetworkProfile({ width: 1024, saveData: false, reducedMotion: false }),
    { nodeCount: 28, animate: true, pointer: true },
  );
  assert.deepEqual(
    getNetworkProfile({ width: 600, saveData: false, reducedMotion: false }),
    { nodeCount: 18, animate: true, pointer: false },
  );
  assert.deepEqual(
    getNetworkProfile({ width: 1440, saveData: true, reducedMotion: false }),
    { nodeCount: 18, animate: true, pointer: false },
  );
  assert.deepEqual(
    getNetworkProfile({ width: 1440, saveData: false, reducedMotion: true }),
    { nodeCount: 40, animate: false, pointer: false },
  );
});

test('hero topology respects node count, depth ranges, and edge validity', () => {
  const graph = createHeroTopology({ nodeCount: 40, seed: 11 });
  assert.equal(graph.nodes.length, 40);

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
    assert.ok(node.radius >= 1.5 && node.radius <= 5, `radius ${node.radius}`);
    assert.ok(node.opacity >= 0.3 && node.opacity <= 0.9, `opacity ${node.opacity}`);
    assert.ok(node.anchorX >= 0 && node.anchorX <= 1);
    assert.ok(node.anchorY >= 0 && node.anchorY <= 1);
  }

  const bigger = graph.nodes.filter((n) => n.radius > 3.5);
  const smaller = graph.nodes.filter((n) => n.radius <= 3.5);
  const avg = (nodes) => nodes.reduce((sum, n) => sum + n.opacity, 0) / nodes.length;
  assert.ok(avg(bigger) > avg(smaller), 'opacity correlates with radius');
});

test('edges only connect near neighbors', () => {
  const graph = createHeroTopology({ nodeCount: 40, seed: 3 });
  const byId = new Map(graph.nodes.map((node) => [node.id, node]));
  for (const edge of graph.edges) {
    const a = byId.get(edge.source);
    const b = byId.get(edge.target);
    const distance = Math.hypot(a.anchorX - b.anchorX, a.anchorY - b.anchorY);
    assert.ok(distance <= 0.3, `edge ${edge.source}-${edge.target} spans ${distance}`);
  }
});

test('anchors avoid the headline text zone', () => {
  const graph = createHeroTopology({ nodeCount: 40, seed: 7 });
  const inTextZone = graph.nodes.filter(
    (node) =>
      node.anchorX >= TEXT_ZONE.x0 && node.anchorX <= TEXT_ZONE.x1 &&
      node.anchorY >= TEXT_ZONE.y0 && node.anchorY <= TEXT_ZONE.y1,
  );
  assert.ok(
    inTextZone.length <= graph.nodes.length * 0.15,
    `${inTextZone.length} of ${graph.nodes.length} nodes behind text`,
  );
});

test('returns the immediate neighborhood including the selected node', () => {
  const graph = createHeroTopology({ nodeCount: 28, seed: 5 });
  const first = graph.nodes[0].id;
  const neighbors = getNeighborIds(graph, first);
  assert.ok(neighbors.has(first));
  assert.ok(neighbors.size > 1);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm run test:network`
Expected: FAIL (`createHeroTopology` not exported).

- [ ] **Step 3: Rewrite `assets/js/research-network/topology.js`** (keep `createRandom` and `getNeighborIds`; drop `createModularTopology` and `distributeCount`):

```js
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

// Normalized hero-section coordinates covered by headline/summary/CTAs.
export const TEXT_ZONE = { x0: 0.03, x1: 0.6, y0: 0.16, y1: 0.8 };

export function getNetworkProfile({ width, saveData, reducedMotion }) {
  const compact = width < 768 || saveData;
  const nodeCount = compact ? 18 : width < 1280 ? 28 : 40;
  return {
    nodeCount,
    animate: !reducedMotion,
    pointer: !compact && !reducedMotion,
  };
}

function inTextZone(x, y) {
  return x >= TEXT_ZONE.x0 && x <= TEXT_ZONE.x1 && y >= TEXT_ZONE.y0 && y <= TEXT_ZONE.y1;
}

function sampleAnchor(random) {
  // Rejection sampling: keep at most ~1 in 8 candidates that fall behind the text.
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const x = random();
    const y = random();
    if (!inTextZone(x, y) || random() < 0.125) return { x, y };
  }
  return { x: 0.65 + random() * 0.35, y: random() };
}

export function createHeroTopology({ nodeCount = 40, seed = 20260719 } = {}) {
  const random = createRandom(seed);
  const nodes = [];
  for (let index = 0; index < nodeCount; index += 1) {
    const { x, y } = sampleAnchor(random);
    const radius = 1.5 + random() * 3.5;
    nodes.push({
      id: `n${index}`,
      anchorX: x,
      anchorY: y,
      x,
      y,
      vx: 0,
      vy: 0,
      radius,
      opacity: 0.3 + ((radius - 1.5) / 3.5) * 0.6,
    });
  }

  const edges = [];
  const edgeKeys = new Set();
  const addEdge = (source, target) => {
    const key = [source, target].sort().join(':');
    if (source === target || edgeKeys.has(key)) return;
    edgeKeys.add(key);
    edges.push({ source, target });
  };

  for (const node of nodes) {
    const distances = nodes
      .filter((other) => other.id !== node.id)
      .map((other) => ({
        id: other.id,
        distance: Math.hypot(other.anchorX - node.anchorX, other.anchorY - node.anchorY),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2)
      .filter((entry) => entry.distance <= 0.3);
    for (const entry of distances) addEdge(node.id, entry.id);
  }

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

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm run test:network`
Expected: `topology.test.mjs` PASS. (`interactions.test.mjs` untouched, still PASS.)

- [ ] **Step 5: Commit**

```bash
git add assets/js/research-network/topology.js tests/network/topology.test.mjs
git commit -m "feat: edge-weighted hero network topology with depth"
```

---

### Task 3: Hero-scoped renderer

**Files:**
- Modify: `assets/js/research-network/renderer.js`

No DOM unit-test harness exists for the renderer (canvas + observers); it is covered by the built-page audit and manual check in Task 8. Keep the public interface (`constructor(canvas, profile)`, `start()`, `destroy()`) unchanged so `index.js` needs no edits.

- [ ] **Step 1: Rewrite `assets/js/research-network/renderer.js`:**

```js
import { createHeroTopology, getNeighborIds } from './topology.js';

export class ResearchNetworkRenderer {
  constructor(canvas, profile) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d', { alpha: true });
    this.profile = profile;
    this.graph = createHeroTopology({ nodeCount: profile.nodeCount });
    this.nodesById = new Map(this.graph.nodes.map((node) => [node.id, node]));
    this.pointer = null;
    this.highlighted = new Set();
    this.frameId = null;
    this.hidden = document.hidden;
    this.inView = true;
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
      this.canvas.parentElement.addEventListener('pointermove', this.onPointerMove, { passive: true });
      this.canvas.parentElement.addEventListener('pointerleave', this.onPointerLeave, { passive: true });
    }
    if ('IntersectionObserver' in window) {
      this.viewObserver = new IntersectionObserver((entries) => {
        this.inView = entries.some((entry) => entry.isIntersecting);
        this.requestFrame();
      });
      this.viewObserver.observe(this.canvas);
    }
    this.draw();
    this.requestFrame();
  }

  requestFrame() {
    if (this.profile.animate && !this.hidden && this.inView && this.frameId === null) {
      this.frameId = requestAnimationFrame(this.frame);
    }
  }

  resize() {
    const host = this.canvas.parentElement.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    this.width = host.width;
    this.height = host.height;
    this.canvas.width = Math.round(this.width * ratio);
    this.canvas.height = Math.round(this.height * ratio);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.context.setTransform(ratio, 0, 0, ratio, 0, 0);
    this.draw();
  }

  onPointerMove(event) {
    const bounds = this.canvas.getBoundingClientRect();
    this.pointer = {
      x: (event.clientX - bounds.left) / this.width,
      y: (event.clientY - bounds.top) / this.height,
    };
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
    this.requestFrame();
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
      const alpha = active ? 0.55 : Math.min(source.opacity, target.opacity) * 0.35;
      this.context.beginPath();
      this.context.moveTo(source.x * this.width, source.y * this.height);
      this.context.lineTo(target.x * this.width, target.y * this.height);
      this.context.strokeStyle = active
        ? `rgba(146, 190, 232, ${alpha})`
        : `rgba(126, 151, 184, ${alpha})`;
      this.context.lineWidth = active ? 1.2 : 0.8;
      this.context.stroke();
    }
    for (const node of this.graph.nodes) {
      const active = this.highlighted.has(node.id);
      this.context.beginPath();
      this.context.arc(
        node.x * this.width,
        node.y * this.height,
        node.radius + (active ? 1 : 0),
        0,
        Math.PI * 2,
      );
      this.context.fillStyle = active
        ? 'rgba(181, 210, 239, 0.95)'
        : `rgba(126, 158, 199, ${node.opacity})`;
      this.context.fill();
    }
  }

  frame() {
    this.frameId = null;
    if (this.hidden || !this.inView) return;
    this.update();
    this.draw();
    this.frameId = requestAnimationFrame(this.frame);
  }

  destroy() {
    if (this.frameId !== null) cancelAnimationFrame(this.frameId);
    if (this.viewObserver) this.viewObserver.disconnect();
    window.removeEventListener('resize', this.resize);
    this.canvas.parentElement.removeEventListener('pointermove', this.onPointerMove);
    this.canvas.parentElement.removeEventListener('pointerleave', this.onPointerLeave);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
  }
}
```

Notes: with `animate: false` (reduced motion) `start()` still calls `draw()` once — that is the static frame required by the spec. Pointer listeners move to the hero element because the canvas is `pointer-events: none`.

- [ ] **Step 2: Verify the module still parses and tests pass**

Run: `pnpm run test:network`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add assets/js/research-network/renderer.js
git commit -m "feat: hero-scoped network renderer with depth and viewport pause"
```

---

### Task 4: Hero block rework

**Files:**
- Create: `assets/media/icons/social/github.svg`, `linkedin.svg`, `google-scholar.svg`, `email.svg`
- Modify: `layouts/_partials/hbx/blocks/portfolio-hero/block.html`, `layouts/_partials/hbx/blocks/portfolio-hero/style.css`, `assets/css/custom.css` (stagger), `content/_index.md`, `content/_index.it.md` (hero section only)
- Test: `tests/test_homepage_contract.py`

- [ ] **Step 1: Update the hero contract test** — in `tests/test_homepage_contract.py` replace `test_personal_hero_uses_author_data_and_local_portrait` with:

```python
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
```

- [ ] **Step 2: Run it to make sure it fails**

Run: `python3 -m unittest tests.test_homepage_contract.HomepageContractTests.test_personal_hero_uses_author_data_and_local_portrait -v`
Expected: FAIL (`portfolio-hero__social` missing).

- [ ] **Step 3: Create the four social SVGs** (24×24, `currentColor`, `mkdir -p assets/media/icons/social` first):

`assets/media/icons/social/github.svg`
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.7-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.94.85.09-.67.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05a9.36 9.36 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.25 10.25 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z"/></svg>
```

`assets/media/icons/social/linkedin.svg`
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5A2.49 2.49 0 0 1 2.5 6a2.5 2.5 0 1 1 2.48-2.5ZM.5 8.25h4V23.5h-4V8.25Zm7.5 0h3.83v2.08h.05c.53-1 1.84-2.08 3.79-2.08 4.05 0 4.8 2.67 4.8 6.15v9.1h-4v-8.07c0-1.92-.03-4.4-2.68-4.4-2.68 0-3.09 2.1-3.09 4.26v8.21H8V8.25Z"/></svg>
```

`assets/media/icons/social/google-scholar.svg`
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2 1 9l4.02 2.56A6.98 6.98 0 0 1 12 8.5c2.93 0 5.44 1.8 6.48 4.35L23 9.79V15h-1.5v-3.94l-2.6 1.66a7 7 0 1 1-13.28-.4L1 9.9 12 2Zm0 8a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z"/></svg>
```

`assets/media/icons/social/email.svg`
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6 8.5-6"/></svg>
```

- [ ] **Step 4: Rewrite `layouts/_partials/hbx/blocks/portfolio-hero/block.html`:**

```html
{{ $block := .wcBlock }}
{{ $username := $block.content.username | default "me" }}
{{ $author := index site.Data.authors $username }}
{{ $portraitPath := printf "media/authors/%s.png" $username }}
{{ $portrait := resources.Get $portraitPath }}

<section id="home" class="portfolio-hero" aria-labelledby="portfolio-hero-title">
  <canvas id="research-network-canvas" class="research-network-canvas" aria-hidden="true"></canvas>
  <div class="portfolio-hero__inner">
    <div class="portfolio-hero__copy">
      <p class="portfolio-eyebrow" data-stagger>{{ $block.content.eyebrow }}</p>
      <h1 id="portfolio-hero-title" data-stagger>{{ $block.content.headline | markdownify }}</h1>
      <div class="portfolio-hero__summary" data-stagger>{{ $block.content.summary | markdownify }}</div>
      <div class="portfolio-actions" data-stagger>
        <a class="portfolio-button portfolio-button--primary" href="{{ $block.content.primary.url }}">{{ $block.content.primary.text }}</a>
        <a class="portfolio-button portfolio-button--secondary" href="{{ $block.content.secondary.url }}">{{ $block.content.secondary.text }}</a>
      </div>
    </div>

    <div class="portfolio-hero__portrait-col" data-stagger>
      <div class="portfolio-portrait">
        {{ with $portrait }}
          {{ $image := .Fill "520x520 webp q90 Center" }}
          <img src="{{ $image.RelPermalink }}" width="{{ $image.Width }}" height="{{ $image.Height }}" alt="{{ $block.content.portrait_alt }}" fetchpriority="high">
        {{ else }}
          <span class="portfolio-portrait__fallback" aria-label="{{ $author.name.display }}">SB</span>
        {{ end }}
      </div>
      <ul class="portfolio-hero__social" aria-label="{{ $block.content.social_label }}">
        {{ range $author.links }}
          {{ $slug := "email" }}
          {{ if in .url "github" }}{{ $slug = "github" }}{{ else if in .url "linkedin" }}{{ $slug = "linkedin" }}{{ else if in .url "scholar" }}{{ $slug = "google-scholar" }}{{ end }}
          {{ $icon := resources.Get (printf "media/icons/social/%s.svg" $slug) }}
          <li>
            <a href="{{ .url }}"{{ if strings.HasPrefix .url "http" }} rel="noopener"{{ end }} aria-label="{{ .label | default $slug }}">
              {{ with $icon }}{{ .Content | safeHTML }}{{ end }}
            </a>
          </li>
        {{ end }}
      </ul>
      {{ range $author.links }}
        {{ if strings.HasPrefix .url "mailto:" }}
          <a class="portfolio-hero__email" href="{{ .url }}">{{ strings.TrimPrefix "mailto:" .url }}</a>
        {{ end }}
      {{ end }}
    </div>
  </div>
</section>
```

- [ ] **Step 5: Rewrite `layouts/_partials/hbx/blocks/portfolio-hero/style.css`:**

```css
.portfolio-hero {
  position: relative;
  overflow: hidden;
  min-height: min(820px, 92vh);
  background: radial-gradient(ellipse at 75% 20%, rgb(55 73 116 / 30%), transparent 55%);
}

.research-network-canvas {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.8;
}

.portfolio-hero__inner {
  position: relative;
  z-index: 1;
  width: min(1120px, calc(100% - 2.5rem));
  min-height: inherit;
  margin-inline: auto;
  padding-block: clamp(5rem, 10vw, 8rem);
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(240px, 1fr);
  gap: clamp(2rem, 6vw, 5rem);
  align-items: center;
}

.portfolio-hero h1 {
  max-width: 18ch;
  margin: 0;
  color: var(--portfolio-text);
  font-size: clamp(2.4rem, 5vw, 3.6rem);
  font-weight: 600;
  line-height: 1.12;
  letter-spacing: -0.03em;
}

.portfolio-hero h1 em {
  font-family: var(--portfolio-serif);
  font-style: italic;
  font-weight: 400;
  color: var(--portfolio-accent);
}

.portfolio-hero__summary {
  max-width: 55ch;
  margin-top: 1.4rem;
  color: var(--portfolio-muted);
  font-size: clamp(1rem, 1.3vw, 1.1rem);
  line-height: 1.7;
}

.portfolio-actions { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1.9rem; }
.portfolio-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
  padding: 0.7rem 1.3rem;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease;
}
.portfolio-button--primary { color: #0b1017; background: var(--portfolio-accent); }
.portfolio-button--primary:hover { transform: translateY(-1px); box-shadow: 0 10px 28px rgb(158 183 219 / 22%); }
.portfolio-button--secondary { color: #c8cdd5; border: 1px solid #3a414f; background: rgb(16 22 33 / 65%); }
.portfolio-button--secondary:hover { border-color: var(--portfolio-faint); }

.portfolio-hero__portrait-col { display: flex; flex-direction: column; align-items: center; gap: 1rem; justify-self: end; }
.portfolio-portrait {
  width: min(100%, 260px);
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 50%;
  border: 2px solid rgb(158 183 219 / 40%);
  background: var(--portfolio-surface);
  box-shadow: 0 25px 65px rgb(0 0 0 / 42%);
}
.portfolio-portrait img { width: 100%; height: 100%; object-fit: cover; object-position: center 20%; filter: saturate(0.92) contrast(1.02); }
.portfolio-portrait__fallback { display: grid; width: 100%; height: 100%; place-items: center; color: var(--portfolio-accent); font-size: 3.5rem; }

.portfolio-hero__social { display: flex; gap: 0.7rem; margin: 0; padding: 0; list-style: none; }
.portfolio-hero__social a {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: 1px solid #3a414f;
  border-radius: 50%;
  color: #c8cdd5;
  transition: color 200ms ease, border-color 200ms ease, transform 200ms ease;
}
.portfolio-hero__social a:hover { color: var(--portfolio-text); border-color: var(--portfolio-accent); transform: translateY(-2px); }
.portfolio-hero__social svg { width: 18px; height: 18px; }
.portfolio-hero__email { color: var(--portfolio-muted); font-size: 0.85rem; text-decoration: none; }
.portfolio-hero__email:hover { color: var(--portfolio-accent); }

@media (max-width: 800px) {
  .portfolio-hero__inner { grid-template-columns: 1fr; padding-top: 5.5rem; }
  .portfolio-hero__portrait-col { justify-self: center; }
}
```

- [ ] **Step 6: Add the stagger animation to `assets/css/custom.css`** (below the `[data-reveal]` rules):

```css
.portfolio-motion .portfolio-hero [data-stagger] {
  opacity: 0;
  transform: translateY(16px);
  animation: portfolio-hero-in 600ms ease forwards;
}
.portfolio-motion .portfolio-hero [data-stagger]:nth-child(1) { animation-delay: 60ms; }
.portfolio-motion .portfolio-hero [data-stagger]:nth-child(2) { animation-delay: 160ms; }
.portfolio-motion .portfolio-hero [data-stagger]:nth-child(3) { animation-delay: 260ms; }
.portfolio-motion .portfolio-hero [data-stagger]:nth-child(4) { animation-delay: 360ms; }
.portfolio-motion .portfolio-hero .portfolio-hero__portrait-col[data-stagger] { animation-delay: 300ms; }

@keyframes portfolio-hero-in {
  to { opacity: 1; transform: none; }
}
```

(`.portfolio-motion` is only added when the user does not prefer reduced motion — `portfolio-interactions.js` already handles that; the existing `prefers-reduced-motion` block in `custom.css` keeps everything visible.)

- [ ] **Step 7: Update hero front matter in `content/_index.md`** — replace the `portfolio-hero` section content with:

```yaml
  - block: portfolio-hero
    content:
      username: me
      eyebrow: Stefano Blando | AI Researcher and PhD Candidate
      headline: Understanding complex systems through *adaptive intelligence.*
      summary: My research lies at the intersection of artificial intelligence, agent-based modeling, and economics. I develop adaptive simulations, statistical verification methods, and practical tools for studying complex economic systems.
      primary:
        text: Explore my work
        url: '#work'
      secondary:
        text: Download CV
        url: /uploads/resume.pdf
      portrait_alt: Portrait of Stefano Blando
      social_label: Social profiles
```

And in `content/_index.it.md`:

```yaml
  - block: portfolio-hero
    content:
      username: me-it
      eyebrow: Stefano Blando | Ricercatore AI e Dottorando
      headline: Comprendere i sistemi complessi attraverso l'*intelligenza adattiva.*
      summary: La mia ricerca si colloca all'intersezione tra intelligenza artificiale, modellazione agent-based ed economia. Sviluppo simulazioni adattive, metodi di verifica statistica e strumenti applicativi per studiare sistemi economici complessi.
      primary: {text: Esplora il mio lavoro, url: '#work'}
      secondary: {text: Scarica il CV, url: /uploads/resume.pdf}
      portrait_alt: Ritratto di Stefano Blando
      social_label: Profili social
```

(Removed keys: `affiliations_label`, `identity_focus`, `location` — the identity card and affiliations row leave the hero per spec.)

- [ ] **Step 8: Run tests**

Run: `python3 -m unittest tests.test_homepage_contract -v`
Expected: hero test PASS; `test_homepage_block_order_and_copy_are_synchronized` still PASS (block list unchanged so far).

- [ ] **Step 9: Commit**

```bash
git add layouts/_partials/hbx/blocks/portfolio-hero assets/media/icons/social assets/css/custom.css content/_index.md content/_index.it.md tests/test_homepage_contract.py
git commit -m "feat: editorial hero with social row and staggered load"
```

---

### Task 5: Research section as editorial numbered list

**Files:**
- Modify: `layouts/_partials/hbx/blocks/research-pillars/block.html`, `layouts/_partials/hbx/blocks/research-pillars/style.css`, `content/_index.md`, `content/_index.it.md` (research section only)
- Test: `tests/test_homepage_contract.py`

- [ ] **Step 1: Replace `test_research_pillars_render_local_svg_assets`** in `tests/test_homepage_contract.py` with:

```python
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
```

- [ ] **Step 2: Run it to make sure it fails**

Run: `python3 -m unittest tests.test_homepage_contract.HomepageContractTests.test_research_pillars_render_editorial_numbered_list -v`
Expected: FAIL.

- [ ] **Step 3: Rewrite `layouts/_partials/hbx/blocks/research-pillars/block.html`:**

```html
{{ $block := .wcBlock }}
<section id="research" class="research-list portfolio-section" aria-labelledby="research-title">
  <div class="portfolio-section__inner">
    <p class="portfolio-eyebrow">{{ $block.content.eyebrow }}</p>
    <h2 id="research-title">{{ $block.content.title }}</h2>
    <p class="portfolio-section__intro">{{ $block.content.text }}</p>
    <ol class="research-list__items">
      {{ range $index, $item := $block.content.items }}
        <li class="research-list__row" data-reveal>
          <span class="research-list__numeral" aria-hidden="true">{{ printf "%02d" (add $index 1) }}</span>
          <div class="research-list__body">
            <h3>{{ $item.name }}</h3>
            <p>{{ $item.description }}</p>
          </div>
          <p class="research-list__topics">{{ delimit $item.topics " · " }}</p>
        </li>
      {{ end }}
    </ol>
  </div>
</section>
```

- [ ] **Step 4: Rewrite `layouts/_partials/hbx/blocks/research-pillars/style.css`:**

```css
.research-list__items {
  margin: 2.5rem 0 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--portfolio-line);
}

.research-list__row {
  display: grid;
  grid-template-columns: 3.5rem minmax(0, 1fr) 200px;
  gap: 1.5rem;
  padding: 1.75rem 0.75rem;
  border-bottom: 1px solid var(--portfolio-line);
  border-radius: 8px;
  transition: background-color 250ms ease;
}
.research-list__row:hover { background: var(--portfolio-surface); }

.research-list__numeral {
  font-family: var(--portfolio-serif);
  font-style: italic;
  font-size: 1.4rem;
  color: var(--portfolio-faint);
  line-height: 1.3;
}

.research-list__body h3 { margin: 0; color: var(--portfolio-text); font-size: 1.15rem; font-weight: 600; }
.research-list__body p { margin: 0.5rem 0 0; max-width: 58ch; color: var(--portfolio-muted); line-height: 1.7; }

.research-list__topics {
  margin: 0.3rem 0 0;
  color: var(--portfolio-faint);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  line-height: 1.7;
}

@media (max-width: 800px) {
  .research-list__row { grid-template-columns: 2.5rem minmax(0, 1fr); }
  .research-list__topics { grid-column: 2; }
}
```

- [ ] **Step 5: Replace the `research-pillars` front matter** in `content/_index.md`:

```yaml
  - block: research-pillars
    content:
      eyebrow: Research profile
      title: Three connected research pillars
      text: My work combines adaptive agents, statistical verification, and robust quantitative methods to study complex economic systems, from simulation design to empirical validation.
      items:
        - name: Adaptive Multi-Agent Systems
          description: I study populations of learning, heuristic, and deliberative agents interacting over evolving economic networks, studying how local adaptation shapes aggregate dynamics.
          topics: [Multi-Agent Systems, Reinforcement Learning, Graph Neural Networks]
        - name: Statistical Verification
          description: I use convergence diagnostics and statistical model checking to make simulation evidence more reliable and reproducible.
          topics: [Statistical Model Checking, Agent-Based Modeling, Reproducibility]
        - name: Robust Quantitative Methods
          description: I apply econometrics, robust statistics, and graph learning to systemic risk and financial decision problems.
          topics: [Econometrics, Systemic Risk, Economic Networks]
```

And in `content/_index.it.md`:

```yaml
  - block: research-pillars
    content:
      eyebrow: Profilo di ricerca
      title: Tre linee di ricerca connesse
      text: Il mio lavoro combina agenti adattivi, verifica statistica e metodi quantitativi robusti per studiare sistemi economici complessi, dal disegno delle simulazioni alla validazione empirica.
      items:
        - name: Sistemi Multi-Agente Adattivi
          description: Studio popolazioni di agenti che apprendono, applicano euristiche e deliberano all'interno di reti economiche in evoluzione, osservando come l'adattamento locale plasma le dinamiche aggregate.
          topics: [Sistemi Multi-Agente, Reinforcement Learning, Graph Neural Networks]
        - name: Verifica Statistica
          description: Uso diagnostica di convergenza e statistical model checking per rendere le evidenze delle simulazioni più affidabili e riproducibili.
          topics: [Statistical Model Checking, Agent-Based Modeling, Riproducibilità]
        - name: Metodi Quantitativi Robusti
          description: Applico econometria, statistica robusta e graph learning a problemi di rischio sistemico e decisioni finanziarie.
          topics: [Econometria, Rischio Sistemico, Reti Economiche]
```

- [ ] **Step 6: Run tests**

Run: `python3 -m unittest tests.test_homepage_contract -v`
Expected: research test PASS, and `test_homepage_block_order_and_copy_are_synchronized` stays green (the copy above deliberately contains no em dashes, which are forbidden in homepage sources).

- [ ] **Step 7: Commit**

```bash
git add layouts/_partials/hbx/blocks/research-pillars content/_index.md content/_index.it.md tests/test_homepage_contract.py
git commit -m "feat: research pillars as editorial numbered list"
```

---

### Task 6: Selected Work as case-study rows

**Files:**
- Modify: `layouts/_partials/hbx/blocks/featured-projects/block.html`, `layouts/_partials/hbx/blocks/featured-projects/style.css`, `content/_index.md`, `content/_index.it.md` (featured-projects section only)
- Test: `tests/test_homepage_contract.py`

- [ ] **Step 1: Replace `test_featured_projects_are_explicit_and_limited_to_three`** with:

```python
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
```

- [ ] **Step 2: Run it to make sure it fails**

Run: `python3 -m unittest tests.test_homepage_contract.HomepageContractTests.test_featured_projects_are_case_study_rows -v`
Expected: FAIL.

- [ ] **Step 3: Rewrite `layouts/_partials/hbx/blocks/featured-projects/block.html`:**

```html
{{ $block := .wcBlock }}
<section id="work" class="featured-cases portfolio-section" aria-labelledby="work-title">
  <div class="portfolio-section__inner">
    <p class="portfolio-eyebrow">{{ $block.content.eyebrow }}</p>
    <h2 id="work-title">{{ $block.content.title }}</h2>
    <p class="portfolio-section__intro">{{ $block.content.text }}</p>
    <div class="featured-cases__list">
      {{ with $block.content.slugs }}
        {{ range $slug := first 3 . }}
          {{ $project := site.GetPage (printf "/projects/%s" $slug) }}
          {{ with $project }}
            {{ $image := .Resources.GetMatch "featured.*" }}
            <article class="featured-case" data-reveal>
              <a class="featured-case__media" href="{{ .RelPermalink }}" aria-label="{{ .Title }}" tabindex="-1">
                {{ with $image }}
                  {{ $thumb := .Fill "640x400 webp q88 Center" }}
                  <img src="{{ $thumb.RelPermalink }}" width="{{ $thumb.Width }}" height="{{ $thumb.Height }}" alt="" loading="lazy">
                {{ else }}
                  <span class="featured-case__placeholder" aria-hidden="true"></span>
                {{ end }}
              </a>
              <div class="featured-case__body">
                <p class="featured-case__meta">{{ delimit (first 2 .Params.tags) " · " }}</p>
                <h3><a href="{{ .RelPermalink }}">{{ .Title }}</a></h3>
                <p class="featured-case__summary">{{ .Params.summary }}</p>
                <div class="featured-case__links">
                  <a class="featured-case__link featured-case__link--primary" href="{{ .RelPermalink }}">{{ $block.content.view_project }}</a>
                  {{ range first 2 .Params.links }}
                    <a class="featured-case__link" href="{{ .url }}" rel="noopener">{{ .name }}</a>
                  {{ end }}
                </div>
              </div>
            </article>
          {{ end }}
        {{ end }}
      {{ end }}
    </div>
    <a class="portfolio-text-link" href="{{ relLangURL "projects/" }}">{{ $block.content.view_all }}</a>
  </div>
</section>
```

- [ ] **Step 4: Rewrite `layouts/_partials/hbx/blocks/featured-projects/style.css`:**

```css
.featured-cases__list { display: flex; flex-direction: column; gap: 1.25rem; margin-top: 2.5rem; }

.featured-case {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  gap: 1.5rem;
  padding: 1.25rem;
  background: var(--portfolio-surface);
  border: 1px solid var(--portfolio-line);
  border-radius: 12px;
  transition: border-color 250ms ease;
}
.featured-case:hover { border-color: rgb(158 183 219 / 35%); }

.featured-case__media {
  display: block;
  overflow: hidden;
  aspect-ratio: 16 / 10;
  border-radius: 8px;
  background: radial-gradient(circle at 60% 40%, var(--portfolio-surface-2), var(--portfolio-surface));
}
.featured-case__media img { width: 100%; height: 100%; object-fit: cover; transition: transform 250ms ease; }
.featured-case:hover .featured-case__media img { transform: scale(1.02); }
.featured-case__placeholder { display: block; width: 100%; height: 100%; }

.featured-case__meta {
  margin: 0 0 0.4rem;
  color: var(--portfolio-faint);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.featured-case__body h3 { margin: 0; font-size: 1.2rem; font-weight: 600; }
.featured-case__body h3 a { color: var(--portfolio-text); text-decoration: none; }
.featured-case__body h3 a:hover { color: var(--portfolio-accent); }
.featured-case__summary { margin: 0.5rem 0 0; max-width: 62ch; color: var(--portfolio-muted); line-height: 1.65; }

.featured-case__links { display: flex; flex-wrap: wrap; gap: 1.25rem; margin-top: 0.9rem; }
.featured-case__link { color: var(--portfolio-faint); font-size: 0.88rem; font-weight: 600; text-decoration: none; }
.featured-case__link:hover { color: var(--portfolio-accent); }
.featured-case__link--primary { color: var(--portfolio-accent); }

.portfolio-text-link { display: inline-block; margin-top: 2rem; color: var(--portfolio-accent); font-weight: 600; text-decoration: none; }
.portfolio-text-link:hover { text-decoration: underline; text-underline-offset: 4px; }

@media (max-width: 720px) {
  .featured-case { grid-template-columns: 1fr; }
}
```

- [ ] **Step 5: Update the two front matter files** — in both `content/_index.md` and `content/_index.it.md` the `featured-projects` block keeps its existing keys (`eyebrow`, `title`, `text`, `slugs`, `view_project`, `view_all`); no changes needed beyond what already exists.

- [ ] **Step 6: Run tests**

Run: `python3 -m unittest tests.test_homepage_contract -v`
Expected: featured-projects test PASS.

- [ ] **Step 7: Commit**

```bash
git add layouts/_partials/hbx/blocks/featured-projects tests/test_homepage_contract.py
git commit -m "feat: selected work as horizontal case-study rows"
```

---

### Task 7: Contact band, homepage assembly, menus, audit

**Files:**
- Modify: `layouts/_partials/hbx/blocks/portfolio-contact/block.html`, `layouts/_partials/hbx/blocks/portfolio-contact/style.css`, `content/_index.md`, `content/_index.it.md`, `config/_default/menus.yaml`, `scripts/audit_built_homepage.py`
- Test: `tests/test_homepage_contract.py`

- [ ] **Step 1: Update contract tests.** In `tests/test_homepage_contract.py`:

Replace `test_contact_block_has_named_links` with:

```python
    def test_contact_block_has_primary_email_and_named_links(self):
        source = (ROOT / "layouts/_partials/hbx/blocks/portfolio-contact/block.html").read_text(encoding="utf-8")
        self.assertIn("$block.content.links", source)
        self.assertIn('id="contact"', source)
        self.assertIn("portfolio-contact__email", source)
```

Replace the `expected` list in `test_homepage_block_order_and_copy_are_synchronized` with:

```python
        expected = [
            "portfolio-hero",
            "research-pillars",
            "featured-projects",
            "portfolio-contact",
        ]
```

Delete `test_education_timeline_uses_native_details_and_author_data` and `test_evidence_queries_publications_and_blog_content` (those blocks are no longer part of the homepage contract; the partials stay in the repo untested).

Add:

```python
    def test_menu_links_survive_homepage_slimdown(self):
        menu = (ROOT / "config/_default/menus.yaml").read_text(encoding="utf-8")
        self.assertIn("'/#work'", menu)
        self.assertIn("publications/", menu)
        self.assertNotIn("'/#publications'", menu)
```

- [ ] **Step 2: Run to verify failures**

Run: `python3 -m unittest tests.test_homepage_contract -v`
Expected: contact, order, and menu tests FAIL.

- [ ] **Step 3: Rewrite `layouts/_partials/hbx/blocks/portfolio-contact/block.html`:**

```html
{{ $block := .wcBlock }}
<section id="contact" class="portfolio-contact portfolio-section" aria-labelledby="contact-title">
  <div class="portfolio-contact__inner" data-reveal>
    <p class="portfolio-eyebrow">{{ $block.content.eyebrow }}</p>
    <h2 id="contact-title">{{ $block.content.title }}</h2>
    <p class="portfolio-contact__text">{{ $block.content.text }}</p>
    <a class="portfolio-contact__email" href="mailto:{{ $block.content.email }}">{{ $block.content.email }}</a>
    <div class="portfolio-contact__links">
      {{ range $block.content.links }}
        <a href="{{ .url }}"{{ if strings.HasPrefix .url "http" }} rel="noopener"{{ end }}>{{ .label }}</a>
      {{ end }}
    </div>
  </div>
</section>
```

- [ ] **Step 4: Rewrite `layouts/_partials/hbx/blocks/portfolio-contact/style.css`:**

```css
.portfolio-contact__inner { width: min(720px, calc(100% - 2.5rem)); margin-inline: auto; text-align: center; }
.portfolio-contact__text { margin: 1rem auto 0; max-width: 48ch; color: var(--portfolio-muted); line-height: 1.7; }
.portfolio-contact__email {
  display: inline-block;
  margin-top: 1.75rem;
  color: var(--portfolio-accent);
  font-family: var(--portfolio-serif);
  font-style: italic;
  font-size: clamp(1.2rem, 2.4vw, 1.6rem);
  text-decoration: none;
  border-bottom: 1px solid rgb(158 183 219 / 40%);
  padding-bottom: 0.2rem;
}
.portfolio-contact__email:hover { border-bottom-color: var(--portfolio-accent); }
.portfolio-contact__links { display: flex; justify-content: center; gap: 1.75rem; margin-top: 2rem; }
.portfolio-contact__links a { color: var(--portfolio-muted); font-size: 0.9rem; font-weight: 600; text-decoration: none; }
.portfolio-contact__links a:hover { color: var(--portfolio-text); }
```

- [ ] **Step 5: Update the homepage front matter (both locales).** In `content/_index.md`: delete the whole `education-timeline` and `portfolio-evidence` sections; replace the `portfolio-contact` section with:

```yaml
  - block: portfolio-contact
    content:
      eyebrow: Contact
      title: Let us discuss research, systems, or collaboration.
      text: I am based in Pisa and open to academic and technical collaborations in artificial intelligence, economic networks, and complex systems.
      email: stefano.blando@santannapisa.it
      links:
        - label: GitHub
          url: https://github.com/stefano-blando
        - label: LinkedIn
          url: https://www.linkedin.com/in/stefano-blando/
        - label: Google Scholar
          url: https://scholar.google.com/citations?user=dNbRRG0AAAAJ
```

In `content/_index.it.md`: same deletions; contact becomes:

```yaml
  - block: portfolio-contact
    content:
      eyebrow: Contatti
      title: Parliamo di ricerca, sistemi o collaborazioni.
      text: Vivo a Pisa e sono disponibile per collaborazioni accademiche e tecniche su intelligenza artificiale, reti economiche e sistemi complessi.
      email: stefano.blando@santannapisa.it
      links:
        - {label: GitHub, url: 'https://github.com/stefano-blando'}
        - {label: LinkedIn, url: 'https://www.linkedin.com/in/stefano-blando/'}
        - {label: Google Scholar, url: 'https://scholar.google.com/citations?user=dNbRRG0AAAAJ'}
```

- [ ] **Step 6: Update `config/_default/menus.yaml`:**

```yaml
main:
  - {name: Research, url: '/#research', weight: 10}
  - {name: Work, url: '/#work', weight: 20}
  - {name: Publications, url: 'publications/', weight: 30}
  - {name: Projects, url: 'projects/', weight: 40}
  - {name: Experience, url: 'experience/', weight: 50}
  - {name: Contact, url: '/#contact', weight: 60}
```

Check for a localized menu file (`ls config/_default/ | grep menus`); if `menus.it.yaml` (or similar) exists, mirror the same structure with Italian labels (Ricerca, Lavori, Pubblicazioni, Progetti, Esperienza, Contatti).

- [ ] **Step 7: Update `scripts/audit_built_homepage.py`** — replace the required/forbidden id checks in `audit()`:

```python
    for required_id in ("research", "work", "contact"):
        if required_id not in facts.ids:
            failures.append(f"{path}: missing id {required_id}")
    for removed_id in ("education", "publications", "projects"):
        if removed_id in facts.ids:
            failures.append(f"{path}: unexpected homepage id {removed_id}")
```

Keep the canvas, forbidden-token, `portfolio-hero` class, and portrait-alt checks as they are.

- [ ] **Step 8: Run the full python suite**

Run: `python3 -m unittest tests.test_homepage_contract -v`
Expected: all PASS.

- [ ] **Step 9: Run i18n sync check**

Run: `pnpm run check:i18n`
Expected: PASS (EN/IT structures mirror each other).

- [ ] **Step 10: Commit**

```bash
git add layouts/_partials/hbx/blocks/portfolio-contact content/_index.md content/_index.it.md config/_default/menus.yaml scripts/audit_built_homepage.py tests/test_homepage_contract.py
git commit -m "feat: 4-section homepage with contact band and updated nav"
```

---

### Task 8: Full verification

**Files:** none created; STATUS.md/TODO.md updated (local tracking files — never pushed).

- [ ] **Step 1: Run every gate**

```bash
pnpm test            # python contract + node network tests
pnpm run build       # hugo --minify + pagefind
pnpm run audit:homepage
pnpm run check:i18n
```

Expected: all PASS. If `audit:homepage` fails on missing ids, inspect `public/en/index.html` — most likely a section id typo.

- [ ] **Step 2: Manual visual check**

```bash
pnpm run dev
```

Open `http://localhost:1313/en/` and `/it/`, verify: staggered hero load; network denser at edges, none behind the headline; social icons + email under portrait; research rows with serif numerals; three case rows; contact band; menu anchors (`Work`, `Publications`) resolve; mobile layout at 360px (devtools); with OS reduced-motion emulation the network is static and content visible.

- [ ] **Step 3: Update `STATUS.md` and `TODO.md`** — record: editorial homepage shipped (4 sections), timeline/evidence removed from home, fonts self-hosted, menu updated. Mark the redesign TODO items done.

- [ ] **Step 4: Commit**

```bash
git add STATUS.md TODO.md
git commit -m "docs: record editorial homepage redesign completion"
```

---

## Self-Review Notes

- **Spec coverage:** tokens/fonts (T1), network topology+depth+distribution (T2), hero-scoped canvas + pause + reduced-motion static (T3), hero layout/social/stagger (T4), research editorial list (T5), case rows + `#work` (T6), contact band + menu + removed blocks + audit (T7), gates + manual a11y/mobile check (T8). Phase 2 (inner pages) intentionally out of scope.
- The em-dash prohibition in homepage sources (`test_homepage_block_order_and_copy_are_synchronized`) applies to the new copy in Task 5 — the provided copy avoids em dashes entirely.
- `index.js` is untouched: renderer keeps its interface; the canvas stays `#research-network-canvas` inside the hero.
