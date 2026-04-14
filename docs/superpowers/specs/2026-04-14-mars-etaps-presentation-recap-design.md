# MARS @ ETAPS 2026 Presentation Recap Design

Date: 2026-04-14

## Context

The website already contains:

- a bilingual acceptance post for the Island Model paper at MARS @ ETAPS 2026
- a bilingual publication page for the paper
- a bilingual project page for the Island Model + MultiVeStA work

The next update should add a second bilingual blog post focused on the actual presentation experience at the workshop, while also aligning all paper links to the proceedings page and improving cross-navigation between the related pages.

## Goal

Publish a bilingual recap post about the presentation at MARS @ ETAPS 2026 and align the Island Model paper references across blog, publication, and project content so that users can consistently reach:

- the proceedings page
- the acceptance news post
- the presentation recap post
- the publication page
- the project page

## Scope

In scope:

- create one new blog post in English
- create one new blog post in Italian
- use the presentation photo from `/home/stefano/Scaricati/featured.jpg` as the featured image for the new post
- update the existing acceptance post in English and Italian
- update the publication page in English and Italian
- update the project page in English and Italian
- add direct proceedings links where relevant
- add reciprocal navigation links where useful and non-redundant

Out of scope:

- redesign of blog listing pages
- changes to the visual theme
- image editing beyond copying the provided featured image
- changes to unrelated projects or publications

## Content Strategy

### New recap post

The new post should be distinct from the existing acceptance post.

It should emphasize:

- the paper was presented at MARS @ ETAPS 2026 in Turin
- the talk went well
- this was the author's first PhD paper
- this was also the author's first international conference
- the event was a positive environment for discussion
- the author appreciated meeting professors and researchers in the area

The tone should remain consistent with the existing site:

- concise
- professional
- lightly personal
- not overly celebratory

The English and Italian versions should match in meaning, but each should read naturally in its own language rather than sounding mechanically translated.

### Existing acceptance post

The acceptance post should remain focused on the acceptance announcement.

Changes should be limited to:

- replacing the current internal "Read the paper" target with the proceedings page
- adding a short navigation link to the new presentation recap post if it fits cleanly

### Publication page

The publication page should become the canonical place for the paper metadata.

It should expose:

- a direct proceedings link in the publication front matter
- a link to the acceptance post
- a link to the new presentation recap post
- the existing interactive explorer link

### Project page

The project page should keep its research-project framing, but it should also provide:

- a direct proceedings link
- a link to the publication page or related news if useful

## Information Architecture

### New blog slug

Recommended slug:

- `mars-etaps-2026-presentation`

This is short, stable, and clearly distinct from `mars-etaps-2026-acceptance`.

### File layout

New content:

- `content/blog/mars-etaps-2026-presentation/index.md`
- `content/blog/mars-etaps-2026-presentation/index.it.md`
- `content/blog/mars-etaps-2026-presentation/featured.jpg`

Updated content:

- `content/blog/mars-etaps-2026-acceptance/index.md`
- `content/blog/mars-etaps-2026-acceptance/index.it.md`
- `content/publications/island-model-smc/index.md`
- `content/publications/island-model-smc/index.it.md`
- `content/projects/island-model-smc/index.md`
- `content/projects/island-model-smc/index.it.md`

## Linking Rules

Canonical proceedings URL:

- `https://cgi.cse.unsw.edu.au/~eptcs/paper.cgi?MARS2026.2`

Expected navigation behavior:

- the recap post links to the proceedings page and to the publication page
- the acceptance post links to the proceedings page and optionally to the recap post
- the publication page links to both news posts
- the project page links to the proceedings page and keeps the interactive explorer link

Cross-links should improve navigation without turning pages into link dumps.

## Media Handling

The featured image for the new recap post should be copied from:

- `/home/stefano/Scaricati/featured.jpg`

It should be stored as:

- `content/blog/mars-etaps-2026-presentation/featured.jpg`

No resizing or format conversion is required unless a later verification step shows a rendering problem.

## Verification

After implementation, verify:

- the new post exists in both languages
- front matter is valid in all touched files
- proceedings links are consistent in all touched files
- cross-links point to the correct localized routes where applicable
- the featured image is present in the new blog folder
- a Hugo build succeeds if the local environment allows it

## Risks and Mitigations

- Risk: duplicated messaging between acceptance and recap posts
  - Mitigation: keep acceptance focused on the paper milestone and recap focused on the talk and conference experience

- Risk: inconsistent localized links
  - Mitigation: explicitly use `/en/...` and `/it/...` routes where needed in front matter links

- Risk: overlinking on publication/project pages
  - Mitigation: add only the proceedings link and the two most relevant navigation links
