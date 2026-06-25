import React from 'react';
import {
  AbsoluteFill,
  Video,
  interpolate,
  useCurrentFrame,
} from 'remotion';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadSpaceGrotesk } from '@remotion/google-fonts/SpaceGrotesk';

const { fontFamily: inter } = loadInter();
const { fontFamily: spaceGrotesk } = loadSpaceGrotesk();

/**
 * ReelTextOverlay — 9:16 Text-Cards ueber bestehender Footage.
 *
 * Usage:
 *   - `videoSrc`: Pfad zu MP4/MOV Footage (staticFile('video/...'))
 *   - `cards`: Array von TextCard { text, start, end, position? }
 *
 * Jede Card faded ein (12 Frames), bleibt stehen, faded aus (12 Frames).
 * Unten Dauer-Brand-Bar mit @{user}.
 *
 * Perfekt fuer: Mural-Reels, Studio-Tour, Announcement, Portfolio-Walk.
 */

const BRAND = {
  bg: '#0a0a0a',
  text: '#ffffff',
  textDim: '#888888',
  overlay: 'rgba(10,10,10,0.55)',
  line: 'rgba(255,255,255,0.25)',
} as const;

export interface TextCard {
  text: string;
  start: number;
  end: number;
  position?: 'top' | 'center' | 'bottom';
}

export interface ReelTextOverlayProps {
  videoSrc: string;
  cards: TextCard[];
}

const Card: React.FC<{ card: TextCard; frame: number }> = ({ card, frame }) => {
  const { text, start, end, position = 'center' } = card;

  if (frame < start - 6 || frame > end + 12) return null;

  const opacity = interpolate(
    frame,
    [start, start + 12, end, end + 12],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const translateY = interpolate(
    frame,
    [start, start + 12],
    [40, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const justifyContent =
    position === 'top'
      ? 'flex-start'
      : position === 'bottom'
        ? 'flex-end'
        : 'center';
  const paddingTop = position === 'top' ? 200 : 0;
  const paddingBottom = position === 'bottom' ? 300 : 0;

  return (
    <AbsoluteFill
      style={{
        justifyContent,
        alignItems: 'center',
        paddingTop,
        paddingBottom,
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          padding: '32px 48px',
          backgroundColor: BRAND.overlay,
          backdropFilter: 'blur(12px)',
          borderLeft: `4px solid ${BRAND.text}`,
        }}
      >
        <h2
          style={{
            fontFamily: spaceGrotesk,
            fontSize: 88,
            fontWeight: 700,
            color: BRAND.text,
            margin: 0,
            letterSpacing: -2,
            lineHeight: 1,
            textTransform: 'uppercase',
          }}
        >
          {text}
        </h2>
      </div>
    </AbsoluteFill>
  );
};

export const ReelTextOverlay: React.FC<ReelTextOverlayProps> = ({
  videoSrc,
  cards,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: BRAND.bg }}>
      {/* Background footage */}
      <AbsoluteFill>
        <Video
          src={videoSrc}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          muted
        />
      </AbsoluteFill>

      {/* Dim overlay */}
      <AbsoluteFill style={{ backgroundColor: 'rgba(10,10,10,0.25)' }} />

      {/* Text cards */}
      {cards.map((card, idx) => (
        <Card key={idx} card={card} frame={frame} />
      ))}

      {/* Brand bar bottom */}
      <AbsoluteFill
        style={{
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingBottom: 80,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '12px 24px',
            borderTop: `1px solid ${BRAND.line}`,
          }}
        >
          <span
            style={{
              fontFamily: inter,
              fontSize: 24,
              fontWeight: 500,
              color: BRAND.text,
              letterSpacing: 3,
            }}
          >
            @{NAME}
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
