
import { SoundType } from '@/types/soundTypes';

export class SoundManager {
  private static sounds: Map<SoundType, HTMLAudioElement> = new Map();
  private static volume: number = 0.7;
  private static muted: boolean = false;

  static init() {
    // Preload commonly used sounds
    const soundFiles: Record<SoundType, string> = {
      'round-start': '/sounds/round_start.mp3',
      'card-activate': '/sounds/card_use.mp3',
      'correct-answer': '/sounds/correct.mp3',
      'wrong-answer': '/sounds/wrong.mp3',
      'timer-warning': '/sounds/timer_warning.mp3',
      'game-over': '/sounds/game_over.mp3',
      'hint': '/sounds/hint.mp3'
    };

    Object.entries(soundFiles).forEach(([soundType, filePath]) => {
      const audio = new Audio(filePath);
      audio.preload = 'auto';
      audio.volume = this.volume;
      this.sounds.set(soundType as SoundType, audio);
    });
  }

  static play(soundType: SoundType) {
    if (this.muted) return;

    const sound = this.sounds.get(soundType);
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(err => console.error(`Error playing ${soundType}:`, err));
    } else {
      console.warn(`Sound ${soundType} not found`);
    }
  }

  static setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    this.sounds.forEach(sound => {
      sound.volume = this.volume;
    });
  }

  static setMuted(muted: boolean) {
    this.muted = muted;
  }

  static getVolume(): number {
    return this.volume;
  }

  static isMuted(): boolean {
    return this.muted;
  }
}

// Initialize sounds when module loads
SoundManager.init();
