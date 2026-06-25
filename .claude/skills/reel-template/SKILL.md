---
name: reel-template
description: Instagram/TikTok Reel script templates for {DEIN_NAME}. 10 proven hook-formats, Dynamic Minimalism 2026 aesthetic, 2026 metrics (watch-through > likes), DM-share CTA language, sub-commands for format/niche/process/series.
triggers:
  - reel
  - reel script
  - reel template
  - tiktok script
  - short video script
  - viral format
  - reel machen
  - mach ein reel
sub-commands:
  - format [1-10]  # Generate script for specific hook-format
  - niche [art|mapping|mural|sculpture|music|process|studio|festival]
  - process        # Process-as-content / build-diary reel
  - series         # Multi-part series (Tag 1, 2, 3...) template
---

# Reel Template Generator (2026 SOTA)

Generate proven-format scripts for Instagram Reels and TikTok based on the Chase-AI Master-Analyse (574 Posts, 61 Format-Reports) und Q1 2026 Algorithm-Updates. Alle Formate matchen `docs/platforms/reel-hook-templates.md`.

## When to use
- User wants to create a Reel or TikTok
- Content needs to be formatted as short video
- Planning social media video content
- Build-diary / process documentation
- Comment-gate lead magnets

## 2026 Algorithm Reality (Q1 2026)

Instagram Reels Top-5 Ranking-Signale (Priorität absteigend):

| Rank | Signal | Gewicht | Erklaerung |
|------|--------|---------|------------|
| 1 | **Watch-Through Rate** | KING | % der User die Reel zu Ende schauen. Likes irrelevant. |
| 2 | **Sends per Reach** | Hoch | DM-Shares. Kernmetrik seit Q1 2026. 500 Shares > 5'000 Likes. |
| 3 | **Saves** | Hoch | Boost fuer Tutorials, Poetisch-Philosophisch, Listicles. |
| 4 | **Completion Rate** | Mittel-Hoch | Komplette Views (inkl. Loops). 8-19s Sweet-Spot. |
| 5 | **Comments** | Mittel | Weiterhin relevant via Comment-Gate, aber nachrangig. |

**First 1.7 Sekunden** entscheiden Scroll-or-Stay. **Sweet-Spot 8-19s** (7-15s: 5.8% engagement, 31-60s: 4.9%, >90s: 3.2%).

Quellen: invideo Reels Guide 2026, Sprout Social Trends 2026, TrueFuture Caption SEO 2026.

## Dynamic Minimalism Aesthetic (Hormozi 2.0)

Hormozi-Style (Impact Bold + Gelb/Grün + Emojis + Woosh-SFX) ist seit Q4 2025 Commodity und tot. 2026-Standard:

| Element | Verboten (alt) | Pflicht (neu) |
|---------|----------------|---------------|
| **Font** | Impact Bold, Anton | Inter, Helvetica Neue, SF Pro (Clean Sans) |
| **Farbe Text** | Gelb, Neon-Gruen | Weiss + 20% Black Shadow |
| **Highlight** | Gelb/Gruen alle 2 Worte | 1 Brand-Color Akzent pro Shot |
| **Emojis** | 🔥😱💯 im Burn-In | KEINE Emojis im Overlay |
| **SFX** | Woosh, Boom, Ding | Subtle/beat-synced oder stumm |
| **Caption-Style** | Word-by-word hyper-animiert | Statisch oder 1-2s Cuts |
| **Zoom** | Punch-In alle 0.5s | Natuerlich, ruhig, intentional |

{Users} Brand-Color: aus `docs/website/{user}-design.md` (falls vorhanden, sonst via `design-md-generator`).

Quelle: Joyspace Hormozi 2026 Analysis.

## 2026 Metrics Table (Benchmarks)

| Metrik | Schlecht | OK | Gut | Viral |
|--------|----------|-----|-----|-------|
| **Watch-Through Rate** | <40% | 40-60% | 60-80% | >80% |
| **Sends / Reach** | <0.5% | 0.5-1% | 1-2% | >2% |
| **Saves / Reach** | <1% | 1-2% | 2-4% | >4% |
| **Completion Rate (15s Reel)** | <50% | 50-70% | 70-85% | >85% |
| **Reach vs Follower** | <50% | 50-100% | 100-500% | >500% |

