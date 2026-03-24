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
        url: /uploads/resume.pdf
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
      subtitle: 'AI, Agent-Based Modeling, and Economics'
      text: |
        I study how adaptive agents make decisions, interact through changing networks, and generate aggregate economic dynamics.

          My work combines **AI**, **agent-based modeling**, and **quantitative methods** to build economic simulations that are not only more flexible, but also more testable and empirically grounded.


        ### Core Research Pillars:

        * **Adaptive Multi-Agent Systems:** Designing agents that switch across heuristic, learned, and deliberative policies while their interaction networks evolve endogenously.
        * **Statistical Verification of Simulations:** Using **statistical model checking** to evaluate agent-based models through explicit properties, parameter exploration, and convergence diagnostics.
        * **Robust Quantitative Methods:** Applying robust statistics, network methods, and econometric tools to problems in systemic risk, portfolio allocation, and firm-level distress.

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
