---
name: gemini-video-analyzer
description: Analyze long videos (up to 6h) with Gemini 2.5 Pro native video input. Replaces the 8-step video-import pipeline (yt-dlp + ffmpeg + whisper + frame extract + per-frame Read loop) with 3 steps (upload + prompt + parse). Use when the user says "analyze video long", "Gemini video", "6 hour podcast", "analyze podcast", "long-form video", "multi-hour video", "transcript extraction", "summarize keynote", or provides a video file/URL longer than ~10 minutes. Also fire when video-import would be too token-expensive (large local .mp4, full YouTube talks, lectures, workshops, Twitch VODs, streams). Outputs the same VI_{date}_{platform}_{slug}.md format {User} uses in video-imports/.
---

# Gemini Video Analyzer — Long-Form Video Intelligence

You are **Gemini Video Analyzer**, a skill that offloads video understanding to **Gemini 2.5 Pro's native video modality**. Where `video-import` burns tokens running yt-dlp → ffprobe → ffmpeg → whisper → frame-by-frame `Read` loops in Claude, this skill lets Gemini ingest the whole video in one shot and return a structured report that Claude then files into `video-imports/`.

**Core insight (Apr 2026):** Gemini 2.5 Pro accepts video directly via the Files API. At the default 1 FPS / 66 tokens/frame rate, a 1M-token context window holds roughly **6 hours** of video. Low-media-resolution mode (32 tokens/frame) stretches that further. This collapses the 8-step video-import pipeline to **3 steps**: upload, prompt, parse.

---

## When to Fire

| User signal | Fire? |
|-------------|-------|
| Video ≤ 2 min (Reel, TikTok) | NO — keep using `video-import` (whisper is free, ffmpeg is fast) |
| Video 2-10 min | MAYBE — check token budget; Gemini wins if frame-heavy |
| Video > 10 min (podcast, keynote, workshop, livestream) | YES — Gemini wins massively |
| User says "6h", "long", "podcast", "lecture", "full video" | YES |
| Local .mp4 > 100 MB | YES |
| Platform where yt-dlp fails (DRM, auth walls) | NO — neither works |
| Need frame-accurate art-process OCR on Reel | NO — `video-import` + Claude vision is more precise |

---

## Setup (One-Time)

### 1. Install Python SDK

```bash
pip install -U google-genai python-dotenv
```

The legacy package is `google-generativeai`; the **new unified SDK is `google-genai`** (released late 2024, merges Google AI Studio + Vertex AI). Use `google-genai` — that is what this skill targets.

### 2. Get API Key

1. Go to https://aistudio.google.com/app/apikey
2. Create key in a Google Cloud project (free tier available)
3. Free tier: ~2 requests/min, ~50/day on Gemini 2.5 Pro — enough for {User}'s volume
4. Paid tier: see cost table below

### 3. Add to .env

```bash
# .env (in project root, NEVER commit)
GOOGLE_API_KEY=AIzaSy...your_key_here
GEMINI_MODEL=gemini-2.5-pro
```

Verify:
```bash
python -c "import os; from dotenv import load_dotenv; load_dotenv(); print('OK' if os.getenv('GOOGLE_API_KEY') else 'MISSING')"
```

### 4. Script Location

The Python helper lives at `scripts/gemini_video_analyze.py` (see full script below — create it on first run if missing).

---

## Cost (April 2026)

Gemini 2.5 Pro pricing (Google AI Studio standard, paid tier):

| Item | Price |
|------|-------|
| Input text/image/video ≤ 200k tokens | $1.25 / 1M tokens |
| Input > 200k tokens | $2.50 / 1M tokens |
| Output ≤ 200k tokens | $10.00 / 1M tokens |
| Output > 200k tokens | $15.00 / 1M tokens |
| Video frame (default res, 1 FPS) | ~66 tokens/frame + 32 tokens/sec audio |
| Video frame (low res) | ~32 tokens/frame |

**Per-hour math (default resolution, 1 FPS):**

- 3600 frames × 66 tokens = 237'600 video tokens
- 3600 sec × 32 tokens = 115'200 audio tokens
- Total input ≈ **353k tokens per hour** → crosses the 200k threshold → $2.50/M
- Cost per hour of video input ≈ **353k × $2.50 / 1M ≈ $0.88**
- Output (report ~8k tokens) ≈ **$0.08**
- **Total per hour of video ≈ $0.96, round up to ~$1.00**

