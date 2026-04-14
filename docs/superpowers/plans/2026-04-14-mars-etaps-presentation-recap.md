# MARS @ ETAPS 2026 Presentation Recap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a bilingual MARS @ ETAPS 2026 presentation recap post, copy the provided featured image into the new post folder, and align proceedings/cross-links across the related Island Model blog, publication, and project pages.

**Architecture:** Keep the existing Hugo Blox content structure unchanged. Add one new bilingual post under `content/blog/`, update the existing acceptance post in place, and add a small number of curated links to the Island Model publication and project pages so all entry points consistently expose the proceedings page and related news.

**Tech Stack:** Hugo Blox content files (`.md` front matter + Markdown), local static image asset, shell verification with Hugo project commands where available.

---

### Task 1: Add the new bilingual presentation recap post

**Files:**
- Create: `content/blog/mars-etaps-2026-presentation/index.md`
- Create: `content/blog/mars-etaps-2026-presentation/index.it.md`
- Create: `content/blog/mars-etaps-2026-presentation/featured.jpg`

- [ ] **Step 1: Create the new English post**

Write front matter and body for a short recap focused on the successful presentation, first PhD paper, first international conference, and positive workshop environment.

- [ ] **Step 2: Create the new Italian post**

Mirror the English post in natural Italian with equivalent metadata and matching cross-links.

- [ ] **Step 3: Copy the provided featured image**

Copy `/home/stefano/Scaricati/featured.jpg` to `content/blog/mars-etaps-2026-presentation/featured.jpg`.

### Task 2: Update the acceptance post to use proceedings and point to the recap

**Files:**
- Modify: `content/blog/mars-etaps-2026-acceptance/index.md`
- Modify: `content/blog/mars-etaps-2026-acceptance/index.it.md`

- [ ] **Step 1: Replace the current paper link**

Point the "Read the paper" call-to-action to `https://cgi.cse.unsw.edu.au/~eptcs/paper.cgi?MARS2026.2`.

- [ ] **Step 2: Add a compact cross-link to the new recap post**

Add one short line pointing readers to the presentation recap post, using localized routes.

### Task 3: Update the publication page links

**Files:**
- Modify: `content/publications/island-model-smc/index.md`
- Modify: `content/publications/island-model-smc/index.it.md`

- [ ] **Step 1: Add proceedings link to front matter**

Add a `Proceedings` entry under `links:` pointing to `https://cgi.cse.unsw.edu.au/~eptcs/paper.cgi?MARS2026.2`.

- [ ] **Step 2: Add links to both related news posts**

Keep the existing news relationship, distinguish `Acceptance News` and `Presentation Recap`, and preserve the interactive explorer link.

### Task 4: Update the project page links

**Files:**
- Modify: `content/projects/island-model-smc/index.md`
- Modify: `content/projects/island-model-smc/index.it.md`

- [ ] **Step 1: Add proceedings link to project front matter**

Insert a `Proceedings` entry in `links:` without removing existing project links.

- [ ] **Step 2: Add one compact in-body reference to the publication page**

Point readers toward the publication page and/or related news without turning the page into a link list.

### Task 5: Verify touched content

**Files:**
- Verify: `content/blog/mars-etaps-2026-presentation/index.md`
- Verify: `content/blog/mars-etaps-2026-presentation/index.it.md`
- Verify: `content/blog/mars-etaps-2026-acceptance/index.md`
- Verify: `content/blog/mars-etaps-2026-acceptance/index.it.md`
- Verify: `content/publications/island-model-smc/index.md`
- Verify: `content/publications/island-model-smc/index.it.md`
- Verify: `content/projects/island-model-smc/index.md`
- Verify: `content/projects/island-model-smc/index.it.md`

- [ ] **Step 1: Inspect the touched files**

Check that front matter remains valid and localized links are correct.

- [ ] **Step 2: Confirm the featured image exists in the new post folder**

Verify the copied file path is present.

- [ ] **Step 3: Run a Hugo build if feasible**

Use the project’s standard local build command and stop if missing dependencies block verification.
