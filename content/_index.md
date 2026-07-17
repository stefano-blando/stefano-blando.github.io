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
          description: 'Designing agents that switch across heuristic, learned, and deliberative policies while their interaction networks evolve endogenously.'
          icon: 'robot'
          icon_pack: 'fas'
        - name: 'Statistical Verification'
          description: 'Using statistical model checking to evaluate agent-based models through explicit properties, parameter exploration, and convergence diagnostics.'
          icon: 'chart-network'
          icon_pack: 'fas'
        - name: 'Robust Quantitative Methods'
          description: 'Applying robust statistics, network methods, and econometric tools to problems in systemic risk, portfolio allocation, and firm-level distress.'
          icon: 'chart-line'
          icon_pack: 'fas'
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
