import React from 'react';
import { Sparkles, Play, Activity, Cpu } from 'lucide-react';
import { Song } from '../types/karaoke';

interface TopHeaderProps {
  title: string;
  subtitle: string;
  onQuickStartDemo?: (song: Song) => void;
  demoSong?: Song;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  title,
  subtitle,
  onQuickStartDemo,
  demoSong,
}) => {
  return (
    <header className="floating-card p-6 mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          AutoKaraoke Studio Platform
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">{title}</h1>
        <p className="text-sm text-slate-400 font-medium">{subtitle}</p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        {/* System Badges */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-xs font-bold text-slate-300">
            <Activity className="w-4 h-4 text-cyan-400" />
            Pitchy YIN Engine
          </div>
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/80 border border-white/10 text-xs font-bold text-slate-300">
            <Cpu className="w-4 h-4 text-purple-400" />
            Bun + Elysia API
          </div>
        </div>

        {/* Quick Start CTA */}
        {onQuickStartDemo && demoSong && (
          <button
            onClick={() => onQuickStartDemo(demoSong)}
            className="btn-emerald py-3 px-6 text-sm font-extrabold shadow-lg shadow-emerald-500/20"
          >
            <Play className="w-4 h-4 fill-current ml-0.5" />
            Cantar "{demoSong.title}" (Teste Grátis)
          </button>
        )}
      </div>
    </header>
  );
};
