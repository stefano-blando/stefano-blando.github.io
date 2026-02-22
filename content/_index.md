---
# Leave the homepage title empty to use the site title
title: ''
summary: ''
date: 2022-10-24
type: landing

design:
  spacing: '6rem'

sections:
  # 1. BIOGRAFIA
  - block: resume-biography-3
    content:
      username: me
      text: ''
      button:
        text: Download CV
        url: uploads/resume.pdf
    design:
      background:
        gradient_mesh:
          enable: true
      name:
        size: lg
      avatar:
        size: large
        shape: circle

# 2. RESEARCH OVERVIEW
 - block: markdown
      content:
        title: '📚 Research Overview'
        subtitle: 'Agent-Based Computational Economics meets Artificial Intelligence'
        text: |
          My research lies at the intersection of **Agent-Based Computational Economics** and **Artificial Intelligence**, within the National PhD Program in AI for Society (SSSA & UniPi).

          I develop **adaptive cognitive architectures** for economic agents that co-evolve their decision strategies and social connections within complex networks — moving beyond static equilibrium toward realistic, heterogeneous, and adaptive behavior.


        ### Core Research Pillars:

        * **Scientific Machine Learning & Inference:** Overcoming the curse of dimensionality in calibrating behavioral models. I apply **Amortized Bayesian Inference (SBI)** and Neural Density Estimators to infer latent decision-making parameters directly from aggregate macro-data.
        * **Network Topology & Systemic Risk:** Leveraging **Graph Neural Networks (GNNs)** and Geometric Deep Learning to decode the evolving topology of financial markets, identifying early warning signals of contagion and distress in interconnected systems.
        * **Behavioral Complexity & Robustness:** Modeling **bounded rationality** and heterogeneous decision-making rules in stochastic environments. I employ HPC-driven Statistical Model Checking to ensure model resilience under structural uncertainty and extreme market shocks.
    design:
      columns: '1'
    
  # 3. NEWS
  - block: collection
    id: news
    content:
      title: Latest News
      subtitle: ''
      text: ''
      filters:
        folders:
          - blog
        exclude_featured: false
    design:
      view: date_title_summary
      columns: 2

  # 4. PUBBLICAZIONI
  - block: collection
    id: papers
    content:
      title: Publications
      filters:
        folders:
          - publications
        featured_only: false
    design:
      view: citation
      columns: 1
---
