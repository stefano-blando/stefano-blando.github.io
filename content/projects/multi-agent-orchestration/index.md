---
title: Multi-Agent Orchestration
date: 2026-03-18
summary: Competitive multi-agent system built for Hackapizza 2.0, using event-driven orchestration, phase-specific strategies, and MCP/HTTP tools for real-time gameplay decisions.
tags:
  - Hackathon
  - Multi-Agent Systems
  - Event-Driven Systems
  - MCP
  - Python
links:
  - icon: brands/github
    name: Code
    url: https://github.com/stefano-blando/multi-agent-orchestration
---

This project was built for **Hackapizza 2.0**, a competitive environment where the agent had to operate in real time under changing game phases, limited information, and strong timing constraints.

The system is structured as an **event-driven multi-agent orchestration layer**. It listens to the game through SSE events, keeps a runtime representation of the restaurant state, and switches strategy depending on the current phase of play: speaking, bidding, waiting, and serving.

What makes the project interesting is not just the use of multiple agents, but the way orchestration is tied to operational robustness. Different tools are used for different actions through **MCP** and HTTP wrappers, while local persistence, metrics, and replay analysis help make decisions more stable under noisy runtime conditions.

In practice, it is a good example of a project where agentic design had to be grounded in execution reliability rather than in generic prompting alone.
