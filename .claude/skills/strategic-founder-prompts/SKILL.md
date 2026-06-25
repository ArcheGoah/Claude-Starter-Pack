---
name: strategic-founder-prompts
description: 7 strategische Claude-Prompts fuer Founder/Solo-Kuenstler. Market-Breakdown, Offer-Design, Bottleneck-ID, Growth-Plan basierend auf evolving.ai Carousel.
triggers:
  - strategic prompts
  - founder prompts
  - business strategy
  - bottleneck analyse
  - growth plan
  - market breakdown
  - offer design
  - claude strategist
---

# Strategic Founder Prompts

7 strategische Claude-Prompts die Claude in einen "Strategic Thinking Partner" verwandeln. Inspiriert von `video-imports/VI_2026-04-11_ig_evolvingai-7-strategic-claude-prompts.md` (19k Likes).

## When to use
- Q1/Q2/Q3/Q4 Strategy Reviews
- Bottleneck-Identification fuer deinen langfristigen Umsatz-Plan
- Decision-Support: "Auf welchen Foerder-Antrag soll ich fokussieren?"
- Pre-Pitch Prep fuer neue Galerien/Stiftungen
- Quartals-Planning fuer Business

## Die 7 Prompts (adaptiert fuer {User})

### Prompt 1 — Market Breakdown
```
Du bist mein Business-Strategist. Analysiere meinen Markt {NISCHE/REGION} 2026 fuer einen
{ALTER}-jaehrigen {ROLLE/CREATOR} mit:
- ~{X} {WÄHRUNG} Einkommen aus meiner Hauptarbeit
- laufende Grant-/Foerder-Bewerbungen
- IG ~{FOLLOWER}k Follower, Crossover {SKILL A}+{SKILL B}
- Ziel: {ZIEL-UMSATZ}/Jahr bis {JAHR}

Welche Marktsegmente sind underserved? Wo ist die hoechste Marge?
Welche 3 Konkurrenz-Modelle soll ich studieren?
```

### Prompt 2 — Highest-Value Offer Design
```
Basierend auf meinen Skills ({deine Kern-Skills, z.B. Design, Motion, 3D, Custom Web,
Automation}) — design 3 hochkonvertierende Offers fuer:
1. Privatkunden (z.B. Sammler/Endkunden)
2. Kommerziell (Brands, ClientCo-Style Kunden)
3. Institutionell (Galerien, Foerderungen)

Pro Offer: Hook, Pricing-Range, ideale Zielgruppe, Distribution-Channel.
```

### Prompt 3 — Most Expensive Industry Problem
```
Was sind die 3 teuersten ungeloesten Probleme im Solo-Kuenstler-Business 2026?
Wo verlieren Maler/Visual Artists am meisten Zeit und Geld?
Welche davon kann ich mit AI/Code-Skills loesen die andere Kuenstler nicht haben?
```

### Prompt 4 — Realistic Growth Plan (Budget-aware)
```
Mein realistisches Budget Q2 2026: ~{X} {WÄHRUNG} freies Cash + {N}h/Woche Zeit (neben
meiner Hauptarbeit). Mein Ziel: {ZIEL} {WÄHRUNG}/Jahr-Run-Rate bis Q4 2026.

Erstelle einen 90-Tage Action-Plan mit konkreten Milestones, kein Bullshit.
Was tun Woche 1-12. Was IGNORIEREN. Was outsourcen.
```

### Prompt 5 — Team-Size aware Strategy
```
Ich bin Solo (ggf. mit einem kreativen Partner, ohne Mitarbeiter, mit Claude Code
als "Personal AI Team"). Wo wuerde Hiring meinen Output verlangsamen?
Was MUSS ich selbst machen? Was kann Claude Code uebernehmen?
Wo sollte ich VAs / Freelancer einsetzen ohne Overhead?
```

### Prompt 6 — Competitive Analysis (Crossover-Niche)
```
Analysiere die Top-5 in meiner Crossover-Niche ({deine Nische, z.B. "Design + Code/Tech"}).
- Was machen die anders als ich?
- Was haben die was ich nicht habe?
- Wo ist mein Unfair Advantage?
- Wie positionier ich mich differenziert?
```

### Prompt 7 — Strategic Bottleneck ID
```
Mein aktueller Status:
- Grant-Bewerbung eingereicht ({DATUM})
- weitere Foerder-Deadlines ({DATUM}) noch offen
- viele Foerderstellen im "Research" Status, kaum davon angeschrieben
- CRM/Kundenliste leer
- IG-Engagement gut aber kaum Conversions
- viele Tools/Skills aufgebaut, aber nur wenige aktiv genutzt

Wo ist mein groesster Bottleneck JETZT? Was wuerde 80% der Wirkung bringen
wenn ich es diese Woche fixen wuerde?
```

## Workflow

### Step 1: Prompt waehlen
Welcher Prompt passt zur aktuellen Decision/Frage?

### Step 2: Mit {User}-Daten fuettern
Stand 2026-04-11 Daten aus Memory-Files:
- `project_business_vision.md`
- `project_urgent_deadlines.md`
- `project_mega_research.md`
- `user_profile.md`

### Step 3: Output strukturieren
Save als: `docs/business/strategic-review-{YYYY-MM-DD}-{prompt-name}.md`

### Step 4: Action Items extrahieren
Top 3 Actions mit Datum + Owner ({User} oder Claude Code).

### Step 5: Notion Update
In Tasks DB als TODO mit Deadline.

## Carousel-Source einholen
**TODO:** v18 Carousel-Bilder (DWmChlJCAeh) holen — die exakten 7 Prompts aus dem original Carousel als Quelle. Der Carousel hat keine Audio, also nur Bild-Extraction.

## Verwandte Skills
- `parallel-research-agent` — fuer Sub-Agent gestuetzte Recherche pro Prompt
- `lightrag-knowledge` — Foerder-Daten als Knowledge-Source

## Output Locations
- `docs/business/strategic-prompts-claude.md` — Master-Index der 7 Prompts
- `docs/business/strategic-review-{date}.md` — Single-Run Outputs
- Notion `Strategic Reviews` DB (anlegen falls nicht da)
