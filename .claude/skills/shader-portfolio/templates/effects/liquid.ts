/**
 * Liquid Distortion Effect (TSL)
 *
 * Water-like refraction with layered sine waves + curl noise flow field.
 * Use-Case: Underwater-Scene, Werk-Hover Flow, Paint-Brush Smear.
 *
 * Uniforms:
 *   uTime        — seconds
 *   uFreq        — wave frequency (1.5..8.0)
 *   uAmp         — displacement amplitude (0.0..0.1)
 *   uColorPrimary, uColorAccent — Brand tint mix
 *   uReducedMotion — 0 normal, 1 freeze at t=0
 *   uTexture     — source texture
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
  mix,
  normalize,
  length,
  time,
  color,
} from 'three/tsl'
import type { Texture, Color } from 'three'

export interface LiquidUniforms {
  uFreq: ReturnType<typeof uniform>
  uAmp: ReturnType<typeof uniform>
  uColorPrimary: ReturnType<typeof uniform>
  uColorAccent: ReturnType<typeof uniform>
  uReducedMotion: ReturnType<typeof uniform>
  uTexture: ReturnType<typeof uniform>
}

export function createLiquidUniforms(
  tex?: Texture,
  primary?: Color,
  accent?: Color
): LiquidUniforms {
  return {
    uFreq: uniform(4.0),
    uAmp: uniform(0.03),
    uColorPrimary: uniform(primary ?? null),
    uColorAccent: uniform(accent ?? null),
    uReducedMotion: uniform(0.0),
    uTexture: uniform(tex ?? null),
  }
}

export const liquidEffect = Fn(
  ([uniforms]: [LiquidUniforms]) => {
    const { uFreq, uAmp, uColorPrimary, uColorAccent, uReducedMotion, uTexture } = uniforms

    // Freeze time under reduced-motion
    const t = time.mul(float(1.0).sub(uReducedMotion))

    // Two layered wave fields for pseudo-curl flow
    const wave1X = sin(uv().y.mul(uFreq).add(t.mul(0.8))).mul(uAmp)
    const wave1Y = cos(uv().x.mul(uFreq).add(t.mul(0.6))).mul(uAmp)

    const wave2X = sin(uv().y.mul(uFreq.mul(2.1)).sub(t.mul(1.3))).mul(uAmp.mul(0.5))
    const wave2Y = cos(uv().x.mul(uFreq.mul(1.7)).sub(t.mul(1.1))).mul(uAmp.mul(0.5))

    const displacement = vec2(wave1X.add(wave2X), wave1Y.add(wave2Y))
    const distortedUv = uv().add(displacement)

    const sampled = texture(uTexture, distortedUv)

    // Brand tint: blend primary into shadows, accent into highlights
    const luma = dotLuma(sampled.rgb)
    const tinted = mix(uColorPrimary, uColorAccent, luma)
    const blended = mix(sampled.rgb, tinted, float(0.15))

    return vec4(blended, sampled.a)
  }
)

// Helper: luminance dot product
const dotLuma = Fn(([rgb]: [ReturnType<typeof vec3>]) => {
  return rgb.r.mul(0.299).add(rgb.g.mul(0.587)).add(rgb.b.mul(0.114))
})

export default liquidEffect
