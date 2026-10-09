import React from 'react';
import { LivePitchSample } from '../types/karaoke';
import { Activity, Flame, Sparkles } from 'lucide-react';

interface LivePitchIndicatorProps {
  sample: LivePitchSample | null;
  scoreIncrement?: number;
  combo?: number;
}

export const LivePitchIndicator: React.FC<LivePitchIndicatorProps> = ({
  sample,
  combo = 0,
}) => {
  const cents = sample ? sample.centsOffset : 0;
  const isGoodHit = sample && sample.clarity > 0.75 && Math.abs(cents) <= 25;

  let feedbackText = 'Aguardando Voz...';
  let feedbackColor = 'text-slate-400';

  if (sample && sample.clarity > 0.75) {
    if (Math.abs(cents) <= 20) {
      feedbackText = 'PERFEITO! 🔥';
      feedbackColor = 'text-emerald-400 font-black animate-pulse text-base tracking-wide';
    } else if (cents > 20) {
      feedbackText = 'UM POUCO AGUDO ⬆️';
      feedbackColor = 'text-amber-400 font-bold';
    } else {
      feedbackText = 'UM POUCO GRAVE ⬇️';
      feedbackColor = 'text-cyan-400 font-bold';
    }
  }

  const clampedCents = Math.max(-50, Math.min(50, cents));
  const meterPercent = ((clampedCents + 50) / 100) * 100;

  return (
    <div className="glass-panel p-5 flex flex-col md:flex-row items-center justify-between gap-6 rounded-3xl border border-white/10 shadow-2xl">
      {/* Current Live Note Badge & Frequency */}
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500/30 via-purple-600/40 to-indigo-600/30 border border-pink-500/40 flex flex-col items-center justify-center shadow-lg shadow-pink-500/20">
          <span className="text-3xl font-black text-white font-mono tracking-tight leading-none">
            {sample ? sample.noteName : '--'}
          </span>
          <span className="text-[11px] text-pink-300 font-mono font-bold mt-1">
            {sample ? `${sample.frequency} Hz` : '0 Hz'}
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-pink-400" />
            <span className="text-xs uppercase tracking-widest text-slate-400 font-bold">
              Afinação por IA ao Vivo
            </span>
          </div>
          <p className={`text-base md:text-lg ${feedbackColor}`}>{feedbackText}</p>
        </div>
      </div>

      {/* Cents Tuning Meter (-50c to +50c) */}
      <div className="w-full md:w-80 flex flex-col gap-2">
        <div className="flex justify-between text-xs font-mono text-slate-400 font-semibold">
          <span>b -50c</span>
          <span className="text-emerald-400 font-extrabold flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> 0c (Ideal)
          </span>
          <span># +50c</span>
        </div>

        <div className="relative w-full h-4 bg-slate-950 rounded-full border border-white/15 overflow-hidden shadow-inner">
          {/* Green Target Zone */}
          <div className="absolute left-[38%] right-[38%] top-0 bottom-0 bg-emerald-500/30 rounded-sm border-x border-emerald-400/40" />

          {/* Glowing Pointer */}
          {sample && sample.clarity > 0.75 && (
            <div
              className={`absolute top-0 bottom-0 w-2.5 -ml-1 rounded-full transition-all duration-75 shadow-lg ${
                isGoodHit
                  ? 'bg-cyan-400 shadow-cyan-400/90'
                  : 'bg-rose-500 shadow-rose-500/90'
              }`}
              style={{ left: `${meterPercent}%` }}
            />
          )}
        </div>
      </div>

      {/* Combo HUD */}
      <div className="flex items-center gap-3">
        {combo > 2 ? (
          <div className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-purple-500/20 border border-amber-500/50 shadow-lg shadow-amber-500/20 animate-bounce flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400 fill-current" />
            <span className="text-sm font-black text-amber-300 uppercase tracking-wider">
              COMBO x{combo}!
            </span>
          </div>
        ) : (
          <div className="px-4 py-2 rounded-2xl bg-slate-900/60 border border-white/10 text-xs text-slate-400 font-mono">
            Singing Target Ready
          </div>
        )}
      </div>
    </div>
  );
};