{Users} Ziel fuer die ersten 90 Tage: **Sends/Reach >1%** + **Saves/Reach >2%**.

Quelle: Trustypost Caption Length 2026, invideo Reels Guide 2026.

---

## 10 Proven Hook-Formats

Cross-reference: `docs/platforms/reel-hook-templates.md` fuer komplette Hook-Formulierungen und Beispiele.

### Format 1: "Gerade fertig geworden" (Neuheits-Hook)
**Hook-Formel:** #1 | **Sweet-Spot:** 12-19s | **Best Metric:** Watch-Through + Sends
```
HOOK (0-2s):    Visual Reveal (final piece) + Overlay "Gerade fertig: [Werk]"
CONTEXT (2-6s): 1 Satz was es ist, wo, Material
SHOW (6-14s):   Detail-Shots, Prozess-Flash, Umfeld
CTA (14-19s):   "DM ART fuer Studio-Access" (DM-Share Language)
LOOP:           Visual cut zurueck zum Reveal-Frame
```
**Niches:** mural, sculpture, festival | **Auto-fire:** `comment-gate-reel` fuer CTA

### Format 2: "Ich habe X in Y gebaut" (Ergebnis-First / Time-Craft)
**Hook-Formel:** #2 | **Sweet-Spot:** 15-19s | **Best Metric:** Sends + Saves
```
HOOK (0-2s):     Final piece + Overlay "4 Meter Mural / 6 Stunden"
TIMELAPSE (2-12s): Speed-Ramp Prozess mit beat-sync cuts
MILESTONE (12-16s): 1 Zahl (Stunden/Spraydosen/Quadratmeter)
CTA (16-19s):    "Send this to an artist friend"
```
**Niches:** mural, painting, mapping, sculpture | **Pair:** `ffmpeg-batch` (Speed-Ramp)

### Format 3: "Zahlen die staunen lassen" (Stats-Hook)
**Hook-Formel:** #3 | **Sweet-Spot:** 10-15s | **Best Metric:** Saves + Sends
```
HOOK (0-2s):    Stat-Overlay auf Establishing-Shot ("200 Std Handarbeit")
CONTEXT (2-8s): Was dahinter steckt, visuell
PAYOFF (8-13s): Die zweite Zahl (Ergebnis, Erloes, Impact)
CTA (13-15s):   "Save this for motivation"
```
**Niches:** process, studio, sculpture, mural

### Format 4: "Der exakte Prozess" (Insider-Workflow)
**Hook-Formel:** #4 | **Sweet-Spot:** 19-30s (Tutorial-Ausnahme) | **Best Metric:** Saves
```
HOOK (0-2s):      "Der exakte Workflow fuer [X]" + numbered overlay "1/7"
STEPS (2-22s):    7 Steps a ~3s, clean captions (step-nummer + action)
OUTCOME (22-27s): Das fertige Ergebnis
CTA (27-30s):     "DM WORKFLOW fuer die komplette Guide"
```
**Niches:** mapping, tools, software, process | **Pair:** `instagram-edits-app` (Storyboards)

### Format 5: "X hat alles veraendert" (Game-Changer)
**Hook-Formel:** #5 | **Sweet-Spot:** 12-18s | **Best Metric:** Comments + Saves
```
HOOK (0-2s):     "[Tool/Material] hat alles veraendert" + before-visual
BEFORE (2-6s):   Alter Zustand / alter Workflow
REVEAL (6-12s):  Nach-Tool Ergebnis, Kontrast
WHY (12-16s):    1 Satz warum es funktioniert
CTA (16-18s):    "DM [KEYWORD] fuer mein Setup"
```
**Niches:** tools, software, material, music

### Format 6: "Before / After Reveal" (Transformation)
**Hook-Formel:** #6 | **Sweet-Spot:** 8-15s | **Best Metric:** Watch-Through (KING)
```
HOOK (0-2s):    Split-Screen Before/After FROZEN
REVEAL (2-4s):  Quick Cut — nur Before
BUILD (4-12s):  Timelapse Transformation
AFTER (12-14s): Final State + beat drop
CTA (14-15s):   "Send to a friend who needs this"
LOOP:           Schluss-Frame = Start-Frame der Before-Seite
```
**Niches:** mural, installation, sculpture, space-design | **Top-Performer 2026**

