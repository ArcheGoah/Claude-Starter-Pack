# Intelligence System (Auto-Pilot Regeln)

## Session-Start Brain (bei JEDER neuen Session)

Bei Session-Start automatisch diese Checks durchfuehren:

1. **Deadlines pruefen** - `docs/business/deadlines.md` lesen falls vorhanden. Alles unter 14 Tagen sofort melden.
2. **Letzter git log** - `git log --oneline -10` checken. Was wurde zuletzt gemacht? Daran ankuepfen.
3. **Memory laden** - `memory/MEMORY.md` lesen, relevante Eintraege zum aktuellen Fokus heraussuchen.
4. **Notion Tasks** - Wenn Aufgaben-DB Eintraege hat, offene Tasks pruefen.
5. **Muell-Check** - Root-Verzeichnis scannen auf Dateien die da nicht hingehoeren.

## Post-Session Learning (bei JEDER Session-Ende)

Vor Session-Ende automatisch via `claude-insights-tracker` Skill:

1. **Was wurde gemacht** - Zusammenfassung als Memory-File in `memory/` ablegen
2. **Neue Erkenntnisse** - Wenn User was Neues erwaehnt hat -> Memory-File erstellen/updaten
3. **Skill-Feedback** - Welche Skills haben gefeuert? Welche Kombis gut funktioniert? -> Pattern speichern
4. **Offene Todos** - Unerledigte Arbeit in Memory speichern fuer naechste Session
5. **Insights-Report** - `memory/session_{date}.md` mit Skills-die-feuerten + Skills-die-haetten-feuern-sollen + Verbesserungsvorschlaegen

## Auto-Organisation (IMMER)

1. **Jede neue Datei** -> Sofort in den richtigen Ordner (siehe CLAUDE.md Ordner-Regeln)
2. **Jeder neue Kontakt/Galerie/Festival** -> Notion DB updaten (falls vorhanden)
3. **Jede neue Erkenntnis** -> Memory speichern (File-Memory in `memory/`)
4. **Jede Code-Aenderung** -> Skill `verification-before-completion` automatisch
5. **Jede visuelle Aenderung** -> Screenshot mit Playwright
6. **Jedes neue Video** -> Report in `video-imports/` nach Schema
7. **Muell sofort loeschen** - Keine temp Files, keine falsch benannten Dateien

## Proaktive Intelligence (OHNE Aufforderung)

| Pattern | Aktion |
|---------|--------|
| Deadline < 7 Tage | Sofort warnen + Aktionsplan vorschlagen |
| Notion DB "Research" Status | Vorschlagen offene Eintraege durchzugehen |
| CRM leer | Vorschlagen: Akquise starten |
| Neues Projekt erwaehnt | Memory anlegen + richtige Docs-Ordner erstellen |
| Gleicher Task 3x gemacht | Skill/Automation dafuer vorschlagen |
| Content-Idee im Gespraech | In Content-Pipeline Notion DB speichern |
| Preis/Budget erwaehnt | In `docs/business/` dokumentieren |

## Tool Auto-Fire (Pattern -> Skill)

