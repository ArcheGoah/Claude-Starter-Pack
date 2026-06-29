# Helpers

Hilfsskripte fuer die Claude-Code-Hooks dieses Packs. Verdrahtet werden sie in
`.claude/settings.json` (Sektion `hooks`).

## Hook-Handler

- **`hook-handler.cjs`** - Zentraler Dispatcher. Wird von fast allen Hook-Events
  aufgerufen (`pre-bash`, `post-edit`, `session-restore`, `session-end`,
  `post-task`, `compact-*`, `status`, `route` ...). Laedt bei Bedarf
  `router.cjs`, `session.cjs`, `memory.cjs`, `intelligence.cjs`.
- **`router.cjs` / `router.js`** - Einfaches Task-Routing (Prompt -> passender Agent).
- **`session.cjs` / `session.js`** - Session-State (Start/Restore/Metriken/Ende).
- **`memory.cjs` / `memory.js`** - Lokaler JSON-Memory-Store.
- **`intelligence.cjs`** - Leichtgewichtiger Pattern-/Edit-Tracker pro Session.

## Guards & Cleanup

- **`file-guard.cjs`** - PreToolUse-Guard fuer Write/Edit (blockt unerwuenschte Pfade).
- **`junk-cleaner.cjs`** - Entfernt versehentlich erzeugte Junk-Dateien nach Bash.
- **`stop-verifier.cjs`** - Stop-Hook-Verifikation.

## Session-Handoff & Compaction

- **`handoff-generator.cjs`** - Schreibt einen Handoff bei SessionEnd/Stop.
- **`handoff-loader.cjs`** - Laedt den letzten Handoff bei SessionStart.
- **`compact-survival.cjs`** - PostCompact-Wiederherstellung.
- **`aggressive-microcompact.mjs` / `patch-aggressive-prune.mjs`** - optionale
  Compaction-Utilities.

## Git

- **`pre-commit` / `post-commit`** - Git-Hooks.
- **`auto-commit.sh`** - Optionales Auto-Commit-Skript.
- **`github-safe.js`** - Schutz-Checks fuer GitHub-Operationen.
- **`checkpoint-manager.sh` / `standard-checkpoint-hooks.sh`** - Checkpoint-Utilities.

## Datenablage

State/Memory landen unter `.claude-state/` (gitignored). Loeschen ist gefahrlos -
wird bei Bedarf neu angelegt.
