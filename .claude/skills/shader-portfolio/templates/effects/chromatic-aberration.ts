/**
 * Chromatic Aberration Effect (TSL)
 *
 * RGB channel radial split from center or mouse position.
 * Use-Case: Header-Hover, Photo reveal, Collab Pages.
 *
 * Uniforms:
 *   uOffset        — base aberration amount (0..0.02)
 *   uMouse         — normalized mouse 0..1 (Vector2)
 *   uRadialFalloff — how fast effect falls off from center (0..4)
 *   uReducedMotion — gate
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
  length,
  mix,
  pow,
  clamp,
  sub,
} from 'three/tsl'
import type { Texture } from 'three'

export interface ChromaticAberrationUniforms {
  uOffset: ReturnType<typeof uniform>
  uMouse: ReturnType<typeof uniform>
  uRadialFalloff: ReturnType<typeof uniform>
  uReducedMotion: ReturnType<typeof uniform>
  uTexture: ReturnType<typeof uniform>
}

export function createChromaticAberrationUniforms(
  tex?: Texture
): ChromaticAberrationUniforms {
  return {
    uOffset: uniform(0.008),
    uMouse: uniform(vec2(0.5, 0.5)),
    uRadialFalloff: uniform(2.0),
    uReducedMotion: uniform(0.0),
    uTexture: uniform(tex ?? null),
  }
}

export const chromaticAberrationEffect = Fn(
  ([uniforms]: [ChromaticAberrationUniforms]) => {
    const { uOffset, uMouse, uRadialFalloff, uReducedMotion, uTexture } = uniforms

    // Gate by reduced-motion (reduce offset to 25%)
    const gate = mix(float(1.0), float(0.25), uReducedMotion)
    const effectiveOffset = uOffset.mul(gate)

    // Direction from mouse position (falls back to center if not set)
    const direction = uv().sub(uMouse)
    const dist = length(direction)

    // Radial falloff — stronger at edges, none at mouse/center
    const falloff = clamp(pow(dist, uRadialFalloff), 0.0, 1.0)
    const shift = direction.mul(effectiveOffset).mul(falloff)

    // Sample each channel with offset shift
    const rUv = uv().sub(shift)
    const gUv = uv()
    const bUv = uv().add(shift)

    const r = texture(uTexture, rUv).r
    const g = texture(uTexture, gUv).g
    const b = texture(uTexture, bUv).b
    const a = texture(uTexture, gUv).a

    return vec4(r, g, b, a)
  }
)

export default chromaticAberrationEffect
