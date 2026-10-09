import React from 'react';
import { Mic, Music, Trophy, Search, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentTab: 'search' | 'player' | 'leaderboard';
  setCurrentTab: (tab: 'search' | 'player' | 'leaderboard') => void;
  activeSongTitle?: string;
  isMicActive: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  activeSongTitle,
  isMicActive,
}) => {
  return (
    <header className="sticky top-0 z-50 px-6 py-4 border-b border-[var(--border-glass)] bg-[#07090e]/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => setCurrentTab('search')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-pink-500/25 group-hover:scale-105 transition-transform duration-300">
            <Mic className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 font-black text-2xl tracking-tight text-white leading-none">
              Auto<span className="text-gradient">Karaoke</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40 font-mono font-bold tracking-widest">
                AI PRO
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] font-medium mt-1">
              Bun • Elysia • Pitchy YIN Engine
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 bg-slate-900/60 p-1.5 rounded-2xl border border-white/10 shadow-inner">
          <button
            onClick={() => setCurrentTab('search')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
              currentTab === 'search'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Search className="w-4 h-4" />
            Músicas & Acervo
          </button>

          <button
            onClick={() => setCurrentTab('player')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
              currentTab === 'player'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Music className="w-4 h-4" />
            {activeSongTitle ? activeSongTitle : 'Karaoke Player'}
          </button>

          <button
            onClick={() => setCurrentTab('leaderboard')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
              currentTab === 'leaderboard'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/25'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Trophy className="w-4 h-4" />
            Placar (Leaderboard)
          </button>
        </nav>

        {/* Status Indicators */}
        <div className="hidden md:flex items-center gap-3">
          <div
            className={`flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-bold border transition-all duration-300 ${
              isMicActive
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.35)]'
                : 'bg-slate-900/60 text-slate-400 border-slate-800'
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isMicActive ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'
              }`}
            />
            {isMicActive ? 'Microfone Ativo' : 'Mic Inativo'}
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-purple-300 bg-purple-500/10 border border-purple-500/30 px-4 py-2 rounded-full shadow-sm">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Pitchy YIN Active
          </div>
        </div>
      </div>
    </header>
  );
};
