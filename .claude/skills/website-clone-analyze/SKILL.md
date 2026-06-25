---
name: website-clone-analyze
description: Deep website analysis using source code + screenshots + visual inspection for design inspiration and reconstruction
triggers:
  - website analysieren
  - website klonen
  - seite analysieren
  - design inspiration
  - website nachbauen
  - source code analyse
  - ctrl+u
  - wie haben die das gemacht
---

# Website Clone & Analyze

Deep-analyze any website using its full HTML/CSS/JS source code combined with visual screenshots. Much better results than screenshots alone.

## When to use
- User wants to analyze/rebuild a website design
- Design inspiration from reference sites
- Understanding how a site's layout/effects work
- Competitive website analysis
- Any "schau dir diese Seite an" or "wie haben die das gemacht" request

## Pipeline

### Step 1: Fetch Source + Screenshots
1. WebFetch the URL to get full HTML source
2. Use Playwright to screenshot at multiple viewports:
   - Desktop (1920x1080)
   - Tablet (768x1024)
   - Mobile (375x812)
3. Take element-specific screenshots of interesting components

### Step 2: Analyze Source Code
Extract from HTML/CSS/JS:
- **Layout system** (CSS Grid, Flexbox, framework)
- **CSS Framework** (Tailwind, Bootstrap, custom)
- **JS Framework** (React, Next.js, Vue, vanilla)
- **Fonts** (Google Fonts, custom, system)
- **Color palette** (extract all hex/rgb values)
- **Animations** (CSS transitions, GSAP, Framer Motion, scroll-based)
- **Special effects** (custom cursors, parallax, 3D, WebGL)
- **Image handling** (lazy loading, formats, CDN)
- **Meta/SEO** (Open Graph, structured data, meta tags)
- **Performance patterns** (code splitting, prefetch, preload)

### Step 3: Component Breakdown
| Component | Implementation | CSS Approach | JS Library |
|-----------|---------------|-------------|------------|
| Hero | Full-width section | Grid + absolute | GSAP scroll |
| Navigation | Sticky header | Flexbox | Headless UI |
| Gallery | Masonry grid | CSS columns | Lightbox |

### Step 4: Replication Guide
For each component {User} wants to use:
1. Minimal code snippet (React/Next.js compatible)
2. Required npm packages
3. Tailwind classes or CSS needed
4. Adaptation notes for {User}'s brand

### Step 5: Save Analysis
Save to `docs/website/analysis-{domain}.md`

## Integration
- Reference: `docs/website/website-design-inspiration.md`
- Reference: `docs/website/website-comparison-audit.md`
- New analyses feed into website rebuild workflow

## Auto-Fire Rules
- User shares a URL and asks "wie haben die das gemacht?"
- User says "analysier diese Website"
- User references design inspiration
- Website rebuild sessions need reference analysis
