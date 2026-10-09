import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Song } from '../types/karaoke';
import { TopHeader } from './TopHeader';
import { Search, Play, Youtube, Music, Loader2, ArrowRight, Disc, Flame, Sparkles } from 'lucide-react';

interface SongSearchProps {
  onSelectSong: (song: Song) => void;
}

export const SongSearch: React.FC<SongSearchProps> = ({ onSelectSong }) => {
  const [activeTab, setActiveTab] = useState<'search' | 'youtube'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [customArtist, setCustomArtist] = useState('');
  const [customTitle, setCustomTitle] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch demo songs from Elysia backend
  const { data: demoSongs = [] } = useQuery<Song[]>({
    queryKey: ['demoSongs'],
    queryFn: async () => {
      const res = await fetch('/api/songs/demo');
      return res.json();
    },
  });

  // Fetch LrcLib API songs via Elysia backend search
  const { data: searchResults = [], isLoading: isSearching } = useQuery({
    queryKey: ['searchSongs', debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery.trim()) return [];
      const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
      return res.json();
    },
    enabled: debouncedQuery.trim().length > 1,
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDebouncedQuery(searchQuery);
  };

  const handleProcessTrack = async (title: string, artist: string, syncedLyrics?: string) => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          artist,
          audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=cinematic-melody-112398.mp3',
          syncedLyrics,
        }),
      });
      const songData: Song = await res.json();
      onSelectSong(songData);
    } catch (err) {
      console.error('Error processing track:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      {/* Top Header */}
      <TopHeader
        title="Acervo & Biblioteca de Músicas"
        subtitle="Selecione uma faixa recomendada, busque no acervo global LrcLib ou processe um link do YouTube."
        onQuickStartDemo={onSelectSong}
        demoSong={demoSongs[0]}
      />

      {/* Main Search & Ingestion Card Container */}
      <div className="floating-card p-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-bold transition ${
              activeTab === 'search'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Search className="w-4 h-4 text-emerald-400" />
            Buscar no Acervo (LrcLib API)
          </button>
          <button
            onClick={() => setActiveTab('youtube')}
            className={`flex items-center gap-2.5 px-5 py-3 rounded-xl text-sm font-bold transition ${
              activeTab === 'youtube'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Youtube className="w-4 h-4 text-rose-400" />
            Link do YouTube
          </button>
        </div>

        {/* Tab 1: Search Form */}
        {activeTab === 'search' && (
          <div className="space-y-4">
            <form onSubmit={handleSearchSubmit} className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Digite a música ou artista (ex: Evidências, Queen, The Weeknd)..."
                  className="input-clean w-full pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-500"
                />
              </div>
              <button type="submit" className="btn-emerald px-8 text-sm font-extrabold">
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Buscar'}
              </button>
            </form>

            {/* Results Grid */}
            {searchResults.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Resultados Encontrados ({searchResults.length})
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                  {searchResults.map((item: any) => (
                    <div
                      key={item.id}
                      onClick={() => handleProcessTrack(item.name, item.artistName, item.syncedLyrics)}
                      className="flex items-center justify-between p-4 bg-slate-950/60 hover:bg-white/10 border border-white/10 rounded-2xl cursor-pointer transition group"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-sm text-white group-hover:text-emerald-400 transition">
                          {item.name}
                        </div>
                        <div className="text-xs text-slate-400">
                          {item.artistName} {item.albumName ? `• ${item.albumName}` : ''}
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 group-hover:bg-emerald-500 group-hover:text-slate-950 transition shadow">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: YouTube Ingestion Form */}
        {activeTab === 'youtube' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Título da Música"
                className="input-clean p-3.5 text-sm"
              />
              <input
                type="text"
                value={customArtist}
                onChange={(e) => setCustomArtist(e.target.value)}
                placeholder="Nome do Artista"
                className="input-clean p-3.5 text-sm"
              />
              <input
                type="text"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="URL do YouTube (ex: https://youtube.com/...)"
                className="input-clean p-3.5 text-sm"
              />
            </div>
            <button
              onClick={() => handleProcessTrack(customTitle || 'Música Personalizada', customArtist || 'Artista')}
              disabled={isProcessing || (!customTitle && !youtubeUrl)}
              className="btn-emerald w-full justify-center py-3.5 text-sm font-extrabold disabled:opacity-50"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processando Stems e Sincronizando Áudio...
                </div>
              ) : (
                <>
                  Processar e Iniciar Karaoke <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* High Quality Demo Songs Grid */}
      <div className="space-y-5 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-white flex items-center gap-2.5">
            <Flame className="w-5 h-5 text-amber-400 fill-current" />
            Músicas Recomendadas
          </h2>
          <span className="text-xs text-slate-400 font-semibold">Faixas preparadas para teste de alta fidelidade</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {demoSongs.map((song) => (
            <div
              key={song.id}
              onClick={() => onSelectSong(song)}
              className="floating-card p-5 rounded-2xl cursor-pointer group hover:-translate-y-1 hover:border-emerald-500/50 transition duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="relative h-48 rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-[11px] font-mono text-emerald-400 font-extrabold border border-white/10">
                      STUDIO READY
                    </span>
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-extrabold text-lg text-white group-hover:text-emerald-300 transition">
                    {song.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5">{song.artist}</p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span className="text-emerald-400 font-bold">✓ LRC Sync</span>
                <span className="text-cyan-400 font-bold">✓ Pitch Map</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
