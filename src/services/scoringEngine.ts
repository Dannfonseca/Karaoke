import { NoteSpan, LivePitchSample, ScoreStats } from '../types/karaoke';
import { normalizeOctave } from '../utils/audioUtils';

export class ScoringEngine {
  private score: number = 0;
  private totalNotes: number = 0;
  private totalNotesHit: number = 0;
  private goldenNotesHit: number = 0;
  private currentCombo: number = 0;
  private maxCombo: number = 0;
  private evaluatedFramesCount: number = 0;
  private successfulFramesCount: number = 0;

  public reset(totalSongNotes: number = 100): void {
    this.score = 0;
    this.totalNotes = totalSongNotes;
    this.totalNotesHit = 0;
    this.goldenNotesHit = 0;
    this.currentCombo = 0;
    this.maxCombo = 0;
    this.evaluatedFramesCount = 0;
    this.successfulFramesCount = 0;
  }

  /**
   * Evaluates a live mic pitch sample against active target note at current playback timestamp.
   */
  public evaluateFrame(sample: LivePitchSample | null, activeNote: NoteSpan | null): {
    isHit: boolean;
    diffSemitones: number;
    scoreIncrement: number;
  } {
    if (!activeNote) {
      // Not currently singing a note
      return { isHit: false, diffSemitones: 0, scoreIncrement: 0 };
    }

    this.evaluatedFramesCount++;

    if (!sample || sample.clarity < 0.75) {
      // Miss / No voice detected
      this.currentCombo = 0;
      return { isHit: false, diffSemitones: 99, scoreIncrement: 0 };
    }

    // Normalize octave (transpose pitch if male singing female song or vice versa)
    const normalizedUserMidi = normalizeOctave(sample.midiNote, activeNote.pitch);
    const diffSemitones = Math.abs(normalizedUserMidi - activeNote.pitch);

    // Hit criteria: within 1.5 semitones
    const isHit = diffSemitones <= 1.5;

    if (isHit) {
      this.successfulFramesCount++;
      this.currentCombo++;
      if (this.currentCombo > this.maxCombo) {
        this.maxCombo = this.currentCombo;
      }

      // Base points per frame + combo multiplier
      const comboMultiplier = 1 + Math.min(Math.floor(this.currentCombo / 10) * 0.1, 1.0); // up to 2x
      const goldenMultiplier = activeNote.isGolden ? 2 : 1;
      const precisionBonus = diffSemitones <= 0.5 ? 1.2 : 1.0;

      const increment = 50 * comboMultiplier * goldenMultiplier * precisionBonus;
      this.score = Math.min(10000, Math.round(this.score + increment));

      if (activeNote.isGolden) {
        this.goldenNotesHit++;
      }

      return { isHit: true, diffSemitones, scoreIncrement: increment };
    } else {
      this.currentCombo = 0;
      return { isHit: false, diffSemitones, scoreIncrement: 0 };
    }
  }

  public getStats(): ScoreStats {
    const accuracyPercentage =
      this.evaluatedFramesCount > 0
        ? Math.min(100, Math.round((this.successfulFramesCount / this.evaluatedFramesCount) * 100))
        : 0;

    let rank: ScoreStats['rank'] = 'F';
    if (this.score >= 9500) rank = 'S+';
    else if (this.score >= 8800) rank = 'S';
    else if (this.score >= 7500) rank = 'A';
    else if (this.score >= 6000) rank = 'B';
    else if (this.score >= 4000) rank = 'C';

    return {
      score: this.score,
      accuracyPercentage,
      maxCombo: this.maxCombo,
      currentCombo: this.currentCombo,
      goldenNotesHit: this.goldenNotesHit,
      totalNotesHit: this.successfulFramesCount,
      totalNotes: this.totalNotes,
      rank,
    };
  }
}
