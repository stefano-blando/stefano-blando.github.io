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
      title: '📚 Panoramica della Ricerca'
      subtitle: 'Il mio lavoro combina AI, agent-based modeling e metodi quantitativi per costruire simulazioni economiche flessibili, testabili e ancorate ai dati.'
      items:
        - name: 'Sistemi Multi-Agente Adattivi'
          description: 'Progetto agenti che alternano politiche euristiche, apprese tramite RL e deliberative, analizzando come le loro interazioni e le reti endogene generino fenomeni macroeconomici emergenti.'
          icon: 'brain'
          icon_pack: 'custom'
        - name: 'Verifica Statistica'
          description: 'Uso lo statistical model checking per valutare rigorosamente i modelli agent-based. Questo include diagnostica di convergenza e verifica di proprietà esplicite per garantire affidabilità.'
          icon: 'network-wired'
          icon_pack: 'custom'
        - name: 'Metodi Quantitativi Robusti'
          description: 'Applico statistica robusta, Graph Neural Networks (GNNs) e strumenti econometrici avanzati a problemi di rischio sistemico e allocazione di portafoglio su mercati reali estremi.'
          icon: 'chart-line'
          icon_pack: 'custom'
    design:
      columns: '3'
    
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
