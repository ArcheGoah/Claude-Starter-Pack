---
name: transcript-cutter
description: Transcript-first Video-Editing. Nimmt Whisper-JSON, lässt Claude die besten N Sekunden identifizieren (Hook, Highlight, Filler-removed Version) und generiert cut_points.json + fertigen Schnitt als MP4 oder FCPXML für Premiere-Import. Use wenn {User} "rough cut", "beste 30 sekunden", "entferne füllwörter", "schneide highlight", "kürze auf x minuten" erwähnt. Kombiniert mit whisper-cut-ffmpeg vorher und premiere-mcp-bridge nachher.
---

# Transcript-First Cutter (Claude Code als NLE)

Das Pattern aus a16z "Agentic Video Editing": Claude liest NUR den Transcript (nie Frames), identifiziert Cut-Points per LLM-Judgement, FFmpeg schneidet.

## Warum Transcript-First?

- LLM ist gut in **Narrative** (Hook, Problem, Reveal, CTA) → kann das im Text erkennen
- Video-Frame-Analyse ist teuer und unnötig für Talking-Head / Interview / Voiceover
- Output ist **deterministisch** (JSON cut_points) → reproducible edits
- Funktioniert mit jedem NLE (Cuts als MP4, Markers, FCPXML, Resolve, Premiere)

## Workflow

```
1. whisper-cut-ffmpeg → transcript.json (word-level timing)
2. transcript-cutter lädt transcript.json
3. Claude (aufgerufen durch User) liest Text, markiert Highlights
4. Claude emittiert cut_points.json:
   [
     {"start": 12.3, "end": 38.7, "reason": "hook + main story"},
     {"start": 82.1, "end": 114.5, "reason": "punchline + CTA"}
   ]
5. scripts/cut.py nimmt cut_points.json + video.mp4 → output.mp4
   (oder → Premiere Markers via premiere-mcp-bridge)
```

## Standard-Invocations für {User}

### "Mach Rough-Cut aus media/footage/interview.mp4, 90 Sekunden"

```bash
# Step 1: Transcribe
bash .claude/skills/whisper-cut-ffmpeg/scripts/transcribe.sh media/footage/interview.mp4 de medium

# Step 2: Claude reads media/footage/interview.transcript.json
# → schreibt media/footage/interview.cut_points.json

# Step 3: Claude ruft auf:
python .claude/skills/transcript-cutter/scripts/cut.py \
  media/footage/interview.mp4 \
  media/footage/interview.cut_points.json \
  media/footage/interview_roughcut.mp4
```

### "Entferne alle äh/öh/ähm aus diesem Podcast"

```bash
# Step 1: Transcribe with word-level
bash .claude/skills/whisper-cut-ffmpeg/scripts/transcribe.sh media/podcast.mp4 de large-v3

# Step 2: Filler-Cleanup Mode
python .claude/skills/transcript-cutter/scripts/cut.py \
  media/podcast.mp4 \
  media/podcast.transcript.json \
  media/podcast_clean.mp4 \
  --mode filler-removal
```

### "Finde die besten 20 Sekunden für Instagram Reel"

Claude bekommt transcript.json, pickt emotionalsten/pointiertesten Abschnitt:

```json
{
  "cuts": [
    {"start": 47.3, "end": 67.8, "reason": "emotional peak + visual callout + question hook", "use_as": "reel"}
  ]
}
```

## Claude's Decision-Heuristik (inline docstring)

Wenn Claude cut_points.json generiert, folgt es diesen Regeln:

### Für Hooks (erste 3 Sekunden)
- Fragen: "Warum…", "Wie…", "Was wenn…"
- Statements mit Spannung: "Das Problem ist…", "Niemand redet über…"
- Visuelle Callouts: "Schau mal…", "Siehst du das?"

### Für Main Story
- Konkrete Zahlen, Namen, Orte
- Emotionale Spitzen (Laut werden, Pause, Lachen)
- Story-Beats: Setup → Complication → Resolution

### Für CTA
- Letzte 2-4 Sekunden
- "…und deswegen…", "…und das ist…", "…was meinst du?"

### Filler-Removal
- Entferne: "äh", "öh", "ähm", "also so", "weißt du", "irgendwie so", wenn sie NICHT den Rhythmus tragen
- Behalte: denselben Filler wenn er emotionales Timing setzt (natural pause)
- **margin_ms=120** vor und nach Wort = sanfter Cut (kein Pop)

## cut_points.json Schema

```json
{
  "source": "media/footage/interview.mp4",
  "target_duration": 20.0,
  "mode": "highlight|filler-removal|custom",
  "cuts": [
    {
      "start": 12.3,
      "end": 38.7,
      "reason": "hook: 'Das Problem mit Kunst ist...'",
      "label": "hook",
      "fade_in_ms": 0,
      "fade_out_ms": 150
    }
  ],
  "meta": {
    "generated_at": "2026-04-19T15:30:00Z",
    "generator": "claude-opus-4-7",
    "transcript_source": "media/footage/interview.transcript.json"
  }
}
```

## Output-Varianten

```bash
# MP4 concat (default)
python scripts/cut.py input.mp4 cuts.json output.mp4

# FCPXML für Premiere-Import (xmeml v5)
python scripts/cut.py input.mp4 cuts.json output.fcpxml --format fcpxml

# Markers-Liste für premiere-mcp-bridge (JSON)
python scripts/cut.py input.mp4 cuts.json output.markers.json --format markers
```

## Kombination mit anderen Skills

| Szenario | Chain |
|----------|-------|
| Reel-Export | `whisper-cut-ffmpeg` → `transcript-cutter` → `ffmpeg-batch` (9:16 crop) |
| Premiere Rohschnitt | `whisper-cut-ffmpeg` → `transcript-cutter` (--format markers) → `premiere-mcp-bridge` (set markers) |
| Longform → 5 Shorts | `whisper-cut-ffmpeg` → `transcript-cutter` --mode multi-highlight → `ffmpeg-batch` |

## Dependencies

- Python 3.10+ ({User} hat 3.10)
- ffmpeg 8.1 ({User} hat)
- `pip install ffmpeg-python` (script checks + installs)
