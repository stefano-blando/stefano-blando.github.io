---
title: Gas Network Risk Forecasting
date: 2024-11-01
summary: Second-place hackathon project for gas leak risk prediction, combining geospatial-temporal features, synthetic data augmentation, and SHAP-based interpretability.
tags:
  - Hackathon
  - Forecasting
  - Imbalanced Learning
  - Explainable AI
  - CTGAN
  - Python
links:
  - icon: github
    icon_pack: fab
    name: Code
    url: https://github.com/stefano-blando/gas-networks-risk-forecasting
---

This project was developed for the **Hera Group Hackathon**, where it earned **2nd place**. The goal was to predict gas network anomalies and leak-related risk using a machine learning pipeline designed for **rare-event detection**.

The workflow focused on combining predictive performance with interpretability:

* **Geospatial-temporal feature engineering:** construction of predictors capturing spatial and temporal structure in the gas network data.
* **Synthetic data augmentation:** use of **CTGAN** and **TimeGAN** to strengthen learning under class imbalance and improve minority-class detection.
* **Explainability:** integration of **SHAP** analysis to understand model behavior and identify the most influential drivers of risk.

The project reflects a recurring theme in my work: building machine learning systems that remain useful under data scarcity, imbalance, and operational uncertainty.
