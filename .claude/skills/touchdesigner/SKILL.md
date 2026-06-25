---
name: "touchdesigner"
description: "TouchDesigner 2025.32820 (Vulkan, GLSL 4.60) playbook for real-time generative visuals and live installations. Covers GLSL TOP feedback loops, compute shaders, CHOP-to-uniform pipeline, WebSocket DAT → Python → CHOP bridge, GPU particles (POP family), multi-screen output, Text TOP, and performance tuning. Use when: building generative art installations, writing GLSL shaders in TD, connecting external data (WebSocket/OSC/JSON) to visuals, setting up particle systems, creating multi-screen setups, fluid/dye field simulations, or any TouchDesigner patching and scripting work."
---

# TouchDesigner 2025

**Version**: 2025.32820 | **Backend**: Vulkan 1.1+ | **GLSL**: 4.60 | **Python**: 3.11

Real-time generative visuals, live art installations, multi-screen environments. This skill covers the full pipeline from external data to GPU visuals.

---

## Operator Families (Quick Map)

| Family | Purpose | Key Operators |
|--------|---------|---------------|
| **TOP** | 2D image / texture ops | GLSL TOP, Feedback TOP, Text TOP, Noise TOP, Composite TOP, Render TOP |
| **CHOP** | Signals / control data | Constant, Lag, Filter, Math, Select, Null, DAT to CHOP |
| **DAT** | Text / data / scripts | WebSocket DAT, Table DAT, Script DAT, Callback DAT, Execute DAT |
| **POP** | GPU point/particle data (**NEW 2025**) | Particle POP, Force POP, Collision POP, Null POP |
| **SOP** | 3D geometry (legacy) | Box, Sphere, Merge, Convert |
| **COMP** | Containers / output | Container COMP, Geo COMP, Window COMP, Camera COMP |
| **MAT** | Materials / shaders | GLSL MAT, Constant MAT, Phong MAT |

---

## GLSL TOP — Core Patterns

### Built-in Variables (TD 2025)

```glsl
// Fragment shader
vUV                        // vec2 — normalized coords 0..1
sTD2DInputs[n]             // sampler2D — input texture n
uTD2DInfos[n].res.zw       // vec2 — 1/width, 1/height (pixel step)
uTD2DInfos[n].res.xy       // vec2 — width, height

// Output — always wrap with this
fragColor = TDOutputSwizzle(color);   // corrects Vulkan channel order

// Compute shader output (no TDOutputSwizzle needed in 2025)
void TDImageStoreOutput(uint idx, ivec3 coord, vec4 color);

// Misc
uTDPass                    // int — current render pass
uTDCurrentDepth            // int — slice for 3D/array textures
gl_GlobalInvocationID      // uvec3 — compute thread ID
```

### Minimal Pixel Shader

```glsl
layout(location = 0) out vec4 fragColor;

void main() {
    vec4 c = texture(sTD2DInputs[0], vUV.st);
    fragColor = TDOutputSwizzle(c);
}
```

### Uniforms from CHOPs

```glsl
uniform float uCoherence;    // declare in shader
uniform float uTurbulence;
uniform vec2  uAttractor;
```

In TD: click **Load Uniform Names** on GLSL TOP → drag Null CHOP onto uniform slot.  
Or bind via parameter expression: `op('null_state')['coherence']`

### CHOP → Uniform Pipeline

```
WebSocket / Constant / LFO CHOP
  └─ Select CHOP          (isolate channels)
       └─ Lag CHOP        (smooth, prevent jitter — Lag: 0.5–2.0s)
            └─ Null CHOP  "AI_STATE"
                 └─ bind to GLSL TOP uniform slots
```

---

## Feedback Loop (Fluid / Dye Field)

The foundation for persistent evolving visuals:

```
impulse_tex (Script TOP)  ──────────────────┐
text_tex    (Text TOP)    ──────────────────┤
                                            ▼
                          ┌─────────────────────────┐
Feedback TOP  ───input0──►│  GLSL TOP  (main shader) │──► Feedback TOP ─┐
                          └────────────────┬─────────┘                  │
                                           └────────────────────────────┘
                                           ▼
                                    Null TOP (output)
```

**Feedback TOP setup**: set *Target TOP* = the GLSL TOP downstream. Reset = 0 = live; Reset = 1 = bypass.

### Fluid Shader Skeleton (TD 2025 syntax)