| Pattern | Skill |
|---------|-------|
| Video URL | `video-import` (oder `gemini-video-analyzer` fuer >10min) |
| After Effects / AE / Render | `ae-mcp-bridge` (live control) oder `ae-automation` (ExtendScript) |
| Resolume / MadMapper / Mapping | `osc-control` |
| Premiere Pro | `premiere-mcp-bridge` |
| Reels / Instagram-Format / 9:16 | `ffmpeg-batch` (mit Whisper-Filter) |
| Whisper / SRT / Transkribieren | `whisper-cut-ffmpeg` |
| Rough Cut / Highlight schneiden | `transcript-cutter` + optional `agentic-edit-critic` |
| Library aus Footage (50+ Clips) | `buttercut-roughcut` |
| Referenz / Inspiration / ArtStation | `gallery-dl` |
| Content-Idee / Was posten | `reel-template` |
| Carousel / Karussell | `carousel` (1080x1350 portrait) |
| Caption / Bildtext | `instagram-caption-generator` |
| Cold Email / Kaltakquise | `cold-email` |
| Email Sequence / Newsletter | `email-sequence` + `email-write` |
| Algorithmic Art / Generative | `algorithmic-art` |
| Canvas / Poster / PDF Art | `canvas-design` |
| Web-Edit / Website / DESIGN.md | `design-md-generator` (Pflicht vor Web-Edit) |
| Hero-Section / Particle / 3D Background | `particle-hero` |
| Shader / Glitch / WebGPU / Distortion | `shader-portfolio` |
| Rate-Limit / Privacy / Local Model / Ollama | `ollama-fallback` |
| Comment-Gate / Lead-Magnet Caption | `comment-gate-reel` |
| 4 Tools Reel / X Tools Every | `tool-list-reel` |
| Recherche-Topic mit 3+ Aspekten | `parallel-research-agent` (3-5 Sub-Agents parallel) |
| Session-Ende / Was haben wir gemacht | `claude-insights-tracker` |
| Foerder-Suche / PDF-Wissen / Knowledge Graph | `lightrag-knowledge` (LightRAG + RAG-Anything) |
| Pre-Deploy / Adversarial Review / Bot Security | `codex-review` (Codex Plugin) |
| Strategic Decision / Business Bottleneck | `strategic-founder-prompts` (7 Templates) |
| Process-as-Content / Build Diary | `process-as-content-reel` |
| Blender / Image-to-3D | `blender-control` (164 Tools via blend-ai) |
| Particles / Hero-Background | `particle-hero` |
| Gemma / Local Open-Source Model | `ollama-fallback` |
| AR / Plakat / WebAR / MindAR | `ar-poster-pipeline` |
| Claude API / Anthropic SDK | `claude-api` |
| Library Docs (React/Next/Vue) | `context7` MCP |

Skill-Registry: `.claude/skills/REGISTRY.md`

## Skill-Matching Regel (PFLICHT bei jeder Unterhaltung)

Bei JEDEM neuen Task/Gespraech sofort pruefen:
1. **Intent analysieren** - Was will der User eigentlich erreichen?
2. **Alle Skills scannen** - Registry + Skill-Liste im System pruefen
3. **Beste Kombination waehlen** - Oft sind 2-3 Skills zusammen staerker als einer allein
4. **Sofort einsetzen** - Nicht fragen, einfach nutzen

---

## 2026 Platform Era Rules

### Instagram Algorithm 2026 (Meta ranking weights)
**Priority order:** Sends-per-Reach > Saves > Watch-through > Completion % > Comments > Likes (near-irrelevant)

Bei JEDEM Social-Media-Task anwenden:
- **Captions:** 125-char hook zone, Caption-SEO (keywords in first 10 words), **3-5 hashtags MAX** (in first comment, nicht caption), DM-Share CTAs > Follow CTAs
- **Reels:** 8-19s sweet spot, 3-sec hook rule, Dynamic Minimalism (clean sans-serif, kein gelb/gruen, keine emojis), watch-through > likes
- **Carousels:** 1080x1350 portrait (3.4x more saves als square), 7-10 slides, save-worthy > swipe-worthy
- **Threads/Notes:** 500/60 char limits, KEINE hashtags

### EU AI Act Disclosure (ab 2026-08-02)
**Pflicht:** Alle AI-assisted content MUSS disclosed sein. "Designer's eye, AI's hands" Positioning = struktureller Vorteil gegenueber undisclosed creators.

### Windows/MSYS Path Discipline (CRITICAL Bug-Fix)
Bei JEDEM Bash-Befehl mit Drive-Letters auf Windows:
- NIE `A:/Video/*.mp4` (MSYS failed silent)
- IMMER `/a/Video/*.mp4` + `shopt -s nullglob` + `mkdir -p` dirs first
- Gilt fuer: ffmpeg-batch, ae-automation, alle Skills mit A:\ oder C:\ paths

