// Utility for Web Speech, Audio playback, Microphone recording, and Lip-Sync Viseme Calculation

export interface VisemeState {
  mouthOpen: number; // 0 (closed) to 1 (wide open)
  mouthWidth: number; // 0.8 (puckered) to 1.3 (wide)
  jawOffset: number; // pixels
  eyeblink: boolean;
  headTilt: number; // degrees
}

export class AudioLipSyncManager {
  private audioCtx: AudioContext | null = null;
  private currentAudio: HTMLAudioElement | null = null;
  private isSpeaking = false;
  private onVisemeUpdate?: (viseme: VisemeState) => void;
  private animFrameId: number | null = null;

  constructor(onVisemeUpdate?: (viseme: VisemeState) => void) {
    this.onVisemeUpdate = onVisemeUpdate;
  }

  // Speak text using either base64 audio or browser speech synthesis
  public speak(
    text: string,
    audioBase64?: string | null,
    onEnd?: () => void
  ) {
    this.stop();

    if (audioBase64) {
      try {
        const audio = new Audio(`data:audio/wav;base64,${audioBase64}`);
        this.currentAudio = audio;
        this.isSpeaking = true;
        this.startVisemeSimulation();

        audio.onended = () => {
          this.stop();
          if (onEnd) onEnd();
        };

        audio.onerror = () => {
          // Fallback to speech synthesis
          this.speakWithSpeechSynthesis(text, onEnd);
        };

        audio.play().catch(() => {
          this.speakWithSpeechSynthesis(text, onEnd);
        });
        return;
      } catch (e) {
        console.warn('Audio play error, falling back to Web Speech', e);
      }
    }

    this.speakWithSpeechSynthesis(text, onEnd);
  }

  private speakWithSpeechSynthesis(text: string, onEnd?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.simulateTalkingForDuration(Math.max(2, text.split(' ').length * 0.35), onEnd);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.15; // Short-form energetic pacing
    utterance.pitch = 1.05;

    // Pick a natural english voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')));
    if (preferredVoice) utterance.voice = preferredVoice;

    this.isSpeaking = true;
    this.startVisemeSimulation();

    utterance.onend = () => {
      this.stop();
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      this.stop();
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }

  private simulateTalkingForDuration(seconds: number, onEnd?: () => void) {
    this.isSpeaking = true;
    this.startVisemeSimulation();
    setTimeout(() => {
      this.stop();
      if (onEnd) onEnd();
    }, seconds * 1000);
  }

  private startVisemeSimulation() {
    let startTime = performance.now();
    let blinkTimer = 0;

    const loop = (now: number) => {
      if (!this.isSpeaking) return;

      const elapsed = (now - startTime) / 1000;
      // Speech syllable rhythms (cadence ~3.5 syllables/sec)
      const syllableOsc = Math.sin(elapsed * 16) * Math.cos(elapsed * 8);
      const intensity = Math.max(0.08, (syllableOsc + 1) / 2);

      // Micro head motion & random blinking
      blinkTimer += 0.016;
      const isBlinking = (blinkTimer % 4.0) > 3.85;
      const headTilt = Math.sin(elapsed * 2) * 2.5;

      const viseme: VisemeState = {
        mouthOpen: intensity * 0.9,
        mouthWidth: 1.0 + (Math.sin(elapsed * 12) * 0.15),
        jawOffset: intensity * 8,
        eyeblink: isBlinking,
        headTilt,
      };

      if (this.onVisemeUpdate) {
        this.onVisemeUpdate(viseme);
      }

      this.animFrameId = requestAnimationFrame(loop);
    };

    this.animFrameId = requestAnimationFrame(loop);
  }

  public stop() {
    this.isSpeaking = false;
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    if (this.onVisemeUpdate) {
      this.onVisemeUpdate({
        mouthOpen: 0,
        mouthWidth: 1.0,
        jawOffset: 0,
        eyeblink: false,
        headTilt: 0,
      });
    }
  }

  public getSpeakingState() {
    return this.isSpeaking;
  }
}
