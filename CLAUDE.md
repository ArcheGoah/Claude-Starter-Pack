# CLAUDE.md - {DEIN_PROJEKT_NAME}

> **Hinweis:** Das ist das Herzstueck deines Setups. Claude liest diese Datei bei JEDER Session.
> Fuelle die Platzhalter `{...}` mit deinen echten Daten aus. Loesche was du nicht brauchst.

---

## Person

{DEIN_NAME}, {JAHRGANG}, {STADT}. {DEIN_BERUF / DEINE_ROLLEN}.
Medien/Skills: {z.B. Coding, Design, Musik, ...}.
Profil: docs/personal/profil.md

## Ziel

{Was willst du in den naechsten 1-5 Jahren erreichen? Konkrete Zahl + Datum.}

## Fokus

**Aktueller Sprint:** {Was arbeitest du gerade ab? z.B. "Website-Launch", "MVP fertig", "Portfolio-Aufbau"}
{Phase 1} -> {Phase 2} -> {Phase 3}. Siehe ROADMAP.md (falls vorhanden)

---

## Projekt-Struktur

```
{DEIN_PROJEKT}/
|-- CLAUDE.md, README.md, ROADMAP.md, package.json  # Root
|-- docs/                       # Alle Dokumentation
|   |-- personal/               # Profil, CV, persoenliches
|   |-- business/               # Business, Legal, Strategie
|   |-- research/               # Recherchen, Reports
|   `-- platforms/              # Social Media, Externes
|-- config/                     # JSON Configs, .env
|-- src/                        # Source Code
|-- scripts/                    # Utility Scripts
|-- .claude/
|   |-- rules/                  # Arbeitsregeln, Intelligence, Feedback
|   |-- skills/                 # 120 lokale Skills (Auto-Fire)
|   |-- agents/                 # Custom Sub-Agents
|   `-- settings.json           # Permissions, Hooks, Env
|-- memory/                     # Auto-Memory (persistent zwischen Sessions)
`-- .mcp.json                   # MCP Server Config
```

Regeln, Datei-Konventionen, Tool-Pfade: `.claude/rules/arbeitsregeln.md`

## 2026 System Rules (PFLICHT-LEKTUERE)

- **Windows Bash:** IMMER `/a/`, `/c/` statt `A:/`, `C:/` + `shopt -s nullglob` (MSYS glob bug)
- **IG Algorithm 2026:** Sends/Reach > Saves > Watch > Comments > Likes. Captions: 125-char hook, 3-5 hashtags, Caption-SEO, DM-Share CTAs
- **EU AI Act Disclosure:** Ab 2026-08-02 alle AI-assisted content disclosen
- **Model Routing:** Opus default, Haiku fuer Lookups (`/model haiku`), Sub-Agents mit model-frontmatter
- **1M Context:** Bei grossen Tasks alle relevanten Docs + Memory + Codebase gleichzeitig laden
- **Prompt Caching:** 1h TTL spart ~$60/Mo, 5x schnellere Session-Starts
- **ffmpeg 8.1:** Native Whisper filter verfuegbar - ersetzt faster-whisper Pipeline by single command

## Website Stack (Beispiel - falls du eine Website baust)

- **Framework:** Next.js 16 + React 19 + Tailwind 4
- **Auth:** Auth.js v5 (`next-auth ^5.0.0-beta.31`)
- **Proxy:** Next 16 proxy (NOT next.config.ts rewrites)
- **Notion DB IDs:** in TypeScript (NOT JSON) wenn Web-Frontend
- **Routes:** App Router (`app/` Verzeichnis)

## Tools & Pfade (PASS DIESE AN DEIN SYSTEM AN)

| Tool | Pfad (Beispiel - aendere fuer dein System) |
|------|------|
| ffmpeg/ffprobe | `/c/Users/{DEIN_USER}/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_*/bin` |
| yt-dlp | `/c/Users/{DEIN_USER}/AppData/Local/Programs/Python/Python310/Scripts/yt-dlp` |
| Cookies (IG) | `config/cookies.txt` |
| Secrets | `.env` (im .gitignore!) |

## Auto-Fire Skills (Kontext -> Skill)

> **Wichtig:** Diese Skills feuern AUTOMATISCH wenn du das Pattern erwaehnst. Du musst sie nicht mit `/skill-name` aufrufen.

### Video & Audio
- Video URL -> `video-import` | Long video (>10min) -> `gemini-video-analyzer`
- AE/Render/Motion Graphics -> `ae-mcp-bridge` (broken aerender umgehen) oder `ae-automation`
- Resolume/MadMapper/Live Visuals -> `osc-control`
- Reels/9:16/Instagram-Format -> `ffmpeg-batch` (mit Whisper-Filter)
- Premiere Pro -> `premiere-mcp-bridge`
- Transkription/SRT/Untertitel -> `whisper-cut-ffmpeg`
- Rough Cut / "beste 30 Sekunden" -> `transcript-cutter` -> `agentic-edit-critic`
- Library aus Footage / Interview / Doku -> `buttercut-roughcut`

### Content & Social Media
- Reels/Video Script -> `reel-template`
- Carousel/Karussell -> `carousel` (1080x1350 portrait)
- Instagram Caption -> `instagram-caption-generator`
- LinkedIn Post -> `linkedin-post-formatter`
- Twitter Thread -> `tweet-thread-generator`
- YouTube Script -> `youtube-script-outliner`
- Comment-Gate Lead-Magnet -> `comment-gate-reel`
- 4 Tools Reel / "X Tools every" -> `tool-list-reel`
- Process-Reel / Build-Diary -> `process-as-content-reel`
- Cold Email -> `cold-email`
- Email / Newsletter -> `email-write`

### Design & Visuelles
- Referenz/Inspiration/ArtStation -> `gallery-dl`
- Algorithmic Art / Generative -> `algorithmic-art` (p5.js)
- Canvas Design / Poster / PDF Art -> `canvas-design`
- Hero/Particle/3D Background -> `particle-hero`
- Shader/WebGPU/Distortion -> `shader-portfolio`
- AR Plakat / WebAR / MindAR -> `ar-poster-pipeline`
- Blender (Image-to-3D, 164 Tools) -> `blender-control`
- Transparent Animated WebP -> `webp-alpha-animation`

### Code & Dev
- Library/Framework Docs (React, Next, Vue, ...) -> `context7` MCP
- Claude API / Anthropic SDK -> `claude-api`
- Browser Automation -> `playwright-skill`
- Codex Review (cheaper than Opus) -> `codex-review`
- Pair Programming / TDD -> `test-driven-development`

### Web & Marketing
- **Web-Edit/Website -> `design-md-generator` (PFLICHT vor Edits an Websites)**
- SEO Audit / Site Health -> `seo-audit`
- Copywriting / Landing Page -> `copywriting`
- Content Strategy -> `content-strategy`
- Programmatic SEO -> `programmatic-seo`
- Schema Markup -> `schema-markup`

### Research & Analysis
- Recherche 3+ Aspekte -> `parallel-research-agent` (3-5 Sub-Agents parallel)
- "Was sagen Leute zu X?" (Reddit/X/HN) -> `last30days`
- Web-Inhalt sauber lesen -> `defuddle` (clean markdown statt WebFetch)
- Firecrawl / Web Scraping -> `firecrawl-web`
- Foerder-PDF / Knowledge Graph -> `lightrag-knowledge`
- Strategic Decision / Business Bottleneck -> `strategic-founder-prompts`

### Documents & Knowledge
- Word .docx erstellen -> `docx`
- PDF erstellen/lesen -> `pdf`
- Excel/Sheets -> `xlsx`
- PowerPoint -> `pptx`
- JSON Canvas -> `json-canvas`

### Privacy & Local
- Rate-Limit / Privacy / Local Model -> `ollama-fallback` (Ollama + Qwen3/Gemma3 lokal)

### Session Management
- Session-End / Insights -> `claude-insights-tracker`
- Brainstorming neuer Feature -> `brainstorming`
- Verification before completion -> `verification-before-completion`

## Pflicht-Referenzen bei Web-Edits

VOR jedem Edit an Website-Code:
1. Lese `docs/website/claude-design-md-reference.md` (Vorlage 9-Sektionen) - falls vorhanden
2. Falls Design-Doc fehlt: SOFORT via `design-md-generator` Skill erstellen lassen

## Notion (optional - falls du Notion nutzt)

- **Token:** In `.env` (NOTION_TOKEN) - NIEMALS in Git committen
- **Config:** config/notion.json (DB IDs)
- **Client:** `src/shared/notion_client.py` (Python) oder `lib/notion.ts` (TypeScript)

## Deadlines (Beispiel - deine eigenen eintragen)

- {DEIN_DEADLINE_1}: {DATUM}
- {DEIN_DEADLINE_2}: {DATUM}

---

## Wie das System funktioniert

1. **Skills feuern automatisch** - du musst sie nicht aufrufen. Erwaehne das Pattern, Claude erkennt es.
2. **Memory ist persistent** - `memory/MEMORY.md` wird bei jeder Session geladen. Lerne Claude an, indem du Feedback gibst.
3. **Sub-Agents fuer Parallel-Tasks** - bei 2+ unabhaengigen Aufgaben spawn Claude automatisch parallele Agents.
4. **MCP-Server** in `.mcp.json` geben Claude Zugriff auf externe Tools (Notion, Firecrawl, Chrome, etc.).
5. **Hooks** in `.claude/settings.json` triggern bei Session-Start, Pre-Edit, Post-Task, etc.

## Was tun bei einer neuen Session?

Claude macht das automatisch (siehe `.claude/rules/intelligence.md`):
1. Deadlines pruefen (`docs/business/funding-deadlines.md` falls vorhanden)
2. `git log --oneline -10` checken
3. Memory laden (`memory/MEMORY.md`)
4. Notion Tasks pruefen (falls verbunden)
5. Root-Verzeichnis auf Muell scannen
