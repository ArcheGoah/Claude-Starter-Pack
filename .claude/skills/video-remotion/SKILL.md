---
name: video-remotion
description: Production-ready Remotion video generator for {DEIN_NAME}. AE fallback since AE 2024 broken. React-based programmatic video with 5 composition templates (IntroBumper, ReelTextOverlay, Timelapse, ProcessReel, MusicVisualizer), 9:16 1080x1920 render preset, audio support via ffmpeg, brand-locked Dynamic Minimalism 2026 aesthetic.
triggers:
  - remotion
  - video generieren
  - programmatic video
  - react video
  - ae fallback
  - ae ersatz
  - reel erstellen
  - video automatisch
  - portfolio video
  - project intro
  - music visualizer
  - intro bumper
  - text overlay reel
  - timelapse render
  - process reel
  - music visualizer
  - audio reactive video
  - sabum style reel
---

# Remotion Video Generator (AE Fallback)

**Status**: Production-ready | **Use case**: {Users} primaerer programmatischer Video-Pfad seit AE 2024 Install broken ist. React + Remotion = jede AE-Composition ersetzbar durch JSX.

## Warum Remotion als AE-Ersatz

| After Effects | Remotion Aequivalent |
|---------------|----------------------|
| Composition | `<Composition id="..." />` in `Root.tsx` |
| Layer | React Component (`<AbsoluteFill>`) |
| Keyframe | `interpolate(frame, [from, to], [val1, val2])` |
| Time Remapping | `useCurrentFrame()` + `spring()` |
| Expression | Plain JavaScript |
| Render Queue | `npx remotion render` CLI |
| Audio | `<Audio src={staticFile('track.mp3')} />` |
| Footage | `<Video src={staticFile('clip.mp4')} />` |
| Image | `<Img src={staticFile('img.jpg')} />` |
| Text Layer | `<h1>` mit CSS |
| Essential Graphics | React Props via `inputProps` |

## Install (One-Time Setup)

```bash
# Step 1: Project-Ordner
PROJ="C:/Users/{DEIN_USER}/Desktop/{DEIN_PROJEKT}/tmp_video/remotion_project"
mkdir -p "$PROJ" && cd "$PROJ"

# Step 2: Remotion Installation (Node.js >= 18 Pflicht)
npx create-video@latest .
# Prompt: Waehle "Blank" Template

# Step 3: Dependencies ergaenzen
npm install @remotion/cli @remotion/player @remotion/google-fonts @remotion/media-utils

# Step 4: Composition-Templates aus diesem Skill kopieren
cp .claude/skills/video-remotion/templates/Root.tsx "$PROJ/src/Root.tsx"
cp -r .claude/skills/video-remotion/templates/compositions "$PROJ/src/compositions"

# Step 5: Assets-Ordner anlegen
mkdir -p "$PROJ/public/images" "$PROJ/public/audio" "$PROJ/public/video"
```

**Prerequisites** (alle bereits installiert auf {Users} Rechner):
- Node.js >= 18 ✓
- ffmpeg 8.1 (Pfad: `/c/Users/{DEIN_USER}/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1-full_build/bin`) — **Pflicht fuer Audio-Support**
- yt-dlp (fuer Footage-Import)

## Project Structure

```
tmp_video/remotion_project/
├── package.json
├── remotion.config.ts
├── src/
│   ├── Root.tsx                       # Registriert alle Compositions
│   ├── index.ts                       # Entry Point
│   └── compositions/
│       ├── IntroBumper.tsx            # 3s Brand Intro
│       ├── ReelTextOverlay.tsx        # 9:16 Text-Overlay mit Timing
│       ├── Timelapse.tsx              # Image Sequence + Speed Control
│       ├── ProcessReel.tsx            # Sabum-Style Designer+AI Format
│       └── MusicVisualizer.tsx        # Audio-Reactive fuer Musik
└── public/
    ├── images/                        # Brand Images, Artworks (staticFile)
    ├── audio/                         # Musik-Tracks, Voiceovers
    └── video/                         # Footage aus video-imports/
```

**Output-Ordner**: `tmp_video/remotion_output/{date}_{composition}_{variant}.mp4`

## Composition Templates (5 Stueck)

### 1. IntroBumper.tsx — 3s Brand Intro
- **Duration**: 90 Frames @ 30fps (3s)
- **Format**: 1080x1920 (9:16)
- **Usage**: Prepend vor jedem Reel als Signatur
- **Effect**: Fade-in Text "{YOUR NAME}" + Location "{YOUR CITY}" + Linie-Reveal
- **Props**: `{ tagline?: string }`

### 2. ReelTextOverlay.tsx — 9:16 Text mit Timing
- **Duration**: Variabel (default 450 Frames = 15s)
- **Format**: 1080x1920 (9:16)
- **Usage**: Text-Layer ueber bestehende Footage legen
- **Effect**: Timed Text-Cards mit Slide-in/out, Hook + Body + CTA
- **Props**: `{ videoSrc: string, cards: TextCard[] }`

### 3. Timelapse.tsx — Image Sequence + Speed
- **Duration**: `images.length * framesPerImage`
- **Format**: 1080x1920 oder 1080x1080
- **Usage**: Studio-Timelapse, Mural-Progress, Artwork-Series
- **Effect**: Schnelle Image Sequence mit optionalem Ken-Burns Zoom
- **Props**: `{ images: string[], framesPerImage?: number, kenBurns?: boolean }`

### 4. ProcessReel.tsx — Sabum-Style Designer+AI
- **Duration**: 600 Frames (20s)
- **Format**: 1080x1920 (9:16)
- **Usage**: Build-Diary Reels, Process-as-Content
- **Effect**: Split-Screen (Hand-Drawing / AI-Generation) mit Progress-Bar + Kommentar-Overlay
- **Props**: `{ designerClip: string, aiClip: string, caption: string }`

