---
name: whisper-cut-ffmpeg
description: Single-command Video-Transcription via ffmpeg 8.1 native Whisper-Filter. Ersetzt komplette faster-whisper/WhisperX Pipeline. Output SRT oder JSON mit Word-Level-Timing. Use wenn {User} "transkribiere", "untertitel", "srt", "whisper", "transcript aus video", "was wurde gesagt" erwähnt. Basis für transcript-cutter und premiere-mcp Marker-Setzen.
---

# FFmpeg 8.1 Native Whisper Transcription

Seit FFmpeg 8.0/8.1 ist Whisper ein nativer Filter — 1 Command statt Python-Pipeline.

## Voraussetzung

- FFmpeg 8.1 ({User} hat's): `/c/Users/{DEIN_USER}/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1-full_build/bin/ffmpeg.exe`
- GGML Whisper Model (einmal herunterladen): `scripts/download-model.sh`

## Core-Commands

### Schnelles SRT aus Video

```bash
FFMPEG="/c/Users/{DEIN_USER}/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1-full_build/bin/ffmpeg.exe"
MODEL="/c/Users/{DEIN_USER}/whisper-models/ggml-medium.bin"

"$FFMPEG" -i input.mp4 \
  -vn -af "whisper=model=${MODEL}:language=de:destination=output.srt:format=srt" \
  -f null -
```

### JSON mit Word-Level-Timing (Pflicht für transcript-cutter)

```bash
"$FFMPEG" -i input.mp4 \
  -vn -af "whisper=model=${MODEL}:language=de:destination=output.json:format=json" \
  -f null -
```

### Deutsch + Englisch Auto-Detect

```bash
# language=auto lässt Whisper selbst detektieren
"$FFMPEG" -i input.mp4 \
  -vn -af "whisper=model=${MODEL}:language=auto:destination=output.srt:format=srt" \
  -f null -
```

### SRT burnen (direkt eingebrannte Subtitles)

```bash
"$FFMPEG" -i input.mp4 \
  -vf "whisper=model=${MODEL}:language=de:destination=/dev/stderr:format=srt,subtitles=/dev/stderr" \
  output_with_subs.mp4
```

## Modell-Auswahl

| Model | Größe | Speed (CPU) | Accuracy | Für was |
|-------|-------|-------------|----------|---------|
| ggml-tiny.bin | 75 MB | 32x realtime | 80% | Erst-Scan, Durchsicht |
| ggml-base.bin | 142 MB | 16x realtime | 88% | Standard IG-Reel |
| **ggml-medium.bin** | **1.5 GB** | **4x realtime** | **95%** | **{Users} Default** |
| ggml-large-v3.bin | 3.1 GB | 2x realtime | 98% | Longform Podcast, Interview |

**Empfehlung:** medium für 80% der Cases. large-v3 nur für {Users} Process-as-Content Doku-Interviews.

## Quality-Tipps für {User} (DE-Content)

- **`language=de`** explizit setzen — Auto-Detect ist 10% langsamer und macht manchmal EN draus
- **`vad=true`** für Talking Heads — filtert Stille/Filler-Words vor Transcription
- **`beam_size=5`** für Podcasts — bessere Accuracy bei mehreren Speakern
- **`temperature=0.0`** Default, wenn Hallucinations auftreten → `temperature=0.2`

Voll-Command für {User}-Quality-Defaults:
```bash
"$FFMPEG" -i input.mp4 \
  -vn -af "whisper=model=${MODEL}:language=de:vad=true:beam_size=5:temperature=0.0:destination=output.json:format=json" \
  -f null -
```

## Integration mit anderen Skills

| Next Step | Skill |
|-----------|-------|
| Cut-Points aus Transcript finden | `transcript-cutter` |
| Marker in Premiere setzen | `premiere-mcp-bridge` |
| Captions brennen (Instagram) | `ffmpeg-batch` (Burn-in-Pattern) |
| Longform → Shorts Split | `process-as-content-reel` |

## Output-Format JSON (für LLM-Verarbeitung)

```json
{
  "language": "de",
  "segments": [
    {"start": 0.48, "end": 3.12, "text": "Also ich hab damit 2018 angefangen"},
    {"start": 3.18, "end": 5.90, "text": "als ich zum ersten Mal nach Berlin kam"}
  ],
  "words": [
    {"start": 0.48, "end": 0.62, "word": "Also"},
    ...
  ]
}
```

## Performance ({Users} System)

- Reel 30s (CPU only, medium): ~8s
- Longform 30min (CPU only, medium): ~7min
- Wenn GPU-Build: `-hwaccel cuda` 3-4x schneller

## Troubleshooting

| Error | Fix |
|-------|-----|
| "whisper filter not found" | FFmpeg Version prüfen: `ffmpeg -version` → muss 8.0+ sein |
| "model file not found" | `bash scripts/download-model.sh medium` |
| "OutOfMemory" bei large-v3 | medium nehmen oder GPU aktivieren |
| DE wird zu EN erkannt | `language=de` explizit |
| Leere Output-Datei | Video hat kein Audio-Track → `-i audio.wav` statt `-i video.mp4` |
