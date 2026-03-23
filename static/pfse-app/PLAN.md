# PFSE Interactive App — Build Plan

**Goal**: Static web app deployable on Netlify that communicates the PFSE (Parallel Factor Space Estimator) paper interactively. Zero server, zero sleep mode, integrable nel sito Hugo.

**Template**: Adapted from `island-model-multivesta/app/` — same stack, same design system.

---

## Stack

| Layer | Tool | Perché |
|-------|------|--------|
| HTML/Layout | HTML5 + **Tailwind CSS** (CDN) | Zero build step, dark theme, responsive |
| Charts | **Plotly.js** (CDN) | Interactive, CI bands, heatmaps native |
| Reactivity | Vanilla JS | Tab routing, terminal animation |
| Data | Embedded JS | From paper's reported numbers |
| Deploy | **Netlify** (GitHub → auto-deploy) | No sleep, CDN globale, free |

---

## Struttura File

```
app/
├── index.html              # App principale (single page)
├── netlify.toml            # Config Netlify
├── PLAN.md                 # Questo file
├── data/
│   └── data.js             # Tutti i dati (contaminazione sweep, regime, stress)
└── js/
    ├── charts.js           # Plotly chart builders
    ├── simulation.js       # Theatrical PFSE log animation
    └── main.js             # App state, tab routing, event handlers
```

---

## Sezioni dell'App (Single Page, Tabs)

### Tab 1 — Paper
- Titolo, autori (Blando, Farcomeni), venue (Computational Economics)
- 4 key metric cards: Sharpe 1.87, Speedup 32×, Max Drawdown -29%, BCR 31:1
- Download PDF button, submission badge

### Tab 2 — The Method
- PFSE 5-phase algorithm (numbered cards animati)
- Breakdown point e complessità computazionale
- Tabella parametri (k, contamination threshold, Tukey constant)

### Tab 3 — Performance Explorer ⭐ (core feature)
- Bottone "Run PFSE Estimation" → theatrical PFSE algorithm log
- Method selector (PFSE, SSRE, Ledoit-Wolf, Sample Cov, MCD)
- Metric selector (Sharpe Ratio, Max Drawdown, Portfolio Turnover)
- Plotly: performance vs contamination level (0-15%)
- Toggle: Computational time vs portfolio size chart

### Tab 4 — Key Results
- Regime performance bar chart (interattivo: click regime per dettagli)
- Stress test heatmap (5 scenari × 4 metodi)
- Economic value breakdown cards ($72M + $93M)

### Tab 5 — Implementation
- PFSE algorithm pseudocode
- Data sources (S&P 500, yfinance, 2015-2025)
- Citation bibtex
- Shiny dashboard reference

---

## Theatrical PFSE Simulation (Tab 3)

Quando l'utente clicca "Run PFSE Estimation":

```
[PFSE v1.0] Initializing estimation pipeline...
[PFSE] Loading return matrix: n=2520 obs, p=100 assets (2015-2025)
[PFSE] ── Phase 1: Robust Parallel Analysis ──────────────
[PFSE]   Tyler M-estimator... iteration 12: criterion=0.003 ✓
[PFSE]   → Optimal factor dimension: k=5
[PFSE] ── Phase 2: Robust Factor Extraction ─────────────
[PFSE]   Tukey bisquare (c=4.685): 21/100 outliers (8.3%) ✓
[PFSE] ── Phase 3: MCD in Factor Space (k=5 dims) ────────
[PFSE]   C-step 7: det=1.82e-08 ✓ converged
[PFSE] ── Phase 4: Robust Idiosyncratic Estimation ───────
[PFSE]   Median-based variance: 100 assets ✓
[PFSE] ── Phase 5: Structured Reconstruction ─────────────
[PFSE]   Condition number: 47.3 ✓  |  PD: ✓
[PFSE] COMPLETE — Sharpe: 1.87 | Speedup: 32× | Time: 2.4s
```

Timing artificiale con setTimeout, poi grafico fade-in.

---

## Data Sources (tutti dalla paper)

- Contamination sweep: Monte Carlo p=100, contamination 0-15%
- Sharpe at 10% contamination: PFSE=1.42, Sample=0.96
- S&P 500 backtest: PFSE Sharpe=1.87, EW=1.61, Sample=1.63
- COVID crisis: PFSE=2.54 vs Sample=2.22
- Computation: PFSE 2.4s vs MCD 78.2s at p=100 (32× speedup)
- Stress test avg: PFSE=1.67 vs Sample=1.39

---

## Design System (identico Island Model)

- **Background**: `#0a0e1a`
- **Accent**: `#4f8ef7` (blu scientifico)
- **Font**: `JetBrains Mono` per terminal, `Inter` per testo
- **Cards**: bordo `#1f2937`, radius 14px
- **CI bands / uncertainty**: area semitrasparente opacity 0.15
