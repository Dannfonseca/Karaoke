import { LrcLine, NoteSpan } from '../../src/types/karaoke';
import { frequencyToMidi, midiToNoteName } from '../../src/utils/audioUtils';

export interface LrcLibTrack {
  id: number;
  name: string;
  artistName: string;
  albumName?: string;
  duration: number;
  syncedLyrics?: string;
  plainLyrics?: string;
}

/**
 * Parses raw LRC string into structured LrcLine array with calculated note spans
 */
export function parseLrcString(lrcContent: string): { lyrics: LrcLine[]; notes: NoteSpan[] } {
  const lyrics: LrcLine[] = [];
  const notes: NoteSpan[] = [];

  const lrcRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\](.*)/;
  const rawLines = lrcContent.split('\n');

  let idCounter = 0;

  for (let i = 0; i < rawLines.length; i++) {
    const match = rawLines[i].trim().match(lrcRegex);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const millisStr = match[3].padEnd(3, '0').substring(0, 3);
      const millis = parseInt(millisStr, 10);
      const timeInSeconds = minutes * 60 + seconds + millis / 1000;
      const text = match[4].trim();

      if (text) {
        idCounter++;
        lyrics.push({
          id: `line-${idCounter}`,
          time: timeInSeconds,
          duration: 3.5, // Default estimate until next line calculation
          text,
        });
      }
    }
  }

  // Calculate actual line durations & generate synthetic pitch notes for karaoke gameplay
  for (let i = 0; i < lyrics.length; i++) {
    const currentLine = lyrics[i];
    const nextLine = lyrics[i + 1];
    if (nextLine) {
      currentLine.duration = Math.max(1.0, nextLine.time - currentLine.time);
    }

    // Generate pitch note blocks for words in this line
    const words = currentLine.text.split(' ').filter((w) => w.length > 0);
    const wordDuration = currentLine.duration / Math.max(1, words.length);

    // Create realistic melodic progression notes (e.g. C4 to G4 range)
    words.forEach((word, wIdx) => {
      const noteStartTime = currentLine.time + wIdx * wordDuration;
      // Synthetic melodious pitch sequence for demo/LRC songs without vocal stem analysis
      const syntheticMidi = 60 + ((wIdx * 2 + i * 3) % 12);
      
      const note: NoteSpan = {
        startTime: noteStartTime,
        duration: wordDuration * 0.9,
        pitch: syntheticMidi,
        noteName: midiToNoteName(syntheticMidi),
        lyric: word,
        isGolden: wIdx % 4 === 0,
      };

      notes.push(note);
    });
  }

  return { lyrics, notes };
}

/**
 * Searches tracks on LrcLib API
 */
export async function searchLrcLib(query: string): Promise<LrcLibTrack[]> {
  try {
    const res = await fetch(`https://lrclib.net/api/search?q=${encodeURIComponent(query)}`);
    if (!res.ok) return [];
    const data = (await res.json()) as LrcLibTrack[];
    return data || [];
  } catch (err) {
    console.error('Error fetching from LrcLib:', err);
    return [];
  }
}
