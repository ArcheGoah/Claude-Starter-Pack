---
name: comment-gate-reel
description: Lead-Magnet Captions fuer Reels in 3 Varianten (Comment-Gate legacy, Story-Sticker 2026, AI-Conversational-DM). 2026-SOTA mit Reply-Speed-Rule, Compliance-Warnings und single-word trigger algorithm.
triggers:
  - comment gate
  - lead magnet caption
  - single word trigger
  - comment for guide
  - DM automation caption
  - reel cta
  - story sticker funnel
  - ai dm persona
---

# Comment-Gate Reel Captions (2026 SOTA)

Generate Lead-Magnet Captions in 3 Format-Varianten. Quellen: `docs/research/skill-upgrades/comment-gate-reel/A-sota.md`, Top-Performer-Analyse 2026 (tenfoldmarc Comment/Like-Ratio 1.6, swiperightai 32.5k Likes).

---

## WARNING: 2026 Reach-Throttling

Instagram **drosselt Comment-Gates aktiv** seit Anfang 2026. Code-word-Comments werden als "engagement manipulation" klassifiziert und Reach wird reduziert. Gleichzeitig:

- **Reply-Speed <60s = 21x Conversion** vs 30min+ Delay
- **Specific CTA "DM PLAN" schlaegt "Message us" um 2.4x**
- **Comment->DM Conversion Baseline:** 15-20% (Micro 10K-100K), 7-12% (500K+)
- **Meta Compliance:** 200 DMs/Stunde Limit, nur User-initiated Triggers, 24h Messaging-Window nach Comment/Mention
- **Banned:** Browser-Bots, Chrome-Extensions, Mass-DMs. **Safe:** ManyChat, Chatfuel, CreatorFlow, InstantDM, ReplyRush (alle Meta Partners)

**Fazit:** Lead-Magnet-Format ist NICHT tot — aber 2026 gewinnen Story-Sticker-Funnels und AI-Conversational-DMs gegenueber Legacy-Comment-Gates.

---

## When to use

- Tutorial-Reel mit Setup-Guide
- Tool-Empfehlung mit Resource-Drop
- Free Resource Lead-Capture (Checklist, Template, Mini-Guide)
- Werk-Showcase mit Process-Deep-Dive
- Galerie/Studio-Visit Booking-Funnel
- Foerderantrag-Templates/Werkverzeichnis-Preview

---

## 3 Format-Varianten

### Variante 1: Comment-Gate (LEGACY)

Status: **Nutzt Reach nur noch fuer hochwertige Lead-Magnets.** OK wenn Content stark genug dass Algo-Drosselung egal ist.

```
[HOOK 1 — attention grabber]

[VALUE — 2-3 Saetze was Content bietet]

[BENEFIT — was dadurch moeglich wird]

Comment "[WORD]" and I'll send you [resource type].

#niche1 #niche2 #niche3
```

**Wann:** Reel > 50K Views erwartet, Resource ist wirklich wertvoll, {User} kann <60s manuell/automatisch antworten.

---

### Variante 2: Story-Sticker-Funnel (2026 PREFERRED)

Status: **Hoechster Intent-Signal, keine Reach-Drosselung, belohnt vom 2026 Algorithmus (Saves/Shares/DMs > Likes).**

**Reel-Caption (kurz):**
```
[HOOK]

[VALUE — 2 Saetze]

Full breakdown in my Story right now.

#niche1 #niche2 #niche3
```

**Story-Sequenz (5-7 Frames):**
1. Frame 1: Reel-Recap (3s Clip)
2. Frame 2: Question Sticker "Which part blew your mind?"
3. Frame 3: Poll Sticker "Want the full guide? [YES] [HELL YES]"
4. Frame 4: Behind-the-Scenes Detail
5. Frame 5: **Link Sticker** direkt zum Lead-Magnet (no friction)
6. Frame 6: "DM me questions" (triggert 24h Messaging-Window)

**Vorteil:** Saves + DMs > Comments im 2026 Ranking. Poll/Question-Sticker = qualifiziertes Intent-Signal fuer DM-Outreach.

---

### Variante 3: AI-Conversational-DM (ADVANCED)

Status: **{Users} Larry-Bot-Pattern auf Instagram uebertragen.** GPT-5/Groq-basierte Persona als "Studio-Assistant".

**Setup:**
- Tool: **ChatGenius** (GPT-5 nativ, $TBD) oder **n8n + ManyChat + OpenAI** ($8/mo, {User} hat n8n schon)
- Kontext: `lightrag-knowledge` fuer Werkverzeichnis + Preise + Galerie-FAQs laden
- Persona: "Hi, ich bin Studio-Assistant fuer {DEIN_NAME}. Frag mich nach Werken, Preisen, Studio-Visit, Foerderung-Infos."

**Reel-Caption:**
```
[HOOK]

[VALUE — was Reel zeigt]

DM "STUDIO" — my AI studio-assistant will reply in seconds with [specific resource].

#niche1 #niche2 #niche3
```

