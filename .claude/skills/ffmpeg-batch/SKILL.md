---
name: ffmpeg-batch
description: Batch process video footage with ffmpeg 8.1 for Instagram Reels (1080x1920), Carousel frames (1080x1350), thumbnails, time-lapses, text overlays, music mixing, AND native Whisper subtitling (ffmpeg 8.1 feature). Use when user mentions ffmpeg, video conversion, batch render, Instagram format, thumbnails, time-lapse, subtitle burn-in, or local media folder footage.
---

# FFmpeg Batch Processing (8.1 — with Whisper filter)

Batch process {User}'s media folder footage for social media content.

## ⚠️ CRITICAL: Windows/MSYS Path Fix

**Bash globs over Windows-style `A:/Video/*.mp4` FAIL SILENTLY on MSYS/Git Bash.** Every batch loop was broken. Rules:

1. **Always use `media/Video/...` or `/c/...` style** (MSYS drive letters), NOT `A:/Video/...` or `C:/...`
2. **Always prepend `shopt -s nullglob`** so empty glob expands to nothing instead of literal pattern
3. **Always `mkdir -p` output dirs FIRST** (MSYS won't create intermediate dirs)
4. **Quote all paths with spaces** — Windows paths often contain them

**Broken pattern (failed silently):**
```bash
for f in media/Video/*.mp4; do  # ❌ MSYS treats "A:" as host prefix, glob fails
  $FFMPEG -i "$f" ...
done
```

**Correct pattern:**
```bash
shopt -s nullglob
mkdir -p /c/renders/reels
for f in media/Video/*.mp4; do  # ✅ MSYS understands media/
  [ -e "$f" ] || continue    # ✅ Defense against empty match
  name=$(basename "$f" .mp4)
  $FFMPEG -i "$f" ... "/c/renders/reels/${name}_reel.mp4"
done
```

## FFmpeg Path (8.1 installed)

```bash
FFMPEG_BIN="/c/Users/{DEIN_USER}/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1-full_build/bin"
FFMPEG="$FFMPEG_BIN/ffmpeg.exe"
FFPROBE="$FFMPEG_BIN/ffprobe.exe"

# Verify version once per session
$FFMPEG -version | head -1  # expect "ffmpeg version 8.1"
```

## 0. Native Whisper Subtitles (ffmpeg 8.1 — NEW)

**Replaces faster-whisper + SRT pipeline entirely.** Single command for transcribe + burn-in:

```bash
# Download whisper model once
mkdir -p /c/Users/{DEIN_USER}/.ffmpeg-whisper
curl -L -o /c/Users/{DEIN_USER}/.ffmpeg-whisper/ggml-large-v3.bin \
  https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-large-v3.bin

WHISPER_MODEL="/c/Users/{DEIN_USER}/.ffmpeg-whisper/ggml-large-v3.bin"

# Transcribe + burn subtitles in one step
$FFMPEG -i input.mp4 \
  -vf "whisper=model=$WHISPER_MODEL:language=auto:format=subtitle,subtitles=f=srt" \
  -c:v libx264 -crf 18 output_subtitled.mp4

# Batch version
shopt -s nullglob
mkdir -p /c/renders/subtitled
for f in media/Video/*.mp4; do
  [ -e "$f" ] || continue
  name=$(basename "$f" .mp4)
  $FFMPEG -i "$f" \
    -vf "whisper=model=$WHISPER_MODEL:language=auto:format=subtitle,subtitles=f=srt" \
    -c:v libx264 -crf 18 "/c/renders/subtitled/${name}.mp4"
done
```

## 1. Convert to Instagram Reel Format (9:16, 1080x1920)

```bash
shopt -s nullglob
mkdir -p /c/renders/reels

# Single file - center crop to 9:16
$FFMPEG -i input.mp4 \
  -vf "crop=ih*9/16:ih,scale=1080:1920" \
  -c:v libx264 -preset slow -crf 18 \
  -c:a aac -b:a 128k \
  -t 90 -movflags +faststart \
  output_reel.mp4

# Batch convert all MP4s in folder (MSYS-safe)
for f in media/Video/*.mp4; do
  [ -e "$f" ] || continue
  name=$(basename "$f" .mp4)
  $FFMPEG -i "$f" \
    -vf "crop=ih*9/16:ih,scale=1080:1920" \
    -c:v libx264 -preset slow -crf 18 \
    -c:a aac -b:a 128k \
    -t 90 -movflags +faststart \
    "/c/renders/reels/${name}_reel.mp4"
done

# With padding instead of crop (letterbox)
$FFMPEG -i input.mp4 \
  -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black" \
  -c:v libx264 -preset slow -crf 18 \
  -movflags +faststart output_padded.mp4
```

## 2. Generate Thumbnails

```bash
# Single best frame (at 25% of duration)
$FFMPEG -i input.mp4 -vf "select='eq(pict_type\,I)',scale=1080:-1" \
  -frames:v 1 -q:v 2 thumbnail.jpg

# Grid of thumbnails (4x4)
$FFMPEG -i input.mp4 \
  -vf "fps=1/10,scale=320:-1,tile=4x4" \
  -frames:v 1 contact_sheet.jpg

# Batch thumbnails from folder
for f in media/Video/*.mp4; do
  name=$(basename "$f" .mp4)
  $FFMPEG -i "$f" -ss 00:00:05 -frames:v 1 -q:v 2 "/c/renders/thumbs/${name}.jpg"
done
```

## 3. Extract Best Frames for Carousel Posts

```bash
# Extract 10 evenly spaced frames
$FFMPEG -i input.mp4 \
  -vf "fps=10/$(ffprobe -v error -show_entries format=duration -of csv=p=0 input.mp4),scale=1080:-1" \
  -q:v 2 "frames/frame_%03d.jpg"

# Extract scene changes (great for carousel variety)
$FFMPEG -i input.mp4 \
  -vf "select='gt(scene\,0.3)',scale=1080:-1" \
  -vsync vfr -q:v 2 "frames/scene_%03d.jpg"
```

## 4. Create Time-lapses

```bash
# Speed up 10x (no audio)
$FFMPEG -i input.mp4 \
  -vf "setpts=0.1*PTS,scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2" \
  -an -c:v libx264 -preset slow -crf 18 \
  timelapse.mp4

# From image sequence (painting process photos)
$FFMPEG -framerate 24 -pattern_type glob -i "media/photos/painting_*.jpg" \
  -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2" \
  -c:v libx264 -preset slow -crf 18 \
  -pix_fmt yuv420p painting_timelapse.mp4
```

## 5. Add Text Overlays (Hook Text)

```bash
# Top hook text for Reels
$FFMPEG -i input.mp4 \
  -vf "drawtext=text='POV\: When your painting comes alive':fontsize=48:fontcolor=white:borderw=3:bordercolor=black:x=(w-text_w)/2:y=h*0.15:fontfile='C\:/Windows/Fonts/arial.ttf'" \
  -c:v libx264 -preset slow -crf 18 \
  -c:a copy hook_reel.mp4

# Animated text (fade in)
$FFMPEG -i input.mp4 \
  -vf "drawtext=text='{DEIN_NAME}':fontsize=36:fontcolor=white@0.0:borderw=2:bordercolor=black@0.0:x=(w-text_w)/2:y=h*0.85:fontfile='C\:/Windows/Fonts/arial.ttf':alpha='if(lt(t,1),t,if(lt(t,4),1,max(0,1-(t-4))))'" \
  -c:v libx264 -preset slow -crf 18 \
  -c:a copy text_animated.mp4
```

## 6. Combine Clips with Music ({DEIN_PROJEKT} Tracks)

```bash
# Replace audio with {DEIN_PROJEKT} track
$FFMPEG -i video.mp4 -i "media/music/your-project_track.mp3" \
  -map 0:v -map 1:a \
  -c:v copy -c:a aac -b:a 192k \
  -shortest with_music.mp4

# Mix original audio + music (ducking)
$FFMPEG -i video.mp4 -i "media/music/your-project_track.mp3" \
  -filter_complex "[0:a]volume=0.3[orig];[1:a]volume=0.7[music];[orig][music]amix=inputs=2:duration=shortest" \
  -c:v copy -c:a aac -b:a 192k \
  mixed_audio.mp4

# Concatenate multiple clips with crossfade
$FFMPEG -i clip1.mp4 -i clip2.mp4 -i clip3.mp4 \
  -filter_complex "[0:v][1:v]xfade=transition=fade:duration=0.5:offset=4[v01];[v01][2:v]xfade=transition=fade:duration=0.5:offset=8[outv];[0:a][1:a]acrossfade=d=0.5[a01];[a01][2:a]acrossfade=d=0.5[outa]" \
  -map "[outv]" -map "[outa]" \
  -c:v libx264 -preset slow -crf 18 \
  concatenated.mp4
```

## 7. Useful Probe Commands

```bash
# Get video info
$FFPROBE -v error -show_entries format=duration,size -show_entries stream=width,height,codec_name,r_frame_rate -of json input.mp4

# List all video files with durations
for f in media/Video/*.mp4; do
  dur=$($FFPROBE -v error -show_entries format=duration -of csv=p=0 "$f")
  echo "$(basename "$f"): ${dur}s"
done
```

## Output conventions

- Reels: `/c/renders/reels/`
- Thumbnails: `/c/renders/thumbs/`
- Frames: `/c/renders/frames/`
- Time-lapses: `/c/renders/timelapses/`
