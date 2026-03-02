---
title: RiskSentinel - Agentic Systemic Risk Simulator
date: 2026-02-23
summary: Multi-agent AI system for systemic risk simulation and financial contagion analysis on 210 S&P 500 stocks, built for Microsoft AI Dev Days Hackathon 2026.
tags:
  - Multi-Agent Systems
  - Financial AI
  - Systemic Risk
  - Network Science
  - Azure OpenAI
  - Streamlit
links:
  - icon: github
    icon_pack: fab
    name: Code
    url: https://github.com/stefano-blando/risk-sentinel
---

RiskSentinel is an **agentic systemic risk simulator** designed to answer stress-test questions such as: *"What happens if JPMorgan crashes 40%?"* The platform combines network science, contagion modeling, and AI-assisted interpretation to simulate how shocks propagate across a large equity network.

Built for the **Microsoft AI Dev Days Hackathon 2026**, the project focuses on real-time decision support for portfolio and systemic risk analysis.

**Methodological Contributions:**
* **Multi-agent architecture:** An orchestrator coordinates three specialist agents: Architect (network topology), Quant (shock simulation), and Advisor (risk interpretation and mitigation).
* **Advanced contagion modeling:** Includes three propagation models for scenario analysis: **DebtRank**, **Linear Threshold**, and **Cascade Removal**.
* **Topology-aware risk analytics:** Integrates centrality metrics, market regime detection, and sector-level decomposition to identify systemic vulnerabilities.

**Key Features:**
* **Natural language stress testing:** Query-based shock scenarios (for example, ticker-specific crash percentages).
* **Interactive contagion animation:** Wave-by-wave cascade visualization with Play/Pause controls and slider navigation.
* **Model comparison dashboard:** Side-by-side outputs across all contagion models with severity and impact comparison.
* **Crisis presets:** Reproducible scenarios inspired by recent events (COVID-19, SVB, Japan carry trade unwind, Volmageddon, Russia-Ukraine shock).
* **Actionable reporting:** Risk scoring, vulnerable-node ranking, sector impact tables, and downloadable reports.

**Technical Implementation:**
RiskSentinel is implemented in **Python** with a modular architecture:
* **Simulation engine:** `NetworkX`-based graph construction and propagation logic in dedicated core modules.
* **Frontend:** `Streamlit` + `Plotly` for interactive and animated network analytics.
* **Agent layer:** Microsoft Agent Framework with Azure AI Foundry/Azure OpenAI integration path.
* **Validation:** **41 unit tests** covering data loading, network construction, and contagion dynamics.

**Data Foundation:**
The system is built on pre-computed research-grade market data:
* **210 S&P 500 stocks** across 11 GICS sectors
* **3,081 daily snapshots** (2013-2025)
* Rolling correlation networks, centrality measures, and VIX-informed market regime annotations

The result is a practical prototype for **systemic risk monitoring**, bridging quantitative finance, complex systems, and agentic AI.
