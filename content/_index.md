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

          I develop **adaptive cognitive architectures** for economic agents that co-evolve their decision strategies and social connections within complex networks — moving beyond static equilibrium toward realistic, heterogeneous, and
  adaptive behavior.

          ### Core Research Pillars:

          * **Adaptive Agents & Network Formation:** Designing multi-tier cognitive architectures (MARL + GNN) where agents learn *how* to learn, forming and rewiring economic networks endogenously. Exploring **Agentic AI** (LLM-based
  deliberative agents) as a novel layer for economic simulation.
          * **Formal Validation & Statistical Model Checking:** Employing **Statistical Model Checking** (MultiVeStA) and HPC-driven analysis to rigorously validate agent-based models under structural uncertainty, bridging the gap between
   theoretical simulations and empirical reality.
          * **Robust Statistics & Functional Data Analysis:** Applying **robust high-dimensional methods** and Functional Data Analysis to ground complex models in real-world data — from macro-financial panel data to network topology
  signals for systemic risk detection.
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
