/**
 * Noise Displacement Effect (TSL)
 *
 * Simplex-like pseudo-noise driven UV displacement for painterly flow & heat haze.
 * Use-Case: Painterly Flow (Werk-Hover), Heat Haze (Mural-Dokumentation), Inkbleed Headlines.
 *
 * Uniforms:
 *   uStrength      — displacement amount (0.0..0.08)
 *   uScale         — noise frequency (1..20)
 *   uSpeed         — time multiplier (0.0..2.0)
 *   uReducedMotion — gate (speed → 0)
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
  fract,
  floor,
  dot,
  mix,
  time,
} from 'three/tsl'
import type { Texture } from 'three'

export interface NoiseDisplacementUniforms {
  uStrength: ReturnType<typeof uniform>
  uScale: ReturnType<typeof uniform>
  uSpeed: ReturnType<typeof uniform>
  uReducedMotion: ReturnType<typeof uniform>
  uTexture: ReturnType<typeof uniform>
}

export function createNoiseDisplacementUniforms(
  tex?: Texture
): NoiseDisplacementUniforms {
  return {
    uStrength: uniform(0.025),
    uScale: uniform(6.0),
    uSpeed: uniform(0.4),
    uReducedMotion: uniform(0.0),
    uTexture: uniform(tex ?? null),
  }
}

// Simple value-noise via hash interpolation (no external dep)
const hash2 = Fn(([p]: [ReturnType<typeof vec2>]) => {
  return fract(sin(dot(p, vec2(127.1, 311.7))).mul(43758.5453123))
})

const valueNoise = Fn(([p]: [ReturnType<typeof vec2>]) => {
  const i = floor(p)
  const f = fract(p)
  // Smoothstep interpolation factor
  const u = f.mul(f).mul(float(3.0).sub(f.mul(2.0)))

  const a = hash2(i)
  const b = hash2(i.add(vec2(1.0, 0.0)))
  const c = hash2(i.add(vec2(0.0, 1.0)))
  const d = hash2(i.add(vec2(1.0, 1.0)))

  const mix1 = mix(a, b, u.x)
  const mix2 = mix(c, d, u.x)
  return mix(mix1, mix2, u.y)
})

export const noiseDisplacementEffect = Fn(
  ([uniforms]: [NoiseDisplacementUniforms]) => {
    const { uStrength, uScale, uSpeed, uReducedMotion, uTexture } = uniforms

    const effectiveSpeed = uSpeed.mul(float(1.0).sub(uReducedMotion))
    const t = time.mul(effectiveSpeed)

    // Two independent noise fields for x and y displacement
    const nx = valueNoise(uv().mul(uScale).add(vec2(t, 0.0)))
    const ny = valueNoise(uv().mul(uScale).add(vec2(0.0, t)))

    // Center noise around 0 (-0.5..0.5)
    const displacement = vec2(nx.sub(0.5), ny.sub(0.5)).mul(uStrength.mul(2.0))

    const distortedUv = uv().add(displacement)
    const sampled = texture(uTexture, distortedUv)

    return vec4(sampled.rgb, sampled.a)
  }
)

export default noiseDisplacementEffect
