import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadSpaceGrotesk } from '@remotion/google-fonts/SpaceGrotesk';

const { fontFamily: inter } = loadInter();
const { fontFamily: spaceGrotesk } = loadSpaceGrotesk();

/**
 * IntroBumper — 3s (90 frames @ 30fps) Brand-Signatur fuer {DEIN_NAME}.
 *
 * Aesthetik: Dynamic Minimalism 2026.
 *   - Dunkler Hintergrund (#0a0a0a)
 *   - Grosse serifenlose Typo (Space Grotesk 160px)
 *   - Fade-in "{YOUR NAME}"
 *   - Location "{YOUR CITY}" mit Line-Reveal
 *   - Optionaler Tagline (z.B. "MOTION. MURAL. CODE.")
 *
 * Use-Case: Prepend vor jedem Reel, Portfolio-Intro, Speaker-Slide.
 */

const BRAND = {
  bg: '#0a0a0a',
  text: '#ffffff',
  textDim: '#888888',
  line: 'rgba(255,255,255,0.25)',
} as const;

export interface IntroBumperProps {
  tagline?: string;
}

export const IntroBumper: React.FC<IntroBumperProps> = ({
  tagline = 'MOTION. MURAL. CODE.',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Name fade-in (0-20 frames)
  const nameOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const nameY = spring({
    frame,
    fps,
    config: { damping: 18, mass: 0.8 },
    from: 40,
    to: 0,
  });

  // Line reveal (20-45 frames)
  const lineScale = interpolate(frame, [20, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Location + tagline (35-90 frames)
  const locationOpacity = interpolate(frame, [35, 55], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Outro fade (75-90 frames)
  const outroOpacity = interpolate(frame, [75, 90], [1, 0], {
    extrapolateLeft: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BRAND.bg,
        fontFamily: inter,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: outroOpacity,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 40,
        }}
      >
        {/* Name */}
        <h1
          style={{
            fontFamily: spaceGrotesk,
            fontSize: 140,
            fontWeight: 700,
            color: BRAND.text,
            margin: 0,
            letterSpacing: -4,
            lineHeight: 1,
            opacity: nameOpacity,
            transform: `translateY(${nameY}px)`,
            textAlign: 'center',
          }}
        >
          {NAME}
        </h1>

        {/* Divider line */}
        <div
          style={{
            height: 2,
            width: 600,
            backgroundColor: BRAND.line,
            transform: `scaleX(${lineScale})`,
            transformOrigin: 'center',
          }}
        />

        {/* Location + tagline */}
        <div
          style={{
            opacity: locationOpacity,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <span
            style={{
              fontFamily: inter,
              fontSize: 36,
              fontWeight: 400,
              color: BRAND.text,
              letterSpacing: 12,
            }}
          >
            {YOUR CITY}
          </span>
          <span
            style={{
              fontFamily: inter,
              fontSize: 22,
              fontWeight: 300,
              color: BRAND.textDim,
              letterSpacing: 4,
            }}
          >
            {tagline}
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
