# Live Installation Patterns — TD 2025

## Two-Timescale Model

The core pattern for "instant feedback → collective drift":

```
incoming CHOP data
  ├─ Filter CHOP (Lag: 0.05s)  ──► FAST channel
  │                                  • on question_received: burst/ripple
  │                                  • visible, immediate, ~2–4s lifetime
  │                                  • fades independently of slow state
  │
  └─ Filter CHOP (Lag: 8.0s)   ──► SLOW channel
                                    • collective world forces
                                    • disposition arc (day-long drift)
                                    • coherence, turbulence, attraction
```

In GLSL: inject the fast channel at a position (impulse burst), use slow channel as gravity. The image always drifts back to the slow state after each burst.

## Disposition Arc (Day-Long Drift)

A slow moving average over all inputs since morning:

```python
# Script CHOP — fires every 300 frames (~5s at 60fps)
# Maintains 'disposition': cumulative average of all question forces

def cook(scriptOp):
    history = op('input_history')   # Table DAT, growing list of force values

    if history.numRows < 2:
        scriptOp['disposition'] = 0.5
        return

    # Weighted average: recent rows count more
    vals    = [float(history[i, 'value'].val) for i in range(1, history.numRows)]
    weights = [float(i) / len(vals) for i in range(len(vals))]
    weighted = sum(v*w for v,w in zip(vals,weights)) / sum(weights)

    scriptOp['disposition'] = weighted
```

Drive color hue, attractor position, or base velocity from `disposition`. Morning calm → cool palette, slow attractor. Evening chaos → warm, fast, turbulent.

## Coherence Bloom

A rare spectacular state achieved only through collective alignment:

```
pulse_density (Script CHOP — counts impulses in 30s window)
  └─ Math CHOP (normalize: 15 pulses = 1.0)
       └─ coherence_smooth (Lag CHOP, Lag: 4.0s)
            └─ Null "COHERENCE"  ── drives:
                 ├─ uCoherence uniform (GLSL)
                 ├─ bloom_env (ramps 0→1 above 0.85 threshold)
                 └─ diagnostic_text ("COLLECTIVE COHERENCE: XX%")
```

In the GLSL shader, when coherence > 0.85:
```glsl
float bloom = smoothstep(0.85, 1.0, uCoherence);
// 1. unify palette
color.rgb = mix(color.rgb, goldPalette * 1.4, bloom * 0.6);
// 2. snap velocity field toward attractor (field organizes)
vel = mix(turbulentVel, attractorVel, bloom * 0.8);
// 3. text becomes legible at peak
float textInject = bloom * 0.3;
```

**Duration**: bloom fades naturally as the density window rolls off (30s window, 4s lag).

## Recalibration Event

Triggered by timer (~12–15 min) OR `tension` crossing a threshold:

```python
# In Execute DAT (frame-level) or Timer CHOP callback

def onTimerDone(timerOp):
    # 1. Signal TD to start recalibration animation (CHOP/param)
    op('recal_trigger').par.value0 = 1.

    # 2. Do NOT wait for LLM — fire recalibration visuals immediately
    # LLM result will arrive async and update world state

    # 3. Log epoch to history
    op('epoch_table').appendRow([absTime.seconds, 'recalibration'])
```

Visual sequence (drive from a single `recal_progress` 0→1 CHOP):
- 0.0–0.2: field contracts, edges fragment, diagnostic "RECALIBRATING"
- 0.2–0.5: agents "argue" — rapid turbulence spikes (high-freq noise in GLSL)
- 0.5–0.8: new direction establishes, forces smoothly transition
- 0.8–1.0: new color world emerges, text: "EPOCH {n} BEGINNING"

```glsl
// In shader: recalibration visual noise
uniform float uRecalProgress;

float recalTurbulence = sin(uRecalProgress * 3.14159) * 0.3;  // spike and fade
float recalGlitch = (1. - smoothstep(0.5, 0.8, uRecalProgress)) * 0.2;
state.rgb += vec3(recalGlitch, 0., recalGlitch * .5) * noiseVal;
vel += curlNoise(uv * 8., uTime * 3.) * recalTurbulence;
```

## Visible Thinking Layer (Diagnostic Overlay)

```
Null CHOP "AI_STATE" ──► Script CHOP ──► string output ──► Text TOP "diagnostic_top"
                                                               └─ Composite TOP (over field)
                                                                    └─ Drive opacity from coherence
```

**Diagnostic strings** (derive from real state values):

```python
def build_diagnostic(coherence, turbulence, chaos, epoch):
    lines = []

    # Numeric readout
    lines.append(f'COLLECTIVE COHERENCE  {int(coherence*100):3d}%')

    # Threshold phrases (real values)
    if coherence < 0.3:
        lines.append('CONSENSUS FAILING')
    elif coherence > 0.85:
        lines.append('COHERENCE BLOOM ACTIVE')

    if chaos > 0.75:
        lines.append('CHAOS AGENT DOMINANT')

    if turbulence > 0.7 and coherence < 0.4:
        lines.append('AGENTS IN CONFLICT')

    lines.append(f'EPOCH {epoch}')
    return '  ·  '.join(lines)
```

The diagnostic text is also injected into the GLSL field as dye (text dissolves into the simulation). Two roles, one Text TOP.

## First Light / Last Breath

**First light** (boot sequence):
```python
# On startup, force world to seed state
def onStart():
    tbl = op('state_table')
    tbl.clear()
    tbl.appendRow(['channel', 'value'])
    for ch, v in [('turbulence',0.1),('attraction',0.3),('coherence',0.2),
                  ('drag',0.5),('velocity',0.2),('birth_rate',0.1)]:
        tbl.appendRow([ch, v])
    op('status_text').par.text = 'SYSTEM AWAKENING'
    op('epoch_count').par.value0 = 0
```

**Last breath** (end of day LLM manifesto call):  
- Freeze new inputs (set WebSocket DAT *Active* = 0)
- Call LLM with full `history` → get manifesto text
- Feed manifesto through Text TOP → inject into field as final dye
- Export still frame + manifesto as artefact

## Transformed Echo

Surface a poetic mutation of collective inputs (not raw visitor text):

```python
# Fires via LLM call every ~15 min (outside the 20s rhythm)
# Input: clustered themes from input_history table
# Output: one poetic line displayed in echo_text TOP

def generate_echo(history_themes):
    # Call Claude Haiku with themes, get 1 poetic line
    # e.g. "someone asked about endings; the field is still folding inward"
    # Return string → op('echo_text').par.text = result

    # Schedule fade-in + inject-to-field
    op('echo_trigger').par.value0.pulse()
```

## Event-Day Checklist

- [ ] Server on Render: health endpoint returns `{"status":"ok"}`
- [ ] Cloudflare tunnel active (if local) / TD WebSocket URL confirmed
- [ ] Hotspot active, QR code tested on fresh device
- [ ] Feedback loop stability-tested 3+ hours
- [ ] TD in Perform Mode (F1), window covers all screens
- [ ] WS auto-reconnect confirmed (unplug cable → TD recovers)
- [ ] GLSL fallback state loads if state_table empty
- [ ] Recalibration timer tested manually
- [ ] diagnostic text readable from 5m away
- [ ] First light / last breath sequences manually triggered + confirmed
