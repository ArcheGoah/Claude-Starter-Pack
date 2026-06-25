---
name: tool-list-reel
description: List-Format Reel "X tools every artist needs" - generiert basierend auf swiperightai 32.5k Likes Format. Optimiert fuer Art/Code-Crossover Niche.
triggers:
  - tool list reel
  - x tools every
  - tool empfehlung video
  - list reel
  - 4 tools reel
  - 5 tools fuer kuenstler
---

# Tool List Reel Generator

Generiert "X Tools Every [Niche] Needs" Reel im swiperightai Format (32.5k Likes / 5.2k Comments). Quelle: `video-imports/VI_2026-04-10_ig_swiperightai-4-creative-coding-tools.md`.

## When to use
- Reichweite in Art-Code-Crossover Niche aufbauen
- Tools die {User} selbst nutzt teilen
- Lead-Magnet via Comment-Gate

## Format-Regeln
1. **Genau 4 Tools** (sweet spot)
2. **Hook in 1 Satz** — "If you are X, these tools will make you jealous in a good way."
3. **Pro Tool: 1 Satz + 2-3s Demo-Footage**
4. **Total Length: 30-45 Sekunden**
5. **Comment-Gate am Ende** — Single-Word Trigger
6. **Niche-spezifisch**

## 4 Templates fuer {User}

### "4 tools every digital artist needs (in 2026)"
1. Blender MCP (Claude Code Integration)
2. Remotion (Programmatic Video)
3. Resolume + OSC (Live Visuals)
4. p5.js (Algorithmic Art)

### "4 free AI tools for painters"
1. Krea Nano Banana (Reference Images)
2. Claude Code (Studio Automation)
3. Ollama + Qwen3 Coder (Local AI)
4. Three.js Particle Sim (Portfolio Hero)

### "4 tools to automate your art business"
1. Notion (CRM, Werkverzeichnis)
2. CareerOps Pattern (Galerie-Outreach)
3. Apollo + Apify (Lead Gen)
4. n8n (Content Pipeline)

### "4 tools that let me ship art websites in 1 day"
1. Next.js + Claude Code
2. awesome-design-md DESIGN.md System
3. Three.js Particle Hero
4. Vercel Deploy

## Pipeline
1. Niche pick (1 von 4 Templates)
2. Demo-Footage besorgen (2-3s pro Tool, via `ffmpeg-batch` aus `media/`)
3. Voice-Over schreiben (~80 Words)
4. Production: AE oder Remotion
5. Caption via `comment-gate-reel` Skill
6. Post Tu/Do 18:00 CET (aus Chase-Analyse)

## Output
- `content-pipeline/drafts/tool-list-{date}.md`
- `content-pipeline/captions/tool-list-{date}.md`
- `content-pipeline/footage/tool-list-{date}/`

## Verwandte Skills
- `comment-gate-reel`
- `video-remotion`
- `ae-automation`
