---
name: carousel
description: Generate branded Instagram carousels (1080x1350 portrait, 7-10 slides) for {DEIN_NAME}'s art, music, and mural niches using HTML template + Playwright screenshot pipeline. Auto-fires on "carousel", "Karussell", "IG slides", "Instagram slides", "multi-slide post".
triggers:
  - carousel
  - Karussell
  - instagram carousel
  - IG slides
  - instagram slides
  - multi-slide
  - slide deck instagram
  - mach ein karussell
  - make a carousel
---

# Instagram Carousel Generator (2026 SOTA)

Auto-generates branded Instagram carousel slides as 1080x1350 PNG images optimized for the 2026 algorithm (saves/shares weighted 3x likes).

## When to fire

- User says "carousel", "Karussell", "IG slides", "Instagram slides", "multi-slide post"
- Content needs multi-slide visual format for Instagram/LinkedIn/Threads
- Reel/video idea better suited to slideshow (listicle, educational, before/after)
- Content-pipeline pulls carousel-format job from Notion DB

## 2026 Format Rules (non-negotiable)

| Rule | Value | Reason |
|---|---|---|
| Dimensions | 1080x1350 (4:5 portrait) | 3.4x more saves than square (Q1 2026 data) |
| Slide count | 7-10 educational, 4-8 narrative | Hard cap 10 (completion rate drops) |
| Progress indicator | "01/08" on every slide | Boosts completion rate |
| Slide 1 weight | 80% of algorithmic weight | Must hook in 1-2 seconds |
| Save CTA | Mandatory on slide 2 AND final slide | Saves weighted 3x likes |
| Share CTA | Mandatory quotable stat slide mid-carousel | Shares weighted 3x likes |
| Loop hook | Last slide references slide 1 or teases next | Re-engage, boost saves |
| Cover A/B | Generate 2 cover variants | Test which hooks better |

## {User}'s Niches (auto-select tone)

| Niche | Tone | Example Hooks |
|---|---|---|
| Art (Malerei/Skulptur) | Process-transparent, craft-respectful | "Wie ein Mural in 7 Schritten entsteht" |
| Art Series Release | Community, edition drops | "Warum diese 111er-Edition niemand mehr ignorieren kann" |
| Motion Design | Behind-the-scenes, tool-transparent | "4 AE Skripte die ich jeden Tag nutze" |
| {DEIN_PROJEKT} (Music) | Mood, gear, build-diary | "Wie ich einen Track in 45 Min fertig mache" |
| Mural/Public Art | Scale, logistics, before/after | "12m Wand, 3 Tage, 180 Liter Farbe" |

## Pipeline (4 Steps)

### Step 1: Content Analysis + Hook Engineering

Analyze the topic. Structure into 7-10 slides using ONE of these frameworks:

1. **PSR** (Problem-Solution-Result) - for tutorial content
2. **PAS** (Problem-Agitate-Solve) - for opinion/contrarian
3. **Listicle** "X things nobody told you about Y" - for evergreen
4. **Before/After** - perfect for murals + art process
5. **Contrarian** "Stop doing X" - for defensiveness trigger

Slide structure:
- **Slide 1 (Hook):** Stop-scroll headline + curiosity/FOMO trigger + transformation preview
- **Slide 2 (Save-bait):** Checklist or reference user wants to keep. "Save this for later."
- **Slides 3-6 (Content):** One key point per slide, high density (2026 rewards dwell time)
- **Slide 4 or 5 (Share-bait):** Quotable stat or contrarian claim with attribution box
- **Slide 7 (Pattern-interrupt):** Visual shift - different color/layout to retain attention
- **Slide 8-9 (CTA):** "Save this" + "Send to a friend who [X]" + "Follow @{user}"
- **Final slide (Loop):** References slide 1 or teases next carousel

### Step 2: Generate HTML (use template)

Copy `templates/base-carousel.html` to `tmp_video/carousel/slides.html`. Replace placeholders:

