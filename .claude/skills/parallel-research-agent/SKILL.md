---
name: parallel-research-agent
description: Spawned 3-5 Sub-Agents fuer parallele Recherche-Tasks. Inspiriert von /ultraplan aus jens.heitmann Reel. Kombiniert {Users} parallele Agents Feedback-Regel.
triggers:
  - parallel research
  - ultraplan
  - sub-agents recherche
  - multi-research
  - parallele sub-agents research
  - parallel agents research
---

# Parallel Research Agent

Spawned 3-5 parallele Sub-Agents fuer Recherche-Tasks. Inspiriert von `/ultraplan` Command (jens.heitmann DW43RJUkVp2). Implementation nutzt {Users} "immer parallele Agents" Feedback-Regel.

## When to use
- Grosses Recherche-Thema mit mehreren Aspekten
- Vor jedem Plan/Phase mit unbekanntem Terrain
- Galerie-Akquise: 5 Galerien parallel deep-dive
- Foerder-Recherche: mehrere Stiftungen parallel

## Architektur

### Master Agent (du)
- Zerlegt Topic in 3-5 unabhaengige Research-Questions
- Spawned Sub-Agents in parallel (1 Message, mehrere Agent calls)
- Synthesisiert Ergebnisse in finalen Report

### Sub-Agents (parallel)
- 1 Frage, scoped
- Output-Format: max 200 Words
- Quellen-Anforderungen klar

## Pipeline

### Step 1: Topic-Decomposition
Beispiel: "Produkt-Launch Setup"
1. Markt 2026 State
2. Plattform-Vergleich
3. Pre-Launch Marketing
4. Pricing-Strategien
5. Post-Launch Community

### Step 2: Sub-Agent Spawning
```
[5 parallele Agent calls in EINEM Message-Block]
- Agent 1 (researcher): Market State
- Agent 2 (researcher): Platforms
- Agent 3 (researcher): Marketing
- Agent 4 (researcher): Pricing
- Agent 5 (researcher): Community
```

### Step 3: Aggregation
Sammle alle 5 Outputs in `docs/research/{topic}-{date}.md`:
- Sub-Topics als Sektionen
- Synthesis vom Master
- Action Items

### Step 4: Notion / Memory Update
Bei neuen Tools/Personen → Notion DB. Bei Patterns → Memory-File.

## Limits
- **Max 5 parallel** (Token-Budget!)
- **Min 3 parallel** (sonst sequenziell)
- **Output-Cap pro Sub-Agent: 200 Words**

## Verwandte Skills
- `dispatching-parallel-agents`
- `research-documentation`

## Reference
- `video-imports/VI_2026-04-10_ig_jens-heitmann-3-new-claude-code-commands.md`
- `memory/feedback_parallel_agents.md`
