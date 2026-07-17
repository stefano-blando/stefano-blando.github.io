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

# Particles Background (Network)
  - block: markdown
    content:
      text: |
        <div id="tsparticles" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 0; pointer-events: none;"></div>
        <script src="https://cdn.jsdelivr.net/npm/tsparticles@3.5.0/tsparticles.bundle.min.js"></script>
        <script>
        (function initParticles() {
            if (typeof tsParticles !== 'undefined') {
                tsParticles.load({
                    id: "tsparticles",
                    options: {
                        background: { color: { value: "transparent" } },
                        fpsLimit: 60,
                        interactivity: {
                            events: { onHover: { enable: true, mode: "grab" } },
                            modes: { grab: { distance: 150, links: { opacity: 0.8 } } }
                        },
                        particles: {
                            color: { value: "#ffffff" },
                            links: { color: "#93c5fd", distance: 150, enable: true, opacity: 0.8, width: 2 },
                            move: { direction: "none", enable: true, outModes: { default: "bounce" }, random: false, speed: 2, straight: false },
                            number: { density: { enable: true, area: 800 }, value: 80 },
                            opacity: { value: 1 },
                            shape: { type: "circle" },
                            size: { value: { min: 2, max: 4 } }
                        },
                        detectRetina: true
                    }
                });
            } else {
                setTimeout(initParticles, 100);
            }
        })();
        </script>

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
