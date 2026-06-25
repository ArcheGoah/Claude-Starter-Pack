'use client'

/**
 * R3F ShaderMaterial Wrapper — TSL-based, WebGPU + WebGL2 compatible
 *
 * Generic <EffectShader /> that plugs any TSL effect from ./effects/* into a
 * plane mesh or as a post-processing quad. Uses drei's useTexture for loading,
 * handles prefers-reduced-motion, IntersectionObserver pause, and Brand-Uniforms.
 *
 * Usage:
 *   import { EffectShader } from './ShaderMaterial'
 *   import { glitchEffect, createGlitchUniforms } from './effects/glitch'
 *
 *   <mesh>
 *     <planeGeometry args={[2, 2]} />
 *     <EffectShader
 *       effect={glitchEffect}
 *       createUniforms={createGlitchUniforms}
 *       texture="/images/werk-01.jpg"
 *       intensity={0.5}
 *     />
 *   </mesh>
 *
 * Requires:
 *   pnpm add three @react-three/fiber @react-three/drei
 *   // three >= r170 for TSL support
 */

import {
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
  type RefObject,
} from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import {
  MeshBasicNodeMaterial,
  Color,
  Vector2,
  type Texture,
  type Mesh,
} from 'three'

export interface BrandColors {
  primary?: string
  accent?: string
  background?: string
}

export interface EffectShaderProps {
  /** TSL effect factory function — returns a colorNode */
  effect: (uniforms: Record<string, unknown>) => unknown
  /** Factory that creates the uniform object for this effect */
  createUniforms: (tex?: Texture, ...args: unknown[]) => Record<string, unknown>
  /** Texture URL or loaded Texture */
  texture?: string | Texture
  /** Brand colors from DESIGN.md */
  brand?: BrandColors
  /** Initial intensity 0..1 (mapped to effect-specific uniform if present) */
  intensity?: number
  /** Pause rendering when mesh leaves viewport */
  pauseOffscreen?: boolean
  /** Mesh ref for IntersectionObserver */
  meshRef?: RefObject<Mesh>
}

/**
 * Hook: detect prefers-reduced-motion
 */
function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setReduced(e.matches)
    handler(mq)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return reduced
}

/**
 * Hook: IntersectionObserver pause when element off-screen.
 * Returns `visible` boolean. Connects to a DOM element via ref.
 */
function useVisibility(target: RefObject<HTMLElement | Mesh | null>): boolean {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const node = target.current
    if (!node || !(node instanceof HTMLElement)) return
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.01 }
    )
    io.observe(node)
    return () => io.disconnect()
  }, [target])
  return visible
}

/**
 * Main R3F component — attaches a MeshBasicNodeMaterial with a TSL colorNode.
 */
export const EffectShader = forwardRef<MeshBasicNodeMaterial, EffectShaderProps>(
  function EffectShader(
    {
      effect,
      createUniforms,
      texture,
      brand,
      intensity = 0.5,
      pauseOffscreen = true,
      meshRef,
    },
    ref
  ) {
    const reducedMotion = useReducedMotion()
    const gl = useThree((s) => s.gl)
    const size = useThree((s) => s.size)

    // Load texture if URL provided (drei will Suspense)
    const loadedTexture =
      typeof texture === 'string' ? useTexture(texture) : texture

    // Build uniforms once per mount
    const uniforms = useMemo(() => {
      const primary = brand?.primary ? new Color(brand.primary) : new Color('#ffffff')
      const accent = brand?.accent ? new Color(brand.accent) : new Color('#000000')
      return createUniforms(loadedTexture, primary, accent)
    }, [createUniforms, loadedTexture, brand?.primary, brand?.accent])

    // Material with TSL colorNode
    const material = useMemo(() => {
      const mat = new MeshBasicNodeMaterial()
      // effect() returns a colorNode (TSL expression)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(mat as any).colorNode = effect(uniforms as any)
      return mat
    }, [effect, uniforms])

    // Sync reducedMotion + intensity into uniforms
    useEffect(() => {
      const u = uniforms as Record<string, { value?: unknown }>
      if (u.uReducedMotion && 'value' in u.uReducedMotion) {
        u.uReducedMotion.value = reducedMotion ? 1 : 0
      }
      if (u.uIntensity && 'value' in u.uIntensity) {
        u.uIntensity.value = intensity
      }
      if (u.uStrength && 'value' in u.uStrength) {
        u.uStrength.value = intensity * 0.08
      }
    }, [reducedMotion, intensity, uniforms])

    // Update resolution uniform on resize
    useEffect(() => {
      const u = uniforms as Record<string, { value?: unknown }>
      if (u.uResolution && 'value' in u.uResolution) {
        u.uResolution.value = new Vector2(size.width, size.height)
      }
    }, [size.width, size.height, uniforms])

    // Pause frame loop off-screen
    const visibilityRef = useRef<Mesh>(null)
    const activeRef = meshRef ?? visibilityRef
    const visible = pauseOffscreen ? useVisibility(activeRef) : true

    // Mouse tracking for uMouse uniform
    useEffect(() => {
      if (typeof window === 'undefined') return
      const handler = (e: MouseEvent) => {
        const u = uniforms as Record<string, { value?: unknown }>
        if (u.uMouse && 'value' in u.uMouse) {
          u.uMouse.value = new Vector2(
            e.clientX / window.innerWidth,
            1 - e.clientY / window.innerHeight
          )
        }
      }
      window.addEventListener('mousemove', handler, { passive: true })
      return () => window.removeEventListener('mousemove', handler)
    }, [uniforms])

    // Only drive shader when visible — allocation-free update
    useFrame(() => {
      if (!visible) return
      // TSL built-in `time` node is auto-updated by the renderer.
      // If a custom uTime exists, advance it manually:
      const u = uniforms as Record<string, { value?: number }>
      if (u.uTime && typeof u.uTime.value === 'number') {
        u.uTime.value += 1 / 60
      }
    })

    // Dispose material on unmount
    useEffect(() => {
      return () => {
        material.dispose()
      }
    }, [material])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return <primitive ref={ref as any} object={material} attach="material" />
  }
)

/**
 * Convenience wrapper: full-screen plane with the effect applied.
 * Use this for hero sections or post-processing overlays.
 */
export function EffectPlane(
  props: EffectShaderProps & ComponentProps<'mesh'>
) {
  const { effect, createUniforms, texture, brand, intensity, pauseOffscreen, ...meshProps } =
    props
  return (
    <mesh {...meshProps}>
      <planeGeometry args={[2, 2]} />
      <EffectShader
        effect={effect}
        createUniforms={createUniforms}
        texture={texture}
        brand={brand}
        intensity={intensity}
        pauseOffscreen={pauseOffscreen}
      />
    </mesh>
  )
}

export default EffectShader
