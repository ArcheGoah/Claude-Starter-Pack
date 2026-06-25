import React from 'react';
import { Composition, staticFile } from 'remotion';
import { IntroBumper } from './compositions/IntroBumper';
import { ReelTextOverlay } from './compositions/ReelTextOverlay';
import { Timelapse } from './compositions/Timelapse';
import { ProcessReel } from './compositions/ProcessReel';
import { MusicVisualizer } from './compositions/MusicVisualizer';

/**
 * Remotion Root — registriert alle Compositions fuer {DEIN_NAME} Studio.
 *
 * Default Format: 9:16 Reel (1080x1920 @ 30fps)
 * Brand: Dynamic Minimalism 2026 (dunkel #0a0a0a, Inter + Space Grotesk, no emojis)
 *
 * Usage:
 *   npx remotion studio                          # Browser Preview
 *   npx remotion render src/index.ts IntroBumper output.mp4
 *   .claude/skills/video-remotion/scripts/render.sh IntroBumper
 */

const REEL_FPS = 30;
const REEL_WIDTH = 1080;
const REEL_HEIGHT = 1920;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 1. IntroBumper — 3s Brand Signature */}
      <Composition
        id="IntroBumper"
        component={IntroBumper}
        durationInFrames={90}
        fps={REEL_FPS}
        width={REEL_WIDTH}
        height={REEL_HEIGHT}
        defaultProps={{
          tagline: 'MOTION. MURAL. CODE.',
        }}
      />

      {/* 2. ReelTextOverlay — Text Cards ueber Footage */}
      <Composition
        id="ReelTextOverlay"
        component={ReelTextOverlay}
        durationInFrames={450}
        fps={REEL_FPS}
        width={REEL_WIDTH}
        height={REEL_HEIGHT}
        defaultProps={{
          videoSrc: staticFile('video/studio.mp4'),
          cards: [
            { text: 'NEW MURAL', start: 0, end: 90 },
            { text: 'YOUR CITY', start: 120, end: 210 },
            { text: 'DROP SOON', start: 360, end: 450 },
          ],
        }}
      />

      {/* 3. Timelapse — Image Sequence */}
      <Composition
        id="Timelapse"
        component={Timelapse}
        durationInFrames={300}
        fps={REEL_FPS}
        width={REEL_WIDTH}
        height={REEL_HEIGHT}
        defaultProps={{
          images: [
            staticFile('images/ts_01.jpg'),
            staticFile('images/ts_02.jpg'),
            staticFile('images/ts_03.jpg'),
            staticFile('images/ts_04.jpg'),
            staticFile('images/ts_05.jpg'),
          ],
          framesPerImage: 60,
          kenBurns: true,
          title: 'STUDIO',
        }}
      />

      {/* 4. ProcessReel — Designer+AI Sabum-Style */}
      <Composition
        id="ProcessReel"
        component={ProcessReel}
        durationInFrames={600}
        fps={REEL_FPS}
        width={REEL_WIDTH}
        height={REEL_HEIGHT}
        defaultProps={{
          designerClip: staticFile('video/hand_drawing.mp4'),
          aiClip: staticFile('video/ai_generate.mp4'),
          caption: 'designers eye / ais hands',
          projectTitle: 'PROJECT BUILD',
        }}
      />

      {/* 5. MusicVisualizer — Audio-Reactive fuer Musik */}
      <Composition
        id="MusicVisualizer"
        component={MusicVisualizer}
        durationInFrames={900}
        fps={REEL_FPS}
        width={REEL_WIDTH}
        height={REEL_HEIGHT}
        defaultProps={{
          audioSrc: staticFile('audio/your-project_track.mp3'),
          trackTitle: 'SUNSET LOOP',
          artist: '{DEIN_PROJEKT}',
        }}
      />
    </>
  );
};
