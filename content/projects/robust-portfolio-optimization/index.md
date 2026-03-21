---
title: High-Dimensional Robust Portfolio Optimization
date: 2023-06-15
summary: Robust statistics project developing high-dimensional covariance estimators that preserve portfolio stability under contamination and market stress.
tags:
  - Research
  - Quantitative Finance
  - Robust Statistics
  - R Language
  - High-Dimensional Data
  - Factor Analysis
links:
  - icon: brands/github
    name: Code
    url: https://github.com/stefano-blando/robust-portfolio-optimization
  - icon: hero/document-text
    name: Paper
    url: /publications/robust-port-opt/
---

This project began from a practical quantitative finance problem: in high-dimensional portfolios, covariance estimation becomes unstable exactly when robustness matters most. Outliers, contamination, and market stress can quickly make standard optimization pipelines unreliable.

The work develops a factor-analytic robust framework built around estimators such as **PFSE** and **SSRE**, designed to preserve allocation stability without becoming computationally prohibitive. The emphasis is not only on robustness in a theoretical sense, but on whether the estimator remains usable for actual portfolio construction.

Relative to more conventional robust approaches, the resulting framework improves risk-adjusted performance while also reducing turnover and computational burden. That combination of statistical robustness and operational practicality is what makes the project important to me.

The project is associated with the paper currently in review at Computational Economics, listed under publications.
