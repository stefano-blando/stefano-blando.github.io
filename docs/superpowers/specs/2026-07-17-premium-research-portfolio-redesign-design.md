# Premium Research Portfolio Redesign

Date: 2026-07-17

Status: Approved design

## Objective

Redesign Stefano Blando's personal academic website as a premium, dark research portfolio that balances personal identity, academic credibility, and technical work.

The site must feel professional and distinctive without resembling a corporate product page, a generic academic template, or a gaming interface. It must present Stefano as both an AI researcher and a builder of technical projects.

## Confirmed Problems

The current published homepage has several implementation and presentation issues:

- The particle network is initialized twice with the same `tsparticles` ID.
- One network container uses a negative z-index and can render behind the page background.
- The second container is embedded in a standalone Markdown section, which creates an unnecessary empty section.
- The particle library is loaded twice from jsDelivr, introducing an avoidable runtime dependency.
- The custom CSS targets generic `.card` and `.feature-card` classes that are not used by the relevant rendered Hugo Blox components.
- Education and Interests therefore keep their original low-contrast styles.
- Research Overview icon names render as visible text because the icon configuration does not match the active Hugo Blox icon API.
- The current styling applies broad rules to unrelated cards and headings, making future theme upgrades fragile.

## Audience and Desired Impression

Primary audiences:

- Academic collaborators and supervisors
- Research groups and conference contacts
- Technical collaborators and applied AI teams
- Recruiters evaluating research and engineering ability

The intended first impression is:

- Personal
- Rigorous
- Premium
- Contemporary
- Technically capable
- Easy to navigate

## Visual Direction

### Overall Theme

Use a full dark theme with an obsidian background and layered navy surfaces. The design should be refined rather than neon-heavy.

Core palette:

- Obsidian background: `#060810`
- Ink surface: `#101621`
- Navy slate surface: `#182033`
- Muted blue accent: `#526FA8`
- Steel secondary accent: `#879BB9`
- Ivory primary text: `#F5F3EF`
- Muted body text: approximately `#A5ADBA`

Cyan is reserved mainly for the scientific network and rare interactive highlights. It must not appear as a glow on every component.

### Gradient Surfaces

Cards use subtle, component-specific gradients rather than a single flat glass style:

- Adaptive systems: navy to ink with a low-opacity indigo bloom
- Statistical verification: slate-blue to ink with a low-opacity steel bloom
- Quantitative methods: navy-violet to ink with a low-opacity muted violet bloom

Gradients must remain dark enough for WCAG AA text contrast. Borders use low-opacity steel tones and become slightly brighter during hover or keyboard focus.

### Typography

Use a strong sans-serif system for navigation, labels, body content, and technical metadata. A restrained serif accent may be used for the hero headline and publication titles to add academic authority.

Copy rules:

- Use complete, natural sentences.
- Avoid em dashes as a shortcut between clauses.
- Avoid fragmented startup slogans.
- Prefer precise academic language over exaggerated marketing claims.

Approved English hero copy:

> Stefano Blando | AI Researcher and PhD Candidate
>
> Understanding complex systems through adaptive intelligence.
>
> My research lies at the intersection of artificial intelligence, agent-based modeling, and economics. I develop adaptive simulations, statistical verification methods, and practical tools for studying complex economic systems.

Approved Italian hero copy:

> Stefano Blando | Ricercatore AI e Dottorando
>
> Comprendere i sistemi complessi attraverso l'intelligenza adattiva.
>
> La mia ricerca si colloca all'intersezione tra intelligenza artificiale, modellazione agent-based ed economia. Sviluppo simulazioni adattive, metodi di verifica statistica e strumenti applicativi per studiare sistemi economici complessi.

## Homepage Information Architecture

The homepage uses the following order:

1. Personal hero
2. Research Overview
3. Academic Journey
4. Featured Projects
5. Publications and News
6. Contact footer

This order introduces the person, explains the research, demonstrates the academic path, proves technical capability, and ends with evidence and a collaboration prompt.

## Navigation

The primary navigation remains sticky and supports both homepage anchors and dedicated pages.

Desktop items:

- Stefano Blando: returns to the homepage hero
- Research: scrolls to Research Overview
- Publications: scrolls to the homepage publication section
- Projects: opens the dedicated Projects page
- Experience: opens the dedicated Experience page
- Contact: highlighted CTA that scrolls to the contact footer
- Compact EN/IT selector