**Low-resolution mode** (set `media_resolution="low"`): 32 tokens/frame → ~168k video + 115k audio = 283k tokens/h → stays under the 200k bracket partially → ~**$0.50/h**.

**Summary:**
- **~$1/hour of video** at default resolution
- **~$0.50/hour of video** at low resolution
- Free tier covers a few podcasts/day at $0

Compare to `video-import`'s cost: whisper is free but Claude burns ~$0.20-2.00 per video on frame Read loops + transcript cleanup on Opus.

---

## Pipeline (3 Steps)

### Step 0: Validate Input

1. The input is `$ARGUMENTS` — either a URL (YouTube/Vimeo/etc.) or a local file path.
2. If URL from YouTube, download first with yt-dlp (Gemini's YouTube URL ingestion is public-only and flaky on unlisted/shorts):
   ```bash
   YTDLP="/c/Users/{DEIN_USER}/AppData/Local/Programs/Python/Python310/Scripts/yt-dlp"
   COOKIES="{DEIN_PROJEKT_PFAD}/config/cookies.txt"
   WORKDIR="{DEIN_PROJEKT_PFAD}/tmp_video"
   mkdir -p "$WORKDIR"
   "$YTDLP" --cookies "$COOKIES" -f "bv*[height<=720]+ba/b[height<=720]" -o "$WORKDIR/video.%(ext)s" --write-info-json "$VIDEO_URL"
   VIDEO_FILE=$(ls "$WORKDIR"/video.* 2>/dev/null | grep -vE '\.(json|description)$' | head -1)
   ```
   Downgrading to 720p saves upload time AND matches Gemini's internal downsampling anyway.
3. If local file, verify it exists and get duration:
   ```bash
   FFPROBE="/c/Users/{DEIN_USER}/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.1-full_build/bin/ffprobe"
   DUR=$("$FFPROBE" -v quiet -show_entries format=duration -of csv=p=0 "$VIDEO_FILE")
   echo "Duration: ${DUR}s"
   ```

### Step 1: Upload to Gemini Files API

```bash
python scripts/gemini_video_analyze.py upload "$VIDEO_FILE"
```

Output: a file URI like `files/abc123xyz`. Wait until state becomes `ACTIVE` (the script handles polling automatically — videos take 30s-5min to process depending on length).

### Step 2: Query with Report Prompt

```bash
python scripts/gemini_video_analyze.py analyze \
  --file-uri "files/abc123xyz" \
  --source-url "$VIDEO_URL" \
  --platform "yt" \
  --prompt-template full \
  --output "video-imports/VI_$(date +%Y-%m-%d)_yt_${SLUG}.md"
```

The script uses the **structured report prompt** (see below) and parses Gemini's response into {User}'s exact VI_*.md format.

### Step 3: Update Knowledge Base + Cleanup

1. Read the generated report with `Read` tool
2. If new techniques/contacts/opportunities found → update `docs/` or Notion DBs
3. Delete the Files API upload (free up quota):
   ```bash
   python scripts/gemini_video_analyze.py delete --file-uri "files/abc123xyz"
   ```
4. `rm -rf "$WORKDIR"`

---

## The Python Script

Create at `scripts/gemini_video_analyze.py` on first run:

```python
#!/usr/bin/env python3
"""
Gemini 2.5 Pro Video Analyzer
Replaces video-import's 8-step pipeline with 3 steps.
"""
import argparse
import os
import sys
import time
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

API_KEY = os.getenv("GOOGLE_API_KEY")
MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-pro")

if not API_KEY:
    sys.exit("ERROR: GOOGLE_API_KEY missing in .env")

client = genai.Client(api_key=API_KEY)


# -------------------- PROMPT TEMPLATES --------------------

PROMPT_FULL = """You are analyzing a video for {DEIN_NAME} — a visual artist (painting, sculpture, murals, video mapping) and motion designer. Goal: extract MAXIMUM value from this video in a structured report.

Your output MUST be a single valid Markdown document with the following sections, in this exact order:

## Transcript
Full transcript with timestamps every 15-60s: [MM:SS] speaker: text
Preserve original language. If multilingual, note switches.

## Description & Social Context
Video title, creator, stated topic, any on-screen text, credits.

## Key Moments (Timeline)
Bullet list: [MM:SS] what happens / what is said / what is shown.
Aim for one bullet every 30-90s of key content. Skip filler.

## Visual Content Extraction
### Art Process & Techniques
Materials, tools, techniques, step-by-step if it's a tutorial/process video.
### Screen Recordings & Software
Full OCR of any visible code, configs, URLs, software interfaces.
### Key Screenshots (described)
Describe standout visual moments: compositions, colors, camera angles.

## Transcript Highlights & Quotes
3-10 standout quotes with [MM:SS] timestamps.

## CTAs & Links Mentioned
Every URL, tool name, book, person, gallery, brand, Instagram handle,
GitHub repo, or actionable link mentioned or shown on screen.

## Key Takeaways
3-7 actionable bullet points.

## Relevance for {DEIN_NAME}
- **Applicable techniques:** list
- **Business insights:** list
- **Content repurpose potential:** could this content/technique be used for {User}'s own content?
- **Contacts/opportunities:** people, galleries, festivals mentioned
- **Actionable next steps:** concrete todos

Rules:
- Do NOT hallucinate. If uncertain, write [unclear] or [inaudible].
- Preserve exact names, numbers, dates, URLs.
- German transcription stays German. English stays English.
- No emojis.
- Be thorough — {User} will base business decisions on this report.
"""

PROMPT_TRANSCRIPT_ONLY = """Provide the full transcript of this video with timestamps every 15-60 seconds in the format [MM:SS] text. Preserve original language. Do not summarize. Do not add commentary."""

PROMPT_KEY_MOMENTS = """Identify the 10-30 most important moments in this video. For each: [MM:SS] + one-sentence description of what happens, what is said, or what is shown. Focus on decisive moments — skip filler."""

PROMPT_CTAS = """Extract every actionable item mentioned or shown in this video: URLs, tool names, GitHub repos, Instagram handles, people, galleries, brands, books, products, prices, dates. Output as a categorized markdown list. Include [MM:SS] timestamp for each."""

PROMPTS = {
    "full": PROMPT_FULL,
    "transcript": PROMPT_TRANSCRIPT_ONLY,
    "moments": PROMPT_KEY_MOMENTS,
    "ctas": PROMPT_CTAS,
}


# -------------------- COMMANDS --------------------

def cmd_upload(args):
    """Upload video to Gemini Files API and wait until ACTIVE."""
    path = Path(args.file)
    if not path.exists():
        sys.exit(f"File not found: {path}")

    print(f"Uploading {path.name} ({path.stat().st_size / 1e6:.1f} MB)...")
    uploaded = client.files.upload(file=str(path))
    print(f"Uploaded. URI: {uploaded.name}")

    # Poll until processing complete
    while uploaded.state.name == "PROCESSING":
        print(f"  state={uploaded.state.name}, waiting 10s...")
        time.sleep(10)
        uploaded = client.files.get(name=uploaded.name)

    if uploaded.state.name == "FAILED":
        sys.exit(f"Processing FAILED for {uploaded.name}")

    print(f"Active: {uploaded.name}")
    print(uploaded.name)  # machine-readable last line
    return uploaded.name


def cmd_analyze(args):
    """Run Gemini analysis on an uploaded video."""
    file_ref = client.files.get(name=args.file_uri)
    prompt = PROMPTS.get(args.prompt_template, PROMPT_FULL)

    # Optional low-res mode for cost savings
    gen_config = types.GenerateContentConfig(
        temperature=0.2,
        max_output_tokens=32768,
        media_resolution=(
            types.MediaResolution.MEDIA_RESOLUTION_LOW
            if args.low_res
            else types.MediaResolution.MEDIA_RESOLUTION_MEDIUM
        ),
    )

    print(f"Analyzing with model={MODEL}, template={args.prompt_template}...")
    response = client.models.generate_content(
        model=MODEL,
        contents=[file_ref, prompt],
        config=gen_config,
    )

    body = response.text or "[No response from Gemini]"

    # Assemble final markdown with frontmatter matching {User}'s VI_*.md schema
    header = f"""# Video Import: {args.title or '[Auto-detect from content]'}

**Source:** {args.source_url or '[local file]'}
**Platform:** {args.platform or 'unknown'}
**Analyzed by:** Gemini {MODEL}
**Imported:** {time.strftime('%Y-%m-%d')}

---

"""

    Path(args.output).parent.mkdir(parents=True, exist_ok=True)
    Path(args.output).write_text(header + body, encoding="utf-8")

    # Token/cost stats
    usage = getattr(response, "usage_metadata", None)
    if usage:
        in_tok = usage.prompt_token_count
        out_tok = usage.candidates_token_count
        in_rate = 2.50 if in_tok > 200_000 else 1.25
        out_rate = 15.00 if out_tok > 200_000 else 10.00
        cost = (in_tok * in_rate + out_tok * out_rate) / 1_000_000
        print(f"Tokens: in={in_tok:,} out={out_tok:,} -> cost=${cost:.4f}")

    print(f"Report saved: {args.output}")


def cmd_delete(args):
    client.files.delete(name=args.file_uri)
    print(f"Deleted: {args.file_uri}")


def cmd_list(args):
    for f in client.files.list():
        print(f"{f.name:40s} {f.state.name:12s} {f.display_name}")


# -------------------- CLI --------------------

def main():
    p = argparse.ArgumentParser(description="Gemini 2.5 Pro Video Analyzer")
    sub = p.add_subparsers(dest="cmd", required=True)

    sp = sub.add_parser("upload")
    sp.add_argument("file")
    sp.set_defaults(func=cmd_upload)

    sp = sub.add_parser("analyze")
    sp.add_argument("--file-uri", required=True)
    sp.add_argument("--source-url", default="")
    sp.add_argument("--platform", default="unknown")
    sp.add_argument("--title", default="")
    sp.add_argument("--prompt-template", default="full",
                    choices=list(PROMPTS.keys()))
    sp.add_argument("--output", required=True)
    sp.add_argument("--low-res", action="store_true",
                    help="Use low media resolution (32 tok/frame, ~50% cheaper)")
    sp.set_defaults(func=cmd_analyze)

    sp = sub.add_parser("delete")
    sp.add_argument("--file-uri", required=True)
    sp.set_defaults(func=cmd_delete)

    sub.add_parser("list").set_defaults(func=cmd_list)

    args = p.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
```

---

## Prompt Templates

The script ships with 4 templates (`--prompt-template` flag):

1. **`full`** (default) — full VI_*.md report with all 8 sections
2. **`transcript`** — transcript only with timestamps
3. **`moments`** — 10-30 key moments timeline
4. **`ctas`** — extract every URL, tool, person, gallery, link mentioned

Prompt design rules:
- Explicit output schema (Markdown sections in order)
- Tell Gemini WHO {User} is (visual artist, motion design)
- Forbid hallucination — use `[unclear]` for uncertainty
- Preserve original language
- No emojis ({User} rule)
- Request exact names, numbers, URLs, dates

---

## Example Workflows

### Workflow 1: Analyze a 90-minute podcast (YouTube)

```bash
cd "{DEIN_PROJEKT_PFAD}"
VIDEO_URL="https://www.youtube.com/watch?v=abc123"
SLUG="tim-ferriss-founder-podcast"

# Download at 720p (faster upload, same Gemini quality)
YTDLP="/c/Users/{DEIN_USER}/AppData/Local/Programs/Python/Python310/Scripts/yt-dlp"
"$YTDLP" -f "bv*[height<=720]+ba/b[height<=720]" \
  -o "tmp_video/video.%(ext)s" --write-info-json "$VIDEO_URL"
VIDEO_FILE=$(ls tmp_video/video.* | grep -vE '\.(json|description)$' | head -1)

# Upload and analyze in one go
FILE_URI=$(python scripts/gemini_video_analyze.py upload "$VIDEO_FILE" | tail -1)

python scripts/gemini_video_analyze.py analyze \
  --file-uri "$FILE_URI" \
  --source-url "$VIDEO_URL" \
  --platform "yt" \
  --title "Tim Ferriss x Founder Mode" \
  --prompt-template full \
  --output "video-imports/VI_$(date +%Y-%m-%d)_yt_${SLUG}.md"

# Cleanup
python scripts/gemini_video_analyze.py delete --file-uri "$FILE_URI"
rm -rf tmp_video
```

Expected cost: 90min × $1/h ≈ **$1.50**.

### Workflow 2: 6-hour conference keynote (local .mp4 from media folder)

```bash
VIDEO_FILE="media/videos/ars-electronica-2025-keynote.mp4"
SLUG="ars-electronica-keynote"

# Use low-res mode — 6h video, want to stay cheap
FILE_URI=$(python scripts/gemini_video_analyze.py upload "$VIDEO_FILE" | tail -1)

python scripts/gemini_video_analyze.py analyze \
  --file-uri "$FILE_URI" \
  --platform "local" \
  --title "Ars Electronica 2025 Keynote" \
  --prompt-template full \
  --low-res \
  --output "video-imports/VI_$(date +%Y-%m-%d)_local_${SLUG}.md"

python scripts/gemini_video_analyze.py delete --file-uri "$FILE_URI"
```

Expected cost: 6h × $0.50/h ≈ **$3.00**.

### Workflow 3: Extract only CTAs from a tool-review video (fast, cheap)

```bash
# {User}: "This AI Reel mentions 10 tools — give me the list."
VIDEO_FILE="video-imports/raw/chase-h-ai-top-10-tools.mp4"

FILE_URI=$(python scripts/gemini_video_analyze.py upload "$VIDEO_FILE" | tail -1)

python scripts/gemini_video_analyze.py analyze \
  --file-uri "$FILE_URI" \
  --platform "ig" \
  --prompt-template ctas \
  --output "video-imports/VI_$(date +%Y-%m-%d)_ig_tool-list-ctas.md"

python scripts/gemini_video_analyze.py delete --file-uri "$FILE_URI"
```

Expected cost: 2min × ~$0.04 ≈ **$0.04**.

---

## Integration with video-import

This skill is the **long-form counterpart** to `video-import`. Routing logic:

| Video duration | Skill to fire |
|----------------|---------------|
| < 2 min | `video-import` (whisper is free, fast) |
| 2-10 min | `video-import` default, or `gemini-video-analyzer` if budget allows |
| 10-60 min | `gemini-video-analyzer` (cheaper total due to less Claude frame-reading) |
| > 1 hour | **`gemini-video-analyzer` only** (video-import would blow context window) |

Both output to the same `video-imports/VI_*.md` format → downstream tools (`research-summary`, Notion sync) work unchanged.

---

## Error Handling

- **Upload fails** → check file size (< 2GB Files API limit), check network, check `GOOGLE_API_KEY`
- **Processing FAILED state** → re-encode video to H.264 + AAC with ffmpeg
- **Rate limit (429)** → Gemini 2.5 Pro free tier is 2 req/min — wait 30s and retry
- **Safety block** → adjust `safety_settings=` in gen_config (rare, but possible on artistic/nude content)
- **Hallucinated timestamps** → enable `--low-res` first, then re-run with `medium` if unclear
- **Report too short / cut off** → raise `max_output_tokens` in the script
- **"Model not found"** → fallback: set `GEMINI_MODEL=gemini-2.5-flash` in .env (cheaper, still handles 1h+ video)

---

## Notes

- Gemini 2.5 Pro is the default; **Gemini 2.5 Flash** is ~5x cheaper and still handles long video — swap via `GEMINI_MODEL` env var for bulk processing
- Files uploaded via Files API **auto-expire after 48h** — delete manually to free quota faster
- Free tier is generous enough for {User}'s typical weekly volume (few podcasts + few Reels)
- Reports accumulate in `video-imports/` alongside `video-import` outputs → `/research-summary` meta-analysis works across both
- For videos {User} wants to **recreate** visually (art process, shader demos, camera angles), still use `video-import` — Claude's frame-by-frame vision is more precise for pixel-level OCR
- For videos {User} wants to **understand** (podcasts, keynotes, interviews, long tutorials), use this skill — Gemini's context is unbeatable

---

## Triggers (Auto-Fire)

Fire this skill when you see any of:
- "analyze video long"
- "Gemini video"
- "6 hour podcast" / "long podcast" / "full podcast"
- "analyze keynote" / "summarize talk" / "conference video"
- "transcript long video"
- Video duration > 10 minutes
- Local file > 100 MB video
- Context window concern flagged by Claude
