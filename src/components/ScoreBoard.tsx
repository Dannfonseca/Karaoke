import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { ScoreStats, Song } from '../types/karaoke';
import { Trophy, Award, Flame, RefreshCw, Send, Check } from 'lucide-react';

interface ScoreBoardProps {
  stats: ScoreStats;
  song: Song;
  onRestart: () => void;
  onGoToLeaderboard: () => void;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  stats,
  song,
  onRestart,
  onGoToLeaderboard,
}) => {
  const [playerName, setPlayerName] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Trigger confetti on S or S+ ranks!
    if (stats.rank === 'S+' || stats.rank === 'S') {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  }, [stats.rank]);

  const handleSaveScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || isSaved) return;

    setIsSubmitting(true);
    try {
      await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          songId: song.id,
          songTitle: song.title,
          artist: song.artist,
          playerName: playerName.trim(),
          score: stats.score,
          accuracy: stats.accuracyPercentage,
          rank: stats.rank,
        }),
      });
      setIsSaved(true);
      setTimeout(() => onGoToLeaderboard(), 1200);
    } catch (err) {
      console.error('Error saving score:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Rank badge colors
  const rankColors: Record<string, string> = {
    'S+': 'from-amber-300 via-yellow-400 to-amber-600 text-slate-950 border-amber-300 shadow-[0_0_40px_rgba(245,158,11,0.6)]',
    S: 'from-pink-500 via-purple-500 to-indigo-600 text-white border-pink-400 shadow-[0_0_35px_rgba(236,72,153,0.5)]',
    A: 'from-cyan-400 to-blue-600 text-white border-cyan-300 shadow-[0_0_30px_rgba(6,182,212,0.4)]',
    B: 'from-emerald-400 to-teal-600 text-white border-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.3)]',
    C: 'from-slate-400 to-slate-600 text-white border-slate-400',
    F: 'from-rose-600 to-red-900 text-white border-rose-500',
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-panel p-8 max-w-lg w-full rounded-3xl space-y-6 text-center border border-pink-500/30 animate-float">
        {/* Header */}
        <div className="space-y-1">
          <span className="text-xs uppercase font-mono tracking-widest text-slate-400">
            Fim de Partida • Desempenho
          </span>
          <h2 className="text-2xl font-bold text-white">{song.title}</h2>
          <p className="text-sm text-slate-400">{song.artist}</p>
        </div>

        {/* Big Rank Badge */}
        <div className="flex justify-center">
          <div
            className={`w-28 h-28 rounded-3xl bg-gradient-to-br ${
              rankColors[stats.rank] || rankColors['C']
            } border-2 flex items-center justify-center font-black text-5xl tracking-tighter`}
          >
            {stats.rank}
          </div>
        </div>

        {/* Score Number */}
        <div>
          <div className="text-5xl font-black text-white font-mono tracking-tight">
            {stats.score.toLocaleString()} <span className="text-sm font-normal text-slate-400">/ 10.000 pts</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 p-4 bg-slate-900/60 rounded-2xl border border-white/10 text-center">
          <div>
            <div className="flex items-center justify-center gap-1 text-cyan-400 mb-1">
              <Award className="w-4 h-4" />
            </div>
            <div className="text-lg font-bold text-white font-mono">{stats.accuracyPercentage}%</div>
            <div className="text-[11px] text-slate-400">Precisão</div>
          </div>

          <div>
            <div className="flex items-center justify-center gap-1 text-amber-400 mb-1">
              <Flame className="w-4 h-4" />
            </div>
            <div className="text-lg font-bold text-white font-mono">{stats.maxCombo}x</div>
            <div className="text-[11px] text-slate-400">Maior Combo</div>
          </div>

          <div>
            <div className="flex items-center justify-center gap-1 text-yellow-400 mb-1">
              <Trophy className="w-4 h-4" />
            </div>
            <div className="text-lg font-bold text-white font-mono">{stats.goldenNotesHit}</div>
            <div className="text-[11px] text-slate-400">Notas Douradas</div>
          </div>
        </div>

        {/* Save to Leaderboard Form */}
        <form onSubmit={handleSaveScore} className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Digite seu nome para o Placar..."
              disabled={isSaved}
              className="flex-1 px-4 py-2.5 bg-slate-900/80 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-pink-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!playerName.trim() || isSaved || isSubmitting}
              className="btn-neon py-2.5 px-4 text-sm disabled:opacity-50"
            >
              {isSaved ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
              {isSaved ? 'Salvo!' : 'Salvar'}
            </button>
          </div>
        </form>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button onClick={onRestart} className="btn-glass flex-1 justify-center">
            <RefreshCw className="w-4 h-4" />
            Cantar Novamente
          </button>
          <button onClick={onGoToLeaderboard} className="btn-neon flex-1 justify-center">
            <Trophy className="w-4 h-4" />
            Ver Placar
          </button>
        </div>
      </div>
    </div>
  );
};
