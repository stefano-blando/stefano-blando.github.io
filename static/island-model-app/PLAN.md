# Island Model Interactive App — Build Plan

**Goal**: Static web app deployable on Netlify that communicates the Island Model + MultiVeStA paper interactively. Zero server, zero sleep mode, integrable nel sito Hugo.

**Future use**: Template riusabile come skill `paper-to-app` per tutti i paper del PhD.

---

## Stack

| Layer | Tool | Perché |
|-------|------|--------|
| HTML/Layout | HTML5 + **Tailwind CSS** (CDN) | Zero build step, dark theme, responsive |
| Charts | **Plotly.js** (CDN) | Identico a Plotly Python, CI bands native |
| Reactivity | **Alpine.js** (CDN) | Micro-framework, dropdown/slider/tabs senza build |
| Animation | Vanilla JS | Theatrical simulation log |
| Data | JSON pre-processati | Convertiti dai CSV MultiVeStA con script Python |
| Deploy | **Netlify** (GitHub → auto-deploy) | No sleep, CDN globale, free |

Nessun build step (webpack/vite/npm) — tutto via CDN. Apribile anche in locale con doppio click.

---

## Struttura File

```
app/
├── index.html              # App principale (single page)
├── netlify.toml            # Config Netlify
├── convert_csv.py          # Script one-shot CSV → JSON
├── data/                   # Dati pre-processati
│   ├── alpha.json          # sweep α (9 valori, time series + CI)
│   ├── phi.json            # sweep φ (7 valori)
│   ├── rho.json            # sweep ρ (7 valori)
│   ├── eps.json            # sweep ε (full range)
│   ├── lambda.json         # sweep λ (6 valori)
│   ├── pi.json             # sweep π (6 valori)
│   ├── agr_eps.json        # AGR vs ε
│   └── metadata.json       # convergence table, parameter descriptions
├── js/
│   ├── charts.js           # Plotly chart builders (sweep, AGR, convergence)
│   ├── simulation.js       # Theatrical MultiVeStA log animation
│   └── main.js             # App state, tab routing, event handlers
└── css/
    └── style.css           # Custom overrides su Tailwind (font, colori paper)
```

---

## Sezioni dell'App (Single Page, Tabs)

### Tab 1 — Paper
- Titolo, autori, venue (MARS @ ETAPS 2026), abstract
- Badge: "Accepted", "EPTCS", "MultiVeStA"
- Bottone download PDF / link Overleaf
- Link GitHub replicability package

### Tab 2 — The Model
- Spiegazione visiva: Island Grid animata (SVG/Canvas con agenti Miner/Imitator/Explorer)
- Tabella parametri con descrizione economica
- Diagramma stati (Miner → Explorer → Imitator) — static SVG generato da `gen_transitions_fig.py`

### Tab 3 — Parameter Explorer ⭐ (core feature)
- Dropdown: scegli parametro (α, φ, ρ, ε, λ, π)
- Multi-select o checkbox: quali valori mostrare
- Bottone **"Run MultiVeStA Analysis"** → theatrical log animation
- Plotly chart: time series E[logGDP] con ribbon CI per ogni valore selezionato
- Badge convergenza per ogni curva (✓ converged / ✗ ds=1)

### Tab 4 — Key Findings
- Convergence heatmap (parametro × valore → converge sì/no)
- Stylized facts (fig_stylized_facts.png embedded)
- Counterfactual t-test results (α e φ)

### Tab 5 — Replicability
- Come usare il pacchetto MultiVeStA
- MultiQuaTEx query mostrate come codice
- Link download pacchetto ZIP

---

## Theatrical Simulation (Tab 3)

Quando l'utente clicca "Run MultiVeStA Analysis":

```
[MultiVeStA] Loading Island Model (N=20, T=201, α=1.5)...
[MultiVeStA] Initializing 20 agents (Miner/Imitator/Explorer)...
[MultiVeStA] Running simulation batch  1/30... E[logGDP@t=50] = 5.43
[MultiVeStA] Running simulation batch  5/30... CI/2 = 0.18 > δ=0.05
[MultiVeStA] Running simulation batch 12/30... CI/2 = 0.09 > δ=0.05
[MultiVeStA] Running simulation batch 19/30... CI/2 = 0.06 > δ=0.05
[MultiVeStA] Running simulation batch 24/30... CI/2 = 0.03 ≤ δ=0.05 ✓
[MultiVeStA] CONVERGED at 24 samples
[MultiVeStA] E[logGDP @ t=201] = 7.82 ± 0.09
```

Dati reali dai CSV, timing artificiale con setTimeout (800ms per riga).
Poi: grafico appare con fade-in.

---

## Design System

- **Background**: `#0f1117` (stesso di Risk Sentinel)
- **Accent**: `#4f8ef7` (blu scientifico, non il rosso Pokémon)
- **Font**: `JetBrains Mono` per il log terminal, `Inter` per il testo
- **Card style**: bordo sottile `#1e2530`, radius 8px
- **CI bands**: area semitrasparente attorno alle curve (opacity 0.15)
- **Convergence badge**: verde `#22c55e` = converged, arancio `#f59e0b` = ds needed, rosso = non converged

---

## Build Steps

### Fase 1 — Data Pipeline (1-2h)
- [ ] `convert_csv.py`: legge tutti i CSV sweep, produce JSON strutturati
- [ ] `metadata.json`: tabella convergenza, descrizioni parametri, baseline values

### Fase 2 — Scaffold HTML (1h)
- [ ] `index.html` base: Tailwind CDN, Alpine.js, Plotly.js, tab navigation
- [ ] Layout dark theme, header con titolo paper e badge venue

### Fase 3 — Parameter Explorer (3-4h) ⭐
- [ ] `charts.js`: builder Plotly per sweep con CI ribbon
- [ ] `simulation.js`: theatrical log animation
- [ ] Dropdown parametro + checkbox valori + bottone Run
- [ ] Integrazione dati JSON → chart

### Fase 4 — Altre Tab (2-3h)
- [ ] Tab Paper: abstract, autori, links
- [ ] Tab Model: island grid SVG, tabella parametri
- [ ] Tab Key Findings: convergence heatmap, stylized facts
- [ ] Tab Replicability: codice MultiQuaTEx, download link

### Fase 5 — Deploy (30min)
- [ ] `netlify.toml`
- [ ] GitHub repo (o cartella nel repo website)
- [ ] Netlify connect → auto-deploy

### Fase 6 — Hugo Integration (30min)
- [ ] Pagina `/projects/island-model-smc/` nel sito Hugo
- [ ] Link "Interactive Demo" → URL Netlify

---

## Reuse Template (Future Skill)

Una volta completato, estrarre come template:
- `convert_csv_template.py` — adattabile a qualsiasi sweep parametrico
- `index_template.html` — structure riusabile
- `SKILL.md` — istruzioni per applicare a un nuovo paper

Target: skill `paper-to-app` per NLP paper, Multiple Equilibria, K+S.
