import { createClient } from '@supabase/supabase-js';
import { LeaderboardEntry } from '../../src/types/karaoke';

// Supabase optional configuration
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || '';

let supabaseClient: ReturnType<typeof createClient> | null = null;
if (SUPABASE_URL && SUPABASE_KEY) {
  supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);
}

// Local in-memory leaderboard fallback
const localScores: LeaderboardEntry[] = [
  {
    id: 'score-1',
    songId: 'demo-evidencias',
    songTitle: 'Evidências',
    artist: 'Chitãozinho & Xororó',
    playerName: 'VocalMaster',
    score: 9850,
    accuracy: 98.5,
    rank: 'S+',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'score-2',
    songId: 'demo-evidencias',
    songTitle: 'Evidências',
    artist: 'Chitãozinho & Xororó',
    playerName: 'KaraokeKing',
    score: 9120,
    accuracy: 91.2,
    rank: 'S',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'score-3',
    songId: 'demo-blinding-lights',
    songTitle: 'Blinding Lights',
    artist: 'The Weeknd',
    playerName: 'StarboySing',
    score: 8750,
    accuracy: 87.5,
    rank: 'A',
    createdAt: new Date(Date.now() - 10800000).toISOString(),
  },
];

export async function getTopScores(songId?: string): Promise<LeaderboardEntry[]> {
  if (supabaseClient) {
    try {
      let query = supabaseClient.from('scores').select('*').order('score', { ascending: false }).limit(20);
      if (songId) {
        query = query.eq('songId', songId);
      }
      const { data, error } = await query;
      if (!error && data) return data as LeaderboardEntry[];
    } catch (e) {
      console.warn('Supabase query error, falling back to local storage:', e);
    }
  }

  // Fallback local memory list
  let filtered = localScores;
  if (songId) {
    filtered = filtered.filter((s) => s.songId === songId);
  }
  return filtered.sort((a, b) => b.score - a.score);
}

export async function saveScore(entry: Omit<LeaderboardEntry, 'id' | 'createdAt'>): Promise<LeaderboardEntry> {
  const newEntry: LeaderboardEntry = {
    ...entry,
    id: `score-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  if (supabaseClient) {
    try {
      const { data, error } = await (supabaseClient as any).from('scores').insert([newEntry]).select();
      if (!error && data && data[0]) return data[0] as LeaderboardEntry;
    } catch (e) {
      console.warn('Supabase insert error, saving locally:', e);
    }
  }

  localScores.push(newEntry);
  return newEntry;
}
