import React from 'react';
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  useCurrentFrame,
} from 'remotion';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadSpaceGrotesk } from '@remotion/google-fonts/SpaceGrotesk';

const { fontFamily: inter } = loadInter();
const { fontFamily: spaceGrotesk } = loadSpaceGrotesk();

/**
 * Timelapse — Image Sequence mit konfigurierbarer Speed + optional Ken-Burns Zoom.
 *
 * Usage:
 *   - `images`: string[] (staticFile paths)
 *   - `framesPerImage`: Frames pro Bild (default 60 = 2s @ 30fps)
 *   - `kenBurns`: boolean, langsamer Zoom pro Bild fuer Cinemaflair
 *   - `title`: optional Caption unten
 *
 * Perfekt fuer: Studio-Timelapse, Mural-Progress, Artwork-Series, Werkstatt-Diary.
 */

const BRAND = {
  bg: '#0a0a0a',
  text: '#ffffff',
  textDim: '#888888',
  line: 'rgba(255,255,255,0.25)',
} as const;

export interface TimelapseProps {
  images: string[];
  framesPerImage?: number;
  kenBurns?: boolean;
  title?: string;
}

const TimelapseFrame: React.FC<{
  src: string;
  duration: number;
  kenBurns: boolean;
  index: number;
}> = ({ src, duration, kenBurns, index }) => {
  const frame = useCurrentFrame();

  const scale = kenBurns
    ? interpolate(frame, [0, duration], [1.0, 1.12], {
        extrapolateRight: 'clamp',
      })
    : 1;

  // Drift direction alternates for variety
  const driftX = kenBurns
    ? interpolate(frame, [0, duration], [0, index % 2 === 0 ? -20 : 20], {
        extrapolateRight: 'clamp',
      })
    : 0;

  // Crossfade in (0-6 frames)
  const fadeIn = interpolate(frame, [0, 6], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.bg }}>
      <AbsoluteFill
        style={{
          opacity: fadeIn,
          transform: `scale(${scale}) translateX(${driftX}px)`,
        }}
      >
        <Img
          src={src}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Timelapse: React.FC<TimelapseProps> = ({
  images,
  framesPerImage = 60,
  kenBurns = true,
  title,
}) => {
  const frame = useCurrentFrame();
  const totalDuration = images.length * framesPerImage;

  // Progress bar (0..1)
  const progress = interpolate(frame, [0, totalDuration], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.bg, fontFamily: inter }}>
      {/* Image sequence */}
      {images.map((src, idx) => (
        <Sequence
          key={idx}
          from={idx * framesPerImage}
          durationInFrames={framesPerImage}
        >
          <TimelapseFrame
            src={src}
            duration={framesPerImage}
            kenBurns={kenBurns}
            index={idx}
          />
        </Sequence>
      ))}

      {/* Bottom overlay with title + progress */}
      <AbsoluteFill
        style={{
          justifyContent: 'flex-end',
          padding: 80,
          pointerEvents: 'none',
        }}
      >
        {title && (
          <h2
            style={{
              fontFamily: spaceGrotesk,
              fontSize: 72,
              fontWeight: 700,
              color: BRAND.text,
              margin: 0,
              letterSpacing: -1,
              marginBottom: 24,
              textTransform: 'uppercase',
              mixBlendMode: 'difference',
            }}
          >
            {title}
          </h2>
        )}

        {/* Progress bar */}
        <div
          style={{
            width: '100%',
            height: 3,
            backgroundColor: BRAND.line,
            position: 'relative',
          }}
        >
          <div
            style={{
              width: `${progress * 100}%`,
              height: '100%',
              backgroundColor: BRAND.text,
            }}
          />
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 12,
          }}
        >
          <span
            style={{
              fontFamily: inter,
              fontSize: 20,
              color: BRAND.textDim,
              letterSpacing: 2,
            }}
          >
            TIMELAPSE
          </span>
          <span
            style={{
              fontFamily: inter,
              fontSize: 20,
              color: BRAND.textDim,
              letterSpacing: 2,
            }}
          >
            @{NAME}
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
