# Particle Hero — Setup Guide (Next.js 14 App Router)

Kompletter Install + Integration Guide fuer `website/` ({deine-domain}.com) oder `project-website/` (zweite Projekt-Site).

---

## 1. Dependencies installieren

### Pflicht-Packages

```bash
# Im website/ oder project-website/ Directory
npm install three@^0.170 \
            @react-three/fiber@^9 \
            @react-three/drei@^10 \
            @react-three/postprocessing@^3 \
            wawa-vfx \
            threeparticles \
            detect-gpu
```

### Dev-Dependencies (Perf Gate)

```bash
npm install -D r3f-perf stats-gl @types/three
```

### WebGPU Types (nur wenn TypeScript strict)

```bash
npm install -D @webgpu/types
```

In `tsconfig.json` ergaenzen:
```json
{
  "compilerOptions": {
    "types": ["@webgpu/types"]
  }
}
```

---

## 2. Versions-Matrix (2026-04-11 verifiziert)

| Package | Version | Grund |
|---------|---------|-------|
| three | ^0.170 | WebGPURenderer + TSL stable |
| @react-three/fiber | ^9 | React 19 kompatibel, R3F 9 |
| @react-three/drei | ^10 | R3F 9 kompatibel |
| @react-three/postprocessing | ^3 | Bloom + ChromaticAberration |
| wawa-vfx | latest | Performance-focused VFX 2026 |
| threeparticles | latest | WebGPU-native Particles |
| detect-gpu | ^5 | Mobile GPU Tiering |
| r3f-perf | ^7 | Dev-FPS Monitor |
| stats-gl | ^3 | WebGPU-aware Stats |

**Breaking Change Warning:** R3F 8 -> 9 erfordert React 19. Wenn Next.js noch auf React 18 laeuft, erst `next@^15` upgraden.

---

## 3. File Structure

```
website/
  src/
    components/
      ParticleHero.tsx         # <- Template kopieren aus .claude/skills/particle-hero/templates/
    design-tokens.ts           # <- Brand-Colors (generiert von design-md-generator Skill)
    app/
      page.tsx                 # <- Hero einbinden via dynamic import
    styles/
      globals.css              # <- CSS Custom Properties fuer Brand-Colors
```

---

## 4. Design Tokens erstellen

**VOR Integration PFLICHT:** `design-md-generator` Skill feuern lassen fuer `docs/website/{user}-design.md`.

Dann `src/design-tokens.ts` erstellen:

```ts
// website/src/design-tokens.ts
// Auto-sync mit docs/website/{user}-design.md
export const colors = {
  primary:   '#E63946',  // {User} Red (Signature)
  secondary: '#F1FAEE',  // Bone White (Background)
  accent:    '#A8DADC',  // Mint (Detail)
  dark:      '#1D3557',  // Navy (Text/Shadow)
  gold:      '#F4A261',  // Sunset (Highlight)
} as const

export type BrandColor = keyof typeof colors
```

Dann in `ParticleHero.tsx` ersetzen:
```ts
// Alt (Fallback):
// const BRAND = { primary: new THREE.Color('#E63946'), ... }

// Neu:
import { colors } from '@/design-tokens'
const BRAND = {
  primary:   new THREE.Color(colors.primary),
  secondary: new THREE.Color(colors.secondary),
  accent:    new THREE.Color(colors.accent),
  dark:      new THREE.Color(colors.dark),
  gold:      new THREE.Color(colors.gold),
}
```

---

## 5. Component einbinden (Next.js App Router)

### `src/app/page.tsx`

```tsx
import dynamic from 'next/dynamic'

// SSR-safe: R3F braucht `window`, darf nicht serverseitig gerendert werden
const ParticleHero = dynamic(
  () => import('@/components/ParticleHero'),
  {
    ssr: false,
    loading: () => (
      <div className="h-screen w-full bg-gradient-to-b from-[#1D3557] to-black" />
    ),
  }
)

export default function HomePage() {
  return (
    <main className="relative">
      <section className="relative h-screen">
        <ParticleHero
          mode="default"
          showPerf={process.env.NODE_ENV === 'development'}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h1 className="text-7xl font-bold text-white mix-blend-difference">
            {DEIN_NAME}
          </h1>
        </div>
      </section>
      {/* weiterer Content */}
    </main>
  )
}
```

---

## 6. Mode-Switches

### Default (Brand Swirl)
```tsx
<ParticleHero mode="default" particleCount={500_000} />
```

