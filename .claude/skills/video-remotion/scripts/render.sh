#!/usr/bin/env bash
#
# render.sh — Remotion Render-Wrapper fuer {DEIN_NAME} Studio
#
# Usage:
#   ./render.sh <CompositionID> [inputPropsJSON] [outputName]
#
# Examples:
#   ./render.sh IntroBumper
#   ./render.sh ReelTextOverlay '{"videoSrc":"public/video/studio.mp4","cards":[{"text":"NEW MURAL","start":0,"end":90}]}'
#   ./render.sh MusicVisualizer '{"audioSrc":"public/audio/your-project_track.mp3","trackTitle":"SUNSET"}' your-project_sunset_v1
#
# Preset: 9:16 1080x1920 @ 30fps H.264 CRF 18 (High Quality)
# Output: tmp_video/remotion_output/{date}_{composition}_{variant}.mp4
#
# Prerequisites:
#   - Node.js >= 18
#   - tmp_video/remotion_project/ mit installiertem Remotion
#   - ffmpeg 8.1 im PATH (fuer Audio)

set -euo pipefail

# --- Paths ---
PROJECT_ROOT="C:/Users/{DEIN_USER}/Desktop/{DEIN_PROJEKT}"
REMOTION_DIR="$PROJECT_ROOT/tmp_video/remotion_project"
OUTPUT_DIR="$PROJECT_ROOT/tmp_video/remotion_output"
ENTRY="src/index.ts"

# --- ffmpeg in PATH (Audio Pflicht) ---
FFMPEG_BIN="/c/Users/{DEIN_USER}/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1-full_build/bin"
export PATH="$FFMPEG_BIN:$PATH"

# --- Args ---
COMPOSITION="${1:-}"
INPUT_PROPS="${2:-}"
OUTPUT_NAME="${3:-}"

if [[ -z "$COMPOSITION" ]]; then
  echo "ERROR: Composition ID required"
  echo "Usage: $0 <CompositionID> [inputPropsJSON] [outputName]"
  echo ""
  echo "Available compositions:"
  echo "  - IntroBumper       (3s brand intro)"
  echo "  - ReelTextOverlay   (text cards ueber footage)"
  echo "  - Timelapse         (image sequence)"
  echo "  - ProcessReel       (designer+AI split-screen)"
  echo "  - MusicVisualizer   (audio-reactive fuer Musik)"
  exit 1
fi

# --- Setup check ---
if [[ ! -d "$REMOTION_DIR" ]]; then
  echo "ERROR: Remotion project not found at $REMOTION_DIR"
  echo ""
  echo "Run setup first:"
  echo "  mkdir -p \"$REMOTION_DIR\" && cd \"$REMOTION_DIR\""
  echo "  npx create-video@latest ."
  echo "  cp -r $PROJECT_ROOT/.claude/skills/video-remotion/templates/* src/"
  exit 1
fi

if [[ ! -f "$REMOTION_DIR/package.json" ]]; then
  echo "ERROR: $REMOTION_DIR/package.json missing — run 'npm install' first"
  exit 1
fi

# --- ffmpeg sanity check ---
if ! command -v ffmpeg >/dev/null 2>&1; then
  echo "WARN: ffmpeg not found in PATH — audio compositions will fail"
fi

# --- Output dir + filename ---
mkdir -p "$OUTPUT_DIR"
DATE=$(date +%Y-%m-%d)
VARIANT="${OUTPUT_NAME:-v1}"
OUTPUT_FILE="$OUTPUT_DIR/${DATE}_${COMPOSITION}_${VARIANT}.mp4"

# --- Input props handling ---
PROPS_ARG=""
if [[ -n "$INPUT_PROPS" ]]; then
  # Write temp file to avoid shell escaping issues
  PROPS_FILE=$(mktemp --suffix=.json)
  echo "$INPUT_PROPS" > "$PROPS_FILE"
  PROPS_ARG="--props=$PROPS_FILE"
fi

# --- Execute render ---
cd "$REMOTION_DIR"

echo "=========================================="
echo "Remotion Render"
echo "=========================================="
echo "Composition : $COMPOSITION"
echo "Output      : $OUTPUT_FILE"
echo "Props       : ${INPUT_PROPS:-<defaults>}"
echo "Resolution  : 1080x1920 @ 30fps"
echo "Codec       : H.264 CRF 18"
echo "=========================================="
echo ""

npx remotion render \
  "$ENTRY" \
  "$COMPOSITION" \
  "$OUTPUT_FILE" \
  --codec=h264 \
  --crf=18 \
  --concurrency=4 \
  --log=info \
  $PROPS_ARG

RENDER_EXIT=$?

# --- Cleanup temp props file ---
if [[ -n "${PROPS_FILE:-}" && -f "$PROPS_FILE" ]]; then
  rm -f "$PROPS_FILE"
fi

if [[ $RENDER_EXIT -eq 0 ]]; then
  echo ""
  echo "SUCCESS: $OUTPUT_FILE"
  if [[ -f "$OUTPUT_FILE" ]]; then
    SIZE=$(du -h "$OUTPUT_FILE" | cut -f1)
    echo "Size    : $SIZE"
  fi
else
  echo ""
  echo "FAILED with exit code $RENDER_EXIT"
  exit $RENDER_EXIT
fi
