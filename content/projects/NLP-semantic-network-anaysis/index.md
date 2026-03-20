---
title: NLP & Semantic Network Analysis
date: 2026-01-10
summary: Text analytics project combining correspondence analysis, clustering, and network science to extract stable semantic structure from large unstructured corpora.
tags:
  - Text Mining
  - Network Science
  - Correspondence Analysis
  - Clustering
  - R
links:
  - icon: github
    icon_pack: fab
    name: Code
    url: https://github.com/stefano-blando/sentiment-semantic-lexicometric-network-analysis # Aggiorna se necessario
  - icon: file-alt
    icon_pack: fas
    name: Paper
    url: /publications/multi-method%20triangulation%20text-analytics/
---

Development of a comprehensive methodology for **extracting knowledge from unstructured text** by bridging statistical analysis with network science. Applied to a case study of *The Adventures of Sherlock Holmes*, this project transforms raw textual data into navigable semantic maps.

This line of work later evolved into the related paper on multi-method validation for large-scale multilingual text analytics.

**Technical Stack:**
* **Text Representation:** Vector Space Model utilizing **TF-IDF** weighting to capture term importance and filter stop-words.
* **Dimensionality Reduction:** Applied **Correspondence Analysis (CA)** to identify associations between terms and documents in a lower-dimensional factor map.
* **Clustering & Network Analysis:** Utilized **K-Means** for semantic grouping and the **Louvain algorithm** for detecting modular communities within the keyword co-occurrence network.
* **Visualization:** Integration with **Gephi** and R libraries (factoextra, igraph) to visualize the topological structure of semantic relationships.
