import React from 'react';
import {
  AbsoluteFill,
  Video,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadSpaceGrotesk } from '@remotion/google-fonts/SpaceGrotesk';

const { fontFamily: inter } = loadInter();
const { fontFamily: spaceGrotesk } = loadSpaceGrotesk();

/**
 * ProcessReel — Sabum-Style "Designer's eye / AI's hands" Format.
 *
 * Layout: Split-Screen vertikal (oben Designer-Clip, unten AI-Clip).
 * Oben ueberlagert: Caption ("designers eye / ais hands")
 * Mitte: animierte Trenn-Linie mit Label
 * Unten: Project-Title + Progress-Bar
 *
 * Duration default: 600 Frames (20s)
 *
 * Usage-Case: Build-Diary Reels, Process-as-Content, Crossover Artist+Code.
 * Pendant zu `process-as-content-reel` Skill.
 */

const BRAND = {
  bg: '#0a0a0a',
  text: '#ffffff',
  textDim: '#888888',
  line: 'rgba(255,255,255,0.3)',
  divider: '#ffffff',
} as const;

export interface ProcessReelProps {
  designerClip: string;
  aiClip: string;
  caption: string;
  projectTitle?: string;
}

export const ProcessReel: React.FC<ProcessReelProps> = ({
  designerClip,
  aiClip,
  caption,
  projectTitle = 'PROJECT',
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Split reveal (0-30 frames)
  const splitProgress = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Caption fade-in (30-60)
  const captionOpacity = interpolate(frame, [30, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Progress bar
  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Split the caption into halves
  const [firstHalf, secondHalf] = caption.includes('/')
    ? caption.split('/').map((s) => s.trim())
    : [caption, ''];

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.bg }}>
      {/* Top half — Designer */}
      <AbsoluteFill
        style={{
          height: '50%',
          overflow: 'hidden',
          opacity: splitProgress,
          transform: `translateY(${interpolate(frame, [0, 30], [-50, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })}px)`,
        }}
      >
        <Video
          src={designerClip}
          muted
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/* Label */}
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: 40,
            padding: '10px 20px',
            backgroundColor: 'rgba(10,10,10,0.7)',
            backdropFilter: 'blur(8px)',
            borderLeft: `3px solid ${BRAND.text}`,
          }}
        >
          <span
            style={{
              fontFamily: inter,
              fontSize: 22,
              fontWeight: 500,
              color: BRAND.text,
              letterSpacing: 3,
              textTransform: 'uppercase',
            }}
          >
            HUMAN
          </span>
        </div>
      </AbsoluteFill>

      {/* Bottom half — AI */}
      <AbsoluteFill
        style={{
          top: '50%',
          height: '50%',
          overflow: 'hidden',
          opacity: splitProgress,
          transform: `translateY(${interpolate(frame, [0, 30], [50, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })}px)`,
        }}
      >
        <Video
          src={aiClip}
          muted
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: 40,
            padding: '10px 20px',
            backgroundColor: 'rgba(10,10,10,0.7)',
            backdropFilter: 'blur(8px)',
            borderLeft: `3px solid ${BRAND.text}`,
          }}
        >
          <span
            style={{
              fontFamily: inter,
              fontSize: 22,
              fontWeight: 500,
              color: BRAND.text,
              letterSpacing: 3,
              textTransform: 'uppercase',
            }}
          >
            MACHINE
          </span>
        </div>
      </AbsoluteFill>

      {/* Horizontal divider with accent */}
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            height: 4,
            width: '100%',
            backgroundColor: BRAND.divider,
            transform: `scaleX(${splitProgress})`,
            transformOrigin: 'center',
          }}
        />
      </AbsoluteFill>

      {/* Center caption overlay */}
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          opacity: captionOpacity,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            padding: '28px 48px',
            backgroundColor: 'rgba(10,10,10,0.85)',
            backdropFilter: 'blur(16px)',
            border: `1px solid ${BRAND.line}`,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontFamily: spaceGrotesk,
              fontSize: 52,
              fontWeight: 700,
              color: BRAND.text,
              letterSpacing: -1,
              lineHeight: 1.1,
            }}
          >
            {firstHalf}
          </div>
          {secondHalf && (
            <>
              <div
                style={{
                  height: 1,
                  width: 120,
                  backgroundColor: BRAND.line,
                  margin: '12px auto',
                }}
              />
              <div
                style={{
                  fontFamily: spaceGrotesk,
                  fontSize: 52,
                  fontWeight: 700,
                  color: BRAND.textDim,
                  letterSpacing: -1,
                  lineHeight: 1.1,
                }}
              >
                {secondHalf}
              </div>
            </>
          )}
        </div>
      </AbsoluteFill>

      {/* Bottom bar — title + progress */}
      <AbsoluteFill
        style={{
          justifyContent: 'flex-end',
          padding: 60,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <span
            style={{
              fontFamily: inter,
              fontSize: 22,
              fontWeight: 600,
              color: BRAND.text,
              letterSpacing: 3,
              textTransform: 'uppercase',
            }}
          >
            {projectTitle}
          </span>
          <span
            style={{
              fontFamily: inter,
              fontSize: 18,
              color: BRAND.textDim,
              letterSpacing: 2,
            }}
          >
            BUILD DIARY
          </span>
        </div>
        <div
          style={{
            width: '100%',
            height: 2,
            backgroundColor: BRAND.line,
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
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
