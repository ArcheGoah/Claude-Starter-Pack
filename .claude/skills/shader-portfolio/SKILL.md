---
name: shader-portfolio
description: Signature Fragment Shaders fuer {deine-domain}.com und eine zweite Projekt-Site mittels Three.js TSL (Three Shader Language). TSL kompiliert write-once zu WGSL (WebGPU) + GLSL (WebGL2 Fallback). 5 Core-Effekte mit fertigen Templates. Auto-Fires bei Shader, Glitch, Distortion, Liquid, Chromatic Aberration, CRT, Noise Displacement, WebGPU, TSL, Custom Material, Hover Effect.
triggers:
  - shader
  - fragment shader
  - tsl
  - three shader language
  - webgpu
  - glitch effect
  - distortion
  - liquid effect
  - chromatic aberration
  - crt effect
  - scanline
  - noise displacement
  - custom material
  - signature visual
  - painterly flow
  - rgb split
  - hover shader
---

# Shader Portfolio (TSL-First, 2026 SOTA)

Signature Fragment-Shader-Library fuer **{deine-domain}.com** (Next 15 + R3F) und eine **zweite Projekt-Site** (Next 15 + R3F). Stack-Entscheidung 2026: **Three.js TSL > raw WGSL dual-authoring**.

## Tech-Entscheidung: Warum TSL statt raw WGSL?

WebGPU hat Nov 2025 kritische Masse erreicht (Chrome, Edge, Safari 26, Firefox 141+). Aber Mobile und aeltere Browser brauchen WebGL2 Fallback. Zwei Optionen:

| Ansatz | Dual-Authoring | Wartung | Browser-Coverage |
|--------|----------------|---------|------------------|
| Raw WGSL + Raw GLSL | JA (2x Code) | Hoch | 100% (bei Duplikat) |
| **TSL (Three Shader Language)** | **NEIN** | **Niedrig** | **100%** |
| Raw WGSL only | NEIN | Niedrig | ~75% (kein FF Linux/Intel Mac) |

**Entscheidung: TSL.** Nodes in TypeScript, three.js kompiliert transparent zu WGSL (WebGPURenderer) oder GLSL (WebGLRenderer). Ein Source, beide Backends, typsicher. Seit three.js r170 built-in.

```bash
pnpm add three @react-three/fiber @react-three/drei
# TSL ist in three.js >= r170 enthalten (import 'three/tsl')
```

## Browser-Support (Stand 2026-04)

| Browser | WebGPU | WebGL2 Fallback noetig? |
|---------|--------|-------------------------|
| Chrome/Edge (Desktop + Android) | stable | nein |
| Safari 26 (macOS Tahoe, iOS 26, visionOS 26) | stable | nein |
| Firefox 141+ (Win) / 145+ (macOS ARM64) | stable | nein |
| Firefox Linux / Intel Mac / Android | WIP | ja |
| iOS < 26 | nein | ja |

Mobile fragmentiert → **immer** `WebGLRenderer` Fallback via drei/fiber Adapter.

## 5 Core Signature-Effekte (mit Code)

Alle Effekte liegen als TSL TypeScript Module in `templates/effects/`:

| Effekt | Datei | Uniforms | Mobile | Use-Case |
|--------|-------|----------|--------|----------|
| **Glitch Burst** | `glitch.ts` | uTime, uIntensity, uSeed | ja | Hover-Trigger Werke, Musik-Drops |
| **Liquid Distortion** | `liquid.ts` | uTime, uFreq, uAmp | ja | Underwater-Scenes, Werk-Flow |
| **Chromatic Aberration** | `chromatic-aberration.ts` | uOffset, uMouse | ja | Header RGB-Split, Photo-Hover |
| **Noise Displacement** | `noise-displacement.ts` | uTime, uStrength, uScale | ja | Painterly Flow, Heat Haze |
| **CRT Scanlines** | `crt.ts` | uTime, uCurvature, uLineCount | ja | Retro Projekt-Seiten, Video Mapping |

Erweiterung um ASCII-Dither, Phosphor-Bloom, Halftone folgt als Phase 2 (siehe `docs/research/skill-upgrades/shader-portfolio/A-sota.md`).

## Brand-Uniform-Konvention

Aus `docs/website/{user}-design.md` / `project-design.md` (via `design-md-generator` Skill):

