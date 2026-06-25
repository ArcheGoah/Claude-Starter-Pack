---
name: buttercut-roughcut
description: ButterCut (Ruby Gem) - Transcript-first Rough-Cut-Generator für Final Cut Pro, Premiere Pro und DaVinci Resolve. Baut Library aus Footage-Ordner, transkribiert mit WhisperX, analysiert Frames, generiert xmeml/FCPXML für direkten NLE-Import. Use wenn {User} grosse Footage-Ordner hat (Interview, Doku, Wedding, Process), "rough cut aus allem", "library bauen", "footage organisieren" sagt. Requires Ruby (via winget installed).
---

# ButterCut — Claude als AI Video Editor

Source: https://github.com/barefootford/buttercut | Clone: `tools/buttercut/`

## Was ButterCut macht

```
Footage-Ordner (50+ Clips, 2h Material)
  ↓ transcribe-audio (WhisperX word-level)
  ↓ analyze-video (frame extraction + visual description)
  ↓ Library mit YAML + JSON transcripts
  ↓ roughcut skill (liest Library, generiert 3-15min Rough Cut)
  ↓
xmeml v5 / FCPXML → Import in Premiere / FCP / Resolve
```

Native Output für Adobe Premiere Pro (xmeml v5) = direkter Import.

## Setup

```bash
# Ruby installiert via winget (Session 2026-04-19)
# In neuer Shell:
ruby --version  # sollte 3.3+ zeigen

cd /c/Users/{DEIN_USER}/projects/my-project/tools/buttercut
bundle install  # installed gemfile deps
pip install -U whisperx  # WhisperX für Transcription ({User} hat)
```

Falls `ruby` nicht gefunden: neue Shell öffnen (PATH-Update nach winget install).

## Erst-Nutzung

### Library anlegen

```
{User}: "bau mir eine neue buttercut library aus media/footage/project-build-diary/"

Claude:
  cd tools/buttercut
  → User Question: Library Name?
  → User Question: Sprache? (Deutsch)
  → User Question: Editor-Target? (Premiere Pro / FCP / Resolve)
  → Create libraries/project-build-diary/library.yaml
  → Parallel Task agents für transcribe-audio
  → Parallel Task agents für analyze-video
  → Backup nach Completion
```

### Rough-Cut generieren

```
{User}: "mach mir einen 8-minütigen Rough-Cut aus der project-build-diary library, Story-Fokus: von erster Idee bis Festival-Pitch"

Claude:
  → Liest library.yaml + alle transcripts
  → Selektiert Clips basierend auf Story-Beat
  → Generiert rough_cut_2026-04-19.xml (xmeml v5)
  → {User} öffnet in Premiere: File → Import → rough_cut_xml
```

## Wann ButterCut statt transcript-cutter nutzen?

| Szenario | Skill |
|----------|-------|
| 1-2 Video-Files, Highlight-Cut | `transcript-cutter` (schneller) |
| 50+ Clips, Multi-Kamera, Story-Arc | `buttercut-roughcut` (library-basiert) |
| Quick Reel 20 Sekunden | `transcript-cutter` + `ffmpeg-batch` |
| YouTube Longform 15min mit B-Roll | `buttercut-roughcut` |
| Filler-Removal Podcast | `transcript-cutter --mode filler-removal` |
| Wedding-Video, Process-Doku | `buttercut-roughcut` |

## Typische {User}-Use-Cases

### 1. Project-Build-Diary → Festival Pitch-Video
- 2h Studio-Footage: Skizze, 3D, Print, LED-Tests, Live-Test
- Library: `libraries/project-build-diary/`
- Output: 8-10min Longform für Festival-Pitch + YouTube

### 2. Music Tour-Footage → 5x IG-Shorts
- 6h Festival-Live-Material (Ableton + Resolume + Crowd)
- Library: `libraries/your-project-tour-2026/`
- Mehrere 30-60sec Sequences für IG/TikTok

### 3. Grant-Application Video-Portfolio 2026
- Alle {User}-Projekte 2024-2026 als Clips
- Library: `libraries/grant-application-2026/`
- 3min Bewerbungs-Video

## Library-Struktur (was ButterCut anlegt)

```
tools/buttercut/libraries/project-build-diary/
├── library.yaml                    # Source of Truth
├── transcripts/
│   ├── DJI_20260415_0001.json      # Audio transcript (WhisperX)
│   ├── DJI_20260415_0001.visual.json  # Visual description per frame
│   └── ...
├── roughcuts/
│   ├── rough_cut_2026-04-19_15-30-00.xml    # xmeml für Premiere
│   └── sequence_hook_2026-04-19.xml          # 30s teaser
└── backups/
    └── ...zip
```

## Kombinationen

| Chain | Output |
|-------|--------|
| `buttercut-roughcut` → `premiere-mcp-bridge` (set markers + import xmeml) | Komplettes Premiere-Projekt |
| `buttercut-roughcut` → `ffmpeg-batch` (9:16 crop variations) | Multi-Platform Exports |
| `buttercut-roughcut` → `ae-mcp-bridge` (add title cards zu Rough Cut) | Finalized Short-Form |

## Wann NICHT buttercut

- Footage hat kein Audio / keinen Speech → `video-remotion` Code-basiert besser
- AI-generated Clips → direkt `video-remotion`
- Pure Music Video → `osc-control` + `ae-mcp-bridge`
- Resolume Festival Live → nicht NLE-basiert, `osc-control`

## Dependencies Check

```bash
ruby --version         # 3.3.x von winget
bundle --version       # bundler (kommt mit Ruby DevKit)
whisperx --version     # installed via pip in Session 2026-04-19
ffprobe -version       # bundled in ffmpeg 8.1
```

Fehlend? → In neuer Shell `bundle install` im tools/buttercut/ dir.