### Format 7: "So sieht X aus" (Curiosity / POV)
**Hook-Formel:** #7 | **Sweet-Spot:** 10-16s | **Best Metric:** Completion + Sends
```
HOOK (0-2s):    Ungewoehnlicher Angle + "So sieht [X] aus"
REVEAL (2-10s): Slow Pan / Walk-Through / Reveal
DETAIL (10-14s): Close-Up auf das Staunen-Element
CTA (14-16s):   "Save this" (silent CTA via pinned comment)
```
**Niches:** studio, festival, installation, mapping (night-shots)

### Format 8: "Top N Tools / Materials" (Listicle)
**Hook-Formel:** #8 | **Sweet-Spot:** 15-19s | **Best Metric:** Saves + Sends
```
HOOK (0-2s):    "[N] Tools every [artist/VJ] needs"
ITEMS (2-14s):  N x ~2.5s (Name + 1-Liner + Hand-Held Shot)
BEST (14-17s):  "But the best one is..." (strongest save for last)
CTA (17-19s):   "DM TOOLS fuer alle Links"
```
**Niches:** tools, software, material | **Auto-fire:** `tool-list-reel`

### Format 9: "Hoer auf damit" (Kontrast / Controversial)
**Hook-Formel:** #9 | **Sweet-Spot:** 10-15s | **Best Metric:** Comments + Sends
```
HOOK (0-2s):    "Stop doing [X]" + red-tint visual of bad example
PAIN (2-6s):    Warum es scheitert / schlecht aussieht
SOLUTION (6-12s): Besserer Ansatz, visuell demonstriert
CTA (12-15s):   "Tag an artist who does this"
```
**Niches:** photography, mural, workflow, social-media-tips

### Format 10: "Tools die du brauchst" (Empfehlungs-Hook / Gear)
**Hook-Formel:** #10 | **Sweet-Spot:** 15-19s | **Best Metric:** Saves + Sends
```
HOOK (0-2s):    "Mein komplettes [Festival/Mural/Studio] Setup"
KIT (2-10s):    Hand-held reveal der Tools, Name-Overlays
FAVORITE (10-15s): Das 1 Must-Have Tool
CTA (15-19s):   "DM KIT fuer die komplette Liste"
```
**Niches:** festival, mapping, painting, music

---

## Poetisch-Philosophisch (Long-Form Save-Optimized)

Ausnahme von der 8-19s Regel. Nur einsetzen wenn Save-Rate > Watch-Through Ziel ist (Art-Niche, Konzept-Pieces, Brand-Storytelling).

```
OPENING (0-10s):    Slow Visual, ambient Musik-Track, philosophische Frage
JOURNEY (10-60s):   Kreativer Prozess mit poetischer Narration (DE oder EN)
REFLECTION (60-90s): Deepere Bedeutung, emotional shift
CLOSE (90-120s):    Open-ended Frage in Overlay
CTA:                 "Save this if it resonated"
```
**Niches:** concept, installation, reflection-pieces | **Metric-Ziel:** Saves/Reach >4%

---

## Caption-SEO (2026 Hashtag-Cap)

Seit 18.12.2025: **Max 5 Hashtags** pro Post. Keyword-rich Captions > Hashtag-Stuffing.

