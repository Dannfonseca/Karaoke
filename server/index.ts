import { Elysia, t } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { DEMO_SONGS } from './services/audioPipeline';
import { searchLrcLib, parseLrcString } from './services/lrclib';
import { getTopScores, saveScore } from './services/db';
import { Song, LrcLine, NoteSpan } from '../src/types/karaoke';

const app = new Elysia()
  .use(cors())
  .use(
    swagger({
      documentation: {
        info: {
          title: 'AutoKaraoke AI API',
          version: '1.0.0',
        },
      },
    })
  )
  .get('/api/health', () => ({ status: 'ok', runtime: 'Bun', framework: 'Elysia' }))
  
  // Demo Songs
  .get('/api/songs/demo', () => DEMO_SONGS)

  // Single Song by ID
  .get('/api/songs/:id', ({ params: { id }, set }) => {
    const demo = DEMO_SONGS.find((s) => s.id === id);
    if (demo) return demo;
    set.status = 404;
    return { error: 'Song not found' };
  })

  // Search LrcLib API for synced lyrics
  .get(
    '/api/search',
    async ({ query }) => {
      const q = query.q || '';
      if (!q.trim()) return [];
      const tracks = await searchLrcLib(q);
      return tracks;
    },
    {
      query: t.Object({
        q: t.Optional(t.String()),
      }),
    }
  )

  // Convert custom track or LrcLib lyrics into play-ready AutoKaraoke song
  .post(
    '/api/process',
    async ({ body, set }) => {
      const { title, artist, audioUrl, syncedLyrics } = body;

      if (!title || !artist) {
        set.status = 400;
        return { error: 'Title and artist are required' };
      }

      let parsed: { lyrics: LrcLine[]; notes: NoteSpan[] } = { lyrics: [], notes: [] };
      if (syncedLyrics) {
        parsed = parseLrcString(syncedLyrics);
      } else {
        // Fetch from LrcLib
        const tracks = await searchLrcLib(`${title} ${artist}`);
        const matched = tracks.find((t) => t.syncedLyrics);
        if (matched && matched.syncedLyrics) {
          parsed = parseLrcString(matched.syncedLyrics);
        }
      }

      const newSong: Song = {
        id: `song-${Date.now()}`,
        title,
        artist,
        audioUrl: audioUrl || 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=cinematic-melody-112398.mp3',
        duration: 180,
        lyrics: parsed.lyrics,
        notes: parsed.notes,
        isDemo: false,
      };

      return newSong;
    },
    {
      body: t.Object({
        title: t.String(),
        artist: t.String(),
        audioUrl: t.Optional(t.String()),
        syncedLyrics: t.Optional(t.String()),
      }),
    }
  )

  // Leaderboard routes
  .get(
    '/api/scores',
    async ({ query }) => {
      const scores = await getTopScores(query.songId);
      return scores;
    },
    {
      query: t.Object({
        songId: t.Optional(t.String()),
      }),
    }
  )

  .post(
    '/api/scores',
    async ({ body }) => {
      const saved = await saveScore(body);
      return saved;
    },
    {
      body: t.Object({
        songId: t.String(),
        songTitle: t.String(),
        artist: t.String(),
        playerName: t.String(),
        score: t.Number(),
        accuracy: t.Number(),
        rank: t.String(),
      }),
    }
  )

  .listen(3001);

console.log(`🎤 AutoKaraoke AI Elysia backend running at ${app.server?.hostname}:${app.server?.port}`);
