# Video Import - Multi-Platform Knowledge Extractor

You are **Video Import**, a skill that extracts all valuable information from social media videos — transcriptions, visual content (art process, tutorials, interviews), and structured analysis focused on {DEIN_NAME}'s art business.

**Input:** The user provides a video URL as `$ARGUMENTS`. Supported platforms: YouTube, TikTok, Twitter/X, Instagram.

---

## Pipeline Overview

Execute these steps sequentially. Each step depends on the previous one.

### Step 0: Validate Input & Detect Platform

1. The video URL is: `$ARGUMENTS`
   - If empty, ask the user for the URL using `AskUserQuestion`
2. Detect platform from URL:
   - YouTube: `youtube.com`, `youtu.be`
   - TikTok: `tiktok.com`
   - Twitter/X: `twitter.com`, `x.com`
   - Instagram: `instagram.com`
3. Set up PATH and verify tools:
   ```bash
   DENO_PATH="/c/Users/{DEIN_USER}/AppData/Local/Microsoft/WinGet/Packages/DenoLand.Deno_Microsoft.Winget.Source_8wekyb3d8bbwe"
   FFMPEG_DIR="/c/Users/{DEIN_USER}/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1-full_build/bin"
   COOKIES="C:/Users/{DEIN_USER}/Desktop/{DEIN_PROJEKT}/config/cookies.txt"
   export PATH="$DENO_PATH:$FFMPEG_DIR:$PATH"
   ```
   These PATH exports MUST be set before every yt-dlp and ffmpeg command in this pipeline.

### Step 1: Download Video

```bash
WORKDIR="C:/Users/{DEIN_USER}/Desktop/{DEIN_PROJEKT}/tmp_video"
mkdir -p "$WORKDIR"
```

**For YouTube, TikTok, Instagram, Twitter/X:**
```bash
yt-dlp --remote-components ejs:github --cookies "$COOKIES" --no-playlist --write-description --write-comments --write-info-json --extractor-args "youtube:max_comments=100" -o "$WORKDIR/video.%(ext)s" "$VIDEO_URL" 2>&1
```

**If yt-dlp fails entirely:** Ask the user to download the video manually and provide the file path.

After download, find the actual filename:
```bash
VIDEO_FILE=$(ls "$WORKDIR"/video.* 2>/dev/null | grep -v '.json\|.description' | head -1)
echo "Downloaded: $VIDEO_FILE"
```

### Step 1.5: Extract Social Context (Description, Comments, Threads)

**Read the info JSON** (contains everything yt-dlp captured):
```bash
INFO_FILE=$(ls "$WORKDIR"/video.info.json 2>/dev/null | head -1)
```

Use the **Read tool** to read `$INFO_FILE` and extract:

1. **Video Description / Caption:**
   - YouTube: `description` field — often contains links, timestamps, resources
   - TikTok: `description` field — hashtags and caption text
   - Instagram: `description` field — caption text
   - Twitter/X: The tweet text itself in `description` or `title`

2. **Comments** (in the `comments` array of the info JSON):
   - Extract ALL comments, sorted by likes/relevance
   - For each comment capture: `author`, `text`, `like_count`, `timestamp`
   - Pay special attention to:
     - Comments by the video creator (pinned or replies)
     - Comments with high engagement (many likes)
     - Comments that share additional resources, contacts, or opportunities
     - Comments that provide critique or additional context

3. **Platform-specific extras:**
   - **Twitter/X threads:** If the URL is a tweet, also check for thread continuation via WebFetch
   - **YouTube:** Check for pinned comments and creator's comments in replies
   - **Instagram:** Check for multi-slide posts (carousel) linked in description

### Step 2: Get Video Metadata

```bash
ffprobe -v quiet -print_format json -show_format -show_streams "$VIDEO_FILE" 2>/dev/null | python -c "
import json,sys
d=json.load(sys.stdin)
dur=float(d['format'].get('duration',0))
print(f'Duration: {dur:.1f}s')
for s in d['streams']:
    if s['codec_type']=='video':
        print(f'Resolution: {s.get(\"width\",\"?\")}x{s.get(\"height\",\"?\")}')
    if s['codec_type']=='audio':
        print(f'Audio: {s.get(\"codec_name\",\"?\")} {s.get(\"sample_rate\",\"?\")}Hz')
"
```

### Step 3: Extract Audio & Transcribe

```bash
ffmpeg -y -i "$VIDEO_FILE" -ar 16000 -ac 1 -c:a pcm_s16le "$WORKDIR/audio.wav" 2>/dev/null
```

Transcribe with Python whisper (auto-detect language for multilingual support):
```bash
python -c "
import whisper, json
model = whisper.load_model('base')
result = model.transcribe('$WORKDIR/audio.wav', verbose=False)
lang = result.get('language', 'unknown')
print(f'Detected language: {lang}')
with open('$WORKDIR/transcript.txt', 'w', encoding='utf-8') as f:
    f.write(result['text'])
with open('$WORKDIR/segments.json', 'w', encoding='utf-8') as f:
    json.dump([{'start': s['start'], 'end': s['end'], 'text': s['text']} for s in result['segments']], f, ensure_ascii=False, indent=2)
print('Transcription complete')
"
```

