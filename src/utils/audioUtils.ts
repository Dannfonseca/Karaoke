const NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

/**
 * Converts a frequency in Hz to MIDI note number
 */
export function frequencyToMidi(frequency: number): number {
  if (!frequency || frequency <= 0) return 0;
  return Math.round(69 + 12 * Math.log2(frequency / 440));
}

/**
 * Converts MIDI note number to exact frequency in Hz
 */
export function midiToFrequency(midi: number): number {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

/**
 * Converts MIDI note number to Note Name (e.g. 60 -> "C4")
 */
export function midiToNoteName(midi: number): string {
  if (midi <= 0) return "--";
  const noteIndex = (Math.round(midi) % 12 + 12) % 12;
  const octave = Math.floor(Math.round(midi) / 12) - 1;
  return `${NOTE_NAMES[noteIndex]}${octave}`;
}

/**
 * Calculates cents difference between frequency and exact MIDI note
 */
export function getCentsOffset(frequency: number, midi: number): number {
  if (!frequency || frequency <= 0) return 0;
  const exactMidi = 69 + 12 * Math.log2(frequency / 440);
  return Math.round((exactMidi - midi) * 100);
}

/**
 * Normalizes user MIDI note to match target pitch octave if needed (Male/Female singer transposition)
 */
export function normalizeOctave(userMidi: number, targetMidi: number): number {
  if (!userMidi || !targetMidi) return userMidi;
  let normalized = userMidi;
  while (normalized - targetMidi > 6) {
    normalized -= 12;
  }
  while (targetMidi - normalized > 6) {
    normalized += 12;
  }
  return normalized;
}