### Audio-Reactive (Musik Live)
```tsx
<ParticleHero
  mode="audio-reactive"
  audioSource="microphone"
  particleCount={250_000}
/>
```
**Wichtig:** User muss erst klicken/tappen bevor Mic-Permission angefragt wird (Browser-Policy).

### Underwater (project-website/)
```tsx
<ParticleHero mode="underwater" particleCount={500_000} />
```

### Signature-Reveal (bei Hover)
```tsx
<ParticleHero mode="signature" particleCount={100_000} />
```

---

## 7. Mobile Optimization

`detect-gpu` tiert automatisch (Tier 0-3). Override fuer Testing:

```tsx
<ParticleHero particleCount={50_000} /> // Force Low-End
```

**CSS Media Query Fallback:**
```tsx
const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
<ParticleHero particleCount={isMobile ? 50_000 : 1_000_000} />
```

---

## 8. Perf Gate (Dev-Only)

In `ParticleHero.tsx` bereits integriert:
```tsx
{showPerf && process.env.NODE_ENV === 'development' && <Perf position="top-left" />}
```

Aktivieren:
```tsx
<ParticleHero showPerf />
```

**Target Metrics:**
- FPS: 60 stable (Desktop 4K) / 60 stable (Mobile 1080p)
- Draw Calls: <50 Desktop / <30 Mobile
- GPU Memory: <2 GB Desktop / <512 MB Mobile

Bei Regression: `particleCount` reduzieren oder Compute-Update-Interval anpassen.

---

## 9. Verification Checklist

Nach Integration IMMER pruefen:

- [ ] `npm run build` ohne Errors
- [ ] `npm run dev` laeuft, `localhost:4400` ({User}) oder `:4401` (Projekt-Site) zeigt Hero
- [ ] Chrome DevTools Performance Tab: 60 FPS stable
- [ ] Mobile Preview (DevTools Device Mode): kein Crash, <100k Particles
- [ ] Dark Mode / Reduced Motion: `prefers-reduced-motion` respektiert (static fallback)
- [ ] Accessibility: `role="img"` + `aria-label` auf Canvas-Wrapper
- [ ] Playwright Screenshot via `playwright-skill` Skill
- [ ] Audio-Mode: User-Gesture funktioniert, Permission-Deny hat Fallback
- [ ] Route-Wechsel: Kein Memory-Leak (`renderer.info.memory` stabil)

---

## 10. Troubleshooting

### "WebGPU not available"
- Chrome 113+, Edge 113+, Safari 18+ pruefen
- `chrome://gpu` -> WebGPU "Hardware accelerated" sein
- Fallback auf WebGL2 ist automatisch (Component handled das)

### "SSR Error: `window is not defined`"
- `dynamic(() => import('...'), { ssr: false })` benutzt?
- `'use client'` am File-Top?

### "FPS drop auf Mobile"
- `detect-gpu` Tier loggen: `console.log(tier)`
- `particleCount` manuell auf 10_000 begrenzen
- `dpr={[1, 1]}` (kein Retina-Scaling)

### "TSL Import Error"
- `three@^0.170` installiert? (TSL ist erst ab 0.170 stable exported)
- Import-Path: `from 'three/tsl'` (nicht `three/nodes`)
- WebGPU Renderer: `from 'three/webgpu'`

### "R3F 9 Errors"
- React 19 Check: `npm ls react` -> `^19.0.0`
- Next.js 15+: `npm install next@latest`
- Peer Dependency Warnings ignorieren wenn React ^19

---

## 11. Nachfolge-Steps

Nach erfolgreichem Setup:

1. **`design-md-generator`** Skill fuer aktuelle Brand-Tokens
2. **`shader-portfolio`** Skill fuer Signature Fragment Shaders (kombinierbar)
3. **`playwright-skill`** fuer Visual Regression Tests
4. **`codex-review`** fuer Pre-Deploy Security Review
5. **`claude-insights-tracker`** Session-Ende

---

## 12. References

- Three.js Docs: https://threejs.org/docs/#manual/en/introduction/How-to-use-WebGPU
- TSL Field Guide: https://blog.maximeheckel.com/posts/the-field-guide-to-tsl/
- R3F 9 Migration: https://r3f.docs.pmnd.rs/
- detect-gpu: https://github.com/pmndrs/detect-gpu
- wawa-vfx: https://github.com/wass08/wawa-vfx
- threeparticles: https://github.com/FarazzShaikh/threeparticles
- Awwwards SOTD References: bruno-simon.com, lusion.co, hero.co
