# WebSocket → TD Pipeline

Full pipeline for connecting an external Node.js server (like AGENTIC:EI) to TouchDesigner.

## Network Diagram

```
Node.js server (Render/local)
  │
  │  WS message types:
  │    question_received → impulse burst
  │    visual_answer     → world state → particle params
  │
  ▼
WebSocket DAT  (ws://host:3000/td?token=SECRET)
  └─ Callback DAT  (Python)
       ├─ state_table  (Table DAT)  ← visual_answer state values
       └─ impulse_queue (Table DAT) ← question_received positions/energy
            │
            ├─ DAT to CHOP  → Lag CHOP (slow, 8s) → Null "AI_STATE"  → GLSL uniforms
            └─ impulse_queue → Script TOP (paint gaussian bursts)     → GLSL input[1]
```

## WebSocket DAT Parameters

| Parameter | Value |
|-----------|-------|
| URL | `ws://yourserver/td?token=<SECRET>` |
| Active | 1 |
| Auto-Reconnect | On |
| Reconnect Interval | 5s |
| Callbacks DAT | `callbacks` |

## Callback DAT (Full)

```python
import json

def onReceiveText(dat, rowIndex, message, bytes, peer):
    try:
        data = json.loads(message)
    except Exception as e:
        print(f'[WS] JSON parse error: {e}')
        return

    msg_type = data.get('type', '')

    # ── Visual answer (world state from Claude) ──────────────────────────
    if msg_type == 'visual_answer':
        s = data.get('state', {})
        tbl = op('state_table')
        tbl.clear()
        tbl.appendRow(['channel', 'value'])

        # Map server keys → CHOP channel names
        key_map = {
            'force_strength':     'force',
            'velocity':           'velocity',
            'drag':               'drag',
            'particle_birth_rate':'birth_rate',
            'turbulence':         'turbulence',
            'attraction':         'attraction',
            'general_speed':      'speed',
        }
        for server_key, chop_name in key_map.items():
            tbl.appendRow([chop_name, s.get(server_key, 0.5)])

        # Diagnostics line for Text TOP overlay
        answer_type = data.get('answer_type', '')
        force       = data.get('force', 'unknown')
        op('diagnostic_text').par.text = f'{force.upper()} FIELD ACTIVE  ·  {answer_type}'

    # ── Question received (instant impulse) ──────────────────────────────
    elif msg_type == 'question_received':
        energy = float(data.get('energy', 0.7))
        force  = data.get('force', 'memory')

        # Map force → canvas region (normalized 0..1)
        force_positions = {
            'memory':  (0.2, 0.5),
            'chaos':   (0.8, 0.3),
            'emotion': (0.5, 0.5),
            'future':  (0.7, 0.7),
            'machine': (0.3, 0.3),
        }
        x, y = force_positions.get(force, (0.5, 0.5))
        # Add some jitter
        import random
        x += random.uniform(-0.05, 0.05)
        y += random.uniform(-0.05, 0.05)

        q = op('impulse_queue')
        q.appendRow([x, y, energy])

        # Short status overlay
        op('status_text').par.text = 'Question entered the field.'

    # ── Connected confirmation ────────────────────────────────────────────
    elif msg_type == 'connected':
        print('[TD] Bridge ready:', data.get('message', ''))
        op('status_text').par.text = 'AGENTIC:EI connected.'


def onConnect(dat, peer):
    print(f'[WS] Connected to {peer}')

def onDisconnect(dat, peer):
    print(f'[WS] Disconnected from {peer}')
    op('status_text').par.text = 'reconnecting…'
```

## state_table → CHOP Chain

```
Table DAT  "state_table"  (cols: channel, value)
  └─ DAT to CHOP
       ├─ Select Row/Column by Name
       ├─ Channel Name: "channel" column
       └─ Value: "value" column
            └─ Lag CHOP (Lag: 8.0, Lag Type: Simple)   ← slow collective drift
                 └─ Math CHOP (clamp 0..1)
                      └─ Null CHOP  "AI_STATE"          ← bind to GLSL uniforms
```

## GLSL Uniform → CHOP Binding

In GLSL TOP, after declaring uniforms and clicking **Load Uniform Names**:

| Uniform | Source CHOP channel |
|---------|-------------------|
| `uTurbulence` | `AI_STATE:turbulence` |
| `uAttraction` | `AI_STATE:attraction` |
| `uDrag` | `AI_STATE:drag` |
| `uVelocity` | `AI_STATE:velocity` |
| `uBirthRate` | `AI_STATE:birth_rate` |
| `uCoherence` | separate — computed in TD (see below) |

## Coherence Computation in TD

Coherence is not a server value — it's derived in TD from input density and variance:

```python
# In a Script CHOP or Expression CHOP
# Fires every frame, reads impulse_queue length and state variance

import numpy as np

def cook(scriptOp):
    # Input density: how many impulses in last 20s
    pulse_count = float(op('pulse_counter')['count'])
    density     = min(pulse_count / 10., 1.)   # normalize: 10 pulses = max

    # State variance: how much the agents are agreeing
    chop    = op('AI_STATE')
    vals    = [chop['turbulence'], chop['attraction'], chop['force'], chop['velocity']]
    variance = float(np.std(vals))
    agreement = 1. - min(variance * 4., 1.)   # low variance = high agreement

    coherence = (density * 0.4 + agreement * 0.6)

    scriptOp['coherence'] = coherence
```

## Fail-Safe: WS Drop

If the WebSocket drops, TD must keep running on last known state:

```
state_table (Table DAT) ← written by Callback DAT
                        ← persists last values even after WS disconnect
                        ← DAT→CHOP reads from table, not from live stream
```

The **Lag CHOP** ensures smooth continuation — values drift, not snap to zero.  
WebSocket DAT *Auto-Reconnect = On* handles the reconnect silently.
