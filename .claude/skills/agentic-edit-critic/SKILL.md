---
name: agentic-edit-critic
description: EditDuet-Pattern (SIGGRAPH 2025) - Editor-Agent + Critic-Agent iterieren auf cut_points.json bis Pacing/Flow/Hook stark sind. Max 3 Loops ({Users} Regel). Nutzt parallel-research-agent Infrastruktur. Use wenn {User} "iteriere den cut", "kritisiere meinen edit", "ist der schnitt gut", "review meinen rough cut", "verbessere das pacing" erwähnt. Baut auf transcript-cutter + whisper-cut-ffmpeg auf.
---

# Agentic Edit-Critic Loop (EditDuet Pattern)

Reproduziert das SIGGRAPH 2025 Paper "EditDuet" (arxiv 2509.10761) als praktisches Skill.

## Das Pattern

```
Round 1:
  Editor-Agent: liest transcript.json → schreibt cut_points_v1.json
  Critic-Agent: liest cut_points_v1.json + transcript → schreibt critique_v1.md

Round 2 (wenn critique nicht "ship it" sagt):
  Editor-Agent: liest critique_v1.md + cut_points_v1 → schreibt cut_points_v2.json
  Critic-Agent: liest cut_points_v2.json → critique_v2.md

Round 3 (max loop):
  ... falls nötig. Danach User-Review.
```

## Wann triggern

Wenn User sagt:
- "iteriere den schnitt"
- "kritisiere den cut"
- "ist das pacing gut"
- "mach den rough cut besser"
- "agentic review"
- nach ersten `transcript-cutter` Output wenn User zögert

## Sub-Agent Roles

### Editor-Agent (system prompt für subagent_type: general-purpose)

```
Du bist Video-Editor für einen Motion Designer ({User}).
Ziel: Tightest possible cut der Emotion + Narrative hält.

Input:
- transcript.json (word-level timing)
- target_duration (z.B. 30s Reel, 8min Longform)
- brand_voice: "Designer's eye, AI's hands" — subtil, präzise, keine Clickbait-Energie
- platform: Instagram Reel | YouTube | Festival-Pitch

Kriterien pro Cut:
1. Hook innerhalb erste 3s (Frage/Statement mit Spannung)
2. Narrative Arc: Setup → Complication → Resolution
3. Filler-Word-Removal (äh/öh) aber Natural Pauses behalten
4. CTA in letzten 2-4s

Output: cut_points.json schema gemäss transcript-cutter Skill.
Wenn Critique vorhanden: JEDEN Punkt adressieren mit reason-Feld warum geändert.
```

### Critic-Agent (system prompt für subagent_type: reviewer)

```
Du bist Senior Video-Editor als Critic.
NICHT selbst schneiden — nur bewerten.

Input:
- cut_points.json
- transcript.json
- target_duration, platform, brand_voice

Bewerte auf 1-10:
- Hook Strength (3s rule)
- Narrative Flow (jumps, confusing cuts)
- Pacing (dead air, rushed sections)
- Filler Cleanup (äh/öh entfernt, natural pauses behalten?)
- CTA Impact

Output: critique.md mit:
- Overall Score / 50
- Verdict: SHIP IT | ONE MORE ROUND | RESTART
- Pro Kategorie: Score + 1-2 konkrete Verbesserungsvorschläge
- Wenn SHIP IT: kurze Begründung
- Wenn ONE MORE ROUND: exakte Cut-Änderungen (timing, reason)
```

## Invocation

```
{User}: "iteriere den rough cut aus media/footage/interview"

Claude (als Orchestrator):
1. Prüft ob media/footage/interview.transcript.json + cut_points.json existieren
2. Spawn parallel:
   - Agent(subagent_type="coder", prompt=Editor-Agent-Prompt)
   - Nach Editor done: Agent(subagent_type="reviewer", prompt=Critic-Agent-Prompt)
3. Liest critique.md
4. Wenn Score >= 40/50 UND verdict=="SHIP IT": Fertig, output path
5. Sonst: Round 2, max 3 Rounds
6. Nach 3 Rounds: User zeigen "Hier sind die 3 Versionen + Critique, deine Entscheidung"
```

## File-Layout pro Run

```
media/footage/interview/
├── project-interview.mp4
├── project-interview.transcript.json
├── .edit-critic/
│   ├── round_1/
│   │   ├── cut_points.json
│   │   ├── critique.md
│   │   └── cut_v1.mp4
│   ├── round_2/
│   │   ├── cut_points.json
│   │   ├── critique.md
│   │   └── cut_v2.mp4
│   └── FINAL.mp4 -> round_2/cut_v2.mp4
```

## Chain-Pattern

```
whisper-cut-ffmpeg → transcript-cutter (initial) → agentic-edit-critic (iterate) → ffmpeg-batch (export variants)
```

## Example Critique Output

```markdown
# Critique Round 1 — project-interview

**Overall: 34/50 — ONE MORE ROUND**

- Hook Strength: 5/10 — Hook startet bei 8.2s, zu spät. Suche einen eröffnenden Statement vor 3s mark.
  - Vorschlag: Start bei 42.1s ("Das Problem mit Kunstfestivals ist...") statt 8.2s

- Narrative Flow: 7/10 — Gut, aber Jump zwischen Setup (42-58s) und Project-Story (67-82s) fühlt sich hart an.
  - Vorschlag: 58-65s behalten (bridging sentence)

- Pacing: 6/10 — Mid-Section (67-82s) zu langsam.
  - Vorschlag: 2 Filler-Pauses bei 71.2s und 77.8s entfernen

- Filler Cleanup: 8/10 — gut!
- CTA Impact: 8/10 — "...komm zum Festival" ist solide.

**Action for Round 2:**
- Move hook to 42.1s
- Include bridge 58-65s
- Trim filler at 71.2 and 77.8
```

## Fallbacks / Safety

- **Max 3 Rounds** ({Users} 3-Loop-Rule aus techniques.md)
- Wenn nach 3 Rounds kein SHIP IT: **User-Review** erzwingen, nicht automatisch rendern
- Bei tiefem Score (<25): `RESTART` → Skill kehrt zu `transcript-cutter` zurück mit Critic's Notes als Bias
- Tokens: Editor ~3k out / Critic ~1.5k — günstig trotz Opus

## Related Papers

- EditDuet (SIGGRAPH 2025) https://arxiv.org/html/2509.10761
- LAVE (CHI 2024) https://arxiv.org/abs/2402.10294
- ExpressEdit (2024) https://arxiv.org/abs/2403.17693