**Struktur:**
1. **Erste 125 chars = Hook-Wiederholung** (kritisch — vor "more")
2. **2-3 Saetze Value** (warum/wie/was lernen)
3. **1 klarer CTA** (DM-Share oder Comment-Gate)
4. **5 Niche-Hashtags** (keine generischen wie #art, #artist)

**Keyword-SEO fuer {Users} Niches:**
- `contemporary artist`, `{STADT} mural artist`, `video mapping installation`
- `generative art process`, `projection mapping setup`, `live visuals`
- `contemporary artist 2026`, `large scale mural`, `polymer clay sculpture process`

**Hashtag-Mix (5 total):**
- 1x Technik: #videomapping / #muralart / #projectionmapping
- 1x Ort: #yourcityartist / #yourregionart / #localart
- 1x Nische: #installationart / #generativeart / #contemporarysculpture
- 1x Tool/Format: #resolumearena / #madmapper / #procreate
- 1x Community: #artistsoninstagram / #artprocess

Quellen: TrueFuture Caption SEO 2026, Trustypost Caption Length 2026.

---

## DM-Share CTA Templates (2026 Language)

Alt (2025): "Comment [KEYWORD] for the guide" — Comment-Gate, funktioniert noch, aber sekundaer.
Neu (2026): **Sends > Comments**. Optimiere fuer DM-Shares:

### Share-Triggering CTAs (Primaer)
- "Send this to an artist friend"
- "Tag someone who needs this in their life"
- "DM an artist who'd love this"
- "Share this if you know someone building something big"
- "Send to a mural artist / VJ / DJ"

### Save-Triggering CTAs (Sekundaer)
- "Save this for your next project"
- "Save if you're working on [relevant thing]"
- "Bookmark this workflow"
- "Save for when you need motivation"

### Comment-Gate CTAs (Tertiaer, weiterhin valide)
- "Comment ART for my toolkit" -> DM-Autoresponder
- "Comment MURAL for the full breakdown" -> DM-Autoresponder
- "Comment MAPPING for my setup guide" -> DM-Autoresponder
- "Comment BEAT for my latest music track" -> DM-Autoresponder
- "Comment DROP for early art-series access" -> DM-Autoresponder

### DM-{User} CTAs (Commission-Pipeline)
- "DM me for commissions"
- "DM AUFTRAG fuer Custom Pieces"
- "DM FESTIVAL fuer Live-Mapping Bookings"

**Regel:** 1 CTA pro Reel. Nicht stacken. Verbal im Video + in Caption identisch.

---

## Instagram Edits App Workflow (Q1 2026 Features)

Meta's CapCut-Killer ist ab Q1 2026 das Pflicht-Tool fuer Reel-Editing. Cross-reference: `instagram-edits-app` Skill.

**Neue Features 2026 nutzen:**
- **Templates** — trending music/font/pacing, remix-fahig mit 1 Tap. Ideal fuer Series Format 2 + 6.
- **Storyboards** — Script-to-Shot built-in. Perfekt fuer Format 4 (Exakter Prozess).
- **Public Reels Remix** mit Auto-Credit — Trend-Hijacking ohne Attribution-Stress.
- **150 neue Fonts** + AI Font Styling — nutzbar fuer Dynamic Minimalism Style (Inter, Helvetica Neue).
- **Beat Sync Auto-Cut** — alle Cuts auf Audio-Beats snappen.
- **In-Video Account Links** — klickbare Profile-Pins on-screen (nicht nur Bio-Link).
- **Auto-cut Silences** — Talking-Head Cleanup.
- **Custom Audio Import** — eigene Musik-Tracks direkt rein.
- **Save Drafts + Lock Screen Widget** — schnelleres Mobile-Workflow.

**Workflow:**
1. Script in diesem Skill generieren (Format waehlen)
2. Rohfootage in Edits App laden
3. Storyboard-Feature nutzen, Shots arrangieren
4. Auto-Caption + Dynamic Minimalism Font (Inter)
5. Beat-Sync Cuts zu eigener Musik oder Trending Audio
6. In-Video Link zu @{user} (falls Commission-CTA)
7. Export 1080x1920 H.264

Quellen: EmbedSocial Edits 2026, Heylist Edits Guide.

---

## AI Tool Stack 2026 (Pre-Production + Post)

**Pre-Production (Storyboard):**
- **ShotBoard.app** — Script -> visual panels in 60s
- **Boords** — Free-Tier, Script -> AI Storyboard Images
- **Storyboarder.ai** — Auto Scene + Screenplay + Shotlist

**Long-to-Short Clipping:**
- **Vugola AI** ($9/Mo) — Halfprice Opus, 99 Sprachen Captions
- **Vizard** — schneller UI als Opus Clip
- **Reap** — All-in-one Clipping + Dubbing + Scheduling
- **Descript** — Text-to-Video + Voice Cloning (Musik-Niche)

**Free Local:**
- **CapCut Desktop** — wenn Edits App nicht reicht
- **ffmpeg-batch** Skill — fuer 1080x1920 Conversion + Subtitle Burn-In
- **ollama-fallback** — lokale Script-Generation wenn Rate-Limited

Quellen: Vugola Opus Alternatives 2026, Reap Top AI Tools 2026.

---

## Sub-Commands

### `/reel-template format 6`
Generate complete 15s Before/After script fuer aktuelles {User}-Projekt (fragt nach Werk + Material).

### `/reel-template niche mural`
Scannt `media/` nach ungenutzen Mural-Clips, schlaegt 3 Formate vor (meist 2, 3, 6), generiert Scripts.

### `/reel-template process`
Fires `process-as-content-reel` Skill — Designer+AI Story Format fuer Build-Diary (Sabum-Style).

### `/reel-template series`
Multi-Part Template fuer "Tag 1: Building [X]", "Tag 2", etc. Consistent Title-Card + Progress-Bar Overlay. Ideal fuer Langzeit-Projekte, Projekt-Revivals, Income-Journey-Serien.

---

## Content Ideas for {User} (Brand-Aligned)

| Format | Niche | Hook | CTA |
|--------|-------|------|-----|
| 2 — Time-Craft | mural | "4m Mural / 6 Stunden / 47 Spraydosen" | "Send to a muralist" |
| 6 — Before/After | installation | "Leere Halle -> immersive Installation" | "DM SPACE" |
| 4 — Exakter Prozess | mapping | "Mein Video Mapping Workflow in 7 Steps" | "DM MAPPING" |
| Poetisch-Long | concept | "What if digital matter could dream?" | "Save if it resonated" |
| 8 — Listicle | tools | "5 Tools every video mapper needs" | "DM TOOLS" |
| Series | longterm | "Tag 1: Building my latest piece" | "Follow for Tag 2" |
| 3 — Stats | process | "878 GB unveroffentlicht — erster Einblick" | "Save this" |
| 5 — Game-Changer | music | "MadMapper hat meine Live-Sets veraendert" | "DM SETUP" |
| 1 — Neuheit | sculpture | "Gerade fertig: neue Polymer Clay Serie" | "DM ART" |
| 6 — Before/After | festival | "Street Parade Backdrop: Weisse Wand -> fertig" | "Send to a DJ" |

---

## Cross-Skill Pairing

Immer parallel einsetzen wenn relevant:

| Phase | Primaer-Skill | Pair |
|-------|---------------|------|
| Pre-Production | `reel-template` | `docs/platforms/reel-hook-templates.md` |
| Editing | `reel-template` | `instagram-edits-app` (Storyboards, Templates) |
| Process-Content | `reel-template format series` | `process-as-content-reel` |
| Lead-Magnet | `reel-template` | `comment-gate-reel` |
| Listicle | `reel-template format 8` | `tool-list-reel` |
| Carousel-Pair | `reel-template` | `carousel` (same topic, different format) |
| Rendering | `reel-template` | `video-remotion` (programmatic), `ffmpeg-batch` (conversion) |
| Caption | `reel-template` | `instagram-caption-generator` |
| A-Roll Content | `reel-template` | `media/` Mapping in `docs/platforms/reel-hook-templates.md` |

---

## Technical Specs

- **Format:** 9:16, 1080x1920, H.264, 30fps, max 100 Mbps
- **Length:** 8-19s Sweet-Spot (Poetisch Ausnahme 60-120s)
- **Voice:** {User}'s authentische Voice (DE fuer CH/DE/AT, EN fuer international)
- **Music:** eigene Musik-Tracks bevorzugt (doppelte Praesenz) oder Trending Audio via Edits App
- **Subtitles:** Pflicht — Inter oder Helvetica Neue, weiss + 20% black shadow, keine Emojis
- **Brand:** config/artist.json (Colors, Voice, Signature)

---

## Auto-Fire Rules

- User sagt "mach ein Reel ueber..." -> this skill
- User sagt "TikTok Script fuer..." -> this skill (mit raw-cut Variante)
- Content-Pipeline produziert video-ready Content -> this skill
- User sagt "was posten" -> this skill
- Neues `media/` Footage gefunden -> `docs/platforms/reel-hook-templates.md` + this skill

---

## References

- `docs/platforms/reel-hook-templates.md` — 10 Hook-Formeln komplett, 10 CTAs, Wochen-Kalender, `media/`-Mapping
- `docs/research/chase-h-ai-master-analysis.md` — Chase AI 574-Post Analyse
- `docs/research/skill-upgrades/reel-template/A-sota.md` — 2026 SOTA Research (diese Skill-Grundlage)
- `config/artist.json` — Brand Voice + Colors
- `instagram-edits-app` Skill — Editing Phase
- `comment-gate-reel` Skill — Lead-Magnet CTAs
- `process-as-content-reel` Skill — Build-Diary Format
- `tool-list-reel` Skill — Listicle Format 8
