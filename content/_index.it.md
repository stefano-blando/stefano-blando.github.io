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
      username: me-it
      text: ''
      button:
        text: Scarica CV
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
      title: '📚 Panoramica della Ricerca'
      subtitle: 'AI, Agent-Based Modeling ed Economia'
      text: |
        Studio come agenti adattivi prendono decisioni, interagiscono attraverso reti che cambiano nel tempo e generano dinamiche economiche aggregate.

          Il mio lavoro combina **AI**, **agent-based modeling** e **metodi quantitativi** per costruire simulazioni economiche non solo piu flessibili, ma anche piu verificabili e meglio ancorate ai dati.


        ### Pilastri principali della ricerca:

        * **Sistemi Multi-Agente Adattivi:** Progetto agenti che alternano politiche euristiche, apprese e deliberative mentre le loro reti di interazione evolvono endogenamente.
        * **Verifica Statistica delle Simulazioni:** Uso lo **statistical model checking** per valutare modelli agent-based tramite proprieta esplicite, esplorazione dei parametri e diagnostica di convergenza.
        * **Metodi Quantitativi Robusti:** Applico statistica robusta, metodi di rete e strumenti econometrici a problemi di rischio sistemico, allocazione di portafoglio e fragilita d'impresa.

    design:
      columns: '1'
    
  # 3. NEWS
  - block: collection
    id: news
    content:
      title: Ultime News
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
      title: Pubblicazioni
      filters:
        folders:
          - publications
        featured_only: false
    design:
      view: citation
      columns: 1
---
