---
name: particle-hero
description: WebGPU + TSL Particle Hero Section fuer {deine-domain}.com / {DEIN_PROJEKT}. 1M Particles real-time via Compute Shaders, R3F + wawa-vfx + threeparticles, Audio-Reactive Mode mit AudioWorklet + FFT. Inkl. lauffaehiger Next.js 14 App Router Component, Brand-Color Injection via DESIGN.md, Mobile-GPU Detection, Cleanup-Routine. Auto-fires bei "hero", "particles", "3d background", "audio reactive", "music reactive visual", "webgpu particles".
triggers:
  - particle hero
  - webgpu particles
  - three.js hero
  - r3f particles
  - tsl shader
  - hero animation
  - 3d background
  - audio reactive particles
  - music reactive visual
  - compute shader particles
  - 1 million particles
license: MIT
version: 2.0.0
---

# Particle Hero (2026 SOTA)

WebGPU + TSL + Compute Shader Particle-Hero-Section fuer {Users} Projekte. **2026 Upgrade:** 1M Particles real-time (Expo Osaka 2025 "Waves of Connection" Beweis), renderer-agnostisch via TSL (WebGPU primary, WebGL2 Fallback automatisch).

## When to use

- **{deine-domain}.com** Hero-Redesign (Next.js 14 App Router)
- **Projekt-Subsite** Underwater-Particles (Plankton, Bubbles, Light-Rays)
- **Live-Set** Audio-Reactive Visual (Musik, AudioWorklet + FFT -> TSL uniform)
- Werk-Showcase mit dynamischer Background-Animation
- Signature-Reveal (Particles formen Logo/Signatur bei Hover)

## Tech-Stack (Pflicht 2026)

| Layer | Tech | Warum |
|-------|------|-------|
| Renderer | `three@0.170+` mit **WebGPURenderer** | 10-100x Perf, Compute Shader Support |
| Shader-DSL | **TSL** (Three Shading Language) | Renderer-agnostisch, node-based, WGSL+GLSL kompiliert |
| React-Wrapper | `@react-three/fiber@9` | R3F 9 = React 19 kompatibel |
| Helpers | `@react-three/drei` | Points, Instances, Float, Perf |
| VFX Composable | **wawa-vfx** | Performance-focused R3F VFX 2026 |
| Particles | **threeparticles** | WebGPU-native declarative Particle API |
| Postprocessing | `@react-three/postprocessing` | Bloom, Chromatic Aberration |
| Monitoring | `stats-gl` + `r3f-perf` | FPS/Memory Budget Gate |
| GPU Detection | `detect-gpu` | Mobile Tiering (low/mid/high) |
| Audio (Music) | **AudioWorklet** + `AnalyserNode` | 2026 Pflicht-Standard |

## Progressive Disclosure

1. **Quick Start** -> `templates/setup.md` (install commands + Next.js integration)
2. **Component Template** -> `templates/ParticleHero.tsx` (lauffaehiger R3F Component)
3. **Deep Dive** -> siehe `docs/research/skill-upgrades/particle-hero/A-sota.md`

## Pipeline

### Step 1: Dependencies installieren
```bash
npm install three@^0.170 @react-three/fiber@^9 @react-three/drei@^10 \
            @react-three/postprocessing wawa-vfx threeparticles \
            detect-gpu stats-gl
```
Vollstaendige Setup-Instructions: `.claude/skills/particle-hero/templates/setup.md`

### Step 2: DESIGN.md laden (PFLICHT)
Vor Edit an website/ MUSS `design-md-generator` Skill die Brand-Colors liefern:
```ts
// website/src/design-tokens.ts (auto-generated)
export const colors = {
  primary: '#E63946',    // {User} Red
  secondary: '#F1FAEE',  // Bone White
  accent: '#A8DADC',     // Mint
  dark: '#1D3557',       // Navy
  gold: '#F4A261',       // Sunset
}
```
Bei fehlen: SOFORT `design-md-generator` feuern.

### Step 3: Component mounten
```tsx
// website/src/app/page.tsx (Next.js 14 App Router)
'use client'
import dynamic from 'next/dynamic'

// SSR-safe: R3F braucht window
const ParticleHero = dynamic(
  () => import('@/components/ParticleHero'),
  { ssr: false, loading: () => <div className="h-screen bg-black" /> }
)

export default function Home() {
  return (
    <main>
      <ParticleHero mode="default" particleCount={500_000} />
      {/* weiterer Content */}
    </main>
  )
}
```
Template: `.claude/skills/particle-hero/templates/ParticleHero.tsx`

### Step 4: Mobile-GPU Tiering
```ts
import { getGPUTier } from 'detect-gpu'
const tier = await getGPUTier()
const count = tier.tier >= 3 ? 1_000_000 : tier.tier === 2 ? 250_000 : 50_000
```

