/**
 * CRT Scanlines Effect (TSL)
 *
 * Curved CRT screen with scanlines, phosphor bloom hint, vignette, slight RGB bleed.
 * Inspired by 2026 Blur Busters + Codrops CRT shader research.
 * Use-Case: Retro Projekt-Seiten, Video Mapping Docs, Retro 8-Bit Mode.
 *
 * Uniforms:
 *   uCurvature     — screen curvature (0..0.3)
 *   uLineCount     — scanline count (200..1080)
 *   uVignette      — vignette darkness (0..1)
 *   uBleed         — RGB bleed amount (0..0.01)
 *   uReducedMotion — gate (no flicker)
 *   uTexture       — source texture
 */

import {
  Fn,
  vec2,
  vec3,
  vec4,
  float,
  uv,
  texture,
  uniform,
  sin,
  cos,
  abs,
  step,
  mix,
  clamp,
  length,
  pow,
  time,
  smoothstep,
} from 'three/tsl'
import type { Texture } from 'three'

export interface CRTUniforms {
  uCurvature: ReturnType<typeof uniform>
  uLineCount: ReturnType<typeof uniform>
  uVignette: ReturnType<typeof uniform>
  uBleed: ReturnType<typeof uniform>
  uReducedMotion: ReturnType<typeof uniform>
  uTexture: ReturnType<typeof uniform>
}

export function createCRTUniforms(tex?: Texture): CRTUniforms {
  return {
    uCurvature: uniform(0.12),
    uLineCount: uniform(480.0),
    uVignette: uniform(0.35),
    uBleed: uniform(0.003),
    uReducedMotion: uniform(0.0),
    uTexture: uniform(tex ?? null),
  }
}

// Barrel distortion for CRT curvature
const curveUv = Fn(
  ([inUv, curvature]: [ReturnType<typeof vec2>, ReturnType<typeof float>]) => {
    // Remap to -1..1
    const centered = inUv.mul(2.0).sub(1.0)
    // Displacement squared towards edges
    const offset = centered.yx.mul(centered.yx).mul(curvature)
    const curved = centered.add(centered.mul(offset))
    // Remap back to 0..1
    return curved.mul(0.5).add(0.5)
  }
)

export const crtEffect = Fn(
  ([uniforms]: [CRTUniforms]) => {
    const { uCurvature, uLineCount, uVignette, uBleed, uReducedMotion, uTexture } =
      uniforms

    // Curved UVs
    const cUv = curveUv(uv(), uCurvature)

    // Outside screen mask (black frame)
    const inside = step(0.0, cUv.x)
      .mul(step(cUv.x, 1.0))
      .mul(step(0.0, cUv.y))
      .mul(step(cUv.y, 1.0))

    // RGB bleed — horizontal sub-pixel simulation
    const r = texture(uTexture, cUv.add(vec2(uBleed, 0.0))).r
    const g = texture(uTexture, cUv).g
    const b = texture(uTexture, cUv.sub(vec2(uBleed, 0.0))).b
    let color = vec3(r, g, b)

    // Scanlines — cos wave on y axis
    const scanY = cUv.y.mul(uLineCount)
    const scan = sin(scanY.mul(3.14159)).mul(0.5).add(0.5)
    const scanStrength = float(0.15)
    color = color.mul(float(1.0).sub(scan.mul(scanStrength)))

    // Subtle vertical rolling bar (disabled under reduced-motion)
    const rollSpeed = float(0.3).mul(float(1.0).sub(uReducedMotion))
    const roll = sin(cUv.y.mul(2.0).add(time.mul(rollSpeed))).mul(0.02)
    color = color.add(roll)

    // Vignette
    const dist = length(cUv.sub(vec2(0.5, 0.5)))
    const vign = smoothstep(0.7, 0.2, dist)
    const vignFactor = mix(float(1.0), vign, uVignette)
    color = color.mul(vignFactor)

    // Apply inside mask
    const finalColor = color.mul(inside)

    return vec4(finalColor, 1.0)
  }
)

export default crtEffect
