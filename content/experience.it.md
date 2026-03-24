---
title: 'Esperienza'
date: 2023-10-24
type: landing

design:
  spacing: '5rem'

# Note: `username` refers to the user's folder name in `content/authors/`

# Page sections
sections:
  # Questo blocco genera SIA la timeline Lavorativa SIA quella Educativa
  - block: resume-experience
    content:
      username: me-it
    design:
      # Hugo date format
      date_format: 'January 2006'
      # Mettiamo FALSE per mostrare PRIMA l'esperienza lavorativa, poi gli studi
      is_education_first: true

  - block: resume-skills
    content:
      title: Competenze
      username: me-it
      
  - block: resume-awards
    content:
      title: Riconoscimenti
      username: me-it
      
  - block: resume-languages
    content:
      title: Lingue
      username: me-it
---
