---
name: ollama-fallback
description: Lokales Claude Code Setup mit Ollama + Qwen3 Coder als Backup bei Rate-Limits oder Privacy-Mode fuer NDA-Client-Code.
triggers:
  - ollama
  - qwen
  - lokales modell
  - rate limit
  - privacy mode
  - claude code lokal
  - free claude code
  - offline ai
---

# Ollama Fallback

Lokales Claude Code Setup mit Ollama + Qwen3 Coder. Setup nach **taki.gpt** Reel (DW6kjNrNBXm).

## Status (2026-04-11)
- **Ollama installed:** YES — v0.20.5 (winget Ollama.Ollama)
- **Path:** `C:\Users\{DEIN_USER}\AppData\Local\Programs\Ollama\ollama.exe`
- **Models pulled:**
  - `qwen2.5-coder:latest` (4.7 GB) — Smoke-Test PASSED
  - `gemma3:latest` — Pulling im Background (Apache 2.0, Top 3 Open-Source 2026)
- **Service:** localhost:11434
- **Env-Var configured:** TBD — siehe Step 3

## Model-Empfehlung 2026 (aus video-imports v01 + v08 Batch 2)

| Use-Case | Model | Warum |
|----------|-------|-------|
| Coding allgemein | `qwen2.5-coder` | Bewährt, schnell |
| Komplexe Logik / Reasoning | `gemma3` (Gemma 4 wenn verfügbar) | Top 3 Open-Source, ~Sonnet 4.6 Niveau, **Apache 2.0** |
| ClientCo (NDA) | `gemma3` | Apache 2.0 = kommerziell ohne Restriktionen |
| Schnelle Drafts | `qwen2.5-coder` | Geringere VRAM |

**Quelle:** Sebastian Kauffmann DE-Tutorial (`video-imports/VI_2026-04-11_ig_sebastian-kauffmann-gemma4-claude-code.md`)

## When to use
- **Rate Limit Hit** — Anthropic API Limit erreicht
- **Privacy Mode** — ClientCo Client-Code (NDA, kein Anthropic Server)
- **Experimentier-Sessions** — ohne Credits zu verbrauchen
- **Offline Work** — Reise / unterwegs ohne Internet

## Setup (3 Steps)

### Step 1: Verify Ollama
```bash
ollama --version
# Falls fehlt: winget install --id Ollama.Ollama --silent
```
Service laeuft auf `http://localhost:11434`.

### Step 2: Model pullen
```bash
ollama pull qwen2.5-coder    # 8GB safer Start
# oder
ollama pull qwen3-coder       # 16GB+ wenn PC stark genug
ollama run qwen2.5-coder "Write hello world"
```

### Step 3: Claude Code Routing
Add zu `.env`:
```
ANTHROPIC_BASE_URL=http://localhost:11434/v1
ANTHROPIC_API_KEY=ollama-local
```
Per-Session: `ANTHROPIC_BASE_URL=http://localhost:11434/v1 claude`

## Decision Tree
| Situation | Tool |
|-----------|------|
| Normale Arbeit | Anthropic Sonnet 4.6 |
| Komplex, max Quality | Anthropic Opus 4.6 |
| Rate Limit | Ollama Qwen3 Coder |
| ClientCo NDA | Ollama (mandatory) |
| Reise offline | Ollama (mandatory) |
| Token-Sparen | Ollama |

## Reference
**Source:** `video-imports/VI_2026-04-10_ig_taki-gpt-claude-code-local-ollama.md`
**Ollama:** https://ollama.com