News remains visible on the homepage but is not part of the primary navigation.

Navigation behavior:

- Transparent over the top of the hero
- More opaque and slightly shorter after scrolling
- Active-section indicator for homepage anchors
- Smooth scrolling for internal links
- Visible focus state for keyboard navigation
- Hamburger menu on mobile

## Components

### Personal Hero

The hero must clearly identify the site as Stefano's personal portfolio.

Desktop layout:

- Copy and calls to action on the left
- Existing portrait on the right in a softly rounded rectangular frame
- Small identity panel overlapping the portrait with PhD role, research focus, and Pisa location
- Affiliation line for Scuola Superiore Sant'Anna and the University of Pisa
- Scientific network visible behind the complete composition

Mobile layout:

- Copy first
- Portrait below the primary actions
- Identity panel remains attached to the portrait without covering the face
- Affiliations wrap cleanly

Primary actions:

- Explore my work
- Download CV

### Scientific Network Background

Use one full-viewport canvas behind the homepage content. The network is an ambient background, not a standalone visualization or page section.

Topology:

- Modular community network
- Three visible communities
- Dense internal connections
- A small number of bridge nodes and bridge edges
- Node sizes reflect degree
- Every edge has two stable endpoints

Behavior:

- Approximately 25 to 35 nodes on desktop
- Use 14 to 20 nodes below 768 pixels and when the browser reports a data-saving preference
- Very slow force-directed motion within each community
- Persistent edges that move with their endpoints
- Low default opacity
- Increased visibility in empty page regions
- Reduced visibility beneath text and cards through masks or opaque surfaces
- Pointer proximity highlights the nearest node and its immediate neighborhood
- Mild local attraction without abrupt movement
- Animation pauses when the document is hidden
- `prefers-reduced-motion` uses a static or nearly static graph
- Touch devices do not use pointer attraction

The implementation must use one local script and one canvas. It must not load tsParticles or another runtime dependency from a CDN.

### Research Overview

Present three premium gradient cards:

- Adaptive Multi-Agent Systems
- Statistical Verification
- Robust Quantitative Methods

Each card includes:

- A visible, correctly rendered icon
- A concise title
- A short description
- A subtle local gradient
- A 3 to 4 pixel hover lift
- A restrained border highlight
- An equivalent focus state for keyboard users

Avoid global `.card` selectors. Styles must be scoped to the component.

### Academic Journey

Show all five education milestones.

Desktop:

- Horizontal timeline
- Chronological left-to-right progression
- Connected line with distinct milestone nodes

Mobile:

- Vertical timeline
- No mandatory horizontal scrolling

Each milestone initially shows:

- Degree
- Institution
- Start and end dates

Expanding a milestone reveals:

- Thesis or research topic
- Final grade where available
- Supervisor or specialization where available
- Additional summary content

Expansion must work with mouse, touch, and keyboard.

### Research Interests

Do not use another large card grid. Present interests as compact chips grouped under three conceptual categories:

- Artificial Intelligence
- Economics and Quantitative Methods
- Network Science and Complex Systems

The chips provide scanability without competing with Research Overview or Featured Projects.

### Featured Projects

Show exactly three selected projects on the homepage. Each project card includes:

- Project visual
- Title
- One-sentence value statement
- Technology or methodology tags
- Clear link to the case study or interactive demo

The dedicated Projects page continues to show the full portfolio.

### Publications and PDFs

Use compact editorial rows rather than large cards. Each row includes:

- Title
- Year
- Venue or type where available
- Direct PDF action when a PDF exists
- Optional project or citation action

If no PDF is available, omit the PDF action rather than rendering a disabled or broken link.

### News

Use a short chronological list alongside Publications on wide screens and below it on narrow screens. News cards must not dominate the homepage hierarchy.

### Contact Footer

Close with a concise collaboration prompt, location, email, GitHub, LinkedIn, and Google Scholar links.

## Interaction Language

Animations must be clearly perceptible but restrained:

- Slow ambient network motion
- Section reveal based on opacity and small vertical movement
- Card lift limited to 3 or 4 pixels
- Pointer-following glow contained within the hovered card
- Very small magnetic displacement on primary buttons
- Compact sticky navigation transition

