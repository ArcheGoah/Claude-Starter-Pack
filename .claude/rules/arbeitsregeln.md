# Arbeitsregeln & Datei-Konventionen

## Arbeitsregeln

1. **{DEINE_SPRACHE}** - Standardmaessig Deutsch oder Englisch. Stelle hier ein was du willst.
2. **Proaktiv handeln** - nicht fragen, machen. Bis zum Ende durcharbeiten.
3. **Pragmatismus > Perfektion** - keine halben Sachen.
4. YOU MUST **Social Accounts NIEMALS gefaehrden** - nur offizielle APIs.
5. **Skills feuern IMMER automatisch** - nie auf Slash-Commands warten. Alle Skills semantisch scannen.
6. **Parallele Agents** bei 2+ unabhaengigen Tasks nutzen.
7. **Bestehende Dateien:** IMMER erst lesen, dann editieren.

## Datei-Regeln

**Naming:** kebab-case, lowercase, Englisch, keine Umlaute/Leerzeichen.
**Root-Dateien:** Nur README.md, CLAUDE.md, ROADMAP.md, package.json, package-lock.json, .gitignore, .mcp.json, .env.

YOU MUST diese Regeln einhalten:
- NIEMALS Dateien in Root ablegen (ausser die 8 oben)
- NIEMALS Doppelte Docs erstellen (erst pruefen ob existiert)
- NIEMALS Code-Fragmente als Dateinamen (flex, mb-6, BigInt(0), void)
- Muell-Dateien sofort loeschen wenn entdeckt

## Ordner-Zuordnung (Beispiel - pass an dein Projekt an)

| Was | Wohin |
|-----|-------|
| Persoenliches (Profil, CV) | `docs/personal/` |
| Business, Strategie, Legal | `docs/business/` |
| Website Docs | `docs/website/` |
| Social Media Plattformen | `docs/platforms/` |
| Recherchen, Analysen, Reports | `docs/research/` |
| Notion Workspace | `docs/notion/` |
| JSON Configs | `config/` |
| Source Code | `src/{modul}/` |
| Utility Scripts | `scripts/` |
| Video Analyse Reports | `video-imports/` |
| Neue Skills | `.claude/skills/{name}/SKILL.md` |
| Neue Custom Agents | `.claude/agents/custom/{name}.md` |

## Tool-Pfade (PASS DIESE AN DEIN SYSTEM AN)

| Tool | Pfad (Beispiel - dein Pfad kann variieren) |
|------|------|
| ffmpeg/ffprobe | `/c/Users/{DEIN_USER}/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_*/bin` |
| yt-dlp | `/c/Users/{DEIN_USER}/AppData/Local/Programs/Python/Python310/Scripts/yt-dlp` |
| Deno | `/c/Users/{DEIN_USER}/AppData/Local/Microsoft/WinGet/Packages/DenoLand.Deno_*` |
| Cookies | `config/cookies.txt` (z.B. Instagram Session) |
| Secrets | `.env` (NOTION_TOKEN, ANTHROPIC_API_KEY etc.) |
| Skill Registry | `.claude/skills/REGISTRY.md` |
| Video Reports | `video-imports/VI_*.md` |

## Wichtige Referenz-Dateien (lege diese selbst an wenn relevant)

| Datei | Inhalt |
|-------|--------|
| `docs/platforms/reel-hook-templates.md` | Eigene Hook-Sammlung |
| `docs/business/lead-generation-setup.md` | Lead Gen Pipeline |
| `docs/notion/notion-database-ids.md` | Notion DB IDs (NICHT in Git!) |
| `config/platforms.json` | Social Media Plattformen |
