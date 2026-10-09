import React, { useState, useEffect, useRef } from 'react';
import { Song, LivePitchSample, ScoreStats } from '../types/karaoke';
import { pitchEngineSingleton } from '../services/pitchEngine';
import { ScoringEngine } from '../services/scoringEngine';
import { PianoRoll } from './PianoRoll';
import { LyricsDisplay } from './LyricsDisplay';
import { LivePitchIndicator } from './LivePitchIndicator';
import { ScoreBoard } from './ScoreBoard';
import { Play, Pause, RotateCcw, Mic, MicOff, ArrowLeft, Trophy, Sparkles } from 'lucide-react';

interface KaraokePlayerProps {
  song: Song;
  onBackToSearch: () => void;
  onGoToLeaderboard: () => void;
}

export const KaraokePlayer: React.FC<KaraokePlayerProps> = ({
  song,
  onBackToSearch,
  onGoToLeaderboard,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scoringEngineRef = useRef<ScoringEngine>(new ScoringEngine());

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(song.duration || 120);
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [liveSample, setLiveSample] = useState<LivePitchSample | null>(null);
  const [scoreStats, setScoreStats] = useState<ScoreStats>(scoringEngineRef.current.getStats());
  const [isGameOver, setIsGameOver] = useState(false);

  // Reset engine on new song
  useEffect(() => {
    scoringEngineRef.current.reset(song.notes.length || 50);
    setScoreStats(scoringEngineRef.current.getStats());
    setIsGameOver(false);
  }, [song]);

  // Microphone toggle
  const toggleMicrophone = async () => {
    if (isMicEnabled) {
      pitchEngineSingleton.stopListening();
      setIsMicEnabled(false);
    } else {
      const ok = await pitchEngineSingleton.startListening();
      if (ok) {
        setIsMicEnabled(true);
      }
    }
  };

  // Subscribe to live mic pitch updates
  useEffect(() => {
    const unsubscribe = pitchEngineSingleton.subscribe((sample) => {
      setLiveSample(sample);

      if (isPlaying && sample) {
        const audio = audioRef.current;
        const curTime = audio ? audio.currentTime : currentTime;

        const activeNote = song.notes.find(
          (n) => curTime >= n.startTime && curTime <= n.startTime + n.duration
        );

        scoringEngineRef.current.evaluateFrame(sample, activeNote || null);
        setScoreStats(scoringEngineRef.current.getStats());
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isPlaying, currentTime, song.notes]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setIsGameOver(true);
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
      if (!isMicEnabled) {
        toggleMicrophone();
      }
    }
  };

  const handleRestart = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
    }
    scoringEngineRef.current.reset(song.notes.length);
    setScoreStats(scoringEngineRef.current.getStats());
    setIsGameOver(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-8 px-6">
      {/* Hidden HTML5 Audio Element */}
      <audio
        ref={audioRef}
        src={song.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
        onEnded={handleEnded}
      />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <button onClick={onBackToSearch} className="btn-glass text-xs py-2.5 px-4 self-start sm:self-auto">
          <ArrowLeft className="w-4 h-4" />
          Voltar às Músicas
        </button>

        <div className="text-center">
          <h1 className="text-3xl font-black text-white">{song.title}</h1>
          <p className="text-sm font-medium text-slate-400 mt-0.5">{song.artist}</p>
        </div>

        {/* Real-time Score HUD */}
        <div className="flex items-center gap-3 bg-slate-900/80 px-5 py-2.5 rounded-2xl border border-white/10 shadow-lg">
          <Trophy className="w-5 h-5 text-amber-400" />
          <div>
            <div className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-bold">
              Pontuação
            </div>
            <div className="text-2xl font-black text-pink-400 font-mono leading-none">
              {scoreStats.score.toLocaleString()}
            </div>
          </div>
          <span className="px-3 py-1 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black text-sm shadow-md">
            {scoreStats.rank}
          </span>
        </div>
      </div>

      {/* UltraStar Pitch Grid Canvas */}
      <PianoRoll notes={song.notes} currentTime={currentTime} liveSample={liveSample} />

      {/* Synced Karaoke Lyrics Display */}
      <LyricsDisplay lyrics={song.lyrics} currentTime={currentTime} />

      {/* Real-time Live Pitch Meter Gauge */}
      <LivePitchIndicator sample={liveSample} combo={scoreStats.currentCombo} />

      {/* Player Control Bar & Scrubber */}
      <div className="glass-panel p-5 flex flex-col md:flex-row items-center justify-between gap-6 rounded-3xl">
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlayPause}
            className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-xl shadow-pink-500/40 hover:scale-105 transition duration-300"
          >
            {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 fill-current ml-0.5" />}
          </button>

          <button onClick={handleRestart} className="btn-glass p-3.5 rounded-2xl">
            <RotateCcw className="w-5 h-5 text-slate-300" />
          </button>

          <button
            onClick={toggleMicrophone}
            className={`p-3.5 rounded-2xl border transition duration-300 flex items-center gap-2 ${
              isMicEnabled
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-lg shadow-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}
          >
            {isMicEnabled ? <Mic className="w-5 h-5 animate-pulse" /> : <MicOff className="w-5 h-5" />}
            <span className="text-xs font-bold hidden sm:inline">
              {isMicEnabled ? 'Mic Ligado' : 'Ligar Mic'}
            </span>
          </button>
        </div>

        {/* Audio Scrubber Timeline */}
        <div className="flex-1 w-full flex items-center gap-4">
          <span className="text-xs font-mono font-bold text-slate-400">
            {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={(e) => {
              const val = Number(e.target.value);
              setCurrentTime(val);
              if (audioRef.current) audioRef.current.currentTime = val;
            }}
            className="w-full h-2.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-pink-500 border border-white/10"
          />
          <span className="text-xs font-mono font-bold text-slate-400">
            {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* GameOver / ScoreBoard Popup */}
      {isGameOver && (
        <ScoreBoard
          stats={scoreStats}
          song={song}
          onRestart={handleRestart}
          onGoToLeaderboard={onGoToLeaderboard}
        />
      )}
    </div>
  );
};
