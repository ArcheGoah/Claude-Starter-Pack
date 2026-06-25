/**
 * Glitch Burst Effect (TSL)
 *
 * RGB-channel shift + block slicing + digital noise.
 * Use-Case: Hover-Trigger fuer Werke, Musik-Drop-Momente, Reel-Intros.
 *
 * TSL compiles to WGSL (WebGPU) and GLSL (WebGL2) transparently.
 * Import: import { glitchEffect } from './effects/glitch'
 *
 * Uniforms:
 *   uTime       — seconds, useFrame injected
 *   uIntensity  — 0..1, hover-trigger amount
 *   uSeed       — random seed per mount (stable artistic variation)
 *   uReducedMotion — 0 normal, 1 disable glitch
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
  step,
  mix,
  abs,
  mod,
  dot,
  time,
} from 'three/tsl'
import type { Texture } from 'three'

export interface GlitchUniforms {
  uIntensity: ReturnType<typeof uniform>
  uSeed: ReturnType<typeof uniform>
  uReducedMotion: ReturnType<typeof uniform>
  uTexture: ReturnType<typeof uniform>
}

export function createGlitchUniforms(tex?: Texture): GlitchUniforms {
  return {
    uIntensity: uniform(0.0),
    uSeed: uniform(Math.random() * 1000),
    uReducedMotion: uniform(0.0),
    uTexture: uniform(tex ?? null),
  }
}

// Hash-based pseudo-random (stable across frames given seed+uv)
const hash = Fn(([p]: [ReturnType<typeof vec2>]) => {
  return fract(sin(dot(p, vec2(12.9898, 78.233))).mul(43758.5453))
})

/**
 * Fragment colorNode for glitch effect.
 * Returns vec4 color — plug into shaderMaterial's colorNode.
 */
export const glitchEffect = Fn(
  ([uniforms]: [GlitchUniforms]) => {
    const { uIntensity, uSeed, uReducedMotion, uTexture } = uniforms

    // Gate by reduced-motion (if 1.0 → return texture as-is)
    const effectiveIntensity = uIntensity.mul(float(1.0).sub(uReducedMotion))

    // Horizontal slicing (block glitch)
    const sliceCount = float(20.0)
    const sliceY = floor(uv().y.mul(sliceCount)).div(sliceCount)
    const sliceNoise = hash(vec2(sliceY.mul(100.0), uSeed.add(time)))
    const sliceThreshold = float(1.0).sub(effectiveIntensity.mul(0.6))
    const sliceActive = step(sliceThreshold, sliceNoise)

    // Horizontal offset per active slice
    const offsetAmount = sliceNoise.sub(0.5).mul(0.1).mul(effectiveIntensity)
    const offsetUv = uv().add(vec2(offsetAmount.mul(sliceActive), 0.0))

    // RGB channel split
    const splitAmount = effectiveIntensity.mul(0.008)
    const rUv = offsetUv.add(vec2(splitAmount, 0.0))
    const gUv = offsetUv
    const bUv = offsetUv.sub(vec2(splitAmount, 0.0))

    const r = texture(uTexture, rUv).r
    const g = texture(uTexture, gUv).g
    const b = texture(uTexture, bUv).b

    // Digital noise overlay
    const grain = hash(uv().add(vec2(time.mul(0.1), uSeed))).sub(0.5)
    const noisyColor = vec3(r, g, b).add(grain.mul(effectiveIntensity).mul(0.1))

    return vec4(noisyColor, 1.0)
  }
)

export default glitchEffect