```typescript
interface BrandUniforms {
  uColorPrimary: Color;   // Hex aus DESIGN.md primary
  uColorAccent: Color;    // Hex aus DESIGN.md accent
  uColorBg: Color;        // Hex aus DESIGN.md neutral-bg
  uTime: number;          // useFrame injected
  uMouse: Vector2;        // normalized 0..1
  uResolution: Vector2;   // canvas size
  uReducedMotion: number; // 0 normal, 1 prefers-reduced-motion
}
```

## R3F Integration

Nutze `templates/ShaderMaterial.tsx` — drei `shaderMaterial` Wrapper mit:
- Auto Uniform-Binding
- `useFrame` Time-Update (allocation-free)
- `prefers-reduced-motion` MediaQuery Toggle
- IntersectionObserver Pause off-screen
- SSR-safe (`'use client'`, dynamic import)

```tsx
import { EffectShader } from './ShaderMaterial'
import { glitchEffect } from './effects/glitch'

<mesh>
  <planeGeometry args={[2, 2]} />
  <EffectShader effect={glitchEffect} intensity={0.5} />
</mesh>
```

## Accessibility (Pflicht)

1. `prefers-reduced-motion: reduce` → `uReducedMotion = 1.0`, Shader reduziert Amplitude/Frequenz auf 0
2. `IntersectionObserver` → Pause Render off-screen (RAF cancel)
3. Keine Flash-Frequenzen > 3Hz (Epilepsy Guard)
4. Keyboard-Focus darf nicht in Shader verschwinden (z-index Text Layer)

## Performance-Budgets

| Device | Target FPS | Lighthouse | Notes |
|--------|------------|------------|-------|
| Desktop (M1+/RTX) | 60 | >=95 | Full WGSL, 2x DPR |
| Mobile (iPhone 12+) | 60 | >=90 | Cap DPR <=1.5 |
| Mobile (Android mid) | 30 | >=85 | WebGL2 Fallback ok |

Verifikation: `pnpm dev --filter website` + Chrome DevTools Performance-Tab. Green-Run Gate.

## Pipeline

1. Effekte in `website/src/shaders/effects/` (kopiert aus `templates/effects/`)
2. `ShaderMaterial.tsx` in `website/src/components/shader/`
3. Brand-Farben aus DESIGN.md via `useShaderUniforms` Hook ziehen
4. Test: `pnpm typecheck && pnpm dev` → visuell verifizieren
5. Deploy: NUR auf {Users} Ansage (feedback_no_auto_deploy.md)

## Tooling & Playgrounds

- **WebGPU Shader Toy** (pongasoft) — Browser, localStorage
- **Tour of WGSL** (Google) — Live Editor mit inline Errors
- **shadplay** / **wgshadertoy** — Desktop live-reload
- **ChatGL / ShaderGPT** — AI Shader Generation als Start, dann manuell verfeinern
- **Shadertoy.com** — Referenzen, Code immer anpassen (kein direkter Copy)

## AI Co-Pilot Workflow

1. Brand-Farben aus DESIGN.md extrahieren
2. ChatGL mit Prompt: "WGSL fragment shader: [effect], uniforms: uTime, uMouse, primary [hex], accent [hex], mobile-friendly"
3. Output in TSL Node-Syntax konvertieren (three.js Docs TSL Reference)
4. In `templates/effects/` als neue Datei ablegen
5. R3F Demo in `playground/` mit `<EffectShader />` wrapper

## Awwwards 2026 Referenzen

- **Samsy Gen-02** (SOTD Oct 2025) — Vue + GSAP + WebGPU
- **Martin Laxenaire** — full WebGPU engine (gpu-curtains)
- **OFFFICE** — minimalist WebGL

## Verwandte Skills

- `particle-hero` — kombiniert TSL-Basis fuer 3D Particle Hero
- `design-md-generator` — PFLICHT vor Shader-Edits, liefert Brand-Farben
- `algorithmic-art` — p5.js Alternative fuer 2D-Only Effekte
- `ae-automation` — Motion-Referenz aus AE extrahieren fuer Shader-Vorlage
- `codex-review` — Pre-Deploy Shader-Security Review

## Referenz-Dokumente

- SOTA Research: `docs/research/skill-upgrades/shader-portfolio/A-sota.md`
- Gap Analysis: `docs/research/skill-upgrades/shader-portfolio/B-gaps.md`
- Three.js TSL Docs: https://threejs.org/docs/#api/en/nodes/Nodes
- drei shaderMaterial: https://drei.docs.pmnd.rs/shaders/shader-material
- WebGPU Status: https://caniuse.com/webgpu
