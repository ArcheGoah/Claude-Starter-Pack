import React from 'react';
import {
  AbsoluteFill,
  Audio,
  interpolate,
  useAudioData,
  visualizeAudio,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadSpaceGrotesk } from '@remotion/google-fonts/SpaceGrotesk';

const { fontFamily: inter } = loadInter();
const { fontFamily: spaceGrotesk } = loadSpaceGrotesk();

/**
 * MusicVisualizer — Audio-reactive FFT Bars fuer Musik DJ-Sets und Track-Promos.
 *
 * Usage:
 *   - `audioSrc`: Pfad zu MP3/WAV (staticFile('audio/...'))
 *   - `trackTitle`: Display-Title des Tracks
 *   - `artist`: default '{DEIN_PROJEKT}'
 *
 * Setup: Benoetigt `@remotion/media-utils` fuer `useAudioData` + `visualizeAudio`.
 * Render: Pflicht mit `--concurrency 2` und ffmpeg im PATH.
 *
 * Aesthetik: Dunkler Hintergrund, zentrale horizontale FFT-Bars, Brand-Header,
 * Track-Title unten, Waveform mirrored fuer Symmetrie.
 */

const BRAND = {
  bg: '#0a0a0a',
  text: '#ffffff',
  textDim: '#888888',
  bar: '#ffffff',
  line: 'rgba(255,255,255,0.2)',
} as const;

export interface MusicVisualizerProps {
  audioSrc: string;
  trackTitle: string;
  artist?: string;
}

const BAR_COUNT = 48;

export const MusicVisualizer: React.FC<MusicVisualizerProps> = ({
  audioSrc,
  trackTitle,
  artist = '{DEIN_PROJEKT}',
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const audioData = useAudioData(audioSrc);

  // Fade-in intro (0-20)
  const introOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Fade-out outro (last 20 frames)
  const outroOpacity = interpolate(
    frame,
    [durationInFrames - 20, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp' }
  );

  let visualization: number[] = new Array(BAR_COUNT).fill(0.1);

  if (audioData) {
    try {
      visualization = visualizeAudio({
        fps,
        frame,
        audioData,
        numberOfSamples: BAR_COUNT * 2, // Power of 2 benoetigt
      }).slice(0, BAR_COUNT);
    } catch (e) {
      // fallback silence
    }
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BRAND.bg,
        opacity: Math.min(introOpacity, outroOpacity),
      }}
    >
      {/* Audio track */}
      <Audio src={audioSrc} />

      {/* Top — Brand header */}
      <AbsoluteFill
        style={{
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingTop: 120,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <span
            style={{
              fontFamily: inter,
              fontSize: 20,
              fontWeight: 400,
              color: BRAND.textDim,
              letterSpacing: 6,
            }}
          >
            NOW PLAYING
          </span>
          <div
            style={{
              height: 1,
              width: 140,
              backgroundColor: BRAND.line,
            }}
          />
        </div>
      </AbsoluteFill>

      {/* Center — FFT bars (mirrored symmetric) */}
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            width: '90%',
            height: 600,
          }}
        >
          {visualization.map((value, idx) => {
            // Amplify and clamp
            const height = Math.max(8, Math.min(value * 1800, 580));
            return (
              <div
                key={idx}
                style={{
                  width: 10,
                  height,
                  backgroundColor: BRAND.bar,
                  transition: 'height 30ms linear',
                }}
              />
            );
          })}
        </div>
      </AbsoluteFill>

      {/* Bottom — Track info */}
      <AbsoluteFill
        style={{
          justifyContent: 'flex-end',
          alignItems: 'center',
          paddingBottom: 180,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 20,
          }}
        >
          <h1
            style={{
              fontFamily: spaceGrotesk,
              fontSize: 96,
              fontWeight: 700,
              color: BRAND.text,
              margin: 0,
              letterSpacing: -2,
              lineHeight: 1,
              textAlign: 'center',
              textTransform: 'uppercase',
            }}
          >
            {trackTitle}
          </h1>
          <div
            style={{
              height: 1,
              width: 200,
              backgroundColor: BRAND.line,
            }}
          />
          <span
            style={{
              fontFamily: inter,
              fontSize: 32,
              fontWeight: 400,
              color: BRAND.text,
              letterSpacing: 8,
            }}
          >
            {artist}
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
