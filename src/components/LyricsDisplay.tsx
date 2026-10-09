import React from 'react';
import { LrcLine } from '../types/karaoke';

interface LyricsDisplayProps {
  lyrics: LrcLine[];
  currentTime: number;
}

export const LyricsDisplay: React.FC<LyricsDisplayProps> = ({ lyrics, currentTime }) => {
  if (!lyrics || lyrics.length === 0) {
    return (
      <div className="glass-panel p-8 text-center text-slate-400">
        Nenhuma letra sincronizada disponível para esta música.
      </div>
    );
  }

  // Find active line index
  let activeIndex = -1;
  for (let i = 0; i < lyrics.length; i++) {
    const line = lyrics[i];
    const nextLine = lyrics[i + 1];
    if (currentTime >= line.time) {
      if (!nextLine || currentTime < nextLine.time) {
        activeIndex = i;
        break;
      }
    }
  }

  const prevLine = activeIndex > 0 ? lyrics[activeIndex - 1] : null;
  const activeLine = activeIndex >= 0 ? lyrics[activeIndex] : lyrics[0];
  const nextLine = activeIndex >= 0 && activeIndex < lyrics.length - 1 ? lyrics[activeIndex + 1] : null;
  const upcomingLine = activeIndex >= 0 && activeIndex < lyrics.length - 2 ? lyrics[activeIndex + 2] : null;

  return (
    <div className="glass-panel p-6 md:p-8 flex flex-col items-center justify-center gap-4 min-h-[180px] rounded-2xl relative overflow-hidden">
      {/* Glow background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-cyan-500/10 pointer-events-none blur-xl" />

      {/* Previous Line */}
      {prevLine && (
        <div className="lyric-line past text-sm md:text-base opacity-40 transition-all duration-300">
          {prevLine.text}
        </div>
      )}

      {/* Active Line with Animated Karaoke Fill */}
      {activeLine && (
        <div className="relative my-2 text-center">
          <div className="lyric-line active text-2xl md:text-4xl font-extrabold tracking-wide text-white drop-shadow-[0_0_20px_rgba(236,72,153,0.6)]">
            {activeLine.text}
          </div>
        </div>
      )}

      {/* Next Line Preview */}
      {nextLine && (
        <div className="lyric-line text-lg md:text-xl text-cyan-300/70 font-medium transition-all duration-300">
          {nextLine.text}
        </div>
      )}

      {/* Upcoming Second Line Preview */}
      {upcomingLine && (
        <div className="lyric-line past text-xs md:text-sm text-slate-500 transition-all duration-300">
          {upcomingLine.text}
        </div>
      )}
    </div>
  );
};
