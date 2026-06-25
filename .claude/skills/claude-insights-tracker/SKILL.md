---
name: claude-insights-tracker
description: Self-Analysis Claude Code Sessions. Welche Skills feuern? Welche Patterns? Was kann besser? Inspiriert von /insights aus jens.heitmann Reel.
triggers:
  - insights
  - session analyse
  - claude usage report
  - workflow analyse
  - was hat gefeuert
  - skill usage
  - post session learning
---

# Claude Insights Tracker

Self-Analysis fuer Claude Code Sessions. Inspiriert von `/insights` Command aus **jens.heitmann** Reel (DW43RJUkVp2). Eigene Implementation da originaler Command vermutlich Custom Skill ist.

## When to use
- **Post-Session Learning** — automatisch via `.claude/rules/intelligence.md`
- "Was haben wir heute gemacht?" Fragen
- Skill-Optimierungs-Sessions
- Wenn Workflow sich 3x wiederholt → in Skill packen

## Pipeline

### Step 1: Session-Daten lesen
- `git log --oneline --since="X hours ago"`
- Aktuelle Conversation
- `.claude-flow/metrics/swarm-activity.json`
- Memory-Files Updates

### Step 2: Pattern-Detection
- Welche Skills haben gefeuert?
- Welche Tools wurden benutzt? (Read, Write, Bash, Agent)
- Welche Files wurden erstellt/editiert?
- Welche Probleme tauchten auf? (3-Loop-Errors, Korrekturen)

### Step 3: Insights-Report
```markdown
# Session Insights — {timestamp}

## Was wurde gemacht
- [Aktion 1]
- [Aktion 2]

## Skills die gefeuert haben
| Skill | Kontext | Erfolg |

## Skills die HAETTEN feuern sollen aber nicht
- [Skill] — [Warum es gepasst haette]

## Wiederkehrende Patterns
- [Pattern] — schon Xx in den letzten Sessions

## Verbesserungsvorschlaege
1. [Konkret]

## Korrekturen durch {User}
- [Was] → in `.claude/rules/feedback.md` ergaenzen?
```

### Step 4: Persist
- Save: `memory/session_{YYYY-MM-DD}.md`
- Update `MEMORY.md` Index

### Step 5: Auto-Trigger
In `.claude/rules/intelligence.md`: Bei Session-End → automatisch ausfuehren.

## Verwandte Skills
- `memory-dream`
- `verification-before-completion`