### Step 5: Audio-Reactive Mode (Music)
```tsx
<ParticleHero mode="audio-reactive" audioSource="microphone" />
```
Requirements:
- User-Gesture (Click) vor `getUserMedia()`
- AudioWorklet statt deprecated ScriptProcessor
- FFT-Buffer (128) als TSL `uniform` -> Bass=Size, Mid=Color, High=Velocity
- Permission-Denial -> Fallback auf Default Mode + Toast Notification

### Step 6: Cleanup (Memory-Leak Prevention)
```tsx
useEffect(() => () => {
  geometry.dispose()
  material.dispose()
  computeShader.dispose()
  renderer.info.memory // log for dev
}, [])
```

### Step 7: Perf Gate
```tsx
import { Perf } from 'r3f-perf'
// in <Canvas>
{process.env.NODE_ENV === 'development' && <Perf position="top-left" />}
```
Target: 60 FPS @ 4K, <50 draw calls, <2 GB GPU memory.

## Performance Targets 2026

| Metric | Desktop (WebGPU+Compute) | Mobile (WebGL2 Fallback) |
|--------|--------------------------|--------------------------|
| Max Particles | 1'000'000 | 50'000-100'000 |
| Draw Calls | <50 | <30 |
| FPS | 60 (4K) | 60 (1080p) |
| Memory | <2 GB GPU | <512 MB |

## {User}-Specific Customizations

- **Painted-Texture Particles** — Pinselstrich-Sprites aus `media/artworks/` als Texture-Atlas (2048x2048, PNG Alpha, 16 Sprites pro Atlas). TSL `textureNode` + `uv` offset per instance.
- **Brand-Colors** aus `docs/website/{user}-design.md` via CSS Custom Properties -> JS import -> TSL uniform.
- **Signature-Reveal** — Particles formen {Users} Handschrift-Signatur bei `onPointerMove` (Attractor-Pattern auf SDF der Signatur).
- **Music Mode** — Audio-Reactive mit Ferrofluid-Look (magnetisches Feld als Attractor).
- **Underwater Mode** — Underwater Caustics, Bubble-Up Forces, Plankton-Glow.

## Casberry Prototyping (Optional)

**URL:** https://particles.casberry.in
**Use:** AI Particle Simulator fuer Swarm-Behavior Prototyping BEVOR Port zu R3F/TSL.
**Rules:**
- NIE `new THREE.Vector3()` in Loop (GC-Killer)
- Reuse `target` + `color` objects
- Max 20k Particles im Tool

Beispiel-Prompts + fertige Functions: `.claude/skills/particle-hero/examples/casberry-swarms.js`

## Verwandte Skills

- **`design-md-generator`** (PFLICHT vor Web-Edit, liefert Brand-Colors)
- `shader-portfolio` — Signature Fragment Shaders (kombinierbar mit Particle-Hero)
- `osc-control` — Resolume Live-Control fuer Live Visual Routing
- `algorithmic-art` — p5.js Alternative fuer 2D-Prototyping
- `playwright-skill` — Visual Verification Screenshots nach Edit
- `claude-insights-tracker` — Session-Ende Pattern-Log

## Referenz-Sites (2026 Inspiration)

- **Waves of Connection** (Expo Osaka 2025) — 1M Particles, Body-Tracking
- **bruno-simon.com** — Interactive 3D Portfolio Goldstandard
- **lusion.co** — R3F + Custom Shader Agency
- **Hero Collective** (Awwwards SOTD 8.02/10) — Particle + Typography Combo
- **Salt & Pepper** — WebGL Particle Hero Reference
- **ASTRODITHER** (Three.js Forum) — Audio-Reactive TSL Experiment

## Documentation Links

- Maxime Heckel: "The Field Guide to Three.js Shading Language (TSL)"
- Wawa Sensei: TSL/GPGPU Tutorials
- sbcode.net: TSL Tutorial Series
- Three.js Docs: `WebGPURenderer` + TSL Nodes
- Codrops (Juni 2025): 3D Audio Visualizer Tutorial

## Anti-Patterns (NIE machen)

1. NIE `setState` in `useFrame` (React-Rerender killt FPS -> mutieren)
2. NIE `new THREE.Vector3()` pro Frame (GC Killer -> reuse)
3. NIE ohne `'use client'` + `dynamic({ ssr: false })` in App Router
4. NIE ohne `geometry.dispose()` bei Unmount (GPU Leak)
5. NIE ohne `detect-gpu` auf Mobile (Crash bei Low-End)
6. NIE raw GLSL (statt TSL) — verliert WebGL2 Fallback automatisch
7. NIE ohne Perf-Gate in Dev (unsichtbare Regressions)
8. NIE `getUserMedia()` ohne User-Gesture (Browser blockiert)
