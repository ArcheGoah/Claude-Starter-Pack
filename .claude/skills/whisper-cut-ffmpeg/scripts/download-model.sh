#!/usr/bin/env bash
# Lädt GGML Whisper Models für ffmpeg 8.1 Whisper-Filter
# Nutzung: bash scripts/download-model.sh [tiny|base|medium|large-v3]

set -euo pipefail

MODEL="${1:-medium}"
MODEL_DIR="/c/Users/{DEIN_USER}/whisper-models"
mkdir -p "$MODEL_DIR"

declare -A URLS=(
  ["tiny"]="https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-tiny.bin"
  ["base"]="https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.bin"
  ["medium"]="https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-medium.bin"
  ["large-v3"]="https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-large-v3.bin"
)

if [[ -z "${URLS[$MODEL]:-}" ]]; then
  echo "Unknown model: $MODEL"
  echo "Options: tiny, base, medium, large-v3"
  exit 1
fi

OUT="$MODEL_DIR/ggml-${MODEL}.bin"

if [[ -f "$OUT" ]]; then
  echo "✅ Already present: $OUT"
  exit 0
fi

echo "→ Downloading ggml-${MODEL}.bin to $OUT"
curl -L --fail -o "$OUT" "${URLS[$MODEL]}"
echo "✅ Done. Size: $(du -h "$OUT" | cut -f1)"
