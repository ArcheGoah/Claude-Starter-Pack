---
name: lightrag-knowledge
description: Graph RAG Knowledge System mit LightRAG + RAG-Anything fuer Foerderungen, Werkverzeichnis, Discord-Logs, Chase-Analyse. Lokal, Multi-Modal, gratis.
triggers:
  - lightrag
  - rag-anything
  - knowledge graph
  - graph rag
  - foerder pdf wissen
  - werkverzeichnis suchen
  - discord logs durchsuchen
  - rag system
  - semantic search
  - knowledge query
---

# LightRAG Knowledge System

Definitive Open-Source Graph RAG Loesung 2026 fuer {User}. Kombo aus **LightRAG** (Foundation) + **RAG-Anything** (Multi-Modal Wrapper). Lokal in `tools/LightRAG/` und `tools/RAG-Anything/`.

## When to use
- "Welche Foerderung passt zu Mural-Projekt Berlin?"
- "Welches Werk hat {User} mit Pinselstrich-Technik X gemacht?"
- "Was wurde im Discord ueber das Release-Feedback diskutiert?"
- Knowledge-Queries ueber 1000+ Documents (jenseits Context Window)

## Tech-Stack
- **LightRAG** (HKUDS) — Graph RAG Foundation, MIT, EMNLP2025
  - Lokal: `tools/LightRAG/`
  - Repo: https://github.com/HKUDS/LightRAG
  - Modes: local, global, hybrid, mix, naive
  - Knowledge Graph mit Entities + Relationships
- **RAG-Anything** (HKUDS) — Multi-Modal Wrapper
  - Lokal: `tools/RAG-Anything/`
  - Repo: https://github.com/HKUDS/RAG-Anything
  - Handles: PDFs, Images (OCR), Charts, Graphs
- **Docker** required
- **Ollama-compatible** — kann mit lokalem Qwen2.5-coder oder Gemma3 laufen

## Pipeline

### Step 1: Setup (einmalig)
```bash
cd tools/LightRAG
# Docker compose oder pip install
docker compose up -d
# Verify: http://localhost:9621 (LightRAG Web UI)
```

### Step 2: Knowledge Sources einlesen

**Source 1 — Foerderbewerbungen (HOCH PRIO):**
```python
# Alle PDFs aus docs/business/ + grants-2026/
import lightrag
rag = LightRAG(working_dir="./{user}_funding")
for pdf in glob("docs/business/*.pdf"):
    rag.insert(extract_pdf_text(pdf))
```

**Source 2 — Werkverzeichnis (HOCH PRIO):**
```python
# media/artworks/ Bilder + Metadata + Statements
rag = LightRAG(working_dir="./{user}_artworks")
# RAG-Anything fuer Image-OCR
```

**Source 3 — Chase-Analyse (574 Posts):**
```python
rag = LightRAG(working_dir="./{user}_chase")
rag.insert(open("docs/research/chase-h-ai-master-analysis.md").read())
```

**Source 4 — Discord-Logs Community:**
- Export aus Discord-Bot
- In separate working_dir

### Step 3: API → Skills Pattern
LightRAG generiert eine Web-App mit API. Pattern aus `video-imports/VI_2026-04-11_ig_chase-h-ai-lightrag-deep-dive.md`:

> "Tell Claude Code: turn these API endpoints into Skills"

Resultat: Skills wie `query-funding`, `query-artworks`, `query-discord` direkt in `.claude/skills/`.

### Step 4: Query
```python
# Direkt aus Claude Code via Skill-Call
result = rag.query("Welche Foerderung passt zum Mural-Projekt 2026?", mode="hybrid")
```

## Use-Cases (priorisiert)

| # | Use-Case | Source | Working Dir |
|---|----------|--------|-------------|
| 1 | Foerder-Match-Engine | docs/business/*.pdf, funding-deadlines.md | {user}_funding |
| 2 | Werk-Suchen by Style/Technik | media/artworks/ + Statements | {user}_artworks |
| 3 | Format-Finder Deep | docs/research/chase-h-ai-* | {user}_chase |
| 4 | Discord Q&A Bot | Discord-Bot logs | community_discord |
| 5 | Notion Backup Search | Notion JSON exports | {user}_notion |

## Verwandte Skills
- `parallel-research-agent` — Sub-Agents koennen LightRAG-Queries machen

## Reference
- `video-imports/VI_2026-04-11_ig_chase-h-ai-lightrag-rag-anything.md`
- `video-imports/VI_2026-04-11_ig_chase-h-ai-lightrag-deep-dive.md`
- `video-imports/VI_2026-04-11_ig_chase-h-ai-rag-anything-multimodal.md`