**AI-DM-Flow:**
1. User sendet "STUDIO" in DM
2. AI antwortet <3s mit Welcome + Menu (Werke, Preise, Studio-Visit, Foerderung)
3. Natural-Language-Matching statt rigid keywords
4. Qualifiziert Lead, schickt Resource, bucht Call wenn Interesse
5. Eskaliert an {User} bei echten Gallerie-Anfragen oder Collector-Signals

**Template-Beispiel (n8n Node):**
```json
{
  "trigger": "DM received",
  "ai_model": "gpt-5-turbo",
  "system_prompt": "Du bist Studio-Assistant fuer {DEIN_NAME} (Kuenstler). Beantworte Fragen zu Werken, Preisen, Studio-Visits, Foerderungen. Eskaliere an {User} bei: Galerie-Anfragen, Kauf-Intent >2000 EUR, Presse-Anfragen.",
  "context_source": "lightrag://werkverzeichnis",
  "max_response_time_ms": 3000,
  "escalation_webhook": "your-bot-dm"
}
```

**Vorteil:** Skaliert 24/7, kein manuelles Reply-Speed-Problem, personalisiert je Frage.

---

## Reply-Speed Rule (2026 CRITICAL)

**<60s Reply = 21x Conversion** vs 30min+ Delay. Praktisch heisst das:

| Variante | Reply-Strategie |
|----------|-----------------|
| Comment-Gate | ManyChat Auto-DM on Comment Trigger (Free Tier bis 1000 Contacts) |
| Story-Sticker | Poll/Question Stickers triggern Notification, {User} manuell <60min = +23% Future Engagement |
| AI-DM | ChatGenius GPT-5 antwortet <3s nativ, kein Delay |

**Fallback:** Wenn {User} nicht live ist, n8n-Workflow schickt Holding-Message "Thanks! {User} replies within 1h" + logged Lead in Notion CRM.

---

## Single-Word Trigger Selection Algorithm

Regeln fuer Trigger-Word-Wahl (wenn Comment-Gate oder DM-CTA):

1. **Laenge:** 3-7 Buchstaben (mobile tippbar, keine Tippfehler)
2. **Sprache:** Englisch (internationales Audience)
3. **Semantisch passend:** Beschreibt Resource direkt ("DISCO" fuer Discoball-Skill, "AR" fuer AR-Poster)
4. **Unique pro Reel:** Nie 2 Reels mit gleichem Trigger (sonst ManyChat-Routing-Chaos)
5. **NO generic words:** NIEMALS "YES", "INFO", "GUIDE", "HELP" — zu generisch, triggert bei Spam-Comments
6. **All-Caps optional:** Macht CTA visuell staerker, aber nicht Pflicht
7. **Specific verbs beat nouns:** "DM PLAN" > "PLAN", "SEND GUIDE" > "GUIDE"

**Algorithm:**
```
input: topic, resource_type
1. extract_noun = main_noun_from_topic  # z.B. "discoball"
2. shorten = first_5_chars_or_acronym  # "DISCO" oder "DBALL"
3. check_uniqueness(shorten) in previous_reels
4. if_unique: return shorten.upper()
5. else: append_number (DISCO2) oder wechsel auf verb ("MAKE")
```

---

## {User} Niche Beispiele

### {DEIN_PROJEKT} (Music / DJ)

**Variante 1 (Comment-Gate):**
```
This new Ableton + Touch Designer live-visual setup is next level.
Synced kickdrum to shader distortion in Resolume. Zero-latency via OSC.
Full walkthrough as PDF, works with any DAW.

Comment "LIVEVIS" and I'll DM you the patch.

#liveperformance #touchdesigner #djsetup
```

**Variante 3 (AI-DM):**
```
Live set at [venue] next week.

Built this live-visual rig myself — OSC + shader + beat detection.

DM "RIG" — my studio-bot sends the full setup PDF + gear list.

#yourproject #liveperformance #visualart
```

---

### 3D-Print (Printer Farm)

**Variante 2 (Story-Sticker-Funnel):**

Reel-Caption:
```
3 print settings that fixed my printer's stringing.

Full before/after carousel in my Story right now — plus my OrcaSlicer profile.

#3dprint #3dprinting #orcaslicer
```

Story-Flow: Recap -> Question "What's your biggest stringing issue?" -> Poll -> Link Sticker zu `.orca.3mf` Profile.

---

### Tool-List Reel (Kombi mit tool-list-reel Skill)

**Variante 1 (Comment-Gate):**
```
4 AI tools every 3D artist needs in 2026.

Blender 5 + blend-ai (164 MCP tools), LightRAG for references, Hunyuan3D for image-to-mesh, Krea Nano Banana for textures.

Full stack-doc with install links.

Comment "STACK" and I'll send the 2-page PDF.

#3dart #aitools #blender
```

---

### Blender Tutorial (Make-Discoball Skill)

**Variante 3 (AI-DM):**
```
ANY 3D model becomes mosaic-mirror disco-sculpture in 30s.

Blender + Claude Code skill I built this week.

DM "DISCO" — my bot sends the full skill + Blender file.

#blender #generativeart #3dart
```