### 5. MusicVisualizer.tsx — Audio-Reactive fuer Musik
- **Duration**: Audio-Duration (via `getAudioDurationInSeconds`)
- **Format**: 1080x1920 (9:16) oder 1080x1080
- **Usage**: DJ-Sets, Track-Promos, Release-Teasers
- **Effect**: FFT-Bars reagieren auf Audio, Track-Title Overlay, Brand-Logo
- **Props**: `{ audioSrc: string, trackTitle: string, artist?: string }`
- **Requires**: `@remotion/media-utils` fuer `useAudioData` + `visualizeAudio`

## Render (Preview + Final)

### Preview im Browser
```bash
cd tmp_video/remotion_project
npx remotion studio
# Opens http://localhost:3000 — alle Compositions browsbar
```

### Final Render via Wrapper-Script
```bash
# 9:16 Reel Preset (default)
.claude/skills/video-remotion/scripts/render.sh IntroBumper

# Mit Custom Props
.claude/skills/video-remotion/scripts/render.sh ReelTextOverlay '{"videoSrc":"public/video/studio.mp4","cards":[{"text":"NEW MURAL","start":0,"end":90}]}'

# Mit Custom Output-Name
.claude/skills/video-remotion/scripts/render.sh MusicVisualizer '{"audioSrc":"public/audio/your-project_track.mp3","trackTitle":"Sunset Loop"}' your-project_sunset_v1
```

### Direct CLI (ohne Wrapper)
```bash
npx remotion render src/index.ts IntroBumper output.mp4 \
  --codec h264 \
  --crf 18 \
  --concurrency 4 \
  --log=verbose
```

## Audio Support (ffmpeg Dependency)

Remotion nutzt ffmpeg fuer Audio-Muxing. Da ffmpeg 8.1 bereits installiert ist:

```bash
# Verify ffmpeg reachable
export PATH="/c/Users/{DEIN_USER}/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1-full_build/bin:$PATH"
ffmpeg -version
```

Remotion findet ffmpeg automatisch ueber PATH. Falls nicht:
```bash
npx remotion render ... --ffmpeg-executable=/c/Users/{DEIN_USER}/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1-full_build/bin/ffmpeg.exe
```

## Brand-Konstanten (aus DESIGN.md)

```typescript
export const BRAND = {
  colors: {
    bg: '#0a0a0a',           // Dunkler Hintergrund
    text: '#ffffff',          // Primary Text
    textDim: '#888888',       // Secondary Text
    accent: '#ffffff',        // Accent (kein Neon, Minimalismus)
    line: 'rgba(255,255,255,0.2)', // Divider-Linien
  },
  fonts: {
    heading: 'Space Grotesk', // via @remotion/google-fonts
    body: 'Inter',             // via @remotion/google-fonts
  },
  handle: '@{user}',
  location: '{YOUR CITY}',
} as const;
```

**Font-Loading** (Pflicht, sonst Times New Roman Fallback):
```typescript
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadSpaceGrotesk } from '@remotion/google-fonts/SpaceGrotesk';

const { fontFamily: inter } = loadInter();
const { fontFamily: spaceGrotesk } = loadSpaceGrotesk();
```

## Asset Pipeline

- `public/images/` — Brand-Assets, Artworks, Projekt-Bilder (remote? download first, dann lokal referenzieren)
- `public/audio/` — Musik-Tracks (MP3/WAV), Voiceovers
- `public/video/` — Footage aus `video-imports/` oder `media/` (erst kopieren)
- Zugriff in Compositions via `staticFile('images/mural.jpg')`

## Cross-Skill Bridges

- **reel-template** → erzeugt Hook+Script+Shot-List → als `inputProps` JSON in Remotion injizieren
- **ffmpeg-batch** → Remotion exportiert MP4, ffmpeg-batch fuegt Whisper-Subs hinzu
- **video-import** → Footage aus YouTube/IG in `public/video/` droppen
- **ae-automation** → Nur wenn AE 2024 wieder laeuft. Bis dahin: Remotion first.

## Auto-Fire Rules

- "generier ein Reel" / "mach ein Intro" → IntroBumper + ReelTextOverlay
- "Timelapse aus Studio-Fotos" → Timelapse
- "Build Diary" / "Process-Reel" → ProcessReel
- "Music Track promo" / "Audio-Visualizer" → MusicVisualizer
- "AE geht nicht" / "aerender broken" → Remotion als Ersatz vorschlagen
- Content-Pipeline braucht Video-Output → Skill fires auto

## Troubleshooting

| Problem | Loesung |
|---------|---------|
| `Cannot find module '@remotion/cli'` | `cd tmp_video/remotion_project && npm install` |
| Font rendert als Times New Roman | `loadFont()` aus `@remotion/google-fonts` vor Component-Export |
| Audio fehlt im Render | ffmpeg in PATH? `ffmpeg -version` in Bash testen |
| Render crasht bei 1080x1920 | `--concurrency 2` statt 4 (RAM-Limit) |
| `useCurrentFrame is null` | Component muss innerhalb `<Composition>` sein, nicht standalone |

## Output Convention

```
tmp_video/remotion_output/
├── 2026-04-11_IntroBumper_v1.mp4
├── 2026-04-11_ReelTextOverlay_mural.mp4
├── 2026-04-11_Timelapse_studio_week.mp4
├── 2026-04-11_ProcessReel_project_build.mp4
└── 2026-04-11_MusicVisualizer_music_sunset.mp4
```

Filename-Schema: `{YYYY-MM-DD}_{Composition}_{variant}.mp4`