Avoid:

- Strong 3D tilt
- Continuous text animation
- Large neon halos
- Fast particle motion
- Animating every component simultaneously

## Technical Architecture

Keep Hugo Blox and the existing Markdown content model. Replace fragile homepage behavior with locally owned, isolated components.

Planned component boundaries:

- `portfolio-hero`: reads identity and affiliations from the author data
- `research-network`: owns the canvas, topology generation, animation lifecycle, pointer behavior, and motion preferences
- `research-pillars`: renders the three research cards
- `education-timeline`: reads education data and manages accessible expansion
- `featured-projects`: queries or explicitly selects three project entries
- Existing content collections continue to provide publications, news, and full project pages

Data flow:

- `data/authors/me.yaml` and `data/authors/me-it.yaml` provide identity, interests, affiliations, and education
- Homepage front matter provides translated section titles and research pillar descriptions
- `content/projects` provides Featured Projects
- `content/publications` and associated PDFs provide publication rows
- `content/blog` provides News
- Network JavaScript reads only viewport, pointer, visibility, and motion-preference state. It does not alter content data.

Implementation must use scoped class names and local assets. It must not depend on generated Hugo Blox utility-class combinations as selectors when a stable component class can be added.

## Error Handling and Progressive Enhancement

- If canvas is unsupported or network initialization fails, the dark gradient background remains complete.
- If JavaScript is disabled, all content and navigation remain usable.
- If the portrait is unavailable, render a neutral initials fallback.
- If a PDF is unavailable, omit its action.
- If an icon cannot be resolved, use a known local fallback icon and never expose the icon name as text.
- If `IntersectionObserver` is unavailable, sections render immediately without reveal animation.
- Touch and reduced-motion users receive simplified behavior automatically.

## Accessibility

- Meet WCAG AA contrast for body text, labels, controls, and focus states.
- Maintain a logical heading hierarchy.
- Provide descriptive alternative text for the portrait and project visuals.
- Make timeline expansion operable by keyboard.
- Preserve visible focus on navigation, cards, buttons, and social links.
- Ensure hover-only information is also available through focus or persistent text.
- Respect `prefers-reduced-motion`.
- Keep the canvas decorative and hidden from assistive technology.

## Performance

- Use one `requestAnimationFrame` loop.
- Pause animation when the page is hidden.
- Use 14 to 20 nodes below 768 pixels and when `navigator.connection.saveData` is true.
- Cap canvas device-pixel-ratio scaling at 2.
- Avoid external network-animation dependencies.
- Let Hugo generate responsive hero images.
- Prevent layout shift by reserving portrait and project-image dimensions.
- Keep card effects based on opacity and transforms where possible.

## Verification Plan

Build and content checks:

- Production Hugo build succeeds
- EN/IT synchronization check succeeds
- No duplicate IDs
- No missing local assets
- No icon name rendered as visible text

Responsive checks:

- 375 pixel mobile viewport
- 768 pixel tablet viewport
- 1440 pixel desktop viewport
- Horizontal Education timeline on desktop
- Vertical Education timeline on mobile
- Mobile navigation and portrait remain usable

Interaction checks:

- Internal navigation anchors
- Projects and Experience routes
- CV and PDF links
- Timeline expansion with mouse, touch, and keyboard
- Card hover and focus states
- Network pointer behavior
- Static reduced-motion behavior

Quality checks:

- Chrome, Firefox, and Safari
- No console errors
- WCAG AA contrast
- Keyboard-only navigation
- Animation pauses in background tabs
- Content remains fully usable when JavaScript or canvas enhancement fails

## Non-Goals

- Rebuilding the site in another framework
- Creating a CMS or database
- Adding a large publication-management system
- Turning the network into a standalone interactive research application
- Adding heavy 3D effects
- Redesigning unrelated project demo applications in this phase

## Success Criteria

The redesign is successful when:

- The homepage immediately reads as Stefano Blando's personal research portfolio.
- The portrait, research identity, academic trajectory, and technical projects have clear hierarchy.
- The scientific network appears connected, subtle, and responsive.
- Education and Interests remain readable on desktop and mobile.
- Research icons render correctly.
- The site feels premium without excessive neon or motion.
- Navigation to Publications, Projects, Experience, Contact, and language variants remains clear.
- Core content works without animation or canvas support.
