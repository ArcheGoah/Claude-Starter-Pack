---
name: process-as-content-reel
description: Designer + AI Story-Format à la Sabum. Process IST der Content. Scroll-Diary unter Demo, Hand-built mit AI als Co-Creator. Crossover Kuenstler+Code Niche.
triggers:
  - process as content
  - sabum style
  - design diary
  - work diary
  - designer ai collab
  - hand built ai
  - crossover content
  - making of
---

# Process-as-Content Reel

Format inspiriert von Sabum Byun (`video-imports/VI_2026-04-11_ig_sabum-css-dragon-cursor.md`). Die zentrale Erkenntnis:

> **"Designer's eye, AI's hands. Neither could do this alone."**

Process IST der Content. Statt nur das fertige Werk zeigen → Build-Diary unter dem Demo, scroll-driven.

## When to use
- Reels ueber Coding-Experimente die {User} mit Claude Code macht
- Werk-Process-Documentation (Painting + Tech-Layer)
- AR Poster Build-Diary
- Custom Cursor / Shader Experiments
- Blender MCP Sessions
- Bot/App Feature Builds

## Format-Regeln (aus Sabum-Analyse)

1. **Zwei Layer:**
   - Visual Demo (Top) — das fertige Werk/Tool/Effekt
   - Scroll-Diary (Bottom) — der Build-Prozess mit Iterations

2. **Tagline pro Reel:**
   - "Designer's eye, AI's hands. Neither could do this alone."
   - Oder Variant: "Painter's instinct, code's precision."
   - Oder: "I painted it. AI moved it. Together it became this."

3. **Story-Arc:**
   - Hook: Das fertige Resultat
   - Reveal: "Started as a [random conversation]"
   - Iteration: Mehrere Build-Stages (gif/video pro Stage)
   - Insight: Was nur durch AI moeglich war / Was nur durch Designer-Eye moeglich war
   - CTA: Comment-Gate (Single-Word Trigger)

4. **Hosting:**
   - Live-Demo URL (wie sabum.kr/lab) — Process-Diary unter dem Demo
   - Embed in Portfolio ({deine-domain}.com/lab)

## Beispiel-Reels fuer {User}

### "Painted Cursor — Pinselstrich folgt deinem Maus"
- Hook: Custom Cursor Live auf {deine-domain}.com
- Demo: Cursor mit Pinselstrich-Trail, Click → Splash
- Diary: "Started as: 'Mein Cursor sollte sich anfuehlen wie mein Maler-Pinsel'"
  - Stage 1: CSS @property Setup (mit Claude)
  - Stage 2: Trail-Algorithmus (Iterations)
  - Stage 3: Click-Splash mit Particles
  - Stage 4: Performance-Optimierung
- CTA: Comment "BRUSH" fuer den Code

### "Werk → 3D in Echtzeit (Blender + Claude)"
- Hook: Foto eines Werks → 3D-Variante in Blender
- Demo: Image-to-3D Pipeline
- Diary: blend-ai MCP Setup, Iterations, Material-Refinement
- CTA: Comment "3D" fuer den Workflow

### "Mein Custom Skill der mein Werkverzeichnis verwaltet"
- Hook: Notion-Werkverzeichnis self-updating
- Demo: Custom Werkverzeichnis-Skill in Action
- Diary: Skill-Build-Process, Errors, Fixes
- CTA: Comment "CATALOG" fuer den Skill

## Pipeline

### Step 1: Build-Session aufzeichnen
- Screen-Recording IM Build-Process
- Time-Lapse via `ffmpeg-batch` Skill

### Step 2: Selfie-Webcam parallel
- Talking-Head Reactions waehrend Build
- Picture-in-Picture im finalen Reel

### Step 3: Diary-Page bauen
- Eigenes /lab Verzeichnis auf {deine-domain}.com
- Pro Experiment: Live-Demo + Markdown-Diary unter dem Demo
- Pretext Library nutzen (NEU 2026-04-11) fuer Text-Layout-Performance

### Step 4: Reel produzieren
- via `video-remotion` ODER `ae-automation` Skill
- Hook 0-3s, Reveal 3-8s, Build-Stages 8-25s, Insight 25-28s, CTA 28-30s
- Pairs mit `comment-gate-reel` Skill fuer Caption

### Step 5: Cross-Posten
- Instagram (Hauptkanal)
- TikTok (Crossposting)
- LinkedIn (Process-Heavy Audience)
- {deine-domain}.com/lab Embed

## Verwandte Skills
- `comment-gate-reel` — Caption mit Trigger
- `shader-portfolio` — Custom Shader Process
- `particle-hero` — Particle Process
- `video-remotion` — Programmatic Production
- `playwright-skill` — Browser-Recording Setup
- `ffmpeg-batch` — Time-Lapse + Editing

## Output
- `content-pipeline/process-reels/{date}-{topic}/` — Footage + Script + Diary
- `website/src/lab/{slug}.tsx` — Live-Demo Page
- `docs/website/lab-template.md` — Template fuer alle Lab-Pages

## Reference
- Source: `video-imports/VI_2026-04-11_ig_sabum-css-dragon-cursor.md`
- Live: https://sabum.kr/03_playground/lab_dragon_type
- Engagement: 6'171 Likes, 35 Comments (qualitatives Engagement, niche but loyal)
