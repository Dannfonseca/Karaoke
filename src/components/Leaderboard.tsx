import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { LeaderboardEntry } from '../types/karaoke';
import { Trophy, Medal, Crown, Music } from 'lucide-react';

export const Leaderboard: React.FC = () => {
  const { data: scores = [], isLoading } = useQuery<LeaderboardEntry[]>({
    queryKey: ['leaderboardScores'],
    queryFn: async () => {
      const res = await fetch('/api/scores');
      return res.json();
    },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-6 px-4">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Crown className="w-4 h-4" />
          Hall da Fama AutoKaraoke
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
          Placar de <span className="text-gradient-gold">Melhores Afinações</span>
        </h1>
        <p className="text-slate-400 text-sm">
          Pontuações registadas em tempo real com avaliação de pitch via IA
        </p>
      </div>

      <div className="glass-panel p-6 rounded-3xl space-y-4">
        {isLoading ? (
          <div className="p-8 text-center text-slate-400">Carregando pontuações...</div>
        ) : scores.length === 0 ? (
          <div className="p-8 text-center text-slate-400">Nenhuma pontuação registrada ainda. Seja o primeiro a cantar!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">Posição</th>
                  <th className="py-3 px-4">Cantor(a)</th>
                  <th className="py-3 px-4">Música</th>
                  <th className="py-3 px-4 text-center">Rank</th>
                  <th className="py-3 px-4 text-right">Pontuação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {scores.map((item, index) => (
                  <tr key={item.id} className="hover:bg-white/5 transition">
                    <td className="py-4 px-4 font-bold font-mono">
                      {index === 0 ? (
                        <span className="flex items-center gap-1 text-amber-400">
                          <Crown className="w-5 h-5 fill-current" /> #1
                        </span>
                      ) : index === 1 ? (
                        <span className="flex items-center gap-1 text-slate-300">
                          <Medal className="w-5 h-5 fill-current" /> #2
                        </span>
                      ) : index === 2 ? (
                        <span className="flex items-center gap-1 text-amber-600">
                          <Medal className="w-5 h-5 fill-current" /> #3
                        </span>
                      ) : (
                        <span className="text-slate-400">#{index + 1}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 font-semibold text-white">{item.playerName}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Music className="w-4 h-4 text-pink-400" />
                        <div>
                          <div className="text-sm font-medium text-white">{item.songTitle}</div>
                          <div className="text-xs text-slate-400">{item.artist}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="px-2.5 py-1 rounded-md bg-pink-500/20 text-pink-300 font-bold text-xs border border-pink-500/30">
                        {item.rank}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-mono font-bold text-lg text-cyan-300">
                      {item.score.toLocaleString()} pts
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
