---
name: ae-mcp-bridge
description: After Effects via TheLlamainator's after-effects-mcp (30+ Tools) steuern. Composition-Create, Layer-Animation, Keyframes, Effects, Markers, Audio-to-Marker Pipeline. Alternative zur broken AE-2024 aerender CLI - dieser MCP nutzt UXP Bridge-Panel. Use wenn {User} "after effects", "motion graphics", "keyframes setzen", "AE comp erstellen", "audio to marker", "waveform in AE" erwähnt. Ersetzt ae-automation Skill für Live-Steuerung.
---

# After Effects MCP Bridge

Production-ready AE MCP (TheLlamainator, 30+ Tools) der über ein Bridge-Panel in AE läuft — umgeht {Users} broken aerender-CLI.

## Architecture

```
Claude Code
  ↓ MCP
after-effects-mcp (Node.js, build/index.js)
  ↓ File Bridge (write commands.json)
AE mcp-bridge-auto.jsx (ExtendScript Panel in AE)
  ↓
Adobe After Effects
```

Kein Socket-Server nötig — Panel pollt File-Bridge.

## One-Time Setup

1. **AE Preferences** aktivieren:
   - Edit → Preferences → Scripting & Expressions → **Allow Scripts to Write Files and Access Network** ✓
2. **Bridge-Script** installieren (hat {Users} Claude schon gemacht):
   ```bash
   cd tools/after-effects-mcp
   npm install  # ✅ done
   npm run build  # ✅ done
   npm run install-bridge  # Kopiert mcp-bridge-auto.jsx in AE ScriptUI Panels
   ```
3. **In AE öffnen:**
   - Window → **mcp-bridge-auto.jsx**
   - Panel bleibt während MCP-Nutzung offen
4. **MCP** in `.mcp.json` registriert als `after-effects` → Claude Code Neustart

## Tools-Übersicht (`mcp__after-effects__*`)

### Composition & Project
- `get_project_info` — Inspiziert aktuelles AE-Projekt
- `create_composition` — Neue Comp (width/height/duration/framerate)
- `list_compositions`, `open_composition`
- `get_clip_frame_range`

### Layers
- `create_text_layer` — mit Font/Size/Color/Position
- `create_shape_layer`, `create_solid_layer`, `create_adjustment_layer`
- `set_layer_transform` — Position/Scale/Rotation/Opacity
- `center_layer` — in Comp zentrieren
- `parent_layer_to`, `delete_layer`

### Animation / Keyframes
- `set_layer_keyframe` — pro Property (Position, Scale, Opacity, ...)
- `set_expression` — JS-Expression an Property hängen
- `set_effect_keyframe` — Keyframe auf Effect-Parameter
- `set_graph_control` — Temporal + Spatial Easing

### Effects & Presets
- `apply_effect_by_name` (zB "Glow", "Levels")
- `apply_effect_by_matchName` (zB "ADBE Gaussian Blur 2")
- `list_layer_effects`, `edit_effect_property`, `remove_effect`
- `apply_preset_ffx`, `list_presets`, `search_presets`
- `list_available_effects` — alle installed

### Markers & Audio
- `add_comp_marker`, `add_layer_marker`, `add_bulk_markers`
- `set_audio_channel_levels`
- `get_audio_metadata`, `analyze_wav_waveform` — detect peaks
- `waveform_to_markers` — Audio → automatische Marker an Beats/Peaks (KILLER für Musik-Video-Workflows)

## {User}-Specific Workflows

### 1. Music Video: Audio → Markers → Motion
```
# User: "mach Beat-synced Marker in meiner {DEIN_PROJEKT} Comp"
1. mcp__after-effects__analyze_wav_waveform path="media/your-project/track.wav"
2. mcp__after-effects__waveform_to_markers comp="MusicVideo" threshold=0.7 min_spacing=0.2
→ Marker landen an allen Drum-Hits, {User} animiert drauflos
```

### 2. Festival Title Card
```
# User: "AE Titel für ein Festival 2026, Glitch-Style"
1. mcp__after-effects__create_composition name="Festival-2026-Title" width=3840 height=2160 duration=5 framerate=30
2. mcp__after-effects__create_text_layer text="Festival Name" font="Monument Extended" size=240
3. mcp__after-effects__apply_effect_by_name layer="Festival Name" effect="Glow"
4. mcp__after-effects__set_layer_keyframe property="Opacity" time=0 value=0
5. mcp__after-effects__set_layer_keyframe property="Opacity" time=1.5 value=100
```

### 3. Batch-Variants (30 Trailer-Versionen)
```
# User: "generier 30 Trailer-Variationen mit verschiedenen Farb-Gradients"
→ Schleife mit create_composition → apply_preset_ffx → render
(für schweres Rendering trotzdem video-remotion Skill nutzen — AE MCP ist für Live-Bearbeitung, nicht Batch-Render)
```

## Skill-Chain-Patterns

| User-Ask | Chain |
|----------|-------|
| "Audio-reactive Motion" | `osc-control` (live) OR `ae-mcp-bridge` (waveform_to_markers) |
| "AE Titel + Premiere Timeline" | `ae-mcp-bridge` (comp) → `premiere-mcp-bridge` (import AE via Dynamic Link) |
| "Motion Graphics Batch" | `video-remotion` (Code-basiert) vorzuziehen |
| "Presets durchsuchen" | `ae-mcp-bridge` (search_presets) |

## Fallback wenn MCP Offline

1. **Panel nicht offen** → "mcp-bridge-auto.jsx" in AE via Window-Menü öffnen
2. **Tool timeout** → Panel in AE hat Polling pausiert — Panel schliessen+wieder öffnen
3. **AE komplett broken** ({Users} 2024 install per Audit broken) → `video-remotion` Skill als Alternative

## Verhältnis zu bestehendem ae-automation Skill

- `ae-automation` — CLI-basiert (aerender), historisch gewachsen, broken in 2024
- `ae-mcp-bridge` (DIESES) — MCP + UXP Panel, **vorziehen für alle neuen Workflows**
- Skill-Registry: `ae-mcp-bridge` ist jetzt PRIMARY, `ae-automation` bleibt als Legacy

## Repo

- Code: `tools/after-effects-mcp/`
- MCP Entry: `tools/after-effects-mcp/build/index.js`
- Bridge Script: `tools/after-effects-mcp/assets/mcp-bridge-auto.jsx`
- Upstream: https://github.com/TheLlamainator/after-effects-mcp
