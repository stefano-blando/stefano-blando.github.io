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
        url: https://stefano-blando.github.io/uploads/resume.pdf
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
  - block: features
    content:
      title: '📚 Research Overview'
      subtitle: 'My work combines AI, agent-based modeling, and quantitative methods to build economic simulations that are flexible, testable, and empirically grounded.'
      items:
        - name: 'Adaptive Multi-Agent Systems'
          description: 'I design and simulate complex populations of agents that dynamically adapt their behavior. By combining reinforcement learning, heuristic rules, and deliberative strategies, these models reveal how micro-level interactions and evolving networks generate emergent macroeconomic phenomena.'
          icon: '🤖'
          icon_pack: 'emoji'
        - name: 'Statistical Verification'
          description: 'Ensuring the reliability of simulations is crucial. I employ advanced statistical model checking techniques to rigorously evaluate agent-based models. This involves exploring vast parameter spaces, conducting convergence diagnostics, and verifying explicit properties to build trust in simulated outcomes.'
          icon: '🕸️'
          icon_pack: 'emoji'
        - name: 'Robust Quantitative Methods'
          description: 'My research applies state-of-the-art econometric tools, robust statistics, and Graph Neural Networks (GNNs) to real-world financial data. I focus on quantifying systemic risk, optimizing portfolio allocation, and predicting firm-level distress under extreme market conditions.'
          icon: '📈'
          icon_pack: 'emoji'
    design:
      columns: '3'
    
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
