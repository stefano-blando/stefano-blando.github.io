# Editorial Homepage Redesign — Design Spec

**Date:** 2026-07-19
**Status:** Approved in brainstorming (visual companion session `.superpowers/brainstorm/201545-1784455424`)
**Scope:** Homepage (EN + IT). Inner pages inherit tokens in a later phase.

## 1. Context and Goals

The 2026-07-18 "premium portfolio" redesign shipped but reads as generic/template-like,
visually heavy (6 dense sections), and under-polished in details. This redesign keeps the
dark navy identity and rebuilds the homepage as a calm, editorial, 4-section page.

**Audience:** mixed academia + industry (researchers, PIs, tech/AI recruiters).
**10-second impression:** rigorous researcher who builds real systems.

**Success criteria:**

- Homepage has exactly 4 sections: Hero, Research, Selected Work, Contact.
- No section feels template-derived; typography and spacing carry the design.
- The network background reads clearly as "network science" without hurting legibility.
- EN and IT stay in sync (`pnpm run check:i18n` passes).
- Existing quality gates (contract test, built-homepage audit, network tests) updated and green.

## 2. Design Principles

1. **One editorial voice.** Serif italics for accents and numerals, one sans family for
   everything else. Generous vertical rhythm. No decorative noise.
2. **Dominant navy, one accent.** The existing palette is the identity; the light-blue
   accent is used sparingly (eyebrows, accent words, links, primary CTA).
3. **Restraint as polish.** One orchestrated hero load animation; quiet scroll reveals;
   subtle hovers. Nothing bounces, nothing spins.
4. **Coherent flow.** Header, sections, and future inner pages share the same tokens so
   the whole site feels like one organized system.

## 3. Design Tokens

Defined as CSS custom properties in `assets/css/custom.css` (single source of truth):

```css
--portfolio-bg:       #060810;  /* page background */
--portfolio-surface:  #101621;  /* cards, rows */
--portfolio-surface-2:#182338;  /* gradient partner, visuals */
--portfolio-text:     #f5f3ef;  /* primary text */
--portfolio-muted:    #a5adba;  /* secondary text */
--portfolio-faint:    #657fa8;  /* tertiary: metadata, small labels */
--portfolio-accent:   #9eb7db;  /* accent + focus ring */
--portfolio-line:     rgba(158,183,219,0.14); /* hairlines and card borders */
```

**Typography** (self-hosted woff2 in `static/fonts/`, no CDN):

- **Display/accent serif:** Fraunces (italic axis). Used for: accent words in headlines,
  the 01/02/03 pillar numerals, pull-quote-like moments. Fallback: Georgia, serif.
- **Sans (headlines, body, UI):** Instrument Sans. Fallback: system-ui stack.
- Scale: hero headline `clamp(2.4rem, 5vw, 3.6rem)`, section titles
  `clamp(1.8rem, 3.5vw, 2.6rem)`, body 1rem/1.7, metadata 0.78rem uppercase
  tracked +0.16em.

**Spacing:** sections `padding-block: clamp(4.5rem, 9vw, 8rem)`; content width
`min(1120px, 100% - 2.5rem)`.

**Radii:** cards 12px, buttons 8px, portrait circle.

## 4. Page Structure

Order in `content/_index.md` / `content/_index.it.md`:

### 4.1 Hero (`portfolio-hero`, reworked)

- Two-column: text (~60%) left, portrait column right; stacks on mobile
  (text first, portrait+social below).
- Eyebrow: `STEFANO BLANDO · AI RESEARCHER & PHD CANDIDATE`.
- Headline: "Understanding complex systems through *adaptive intelligence*." —
  accent phrase in Fraunces italic, `--portfolio-accent`.
- Summary paragraph (existing copy), max ~55ch.
- CTAs: primary "Explore my work" (filled accent, dark text) → `#work`;
  secondary "Download CV" (hairline border) → `/uploads/resume.pdf`.
- Portrait: circular, 2px `rgba(158,183,219,0.4)` ring. Below it, in order:
  social icon row (GitHub, LinkedIn, Google Scholar, email icon) as 1px-bordered
  circular buttons; then the email address as plain text
  (`stefano.blando@santannapisa.it`).
- Load animation: staggered reveal (eyebrow → headline → summary → CTAs → portrait
  column), 500-650ms each, 80-120ms stagger, translateY(16px)→0 + fade. Runs once.

### 4.2 Network background (canvas, hero-scoped)

Reuses/refactors the existing modular network model (`tests/network/` covers it):

- **Density:** target ~40 nodes at ≥1280px wide, ~28 at tablet, ~18 at phone
  (scaled by viewport area, capped).
- **Distribution:** weighted away from the headline/summary text zone — denser along
  top/right/bottom edges and around the portrait; sparse behind text.
- **Depth:** node radius 1.5-5px with opacity 0.3-0.9 correlated to radius;
  edges 0.6-1px, `#46566e` at ≤0.35 opacity, connecting near neighbors only.
- **Motion:** slow drift (a few px/s) with gentle re-linking; pauses when the hero is
  off-viewport (IntersectionObserver) and fully disabled under
  `prefers-reduced-motion` (static frame is drawn once).