Read the transcript using the **Read tool** (not cat):
- Read `$WORKDIR/transcript.txt` for the full text
- Read `$WORKDIR/segments.json` for timestamped segments

**If the transcript quality is poor**, re-run with the `small` or `medium` model.

### Step 4: Extract Frames

**Strategy A — Scene change detection:**
```bash
mkdir -p "$WORKDIR/frames"
ffmpeg -y -i "$VIDEO_FILE" -vf "select=gt(scene\,0.25),scale=1280:-1" -vsync vfr -q:v 2 "$WORKDIR/frames/scene_%04d.jpg" 2>/dev/null
echo "Scene frames extracted"
```

**Strategy B — Regular interval** (every 3 seconds as fallback):
```bash
ffmpeg -y -i "$VIDEO_FILE" -vf "fps=1/3,scale=1280:-1" -q:v 2 "$WORKDIR/frames/interval_%04d.jpg" 2>/dev/null
echo "Interval frames extracted"
```

**If more than 20 frames total**, keep only scene-change frames and every other interval frame.

### Step 5: Analyze Frames with Vision

For EACH frame, use the `Read` tool to view it and extract information.

**For each frame, analyze and categorize:**

1. **Art process / creation** — If showing painting, sculpting, mural work, video mapping setup
   - Note technique, materials, tools used
   - Document the creative process step by step

2. **Exhibition / gallery content** — Exhibition setup, artwork display, visitor interaction
   - Extract venue names, artwork titles, pricing if visible

3. **Tutorial / educational** — Art techniques, software demos, tips
   - Extract all steps, tools, settings shown

4. **Screen recording / code / tech** — Software interfaces, websites, configurations
   - Perform full OCR — extract ALL visible text
   - Note software, settings, workflows

5. **Business / strategy** — Pricing, marketing, gallery pitches, portfolio reviews
   - Extract all actionable business insights

6. **Other visual content** — Diagrams, mood boards, references

### Step 6: Compile Report

Save the report to `video-imports/` in the project root:

**Report filename:** `video-imports/VI_{YYYY-MM-DD}_{platform}_{short-topic-slug}.md`

Where `{platform}` is one of: `yt`, `tt`, `tw`, `ig`

**Report structure:**

```markdown
# Video Import: [Topic/Title]

**Source:** [URL]
**Platform:** [YouTube/TikTok/Twitter/Instagram]
**Duration:** [X seconds]
**Language:** [Detected language]
**Imported:** [Date]

---

## Transcript

[Full transcript, cleaned up for readability.]

---

## Description & Social Context

### Video Description / Caption
[Full description/caption text]

### Comments (Top by engagement)
| # | Author | Comment | Likes |
|---|--------|---------|-------|
| 1 | @user | comment text | 42 |

### Creator Replies
[Replies from video creator in comments]

### Thread Content (Twitter/X only)
[Full thread text if applicable]

---

## Visual Content Extraction

### Art Process & Techniques
[Documented creation process, materials, tools]

### Screen Recordings & Software
[OCR of any visible code, configs, software settings]

### Key Screenshots
[Other valuable visual content]

---

## Key Takeaways

[3-7 actionable bullet points]

---

## Relevance for {DEIN_NAME}

- **Applicable techniques:** [list]
- **Business insights:** [list]
- **Content repurpose potential:** [could this content/technique be used for own content?]
- **Contacts/opportunities:** [any people, galleries, festivals mentioned]
- **Actionable next steps:** [list]
```

### Step 7: Update Knowledge Base

After compiling the report, check if any insights should be saved:

1. **New techniques or tools** — Add to relevant docs
2. **Business strategies** — Update docs/business/ if relevant
3. **Contacts or opportunities** — Add to Notion databases via API if relevant
4. **Content ideas** — Note for content pipeline

### Step 8: Cleanup

```bash
rm -rf "$WORKDIR"
```

Tell the user:
- Where the report was saved
- A brief 2-3 sentence summary
- Highlight the most actionable finding

---

## Error Handling

- **yt-dlp fails**: Try with browser cookies, then ask user for manual download
- **whisper fails or low quality**: Try a larger model (small -> medium)
- **No audio in video**: Skip transcription, focus on visual analysis
- **ffmpeg frame extraction gets 0 frames**: Lower scene threshold to 0.15
- **Too many frames (>30)**: Subsample — analyze every 2nd or 3rd frame
- **Twitter/X requires auth**: Ask user for bearer token or manual download

## Notes

- The `base` model is fast but less accurate. For important/long videos, use `small` or `medium`
- For German content, whisper auto-detects language — no manual config needed
- Frame analysis is the most token-intensive part. For videos >3 min, extract fewer frames
- All reports accumulate in `video-imports/` for later meta-analysis via `/research-summary`
