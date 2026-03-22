"""
convert_csv.py — Data pipeline: CSV MultiVeStA → JSON per l'app Netlify

Legge tutti i sweep parametrici e produce file JSON strutturati in app/data/.
Eseguire una volta sola, o ogni volta che si aggiornano i CSV.

Usage:
    python app/convert_csv.py
    (da eseguire dalla root: island-model-multivesta/)
"""

import csv
import json
import os
from pathlib import Path

# ── Paths ──────────────────────────────────────────────────────────────────────
ROOT = Path(__file__).parent.parent / "island_model-mv"
OUT  = Path(__file__).parent / "data"
OUT.mkdir(exist_ok=True)

# ── Helpers ────────────────────────────────────────────────────────────────────

def read_loggdp_csv(path: Path) -> list[dict]:
    """Legge un CSV parametrico logGDP → lista di punti {x, mean, ci, var, n}."""
    rows = []
    with open(path, newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            x = float(row["x"])
            if x < 1.5:          # salta t=1 (logGDP=0 per tutti, non informativo)
                continue
            rows.append({
                "x":    round(x),
                "mean": round(float(row["obsAtStep(x;logGDP)"]), 6),
                "ci":   round(float(row["obsAtStep(x;logGDP)_CI/2"]), 6),
                "var":  round(float(row["obsAtStep(x;logGDP)_Var"]), 6),
                "n":    int(float(row["obsAtStep(x;logGDP)_NSamples"])),
            })
    return rows


def best_csv(folder: Path, prefix: str = "parametric") -> Path | None:
    """
    Restituisce il CSV migliore in una cartella sweep:
    - Preferisce il file principale (senza _iterations_N) con il prefix dato
    - Fallback: _iterations con numero più alto
    - Ultimo fallback: standalone_results.csv (run standalone con N>30 campioni)
    """
    candidates = sorted(folder.glob(f"{prefix}*.csv"))
    # escludi _iterations e prendi il main
    mains = [p for p in candidates if "_iterations_" not in p.name]
    if mains:
        return mains[-1]
    # fallback: ultima iterazione disponibile
    iters = [p for p in candidates if "_iterations_" in p.name]
    if iters:
        iters.sort(key=lambda p: int(p.stem.split("_iterations_")[-1]))
        return iters[-1]
    # ultimo fallback: standalone_results.csv
    standalone = folder / "standalone_results.csv"
    if standalone.exists():
        return standalone
    return None


def read_agr_csv(path: Path) -> dict | None:
    """
    Legge un CSV AGR (valore singolo a t=201) → {mean, ci, var}.

    Il formato MultiVeStA è:
        Property,ObtainedValue,Variance,CI,Problems
        obsAtStep(201.0,AGR_total),0.088,6.4e-4,0.019,0

    La virgola dentro obsAtStep(...) fa sì che csv.DictReader sposti le
    colonne di uno. I valori reali sono quindi in Variance, CI, Problems.
    """
    with open(path, newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Property viene troncato a "obsAtStep(201.0", ObtainedValue = "AGR_total)"
            prop = row.get("Property", "") + row.get("ObtainedValue", "")
            if "AGR" in prop:
                return {
                    "mean": round(float(row["Variance"]), 6),   # offset +1
                    "var":  round(float(row["CI"]), 6),         # offset +1
                    "ci":   round(float(row["Problems"]), 6),   # offset +1
                }
    return None

# ── Sweep configurations ───────────────────────────────────────────────────────
#
# Per ogni parametro: lista di (valore, folder_name, converged, ds_used)
# converged: True = ds=1 sufficiente | False = serviva ds>1 | None = baseline
# ds_used: step di convergenza usato

SWEEPS = {

    "alpha": {
        "label": "α — Returns to Scale",
        "symbol": "α",
        "description": "Controls the degree of returns to scale in production. Higher α amplifies skill differences between islands, leading to more extreme specialization and higher variance in outcomes.",
        "baseline": 1.5,
        "unit": "",
        "in_paper": True,
        "paper_note": "Converged values (δ=1): α ∈ {0.9, 1.0, 1.1}. Higher values did not converge within δ=1.",
        "values": [
            {"val": 0.9,  "folder": "alpha 0.9",  "converged": True, "ds": 1, "in_paper": True},
            {"val": 1.0,  "folder": "alpha 1",    "converged": True, "ds": 1, "in_paper": True},
            {"val": 1.1,  "folder": "alpha 1.1",  "converged": True, "ds": 1, "in_paper": True},
        ],
    },

    "phi": {
        "label": "φ — Skill Transfer",
        "symbol": "φ",
        "description": "Probability that an imitating agent successfully transfers skills from the imitated agent. Higher φ facilitates faster diffusion of productive knowledge across the economy.",
        "baseline": 0.5,
        "unit": "",
        "in_paper": True,
        "paper_note": "Converged values (δ=1): φ ∈ {0.0, 0.1}. Higher values did not converge within δ=1.",
        "values": [
            {"val": 0.0,  "folder": "phi 0",   "converged": True, "ds": 1, "in_paper": True},
            {"val": 0.1,  "folder": "phi 0.1", "converged": True, "ds": 1, "in_paper": True},
        ],
    },

    "rho": {
        "label": "ρ — Knowledge Locality",
        "symbol": "ρ",
        "description": "Controls how localized knowledge is on each island. Higher ρ means knowledge is more specific to an island, reducing cross-island transferability and slowing diffusion.",
        "baseline": 0.1,
        "unit": "",
        "in_paper": True,
        "paper_note": "Converged values (δ=1): ρ ∈ {0.0, 0.05, 0.1}. Higher values did not converge within δ=1.",
        "values": [
            {"val": 0.0,  "folder": "rho 0",   "converged": True, "ds": 1, "in_paper": True},
            {"val": 0.05, "folder": "rho 0.05","converged": True, "ds": 1, "in_paper": True},
            {"val": 0.1,  "folder": "rho 0.1", "converged": True, "ds": 1, "note": "baseline", "in_paper": True},
        ],
    },

    "lambda": {
        "label": "λ — Innovation Rate",
        "symbol": "λ",
        "description": "Rate at which explorer agents generate new innovations. Higher λ increases the frequency of new knowledge creation but also increases output variance, making convergence harder.",
        "baseline": 1.0,
        "unit": "",
        "in_paper": False,
        "paper_note": "Omitted from paper — no value converged with δ=1 due to high output variance. Full results shown here for the first time.",
        "values": [
            {"val": 0.1,  "folder": "lambda 0.1", "converged": False, "ds": 1, "in_paper": False},
            {"val": 0.5,  "folder": "lambda 0.5", "converged": False, "ds": 1, "in_paper": False},
            {"val": 1.0,  "folder": "lambda 1",   "converged": False, "ds": 1, "note": "baseline", "in_paper": False},
            {"val": 2.0,  "folder": "lambda 2",   "converged": False, "ds": 1, "in_paper": False},
            {"val": 5.0,  "folder": "lambda 5",   "converged": False, "ds": 1, "in_paper": False},
            {"val": 10.0, "folder": "lambda 10",  "converged": False, "ds": 1, "in_paper": False},
        ],
    },

    "pi": {
        "label": "π — Island Density",
        "symbol": "π",
        "description": "Proportion of islands that are occupied at initialization. Controls the initial density of the economy — how many productive niches are already exploited at t=0.",
        "baseline": 0.1,
        "unit": "",
        "in_paper": False,
        "paper_note": "Omitted from paper — no value converged with δ=1 due to high output variance. Full results shown here for the first time.",
        "values": [
            {"val": 0.01, "folder": "pi 0.01", "converged": False, "ds": 1, "in_paper": False},
            {"val": 0.06, "folder": "pi 0.06", "converged": False, "ds": 1, "in_paper": False},
            {"val": 0.1,  "folder": "pi 0.1",  "converged": False, "ds": 1, "note": "baseline", "in_paper": False},
            {"val": 0.2,  "folder": "pi 0.2",  "converged": False, "ds": 1, "in_paper": False},
            {"val": 0.3,  "folder": "pi 0.3",  "converged": False, "ds": 1, "in_paper": False},
            {"val": 0.5,  "folder": "pi 0.5",  "converged": False, "ds": 1, "in_paper": False},
        ],
    },
}

LOGGDP_PARENT = {
    "alpha": ROOT / "LOG_GDP alpha sweep",
    "phi":   ROOT / "LOG_GDP phi sweep",
    "rho":   ROOT / "LOG_GDP rho sweep",
    # lambda and pi omitted: runs did not converge, CSVs are intermediate only
}

AGR_PARENT = ROOT / "AGR eps sweep"

STAGNATION_FOLDER = ROOT / "fig 1a grafico_ logGDP stagnating"

# ── Build logGDP sweep JSONs ───────────────────────────────────────────────────

for param, config in SWEEPS.items():
    if param not in LOGGDP_PARENT:
        continue
    parent = LOGGDP_PARENT[param]
    series_list = []

    for entry in config["values"]:
        folder = parent / entry["folder"]
        if not folder.exists():
            print(f"  [WARN] Not found: {folder}")
            continue

        csv_path = best_csv(folder)
        if csv_path is None:
            print(f"  [WARN] No CSV in: {folder}")
            continue

        points = read_loggdp_csv(csv_path)
        if not points:
            print(f"  [WARN] Empty CSV: {csv_path}")
            continue

        series_list.append({
            "value":     entry["val"],
            "label":     f"{config['symbol']} = {entry['val']}",
            "converged": entry["converged"],
            "in_paper":  entry.get("in_paper", False),
            "ds":        entry["ds"],
            "note":      entry.get("note", ""),
            "n_samples": points[-1]["n"],
            "final_mean": points[-1]["mean"],
            "final_ci":   points[-1]["ci"],
            "series":    points,
        })

    output = {
        "parameter":  param,
        "label":      config["label"],
        "symbol":     config["symbol"],
        "description": config["description"],
        "baseline":   config["baseline"],
        "unit":       config["unit"],
        "in_paper":   config["in_paper"],
        "paper_note": config["paper_note"],
        "series":     series_list,
    }

    out_path = OUT / f"{param}.json"
    with open(out_path, "w") as f:
        json.dump(output, f, separators=(",", ":"))
    print(f"[OK] {out_path.name}  ({len(series_list)} series)")

# ── Build AGR eps JSON ─────────────────────────────────────────────────────────

AGR_VALUES = [
    {"val": 0.0,  "folder": "AGR con eps 0"},
    {"val": 0.05, "folder": "AGR sweep eps 0.05"},
    {"val": 0.1,  "folder": "AGR sweep eps 0.1"},
    {"val": 0.2,  "folder": "AGR con eps 0.2"},
    {"val": 0.3,  "folder": "AGR sweep eps 0.3"},
    {"val": 0.4,  "folder": "AGR sweep eps 0.4"},
    {"val": 0.6,  "folder": "AGR sweep eps 0.6"},
    {"val": 0.7,  "folder": "AGR sweep eps 0.7"},
    {"val": 0.8,  "folder": "AGR sweep eps 0.8"},
    {"val": 0.9,  "folder": "AGR sweep eps 0.9"},
    {"val": 1.0,  "folder": "AGR sweep eps 1"},
]

agr_points = []
for entry in AGR_VALUES:
    folder = AGR_PARENT / entry["folder"]
    if not folder.exists():
        # try AGR eps experiments output subfolder
        folder = AGR_PARENT / "AGR eps experiments output" / entry["folder"]
    if not folder.exists():
        print(f"  [WARN] AGR folder not found: {entry['folder']}")
        continue

    # AGR files use "multiQuaTEx" prefix (not "parametric")
    csvs = [p for p in folder.glob("multiQuaTEx*.csv") if "_iterations_" not in p.name]
    if not csvs:
        csvs = [p for p in folder.glob("multiQuaTEx*_iterations_1.csv")]
    if not csvs:
        print(f"  [WARN] No AGR CSV in: {folder}")
        continue

    result = read_agr_csv(csvs[0])
    if result:
        agr_points.append({
            "eps":  entry["val"],
            "mean": result["mean"],
            "ci":   result["ci"],
            "var":  result["var"],
        })

agr_output = {
    "parameter": "eps",
    "label": "ε — Exploration Probability",
    "symbol": "ε",
    "description": "Probability that an agent switches to explorer mode in a given period. Controls the trade-off between exploitation of known islands and exploration of new ones. Measured via Average Growth Rate (AGR) at t=201.",
    "metric": "AGR at t=201",
    "baseline": 0.1,
    "points": sorted(agr_points, key=lambda p: p["eps"]),
}

out_path = OUT / "agr_eps.json"
with open(out_path, "w") as f:
    json.dump(agr_output, f, separators=(",", ":"))
print(f"[OK] {out_path.name}  ({len(agr_points)} points)")

# ── Build stagnation JSON (fig 1a) ─────────────────────────────────────────────

stag_csv = best_csv(STAGNATION_FOLDER)
stag_points = read_loggdp_csv(stag_csv) if stag_csv else []

stagnation_output = {
    "label": "Stagnation scenario (ε = 0)",
    "description": "When exploration probability is zero, agents can only mine or imitate. The economy explores only a fraction of the island space and eventually stagnates, with logGDP plateauing well below the baseline.",
    "series": stag_points,
}

out_path = OUT / "stagnation.json"
with open(out_path, "w") as f:
    json.dump(stagnation_output, f, separators=(",", ":"))
print(f"[OK] {out_path.name}  ({len(stag_points)} points)")

# ── Build metadata JSON ────────────────────────────────────────────────────────

metadata = {
    "paper": {
        "title": "Statistical Model Checking of an Island Model for Economic Growth",
        "authors": ["Stefano Blando", "Andrea Vandin", "Giorgio Fagiolo"],
        "venue": "MARS @ ETAPS 2026",
        "series": "EPTCS",
        "status": "Accepted",
        "abstract": (
            "We reproduce and extend the Fagiolo & Dosi (2003) Island Model using MultiVeStA, "
            "a tool for statistical model checking of stochastic systems. The model captures "
            "endogenous growth dynamics through heterogeneous agents (Miners, Imitators, Explorers) "
            "operating on a fitness landscape of islands. We perform comprehensive parameter "
            "sensitivity analysis with formal convergence guarantees, providing rigorous "
            "statistical characterization of how each parameter shapes long-run growth trajectories."
        ),
    },
    "model": {
        "agents": 20,
        "timesteps": 201,
        "agent_types": [
            {
                "name": "Miner",
                "color": "#4f8ef7",
                "description": "Exploits the current island — produces output proportional to island fitness and own skill level.",
            },
            {
                "name": "Imitator",
                "color": "#22c55e",
                "description": "Copies the strategy of the most successful visible agent — transfers skills with probability φ.",
            },
            {
                "name": "Explorer",
                "color": "#f59e0b",
                "description": "Searches for new islands at random — probability ε of discovering a better niche.",
            },
        ],
        "parameters": {
            "pi":     {"symbol": "π", "baseline": 0.1,  "range": [0.01, 0.5],  "description": "Island density"},
            "alpha":  {"symbol": "α", "baseline": 1.5,  "range": [0.5, 1.9],   "description": "Returns to scale"},
            "eps":    {"symbol": "ε", "baseline": 0.1,  "range": [0.0, 1.0],   "description": "Exploration probability"},
            "phi":    {"symbol": "φ", "baseline": 0.5,  "range": [0.0, 1.0],   "description": "Skill transfer rate"},
            "rho":    {"symbol": "ρ", "baseline": 0.1,  "range": [0.0, 5.0],   "description": "Knowledge locality"},
            "lambda": {"symbol": "λ", "baseline": 1.0,  "range": [0.1, 10.0],  "description": "Innovation rate"},
        },
    },
    "multivesta": {
        "tool": "MultiVeStA",
        "method": "Sequential Statistical Model Checking",
        "convergence_delta": 0.05,
        "min_samples": 30,
        "description": (
            "MultiVeStA uses sequential hypothesis testing to adaptively determine "
            "how many simulations are needed to achieve a target confidence interval width δ. "
            "Convergence at δ=0.05 means E[logGDP] is estimated within ±0.05 with high confidence."
        ),
        "queries": [
            {
                "name": "logGDPaftersteps",
                "file": "logGDPaftersteps.multiquatex",
                "description": "E[log(GDP)] at each timestep — parametric sweep over time",
            },
            {
                "name": "AGRfinal",
                "file": "AGRfinal.multiquatex",
                "description": "Average Growth Rate at t=201 — scalar summary statistic",
            },
        ],
    },
    "convergence_summary": {
        "note": "Convergence linked to output variance. Low-variance regimes (α≤1.0, φ≤0.1) converge with ds=1. High-variance regimes (α=1.9) require ds=5.",
        "by_parameter": {
            "alpha":  {"converged_values": [0.5, 0.7, 0.9, 1.0, 1.1], "not_converged": [1.2, 1.5, 1.7, 1.9]},
            "phi":    {"converged_values": [0.0, 0.1], "not_converged": [0.3, 0.5, 0.7, 0.9, 1.0]},
            "rho":    {"converged_values": [0.0, 0.05, 0.1], "not_converged": [0.5, 1.0, 3.0, 5.0]},
            "lambda": {"converged_values": [], "not_converged": [0.1, 0.5, 1.0, 2.0, 5.0, 10.0]},
            "pi":     {"converged_values": [], "not_converged": [0.01, 0.06, 0.1, 0.2, 0.3, 0.5]},
        },
    },
}

out_path = OUT / "metadata.json"
with open(out_path, "w") as f:
    json.dump(metadata, f, indent=2)
print(f"[OK] {out_path.name}")

# ── Generate data.js — embedded bundle (works with file:// locally) ────────────

all_data = {"metadata": metadata}
for name in ["alpha", "phi", "rho", "agr_eps", "stagnation"]:
    p = OUT / f"{name}.json"
    if p.exists():
        all_data[name] = json.loads(p.read_text())

js_path = OUT / "data.js"
with open(js_path, "w") as f:
    f.write("// Auto-generated by convert_csv.py — do not edit manually\n")
    f.write("window.ISLAND_DATA = ")
    json.dump(all_data, f, separators=(",", ":"))
    f.write(";\n")
print(f"[OK] data.js  (embedded bundle for local + Netlify)")

print("\n✓ All files written to app/data/")
