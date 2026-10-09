import { PitchDetector } from 'pitchy';
import { LivePitchSample } from '../types/karaoke';
import { frequencyToMidi, midiToNoteName, getCentsOffset } from '../utils/audioUtils';

export type PitchCallback = (sample: LivePitchSample | null) => void;

export class PitchEngine {
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private analyser: AnalyserNode | null = null;
  private isListening: boolean = false;
  private animationFrameId: number | null = null;
  private callbacks: Set<PitchCallback> = new Set();
  private buffer: Float32Array<ArrayBuffer> = new Float32Array(new ArrayBuffer(2048 * 4));

  public async startListening(): Promise<boolean> {
    try {
      if (this.isListening) return true;

      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioContext = new AudioCtx();

      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      const source = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048;
      source.connect(this.analyser);

      this.buffer = new Float32Array(new ArrayBuffer(this.analyser.fftSize * 4));
      this.isListening = true;
      this.updateLoop();

      return true;
    } catch (err) {
      console.error('Error starting PitchEngine microphone stream:', err);
      return false;
    }
  }

  public stopListening(): void {
    this.isListening = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }

    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.notifyCallbacks(null);
  }

  public subscribe(callback: PitchCallback): () => void {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }

  private notifyCallbacks(sample: LivePitchSample | null): void {
    this.callbacks.forEach((cb) => cb(sample));
  }

  private updateLoop = (): void => {
    if (!this.isListening || !this.analyser || !this.audioContext) return;

    this.analyser.getFloatTimeDomainData(this.buffer);

    const detector: any = PitchDetector.forFloat32Array(this.buffer.length);
    const [pitch, clarity] = detector.findPitch(this.buffer, this.audioContext.sampleRate);

    // Filter out low clarity or extreme pitch values outside vocal range (50Hz - 1500Hz)
    if (clarity > 0.8 && pitch >= 50 && pitch <= 1500) {
      const midiNote = frequencyToMidi(pitch);
      const noteName = midiToNoteName(midiNote);
      const centsOffset = getCentsOffset(pitch, midiNote);

      const sample: LivePitchSample = {
        timestamp: this.audioContext.currentTime,
        frequency: Math.round(pitch * 10) / 10,
        clarity,
        midiNote,
        noteName,
        centsOffset,
      };

      this.notifyCallbacks(sample);
    } else {
      this.notifyCallbacks(null);
    }

    this.animationFrameId = requestAnimationFrame(this.updateLoop);
  };
}

export const pitchEngineSingleton = new PitchEngine();