```glsl
// inputs: [0]=feedback [1]=impulse [2]=text
layout(location = 0) out vec4 fragColor;

uniform float uCoherence;
uniform float uTurbulence;
uniform float uAttraction;
uniform float uDrag;
uniform float uVelocity;
uniform float uBirthRate;
uniform float uTime;
uniform vec2  uAttractor;   // normalized 0..1 position

vec2 curlNoise(vec2 p, float t) {
    float e = 0.001;
    float a = fract(sin(dot(p + vec2(0,e) + t*.3, vec2(127.1,311.7))) * 43758.5);
    float b = fract(sin(dot(p - vec2(0,e) + t*.3, vec2(127.1,311.7))) * 43758.5);
    float c = fract(sin(dot(p + vec2(e,0) + t*.3, vec2(269.5,183.3))) * 43758.5);
    float d = fract(sin(dot(p - vec2(e,0) + t*.3, vec2(269.5,183.3))) * 43758.5);
    return vec2(a-b, -(c-d)) / (2.*e);
}

void main() {
    vec2 uv = vUV.st;

    // velocity field
    vec2 vel = curlNoise(uv * 3., uTime * .1) * uTurbulence * .008;
    vel += (uAttractor - uv) * uAttraction * uCoherence * .04;
    vel *= mix(.3, 1.5, uVelocity);

    // advect
    vec4 prev  = texture(sTD2DInputs[0], uv - vel);
    vec4 state = prev * (1. - uDrag * .012);

    // inject impulse + text
    state += texture(sTD2DInputs[1], uv) * uBirthRate * .6;
    float lum = dot(texture(sTD2DInputs[2], uv).rgb, vec3(.299,.587,.114));
    state += vec4(lum * .04);

    // coherence bloom
    float bloom = smoothstep(.75, 1., uCoherence);
    state.rgb = mix(state.rgb, state.rgb * vec3(.85,.78,.62) * 1.3, bloom * .4);

    fragColor = TDOutputSwizzle(clamp(state, 0., 1.));
}
```

**Stability**: multiply prev by `0.995` per frame + hard clamp → prevents blowup over hours.

---

## WebSocket → Python → CHOP Pipeline

### WebSocket DAT Setup
1. Create **WebSocket DAT**
2. Set *URL*: `ws://server:port`
3. Set *Callbacks DAT*: path to Callback DAT with Python
4. *Active* = 1

### Callback DAT Python

```python
import json

def onReceiveText(dat, rowIndex, message, bytes, peer):
    data = json.loads(message)

    # Write to Table DAT (drives DAT→CHOP)
    tbl = op('state_table')
    if data['type'] == 'visual_answer':
        s = data['state']
        tbl.clear()
        tbl.appendRow(['channel', 'value'])
        for k, v in s.items():
            tbl.appendRow([k, v])

    # Trigger impulse for question_received
    if data['type'] == 'question_received':
        op('impulse_trigger').par.value0 = data.get('energy', 0.7)
        op('impulse_trigger').par.value0pulse.pulse()  # Trigger CHOP pulse
```

### Table DAT → CHOP

```
WebSocket DAT
  └─ Callback DAT  (writes to state_table)
       └─ Table DAT  "state_table"   (rows: channel, value)
            └─ DAT to CHOP           (Column Name: 'channel', Column Value: 'value')
                 └─ Lag CHOP         (per-channel smoothing)
                      └─ Null CHOP   "AI_STATE"
```

### Two-Timescale Model (Instant + Collective)

```
AI_STATE Null CHOP
  ├─ Filter CHOP  (Lag: 0.05s)  → FAST channel  → impulse_pos, impulse_strength
  └─ Filter CHOP  (Lag: 8.0s)   → SLOW channel  → coherence, turbulence, attraction
```

Fast = individual visitor feedback (ripple, burst, 2–4s decay).  
Slow = collective drift — the gravity the whole image returns to.

---

## Impulse Injection (Script TOP)

Paints a position-mapped gaussian burst when a question arrives:

```python
import numpy as np

def cook(scriptOp):
    w, h = scriptOp.width, scriptOp.height
    data = np.zeros((h, w, 4), dtype=np.float32)

    # Get pending impulses from Table DAT
    tbl = op('impulse_queue')
    for row in range(tbl.numRows):
        x  = int(float(tbl[row, 'x'].val) * w)
        y  = int(float(tbl[row, 'y'].val) * h)
        e  = float(tbl[row, 'energy'].val)
        r  = 20   # gaussian radius px

        ys, xs = np.ogrid[max(0,y-r):min(h,y+r), max(0,x-r):min(w,x+r)]
        g = np.exp(-((xs-x)**2 + (ys-y)**2) / (2*(r/3)**2)) * e
        data[max(0,y-r):min(h,y+r), max(0,x-r):min(w,x+r), 0] += g
        data[max(0,y-r):min(h,y+r), max(0,x-r):min(w,x+r), 3]  = 1.

    scriptOp.copyNumpyArray(np.clip(data, 0, 1))
    op('impulse_queue').clear()   # consume
```

