import React from 'react';
import { Mic, Music, Trophy, Search, Sparkles, Radio, Play, AudioWaveform } from 'lucide-react';
import { Song } from '../types/karaoke';

interface SidebarProps {
  currentTab: 'search' | 'player' | 'leaderboard';
  setCurrentTab: (tab: 'search' | 'player' | 'leaderboard') => void;
  activeSong: Song | null;
  isMicActive: boolean;
  onSelectSong: (song: Song) => void;
  demoSongs: Song[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  activeSong,
  isMicActive,
  onSelectSong,
  demoSongs,
}) => {
  return (
    <aside className="w-72 p-4 flex flex-col justify-between shrink-0 select-none h-screen sticky top-0 bg-[#080a12] border-r border-white/10 z-40 overflow-y-auto">
      <div className="space-y-4">
        {/* BLOCK 1: Brand & Logo Floating Card */}
        <div
          onClick={() => setCurrentTab('search')}
          className="floating-card p-4 cursor-pointer group hover:border-emerald-500/40 transition"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-105 transition">
              <Mic className="w-6 h-6 text-slate-950 fill-current" />
            </div>
            <div>
              <div className="font-extrabold text-xl tracking-tight text-white flex items-center gap-2">
                AutoKaraoke
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-mono font-extrabold border border-emerald-500/30">
                  PRO
                </span>
              </div>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">Studio AI Edition</p>
            </div>
          </div>
        </div>

        {/* BLOCK 2: Separate Navigation Menu Floating Card */}
        <div className="floating-card p-3 space-y-1.5">
          <div className="px-3 pt-1 pb-2 text-[11px] font-black uppercase tracking-widest text-slate-400">
            Menu Principal
          </div>

          <button
            onClick={() => setCurrentTab('search')}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold transition ${
              currentTab === 'search'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Search className="w-4 h-4 text-emerald-400" />
            Músicas & Acervo
          </button>

          <button
            onClick={() => setCurrentTab('player')}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold transition ${
              currentTab === 'player'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Music className="w-4 h-4 text-cyan-400" />
            Karaoke Player
          </button>

          <button
            onClick={() => setCurrentTab('leaderboard')}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-bold transition ${
              currentTab === 'leaderboard'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            Placar (Leaderboard)
          </button>
        </div>

        {/* BLOCK 3: Separate Demo Songs Floating Card */}
        <div className="floating-card p-4 space-y-3">
          <div className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center justify-between px-1">
            <span>Demos Rápidas</span>
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          </div>

          <div className="space-y-2">
            {demoSongs.map((song) => (
              <div
                key={song.id}
                onClick={() => onSelectSong(song)}
                className={`p-2.5 rounded-xl transition cursor-pointer flex items-center gap-3 group ${
                  activeSong?.id === song.id
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-900/40 hover:bg-white/10 border border-white/5 text-slate-300 hover:text-white'
                }`}
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 relative shadow">
                  <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition" />
                  <Play className="w-4 h-4 text-white absolute inset-0 m-auto opacity-0 group-hover:opacity-100 transition fill-current ml-0.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-sm truncate text-white leading-tight">
                    {song.title}
                  </div>
                  <div className="text-xs text-slate-400 truncate mt-0.5">{song.artist}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BLOCK 4: Live Audio & Mic Status Floating Card */}
      <div className="floating-card p-4 mt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Live Audio Wave Visualizer Bars */}
            <div className="flex items-center gap-1 h-5">
              <span className={`w-1 rounded-full ${isMicActive ? 'bg-emerald-400 wave-bar-1' : 'bg-slate-600 h-1'}`} />
              <span className={`w-1 rounded-full ${isMicActive ? 'bg-emerald-400 wave-bar-2' : 'bg-slate-600 h-1'}`} />
              <span className={`w-1 rounded-full ${isMicActive ? 'bg-emerald-400 wave-bar-3' : 'bg-slate-600 h-1'}`} />
              <span className={`w-1 rounded-full ${isMicActive ? 'bg-emerald-400 wave-bar-4' : 'bg-slate-600 h-1'}`} />
            </div>

            <div>
              <div className={`text-xs font-bold ${isMicActive ? 'text-emerald-400' : 'text-slate-400'}`}>
                {isMicActive ? 'Microfone Ativo' : 'Mic Inativo'}
              </div>
              <div className="text-[10px] text-slate-500 font-mono">Pitchy YIN Engine</div>
            </div>
          </div>

          <Sparkles className="w-4 h-4 text-purple-400" />
        </div>
      </div>
    </aside>
  );
};
