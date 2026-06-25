---
name: design-md-generator
description: Generate strukturierte DESIGN.md Specs nach VoltAgent awesome-design-md Schema mit 9 Sektionen. Verhindert AI-Slop bei Web-Generierung in Claude Code.
triggers:
  - design.md
  - design system erstellen
  - DESIGN.md generieren
  - design tokens extrahieren
  - website design dokumentieren
  - anti ai slop
  - design specs
  - branding system
---

# DESIGN.md Generator

Erstelle strukturierte Design-System-Specs (`DESIGN.md`) nach dem VoltAgent **awesome-design-md** Schema. Diese Dateien werden von Claude Code/LLMs gelesen um konsistente UIs zu generieren statt generischem AI-Slop.

## When to use
- Neue Website starten und Design-DNA festlegen wollen
- Bestehende Website ({deine-domain}.com) dokumentieren
- Referenz-Künstler/Brand klonen als Inspiration (die Top-Namen deiner Nische)
- Vor jedem Web-Edit in Claude Code → DESIGN.md mitliefern

## Schema (9 Pflicht-Sektionen)

1. **Visual Theme & Atmosphere** — Mood, Density, Design Philosophy
2. **Color Palette & Roles** — Semantic Name + Hex + Functional Role (Primary, Secondary, Surface, Neutrals, Semantic, Gradient System)
3. **Typography Rules** — Font Families, Hierarchy Table (Display → Micro), Principles
4. **Component Stylings** — Buttons, Cards, Inputs, Navigation mit States
5. **Layout Principles** — Spacing Scale, Grid, Whitespace Philosophy
6. **Depth & Elevation** — Shadow System, Surface Hierarchy, Borders/Rings
7. **Do's and Don'ts** — Design Guardrails und Anti-Patterns
8. **Responsive Behavior** — Breakpoints, Touch Targets, Collapsing Strategy
9. **Agent Prompt Guide** — Quick Color Reference, Ready-to-Use Prompts

## Reference

**Vollständige Beispiel-DESIGN.md** (Claude/Anthropic): `docs/website/claude-design-md-reference.md`
**Repo:** `tools/awesome-design-md/` (59 Brand-Examples lokal)
**Live:** https://github.com/VoltAgent/awesome-design-md
**Origin:** Google Stitch popularisierte das Format

## Pipeline

### Step 1: Source-Material sammeln
- Live-URL der Referenz-Site → Playwright Screenshot (Light + Dark Mode)
- Computed Styles via Browser DevTools extrahieren (Colors, Fonts, Spacing)
- Logo + Brand-Assets für Color-Picking
- Falls eigene Site: bestehender Code in `website/`

### Step 2: 9 Sektionen ausfüllen
Per Sektion strukturiert dokumentieren. Vorlage aus `docs/website/claude-design-md-reference.md` als Master-Template nehmen.

### Step 3: Output
Speichere in:
- **{deine-domain}.com:** `docs/website/{user}-design.md`
- **Referenz-Künstler:** `docs/website/references/{name}-design.md`

### Step 4: CLAUDE.md Integration
Verlinke neue DESIGN.md als Pflicht-Referenz in CLAUDE.md → Claude liest sie automatisch bei Web-Edits.

## Animation Strategy: Pop Music 4-Bar Rule (NEU 2026-04-11)

Aus Edward Sun Reel `VI_2026-04-11_ig_edwardsun-framer-japanese-history-site.md`:

**Regel:** Jeder Scroll = neuer visueller Reiz (wie in Pop-Musik alle 4 Takte ein neues Element).

In DESIGN.md Sektion 5 (Layout Principles) ergaenzen:
- **Scroll-Rhythmus:** Jede Section bringt min. 1 neue Animation
- **Preview-Hook:** Naechste Section am unteren Rand schon "peeking"
- **Storytelling-Flow:** Werk → Detail → Material → Context → CTA
- **Animations-Inventar pro Section:** Reveal, Stagger, Parallax, Color-Shift, Element-Flip

Referenz-Site: https://unifiersofjapan.framer.website (Daniel Designwork in Framer)

## DOM Element Selector Workflow (NEU 2026-04-11)

Aus `VI_2026-04-11_ig_metaverse-claude-dom-element-selector.md`:

Claude Code Desktop kann jetzt DOM Elements direkt im Live-Preview pickern statt Screenshots zu beschreiben:
- Auto-captures: tags, classes, styles, HTML context, React source files + props
- **2-3x faster UI Iterations**

**Workflow:**
1. Dev-Server starten (`npm run dev`)
2. Claude Code Desktop oeffnen mit Live-Preview
3. Element pickern statt screenshot
4. Direkt editieren in DESIGN.md Compliance

## Quick-Start mit getdesign CLI

```bash
mkdir -p tools/getdesign-cache && cd tools/getdesign-cache
npx getdesign@latest add claude    # Holt Anthropic DESIGN.md
npx getdesign@latest add stripe    # Holt Stripe DESIGN.md
# Output: DESIGN.md im current dir → manuell ans richtige Ziel verschieben
```

## Künstler-Use-Case
{Users} Werk hat eine spezifische Farbpalette (Erdtöne, Pop-Akzente). Eine eigene DESIGN.md für {deine-domain}.com sollte:
- Hand-painted Aesthetic (nicht clean tech)
- Art-Specific Layout (Werkverzeichnis als Hero)
- Mobile-First (44px Touch Targets, 16px Min Font)
- Minimal Animations (Fokus auf Werk)
- Connection zu {Users} Maler-Identität

## Output-Format
Markdown mit Hex-Codes in Code-Blocks, Tables für Hierarchy, klare H2/H3 Struktur.
