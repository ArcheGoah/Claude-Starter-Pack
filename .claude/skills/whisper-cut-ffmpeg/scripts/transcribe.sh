#!/usr/bin/env bash
# Transkribiert Video → JSON (word-level) + SRT. ffmpeg 8.1 Whisper-Filter.
# Nutzung: bash scripts/transcribe.sh input.mp4 [de|en|auto] [medium|large-v3]

set -euo pipefail
shopt -s nullglob

INPUT="${1:?Usage: transcribe.sh input.mp4 [lang] [model]}"
LANG="${2:-de}"
MODEL_NAME="${3:-medium}"

FFMPEG="/c/Users/{DEIN_USER}/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1-full_build/bin/ffmpeg.exe"
MODEL="/c/Users/{DEIN_USER}/whisper-models/ggml-${MODEL_NAME}.bin"

if [[ ! -f "$MODEL" ]]; then
  echo "❌ Model missing: $MODEL"
  echo "→ Run: bash scripts/download-model.sh $MODEL_NAME"
  exit 1
fi

BASE="$(basename "$INPUT")"
BASE="${BASE%.*}"
DIR="$(dirname "$INPUT")"
OUT_JSON="${DIR}/${BASE}.transcript.json"
OUT_SRT="${DIR}/${BASE}.transcript.srt"

echo "→ Transcribing $INPUT (lang=$LANG, model=$MODEL_NAME)"

"$FFMPEG" -y -i "$INPUT" \
  -vn \
  -af "whisper=model=${MODEL}:language=${LANG}:vad=true:destination=${OUT_JSON}:format=json" \
  -f null - 2>&1 | grep -E '(whisper|error)' || true

"$FFMPEG" -y -i "$INPUT" \
  -vn \
  -af "whisper=model=${MODEL}:language=${LANG}:vad=true:destination=${OUT_SRT}:format=srt" \
  -f null - 2>&1 | grep -E '(whisper|error)' || true

echo "✅ JSON: $OUT_JSON"
echo "✅ SRT:  $OUT_SRT"