---

### AR Poster (AR-Poster-Pipeline Skill)

**Variante 2 (Story-Sticker):**

Reel-Caption:
```
AR posters at the festival — scan the wall, animation plays.

SAM segmentation + Kling AI + MindAR. Works in any browser, no app.

Full behind-the-scenes in my Story right now.

#augmentedreality #artfestival #webar
```

Story: Recap -> Poll "Would you try this for your event?" -> Link Sticker zu Demo-URL -> "DM for collab" (24h Messaging-Window).

---

## Pipeline

1. **Topic in** + Resource-Type (PDF, Template, Skill, Blender-File, Profile)
2. **Variante waehlen:**
   - Reel < 20K Views erwartet -> Variante 2 (Story-Sticker, keine Drosselung)
   - Reel > 50K Views erwartet + Resource premium -> Variante 1 (Comment-Gate)
   - {User} will skalieren / passiv laufen lassen -> Variante 3 (AI-DM)
3. **Trigger-Word per Algorithm** (wenn V1 oder V3)
4. **Caption nach Template** der gewaehlten Variante
5. **Hashtags 3-7 niche-spezifisch** (siehe `docs/platforms/reel-hook-templates.md`)
6. **DM-Template pre-write** (ManyChat JSON oder ChatGenius Persona)
7. **Reply-Speed Setup pruefen:** ManyChat-Flow / n8n-Webhook / AI-Bot live?
8. **Compliance-Check:** 200 DMs/h? Nur Meta-Partner-Tools? 24h-Window aktiv?

---

## Metriken (KPI-Baseline 2026)

- **Comment->DM Conversion:** 15-20% Ziel ({User} ist Micro)
- **DM->Lead-Magnet Open:** >60%
- **Lead-Magnet->Email-Opt-In:** >25%
- **Email-Opt-In->Paid Customer:** 2-5% (Foerderung / Kauf / Studio-Visit)
- **Reply-Speed Target:** <60s bei AI-DM, <60min bei manueller Antwort

Tracking in Notion Content-Pipeline DB + ManyChat Analytics.

---

## Output

`content-pipeline/captions/{date}-{topic}.md`

Beispiel: `content-pipeline/captions/2026-04-11-discoball-blender.md`

Struktur:
```markdown
# [Topic] — Comment-Gate Reel

**Variante:** [1 Comment-Gate / 2 Story-Sticker / 3 AI-DM]
**Trigger:** [WORD]
**Resource:** [PDF / Template / Skill]
**Reply-Tool:** [ManyChat / n8n / ChatGenius]

## Reel-Caption
[caption]

## Story-Sequenz (if V2)
[frames]

## DM-Template (if V1 or V3)
[json / prompt]

## Hashtags
[3-7]

## KPI-Target
Expected Views: X
Expected Comments: Y
Expected DMs: Z
```

---

## Tool-Stack (2026)

| Tool | Preis | Best For |
|------|-------|----------|
| ManyChat | $15-65/mo (Free bis 1000) | Templates, Growth-Tooling, Cross-Channel |
| Chatfuel | $24-45/mo | Visual Builder, Story-Mentions, Web-Chat-Beta |
| ChatGenius | TBD (2026 Launch) | GPT-5 Native, persistent memory, 30min Setup |
| n8n + ManyChat + OpenAI | $8/mo | Custom AI-Agent ({User} hat schon n8n!) |

**{User}-Empfehlung:** n8n + ManyChat + OpenAI (Template https://n8n.io/workflows/2718) — billig, {User} kennt n8n, integriert mit Larry-Bot-Pattern.

---

## Verwandte Skills

- `instagram-caption-generator` — Caption-Fine-Tuning + Hashtag-Optimierung
- `tool-list-reel` — List-Format Reels ("X tools every artist needs")
- `reel-template` — Reel-Script-Templates aus viralen Reels
- `cold-email` — DM->Email Bridge fuer Leads die eskalieren
- `lightrag-knowledge` — AI-DM-Persona Context (Werkverzeichnis, Preise, FAQs)
- `notion-content-pipeline` — KPI-Tracking + Scheduling
- `ch-dsg-compliance-check` — DSG-Compliance fuer DM-gesammelte Leads

---

## Sources

- [Spur: Instagram DM Automation Rules 2026](https://www.spurnow.com/en/blogs/instagram-dm-automation-rules)
- [SumGenius: Bot Bans 2026](https://sumgenius.ai/blog/instagram-dm-bot-ban-wave-2026/)
- [Inro: ManyChat Competitors 2026](https://www.inro.social/blog/manychat-competitors-alternatives-2026)
- [ChatGenius GPT-5 Launch](https://aithority.com/machine-learning/chatgenius-launches-as-the-first-gpt-5-powered-instagram-dm-automation-platform/)
- [n8n: ManyChat + OpenAI Workflow](https://n8n.io/workflows/2718-ai-agent-for-instagram-dminbox-manychat-open-ai-integration/)
- Full research: `docs/research/skill-upgrades/comment-gate-reel/A-sota.md`