- `{{BRAND_PRIMARY}}` - from `docs/website/{user}-design.md` (fallback `#0a0a0a`)
- `{{BRAND_ACCENT}}` - from design.md (fallback `#ff3d00`)
- `{{BRAND_TEXT}}` - fallback `#ffffff`
- `{{HANDLE}}` - `@{user}`
- `{{SLIDE_COUNT}}` - e.g. `08`
- Per-slide: `{{SLIDE_N_TYPE}}`, `{{SLIDE_N_HEADLINE}}`, `{{SLIDE_N_BODY}}`

If `docs/website/{user}-design.md` missing: fire `design-md-generator` skill first.

### Step 3: Screenshot with Playwright

Run `scripts/render-carousel.js`:

```bash
mkdir -p tmp_video/carousel
node .claude/skills/carousel/scripts/render-carousel.js tmp_video/carousel/slides.html tmp_video/carousel
```

Outputs: `tmp_video/carousel/slide_01.png` through `slide_NN.png` at exactly 1080x1350.

### Step 4: Output + Caption Handoff

- Confirm file count in `tmp_video/carousel/`
- List slide headlines (sanity check)
- Fire `instagram-caption-generator` skill with carousel context (save/share gate prompts)
- Offer to save to Content-Pipeline Notion DB via `notion-content-pipeline` skill
- Generate 2 cover variants as `cover_A.png` + `cover_B.png` for A/B testing

## Slide Type Library

| Type | Layout | Use |
|---|---|---|
| `hook` | Huge headline, accent gradient, minimal body | Slide 1 only |
| `save-bait` | Numbered checklist, "Save for later" tag | Slide 2 |
| `content` | Headline + 2-4 bullets | Middle slides |
| `stat` | Giant number + 1-line context | Share-bait |
| `quote` | Quotation + attribution box | Quote slides |
| `before-after` | Split 50/50 image/text | Mural/process |
| `pattern-interrupt` | Inverted colors (light bg, dark text) | Mid-carousel |
| `cta` | "Save + Share + Follow" triple CTA | Slide 8-9 |
| `loop` | Callback to slide 1 or tease | Final slide |

## Auto-Fire Rules

- User says "mach ein Karussell ueber..." -> fire
- User says "Instagram slides fuer..." -> fire
- User pastes content + says "carousel format" -> fire
- Content-pipeline Notion DB has job with `format=carousel` -> fire
- `reel-template` skill fails (topic too text-heavy) -> suggest fallback to carousel

## Quality Gates (before output)

1. Every slide has `01/NN` progress indicator? (boosts completion)
2. Slide 1 passes 1-2 second readability test? (biggest font)
3. At least one save-bait + one share-bait slide? (algorithm weight)
4. Final slide has loop hook? (re-engagement)
5. All PNGs exactly 1080x1350? (run `ffprobe` if uncertain)
6. No hardcoded brand colors? (must read from design.md)

## Integration with other skills

- `design-md-generator` - must run first if no design.md exists
- `instagram-caption-generator` - chain after render for captions
- `notion-content-pipeline` - save finished carousel to schedule DB
- `ffmpeg-batch` - if converting carousel to Reel slideshow variant
- `parallel-research-agent` - if topic needs deep research first

## File Locations

- Template: `.claude/skills/carousel/templates/base-carousel.html`
- Script: `.claude/skills/carousel/scripts/render-carousel.js`
- Output dir: `tmp_video/carousel/` (auto-created by script)
- Brand source: `docs/website/{user}-design.md`

## Sources (2026 research)

- truefuturemedia.com/articles/instagram-carousel-strategy-2026
- marketingagent.blog/2026/01/03/mastering-instagram-carousel-strategy-in-2026
- trymypost.com/blog/instagram-carousel-algorithm-2026-guide
- amourvert.com/articles/why-instagram-carousels-are-quietly-winning-the-algorithm-in-2026
- postnitro.ai/blog/post/instagram-carousel-maker
