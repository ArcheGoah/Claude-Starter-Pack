---
name: premiere-mcp-bridge
description: Adobe Premiere Pro via adb-mcp (Mike Chambers) steuern. Timeline-Aufbau, Clip-Import, Transitions, Effects, Audio-Mix, Marker, Export - alles via MCP Tools. Use wenn {User} "premiere", "timeline", "sequence", "cut in premiere", "render aus premiere", "premiere marker", oder "mach mir ein premiere projekt" sagt. Setup erfordert Premiere Beta 25.3+ und laufenden adb-proxy-socket.
---

# Premiere Pro MCP Bridge

Adobe Premiere Pro wird via Mike Chambers' `adb-mcp` komplett von Claude Code gesteuert. Live-Tools in Premiere während der User arbeitet.

## Architecture

```
Claude Code
  ↓ (MCP Protocol)
adb-mcp/pr-mcp.py (FastMCP Server)
  ↓ (WebSocket)
adb-proxy-socket (node proxy on localhost:3001)
  ↓ (WebSocket)
Premiere UXP Plugin (loaded via Adobe UXP Developer Tool)
  ↓
Adobe Premiere Pro Beta 25.3+
```

## One-Time Setup Checklist

1. **Premiere Pro Beta 25.3 Build 46+** via Creative Cloud (Pflicht — Stable-Release API reicht nicht)
2. **Adobe UXP Developer Tool** aus Creative Cloud installieren
3. Plugin registrieren:
   - UXP Developer Tool → File → Add Plugin
   - Datei: `tools/adb-mcp/uxp/pr/manifest.json`
   - Load → in Premiere das Plugin-Panel öffnen → **Connect**
4. **Proxy Server** starten (muss laufen während Claude Premiere steuert):
   ```bash
   cd tools/adb-mcp/adb-proxy-socket && node proxy.js
   ```
   Output erwartet: `Premiere MCP Command proxy server running on ws://localhost:3001`
5. **MCP** bereits in `.mcp.json` als `adobe-premiere` registriert → Claude Code Neustart reicht

## Pre-Flight Check (IMMER bevor Tools genutzt werden)

```bash
# Prüft ob Proxy läuft
curl -sf http://localhost:3001/ > /dev/null && echo "proxy ON" || echo "proxy OFF — run: cd tools/adb-mcp/adb-proxy-socket && node proxy.js"
```

Wenn Proxy OFF → proxy.js starten (im Hintergrund):
```bash
cd /c/Users/{DEIN_USER}/Desktop/{DEIN_PROJEKT}/tools/adb-mcp/adb-proxy-socket && node proxy.js &
```

## Verfügbare MCP Tools (adb-mcp Premiere)

Nach Registrierung in `.mcp.json` erscheinen Tools unter `mcp__adobe-premiere__*`:

- `create_project`, `open_project`, `save_project`
- `import_media`, `create_sequence`, `add_to_timeline`
- `set_clip_speed`, `trim_clip`, `split_clip`
- `add_transition`, `add_effect`, `apply_preset`
- `add_marker`, `set_audio_levels`, `mute_track`
- `export_sequence` (mit Presets: H.264 Match Source, YouTube 2160p etc.)
- `get_project_info`, `get_sequence_info` (state inspection)

**Limit-Hinweis aus README:** "Premiere agent ist etwas limitierter als Photoshop-Variante wegen Premiere Plugin API Limits." Für Feinschliff trotzdem manuell in Premiere arbeiten — Claude macht das 80%-Grunding.

## Typische Workflows für {User}

### 1. "Bau mir aus media/footage/project-event/ ein Premiere-Projekt"
```
1. Pre-flight (proxy check)
2. mcp__adobe-premiere__create_project name="project-event-rohschnitt"
3. mcp__adobe-premiere__import_media paths=["media/footage/project-event/*.mp4"]
4. mcp__adobe-premiere__create_sequence preset="1080p29.97"
5. Für jede Datei: mcp__adobe-premiere__add_to_timeline
6. mcp__adobe-premiere__save_project
→ {User} öffnet Projekt und macht Feinschliff
```

### 2. "Setze Marker an allen Hooks in meinem Interview"
```
1. Ersten transcript-cutter laufen lassen (separates Skill) → cut_points.json
2. Für jeden Cut-Point: mcp__adobe-premiere__add_marker time=X.XXs label="hook"
```

### 3. "Mach 9:16 Crop-Sequence aus meinem 16:9 Projekt"
```
1. mcp__adobe-premiere__get_sequence_info → Clip-Liste
2. mcp__adobe-premiere__create_sequence preset="1080x1920"
3. Für jeden Clip: mcp__adobe-premiere__add_to_timeline + add_effect name="Auto Reframe"
4. mcp__adobe-premiere__export_sequence preset="IG Reel"
```

## Combined Workflows (Skill-Chains)

| User sagt | Skill-Chain |
|-----------|-------------|
| "Mach Rohschnitt aus diesem Interview" | `whisper-cut-ffmpeg` → `transcript-cutter` → `premiere-mcp-bridge` (Marker setzen) |
| "Premiere Projekt aus meinem Footage-Ordner" | `video-import` (falls URLs) → `premiere-mcp-bridge` (create_project + import) |
| "Reel Version aus meinem Longform" | `premiere-mcp-bridge` (crop+reframe) → `ffmpeg-batch` (export) → `instagram-caption-generator` |

## Fehlerfälle

- **"proxy OFF"** → `node proxy.js` starten
- **"UXP plugin not connected"** → Premiere-Plugin-Panel öffnen und Connect klicken
- **"Premiere Beta nicht installiert"** → Creative Cloud → Beta Apps → Premiere Pro Beta
- **Tool existiert nicht** → adb-mcp Update: `cd tools/adb-mcp && git pull`

## Repo-Referenz

- Code: `tools/adb-mcp/`
- MCP-Script: `tools/adb-mcp/mcp/pr-mcp.py`
- Proxy: `tools/adb-mcp/adb-proxy-socket/proxy.js`
- UXP Plugin: `tools/adb-mcp/uxp/pr/`
- Upstream: https://github.com/mikechambers/adb-mcp
