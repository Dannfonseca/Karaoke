export interface LrcLine {
  id: string;
  time: number; // Start time in seconds
  duration: number; // Line duration in seconds
  text: string;
  notes?: NoteSpan[];
}

export interface NoteSpan {
  startTime: number; // in seconds
  duration: number; // in seconds
  pitch: number; // MIDI note number (e.g. 60 = C4)
  noteName: string; // e.g. "C4"
  lyric: string; // syllable or word
  isGolden?: boolean;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  duration: number; // Total duration in seconds
  coverUrl?: string;
  audioUrl: string; // Instrumental track
  vocalUrl?: string; // Isolated vocal track (for guide or pitch extraction)
  lyrics: LrcLine[];
  notes: NoteSpan[];
  isDemo?: boolean;
}

export interface LivePitchSample {
  timestamp: number; // in seconds
  frequency: number; // in Hz
  clarity: number; // 0 to 1 confidence
  midiNote: number;
  noteName: string;
  centsOffset: number;
}

export interface ScoreStats {
  score: number; // 0 - 10,000 max score
  accuracyPercentage: number;
  maxCombo: number;
  currentCombo: number;
  goldenNotesHit: number;
  totalNotesHit: number;
  totalNotes: number;
  rank: 'S+' | 'S' | 'A' | 'B' | 'C' | 'F';
}

export interface LeaderboardEntry {
  id: string;
  songId: string;
  songTitle: string;
  artist: string;
  playerName: string;
  score: number;
  accuracy: number;
  rank: string;
  createdAt: string;
}
