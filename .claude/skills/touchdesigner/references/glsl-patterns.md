# GLSL Patterns — TD 2025

## All Built-in Variables

```glsl
// Samplers (auto-declared by TD based on connected inputs)
sTD2DInputs[n]             // sampler2D
sTD3DInputs[n]             // sampler3D
sTD2DArrayInputs[n]        // sampler2DArray
sTDCubeInputs[n]           // samplerCube

// Resolution info
uTD2DInfos[n].res.xy       // vec2 — pixel width, height
uTD2DInfos[n].res.zw       // vec2 — 1/width, 1/height (pixel step)
uTDOutputInfo.res.xy       // output resolution

// Coordinates
vUV                        // vec2 — 0..1, bottom-left origin
vUV.st                     // same (preferred form)

// Misc
uTDPass                    // int — render pass index
uTDCurrentDepth            // int — 3D/array slice
gl_GlobalInvocationID      // uvec3 — compute thread (x,y,z)
```

## Compute Shader Template

```glsl
// GLSL TOP — Compute Shader mode
// Dispatch: Auto (TD sets numgroups from local_size + output res)

layout(local_size_x = 16, local_size_y = 16, local_size_z = 1) in;

// Compute shaders do NOT use TDOutputSwizzle — TD handles it automatically in 2025
void TDImageStoreOutput(uint index, ivec3 coord, vec4 color);

void main() {
    ivec2 coord = ivec2(gl_GlobalInvocationID.xy);
    ivec2 size  = ivec2(uTDOutputInfo.res.xy);
    if (coord.x >= size.x || coord.y >= size.y) return;

    vec2 uv = (vec2(coord) + 0.5) / vec2(size);
    vec4 c  = texture(sTD2DInputs[0], uv);

    // process c...

    TDImageStoreOutput(0, ivec3(coord, 0), c);
}
```

## Multi-Output (Color Buffers)

```glsl
// In GLSL TOP: set "# of Color Buffers" = 2
// Access buffer 1+ via Render Select TOP downstream

layout(location = 0) out vec4 fragColor;    // buffer 0 (connector output)
layout(location = 1) out vec4 fragColor1;   // buffer 1 (via Render Select TOP)

void main() {
    fragColor  = TDOutputSwizzle(vec4(position, 1.));
    fragColor1 = TDOutputSwizzle(vec4(velocity, 1.));
}
```

## Utility Functions

```glsl
// --- Curl noise (divergence-free 2D velocity) ---
float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

vec2 curlNoise(vec2 p, float t) {
    const float e = 0.001;
    float n1 = hash(p + vec2(0, e) + t * .3);
    float n2 = hash(p - vec2(0, e) + t * .3);
    float n3 = hash(p + vec2(e, 0) + t * .3);
    float n4 = hash(p - vec2(e, 0) + t * .3);
    return vec2((n1-n2), -(n3-n4)) / (2.*e);
}

// --- Smooth HSV → RGB ---
vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1., 2./3., 1./3., 3.);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6. - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0., 1.), c.y);
}

// --- Soft circle ---
float circle(vec2 uv, vec2 center, float radius, float softness) {
    return 1. - smoothstep(radius - softness, radius, length(uv - center));
}

// --- Vignette ---
float vignette(vec2 uv, float strength) {
    uv = uv * 2. - 1.;
    return 1. - dot(uv, uv) * strength;
}
```

## Feedback Loop — Stability Pattern

```glsl
// SAFE feedback — won't blow up or die after hours
void main() {
    vec4 prev = texture(sTD2DInputs[0], uv - velocity);

    // 1. Slow decay: prevents accumulation
    vec4 state = prev * 0.995;

    // 2. Process / inject ...
    state += injection;

    // 3. Hard clamp: prevents blowup
    state = clamp(state, 0., 1.);

    fragColor = TDOutputSwizzle(state);
}
```

## Color Coherence Axis

Wire `uCoherence` (0..1) to multiple visual parameters for a single legible axis:

```glsl
// Text legibility: crisp ↔ dissolved
float textAlpha = mix(0., lum, uCoherence);

// Palette: diverse ↔ unified gold
vec3 goldPalette = vec3(0.85, 0.78, 0.62);
color.rgb = mix(color.rgb, color.rgb * goldPalette, uCoherence * 0.6);

// Particle order: turbulent ↔ organized (via attractor strength)
float attractionWeight = uCoherence * uAttraction;

// Disruption visual: when coherence low
float glitch = (1. - uCoherence) * turbulenceNoise;
color.rgb += vec3(glitch * 0.3, 0., glitch * 0.1);  // red-blue fringe

// Bloom: rare, spectacular peak
float bloom = smoothstep(0.85, 1.0, uCoherence);
color.rgb += color.rgb * bloom * 0.5;  // self-luminance spike
```