- **Legibility guarantee:** canvas sits behind content (`z-index`), max overall
  opacity such that text contrast on `--portfolio-bg` stays ≥ WCAG AA.
- Background also keeps the existing radial navy glow
  (`radial-gradient(ellipse at 75% 20%, rgba(55,73,116,0.30), transparent 55%)`).

### 4.3 Research (`research-pillars` → editorial numbered list)

- Section id `#research`. Eyebrow "Research profile", title
  "Three connected research pillars", short intro paragraph.
- Three full-width rows separated by `--portfolio-line` hairlines. Each row:
  - Left: numeral `01`/`02`/`03` in Fraunces italic, `--portfolio-faint`.
  - Middle (flexible): pillar name (semibold sans) + 2-3 sentence discursive
    description (current copy may be expanded; not artificially compressed).
  - Right (fixed ~200px, wraps under middle column on mobile): 3 related topics as
    small `--portfolio-faint` text separated by `·` (replaces the old
    interest-group tag cloud).
- No cards, no icons. Hover: row background eases to `--portfolio-surface`.

### 4.4 Selected Work (`featured-projects` → horizontal case-study rows)

- Section id `#work`. Eyebrow "Selected work", title
  "Research translated into technology".
- Three horizontal cards (`--portfolio-surface`, 1px `--portfolio-line`, 12px radius),
  one per project, stacking visual-above-text on mobile:
  - Left: visual block 16:10 (~220px wide): project image if present in the project
    page front matter, else a generated abstract network/gradient placeholder in
    palette (`--portfolio-surface-2` radial).
  - Right: category metadata line (uppercase, `--portfolio-faint`, e.g.
    "AGENTIC SIMULATION · HACKATHON WINNER"), project title, 1-2 sentence summary,
    link row: "View project →" (accent) plus Paper/Code when defined.
- Projects (slugs, unchanged): `risk-sentinel`, `island-model-smc`,
  `multi-agent-orchestration`. Footer link: "Explore all projects →" → `/projects/`.
- Hover: border brightens to accent at 35%, visual scales 1.02, 250ms ease.

### 4.5 Contact (`portfolio-contact`, simplified)

- Section id `#contact`. Eyebrow "Contact", title
  "Let us discuss research, systems, or collaboration.", one-line text.
- Single centered band: primary email link styled as the section's one accent
  element, then a hairline-separated row of text links (GitHub, LinkedIn,
  Google Scholar). No cards.

### 4.6 Removed from homepage

- `education-timeline` block — content lives in the existing Experience page/tab.
- `portfolio-evidence` (publications + news) — lives in Publications/Blog tabs.
- Both partials stay in the repo (used elsewhere or kept for reuse), only the
  homepage front matter drops them.

## 5. Header / Navigation

- Keep the current translucent blur header. Menu (`config/_default/menus.yaml`)
  updates required because the homepage `#publications` anchor disappears:
  - Research → `/#research` (unchanged)
  - Work → `/#work` (new, replaces the Publications anchor position)
  - Publications → `/publications/` (was `/#publications`)
  - Projects → `/projects/` (unchanged)
  - Experience → `/experience/` (unchanged, first-class tab)
  - Contact → `/#contact` (unchanged)
- Active state: `--portfolio-text` with accent underline offset; contact stays as the
  bordered pill on the right.

## 6. Bilingual Parity

- Every content change lands in `_index.md` and `_index.it.md` in the same commit.
- Italian copy mirrors structure 1:1 (numerals, section ids, slugs identical).
- `pnpm run check:i18n` must pass.

## 7. Accessibility

- Text contrast ≥ AA on all combinations (muted/faint text sizes chosen accordingly;
  `--portfolio-faint` only at ≥0.78rem bold-tracked or decorative numerals).
- `:focus-visible` ring in accent (already present) on all interactive elements,
  including social icon buttons.
- Canvas is `aria-hidden`; all information carried by text.
- `prefers-reduced-motion`: no drift, no reveal transforms (already themed; extend to
  hero stagger).

## 8. Implementation Notes

- All work in existing Hugo Blox block partials under
  `layouts/_partials/hbx/blocks/`; no new Hugo theme, no new JS framework.
- CSS stays in `assets/css/custom.css` (may be split into logical files under
  `assets/css/` if it grows past ~400 lines).
- Fonts self-hosted with `font-display: swap`; subset to latin.
- Network canvas JS stays modular (current `assets/js` structure) so
  `tests/network/*.test.mjs` keep exercising topology and interactions.

## 9. Testing / Quality Gates

- `tests/test_homepage_contract.py`: update expected section list/order
  (hero, research, work, contact) and removed blocks.
- `scripts/audit_built_homepage.py`: update audit rules to the new layout for both
  locales.
- `tests/network/`: update topology expectations (density targets, edge-weighted
  distribution, reduced-motion static render).
- Manual pass: Lighthouse a11y + contrast spot-checks, mobile layout at 360px.

## 10. Out of Scope (Phase 2)

- Applying tokens/typography to inner pages (Experience, Projects, Publications, Blog).
- Any content rewriting beyond what section 4 requires.
- Hidden demo/template `.it.md` cleanup (tracked separately in STATUS.md).
