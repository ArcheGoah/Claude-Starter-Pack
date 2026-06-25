# Claude Code Starter Pack

A neutral, ready-to-customize configuration pack for [Claude Code](https://docs.claude.com/en/docs/claude-code) — a backbone of skills, hooks, rules, and agents that you fill with your own project data.

> Starting point, not a finished product. Every `{DEIN_*}` / `{DEINE_*}` placeholder is meant for you to replace.

## What's inside

```
.
├── CLAUDE.md            # Core instructions, loaded every session (fill the placeholders)
├── .mcp.json            # MCP servers (playwright, context7, chrome-devtools + optional examples)
├── .claude/
│   ├── rules/           # Working rules, intelligence/auto-pilot, feedback, thinking protocol
│   ├── skills/          # 120 auto-firing skills (video, design, dev, docs, research, …)
│   ├── agents/          # Sub-agent definitions (core: coder/planner/researcher/reviewer/tester)
│   ├── helpers/         # Hook scripts (session restore, handoff, memory, junk-cleaner, …)
│   └── settings.json    # Permissions, hooks, env
└── memory/              # Persistent memory across sessions (gitignored except MEMORY.md)
```

- **Skills** fire automatically when you mention a matching pattern — you don't call them manually.
- **Hooks** run on session start/end, before/after edits, on compaction, etc.
- **Memory** persists context between sessions via `memory/MEMORY.md` as an index.

> Note: many skills and docs are written in German. Translate or adapt as needed.

## Setup

1. **Clone into your project** (or copy `.claude/`, `CLAUDE.md`, `.mcp.json`).
2. **Fill the placeholders** in `CLAUDE.md` and `.claude/rules/` — name, goals, paths, stack. Search the repo for `{DEIN_` and `{DEINE_` to find them all.
3. **Adjust `.mcp.json`** — keep the servers you use, fill `{DEIN_USER}` paths, enable the `_optional_*` servers you need (each needs its own install).
4. **Review `.claude/settings.json`** permissions and hooks for your OS (hook scripts assume Windows/Node paths — adapt for macOS/Linux).
5. **Secrets** go in `.env` (gitignored) — never commit tokens/keys.

## Requirements

- Claude Code CLI
- Node.js (for the hook scripts in `.claude/helpers/`)
- Per-skill tools as documented in each `SKILL.md` (ffmpeg, yt-dlp, Python, etc.)

## License

MIT — see [LICENSE](LICENSE).