---

## GPU Particles (POP Family — 2025)

```
Particle POP
  ├─ Force POP    (driven by CHOP channels)
  ├─ Collision POP
  └─ Null POP  "particles_out"
       └─ Render Simple TOP  (direct GPU render, no Geo COMP needed)
```

Key POP attributes: `P` (position), `PartVel` (velocity), `PartAge`, `PartLifeSpan`, `PartDrag`, `PartForce`, `PartId`.

Physics per frame:  
`vel += (force / mass) * dt` → `pos += vel * dt` → `vel *= (1 - drag)`

Min VRAM: 4GB. Rec: 8GB for 1M+ points.

---

## Multi-Screen Output

### Single machine (recommended for live events):

```
Container COMP  (full canvas — e.g. 7680×1080 for 4×FHD)
  └─ Window COMP
       ├─ Monitor: 0 (or "All Monitors")
       ├─ Span Monitors: On
       └─ Perform Mode: F1
```

One Window COMP over a single wide canvas = lowest latency, no sync complexity.  
Multiple Window COMPs = parallel renders = more CPU overhead.

### Per-screen agent bias (within one shader):

Pass a `uScreenIndex` uniform per region, use it to weight agent forces spatially. Same world state, different agent emphasis per zone.

---

## Text TOP as Dye Source

```
Text TOP  (Space Mono, white on black)
  └─ GLSL TOP input[2]
```

In shader — inject text luminance as dye:
```glsl
float lum = dot(texture(sTD2DInputs[2], uv).rgb, vec3(.299,.587,.114));
state += vec4(lum * inject_strength);
```

Text becomes particles: words appear in the field and are advected/dissolved by agent forces. Drive `inject_strength` to 0 over ~3s = text dissolves naturally.

---

## Python API Essentials

```python
# Operator access
op('myOp')                    # relative to me.parent
op('/project1/myOp')         # absolute

# Parameters
op('glslTop').par.Ucoherence = 0.8      # set value
op('glslTop').par.Ucoherence.expr = "op('null1')['coherence']"  # expression

# Table DAT
tbl = op('myTable')
tbl.appendRow(['key', 'value'])
tbl[0, 'value'].val           # read cell
tbl.clear()                   # empty it

# CHOP channel value
op('null_state')['coherence']  # current float value

# Pulse a parameter
op('trigger').par.value0pulse.pulse()

# Useful globals
absTime.frame    # current frame number
absTime.seconds  # current time in seconds
me.time.frame    # same via me
```

---

## Performance

**Diagnose GPU vs CPU bottleneck**:  
Set Render TOP to 32×32 → still slow? CPU. Gets fast? GPU.

**GPU (Vulkan 2025)**:
- Move all work to TOPs/POPs/GLSL (GPU-resident)
- Avoid Script TOPs with heavy NumPy in cook() — fires every frame
- Use Lag CHOP instead of Script CHOP for smoothing
- Minimize CPU↔GPU transfers (downloadTOP is expensive)

**Feedback loop stability**:
- Multiply prev by 0.995 per frame (slow decay)
- Hard clamp 0..1 every frame
- Test 3+ hours before live event — feedback can accumulate subtle artifacts

**Multi-hour stability checklist**:
- [ ] Feedback has decay factor
- [ ] All values clamped
- [ ] WebSocket has reconnect logic (TD WebSocket DAT: *Auto-Reconnect* = On)
- [ ] TD runs on last state if WS drops (local Table DAT persists)
- [ ] Perform mode (F1) active on event day
- [ ] Frame rate locked: Preferences → General → Frame Rate → Lock to Refresh

---

## Reference Files

- [GLSL patterns + advanced compute](references/glsl-patterns.md)
- [WebSocket pipeline + full AGENTIC:EI server bridge](references/websocket-pipeline.md)
- [Installation patterns: two-timescale, coherence bloom, recalibration events](references/installation-patterns.md)
- [Operator family deep reference](references/operators.md)
