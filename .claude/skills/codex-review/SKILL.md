---
name: codex-review
description: Codex Adversarial Review fuer Claude Code via openai/codex-plugin-cc. Second pair of eyes auf Code, billiger als Opus, prueft 7 Schwachstellen.
triggers:
  - codex review
  - adversarial review
  - code review
  - second opinion
  - pre-deploy check
  - bot security
  - prod readiness
  - codex
---

# Codex Adversarial Review

OpenAI Codex via Plugin in Claude Code. Inspiration: `video-imports/VI_2026-04-11_ig_chase-h-ai-codex-adversarial-review.md`.

## When to use
- **Pre-Deploy** zu Vercel ({deine-domain}.com)
- **Pre PM2 restart** vom Discord-Bot
- **Vor `git push`** mit kritischem Code
- **Vor Foerder-Submission** Code-Reviews
- **Cost-Saving:** Codex viel billiger als Opus → kann oefter laufen

## Status
- **Plugin lokal:** `tools/codex-plugin-cc/`
- **Repo:** https://github.com/openai/codex-plugin-cc
- **Requires:** ChatGPT Subscription ODER OpenAI API Key + Node.js 18.18+
- **TODO:** OpenAI API Key in `.env` ergaenzen

## Setup
```bash
cd tools/codex-plugin-cc
npm install
# Plugin installieren in Claude Code
# (siehe README.md fuer claude-code Plugin Install)

# In .env:
OPENAI_API_KEY=sk-...
```

## Commands (aus codex-plugin-cc)
- `/codex:adversarial-review` — Aktiv Hinterfragen, Decision-Challenge, Risk-Flagging
- `/codex:rescue` — Task-Delegation an codex:codex-rescue subagent
- `/codex:status`, `/codex:result`, `/codex:cancel` — Background Job Management

## Adversarial Review Pipeline (8 Steps)
1. Parse arguments / flags
2. Estimate review size
3. Resolve target (welcher Code-Bereich)
4. Collect context aus Codebase
5. **Build adversarial prompt** — sucht 7 Schwachstellen
6. Send to Codex
7. Claude Code als Harness
8. Output: Summary, Findings, Severity, Recommendations, Next Steps

## Die 7 Schwachstellen die Codex sucht
1. **Authentication** — Auth-Bypass, Token-Leaks
2. **Data Loss** — Race Conditions die Daten verlieren
3. **Rollbacks** — Migration-Reversibility
4. **Race Conditions** — Concurrent Modification
5. **Degraded Dependencies** — Veraltete Libs, Security-CVEs
6. **Version Skew** — Client/Server Mismatch
7. **Observability Gap** — Fehlende Logs/Metrics

## Use-Cases fuer {User}

### {deine-domain}.com Pre-Deploy
```
/codex:adversarial-review --target=website/src/app
```

### Client-Projekt vor Vercel Push
```
/codex:adversarial-review --target=client-project/src --severity=high
```

### Discord-Bot vor PM2 Restart
```
cd discord-bot
/codex:adversarial-review --target=src/ --focus=security
```

## Pairs mit
- `verification-before-completion` — Pre-Claim-Check Pattern
- `playwright-skill` — Browser-Test nach Adversarial Review
- `feedback_pm2_bot` Memory — Bot wird nicht direkt gestartet, immer pm2

## TODO
- [ ] OpenAI API Key besorgen / pruefen ob ChatGPT-Sub reicht
- [ ] Plugin in Claude Code installieren
- [ ] Erster Test auf {deine-domain}.com Code
- [ ] Cost-Vergleich Codex vs Opus dokumentieren