### Prompt Caching Reminder
CLAUDE.md + intelligence.md + MEMORY.md laden bei jedem Session-Start ~15k tokens - bereits cached (1h TTL) via settings.json cache_control. Spart ~$60/Monat + 5x schnellere Starts.

### Model Routing (Opus default, Haiku fuer Lookups)
- **Opus 4.8 [1M]** - Komplexe Planung, Multi-Skill-Chains, Kreative Arbeit (default)
- **Sonnet 4.6** - Balanced research, coding, implementation
- **Haiku 4.5** - Schnelle Lookups, File-Reads, Verification-Checks (proactive via `/model haiku`)
- **Sub-Agents:** Model-frontmatter setzen je Aufgabe (researcher->sonnet, Explore->haiku, coder->sonnet)

### Sub-Agent Isolation (60-95% context savings)
Bei 2+ unabhaengigen Recherche/Lookup Tasks IMMER Sub-Agents spawnen (nicht im Main-Context arbeiten). Pattern: agent writes report to disk -> main reads summary only.

---

## AI Video Editing Auto-Fire Rules

| Pattern | Skill Chain |
|---------|-------------|
| "Premiere" / "timeline" / "sequence" | `premiere-mcp-bridge` (requires proxy + UXP plugin + Premiere Beta 25.3+) |
| "After Effects" / "AE comp" / "motion graphics" | `ae-mcp-bridge` (via TheLlamainator MCP) |
| "Transkribiere" / "SRT" / "Untertitel aus video" | `whisper-cut-ffmpeg` (ffmpeg 8.1 native Whisper-Filter) |
| "Rough cut" / "beste 30 Sekunden" / "Highlight schneiden" | `whisper-cut-ffmpeg` -> `transcript-cutter` |
| "Library aus Footage" / "Interview library" | `buttercut-roughcut` (Ruby/WhisperX, xmeml v5) |
| "Iteriere den cut" / "Kritisiere edit" / "Pacing" | `agentic-edit-critic` (EditDuet-Pattern, max 3 Rounds) |
| "Audio to marker" / "Beat sync AE" | `ae-mcp-bridge` (`waveform_to_markers` Tool) |
| "Reel aus langem Video" | `whisper-cut-ffmpeg` -> `transcript-cutter` -> `ffmpeg-batch` (9:16) -> `instagram-caption-generator` |

---

## Claude Code Built-ins 2026

Diese Features sind direkt im Claude Code Binary verfuegbar und MUESSEN aktiv genutzt werden:

| Built-in | Wann nutzen | Wert |
|----------|-------------|------|
| **`/goal <text>`** | Multi-Turn Tasks die mehrere Sessions ueberdauern | persistent execution context |
| **`/recap`** | Beim Wiederaufnehmen einer Session nach Pause | Context-Snapshot in einer Antwort |
| **`/skills`** mit Type-to-Filter | Wenn der Skill-Pool durchsucht werden muss | Token-Sort + Live-Filter |
| **`/schedule`** | Cron-Jobs in der Cloud | kein 6h-Limit, cloud-managed |
| **`/ultrareview`** | VOR jedem Deploy (Pre-Production) | paralleler Multi-Agent Review |
| **PowerShell-Tool** | Windows-Befehle ohne Git-for-Windows | direkt nativ, kein WSL noetig |
| **PreCompact Hook** | Bei langen Sessions (>500k Token) | blockiert ungewollte Auto-Compaction |
| **Opus 4.7 `xhigh` Effort** | Zwischen `high` und `max` | besseres Cost/Quality Ratio |

### MCP-Server (siehe `.mcp.json`)

| MCP | Use-Case |
|-----|----------|
| `chrome-devtools` | Performance debuggen, Lighthouse, Network-Logs |
| `vercel` (SSE + OAuth) | Build-Logs + Redeploy direkt aus Claude |
| `firecrawl` | Sites scrapen + Email-Extraction |
| `context7` | Up-to-date Library-Docs |
| `playwright` | Browser Automation, E2E Tests |
| `blender` / `blend-ai` | 3D Modeling, Rendering, Animation |
| `after-effects` | Motion Graphics |
| `notion` | Notion DB Access |
