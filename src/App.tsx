import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Song } from './types/karaoke';
import { Sidebar } from './components/Sidebar';
import { SongSearch } from './components/SongSearch';
import { KaraokePlayer } from './components/KaraokePlayer';
import { Leaderboard } from './components/Leaderboard';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'search' | 'player' | 'leaderboard'>('search');
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);

  // Fetch demo songs for sidebar & search
  const { data: demoSongs = [] } = useQuery<Song[]>({
    queryKey: ['demoSongs'],
    queryFn: async () => {
      const res = await fetch('/api/songs/demo');
      return res.json();
    },
  });

  const handleSelectSong = (song: Song) => {
    setSelectedSong(song);
    setCurrentTab('player');
  };

  return (
    <div className="min-h-screen flex bg-[#0b0e17] text-slate-100 selection:bg-emerald-500 selection:text-black">
      {/* Left Navigation Sidebar (Spotify Style) */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        activeSong={selectedSong}
        isMicActive={currentTab === 'player'}
        onSelectSong={handleSelectSong}
        demoSongs={demoSongs}
      />

      {/* Main Right Content Panel */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {currentTab === 'search' && <SongSearch onSelectSong={handleSelectSong} />}

        {currentTab === 'player' && selectedSong && (
          <KaraokePlayer
            song={selectedSong}
            onBackToSearch={() => setCurrentTab('search')}
            onGoToLeaderboard={() => setCurrentTab('leaderboard')}
          />
        )}

        {currentTab === 'player' && !selectedSong && (
          <div className="max-w-md mx-auto py-24 text-center space-y-4">
            <h2 className="text-2xl font-bold text-white">Nenhuma música selecionada</h2>
            <p className="text-sm text-slate-400">
              Escolha uma música no acervo para iniciar a partida de Karaoke.
            </p>
            <button onClick={() => setCurrentTab('search')} className="btn-emerald py-3 px-6 text-sm">
              Ir para Biblioteca de Músicas
            </button>
          </div>
        )}

        {currentTab === 'leaderboard' && <Leaderboard />}
      </main>
    </div>
  );
};

export default App;
