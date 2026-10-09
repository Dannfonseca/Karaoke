import React, { useEffect, useRef } from 'react';
import { NoteSpan, LivePitchSample } from '../types/karaoke';
import { normalizeOctave, midiToNoteName } from '../utils/audioUtils';

interface PianoRollProps {
  notes: NoteSpan[];
  currentTime: number;
  liveSample: LivePitchSample | null;
  height?: number;
}

export const PianoRoll: React.FC<PianoRollProps> = ({
  notes,
  currentTime,
  liveSample,
  height = 260,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const userHistoryRef = useRef<{ time: number; midi: number; hit: boolean }[]>([]);

  // Window settings
  const timeWindow = 6; // Visible timeline seconds
  const minMidi = 48; // C3
  const maxMidi = 84; // C6
  const totalMidiRange = maxMidi - minMidi;

  useEffect(() => {
    // Record user live singing history
    if (liveSample && liveSample.clarity > 0.75) {
      const activeNote = notes.find(
        (n) => currentTime >= n.startTime && currentTime <= n.startTime + n.duration
      );
      let targetMidi = activeNote ? activeNote.pitch : liveSample.midiNote;
      const normalizedMidi = normalizeOctave(liveSample.midiNote, targetMidi);
      const isHit = activeNote ? Math.abs(normalizedMidi - activeNote.pitch) <= 1.5 : false;

      userHistoryRef.current.push({
        time: currentTime,
        midi: normalizedMidi,
        hit: isHit,
      });

      if (userHistoryRef.current.length > 800) {
        userHistoryRef.current.shift();
      }
    }
  }, [currentTime, liveSample, notes]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high-DPI displays cleanly
    const dpr = window.devicePixelRatio || 1;
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    if (canvas.width !== displayWidth * dpr || canvas.height !== displayHeight * dpr) {
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
    }

    ctx.scale(dpr, dpr);

    const width = displayWidth;
    const canvasHeight = displayHeight;

    // Background Dark Canvas
    ctx.fillStyle = '#080b14';
    ctx.fillRect(0, 0, width, canvasHeight);

    // Subtle background horizontal pitch lines
    ctx.lineWidth = 1;
    for (let m = minMidi; m <= maxMidi; m += 2) {
      const y = canvasHeight - ((m - minMidi) / totalMidiRange) * canvasHeight;
      ctx.strokeStyle = m % 12 === 0 ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.04)';
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();

      if (m % 12 === 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.font = '600 11px JetBrains Mono';
        ctx.fillText(midiToNoteName(m), 10, y - 4);
      }
    }

    // Vertical Center Timeline (Current Playback Position)
    const timeLineX = width * 0.38;
    ctx.strokeStyle = 'rgba(236, 72, 153, 0.7)';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(timeLineX, 0);
    ctx.lineTo(timeLineX, canvasHeight);
    ctx.stroke();
    ctx.setLineDash([]);

    const timeToX = (t: number) => {
      const timeDiff = t - currentTime;
      return timeLineX + (timeDiff / timeWindow) * width;
    };

    const midiToY = (midi: number) => {
      const clamped = Math.max(minMidi, Math.min(maxMidi, midi));
      return canvasHeight - ((clamped - minMidi) / totalMidiRange) * canvasHeight;
    };

    // Draw Target Note Blocks (UltraStar Deluxe style)
    const visibleNotes = notes.filter(
      (n) => n.startTime + n.duration >= currentTime - 4 && n.startTime <= currentTime + 6
    );

    visibleNotes.forEach((note) => {
      const x = timeToX(note.startTime);
      const w = Math.max(14, (note.duration / timeWindow) * width);
      const y = midiToY(note.pitch);
      const h = Math.max(12, canvasHeight / totalMidiRange);

      const isCurrent = currentTime >= note.startTime && currentTime <= note.startTime + note.duration;

      // Note Gradient
      const gradient = ctx.createLinearGradient(x, y, x, y + h);
      if (note.isGolden) {
        gradient.addColorStop(0, '#fef08a');
        gradient.addColorStop(1, '#f59e0b');
      } else if (isCurrent) {
        gradient.addColorStop(0, '#ec4899');
        gradient.addColorStop(1, '#a855f7');
      } else {
        gradient.addColorStop(0, '#6366f1');
        gradient.addColorStop(1, '#3730a3');
      }

      ctx.fillStyle = gradient;
      ctx.shadowColor = note.isGolden ? '#f59e0b' : isCurrent ? '#ec4899' : 'transparent';
      ctx.shadowBlur = isCurrent || note.isGolden ? 16 : 0;

      ctx.beginPath();
      ctx.roundRect(x, y - h / 2, w, h, 6);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = note.isGolden ? '#ffffff' : isCurrent ? '#f472b6' : 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = isCurrent ? 2 : 1;
      ctx.stroke();

      if (w > 18) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(note.lyric, x + w / 2, y + 4);
      }
    });

    // Draw Live User Pitch Trail
    const recentHistory = userHistoryRef.current.filter(
      (h) => h.time >= currentTime - 4 && h.time <= currentTime + 2
    );

    if (recentHistory.length > 1) {
      ctx.lineWidth = 4;
      ctx.shadowBlur = 12;

      for (let i = 1; i < recentHistory.length; i++) {
        const p1 = recentHistory[i - 1];
        const p2 = recentHistory[i];

        const x1 = timeToX(p1.time);
        const y1 = midiToY(p1.midi);
        const x2 = timeToX(p2.time);
        const y2 = midiToY(p2.midi);

        ctx.strokeStyle = p2.hit ? '#06b6d4' : '#f43f5e';
        ctx.shadowColor = p2.hit ? '#06b6d4' : '#f43f5e';

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
    }

    // Live Mic Cursor Node
    if (liveSample && liveSample.clarity > 0.75) {
      const activeNote = notes.find(
        (n) => currentTime >= n.startTime && currentTime <= n.startTime + n.duration
      );
      let targetMidi = activeNote ? activeNote.pitch : liveSample.midiNote;
      const normalizedMidi = normalizeOctave(liveSample.midiNote, targetMidi);
      const curY = midiToY(normalizedMidi);

      ctx.fillStyle = '#06b6d4';
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(timeLineX, curY, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px JetBrains Mono';
      ctx.textAlign = 'left';
      ctx.fillText(`${liveSample.noteName}`, timeLineX + 14, curY + 4);
    }
  }, [notes, currentTime, liveSample]);

  return (
    <div className="w-full relative glass-panel-glow overflow-hidden p-3 rounded-3xl">
      <div className="absolute top-4 left-5 z-10 flex items-center gap-2 text-xs font-bold tracking-wider text-white uppercase bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-md">
        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
        Pitch Grid (UltraStar Deluxe Canvas)
      </div>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: `${height}px` }}
        className="w-full block rounded-2xl cursor-crosshair"
      />
    </div>
  );
};
