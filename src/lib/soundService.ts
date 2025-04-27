
export type SoundType =
  | 'wheel_spin'
  | 'round_start'
  | 'round_end'
  | 'question_show'
  | 'timer'
  | 'player_join'
  | 'player_leave'
  | 'correct_answer'
  | 'wrong_answer'
  | 'game_over'
  | 'card_awarded'
  | 'card_use';

class SoundService {
  private sounds: Map<SoundType, HTMLAudioElement>;
  private muted: boolean = false;
  private volume: number = 1.0;
  private defaultSoundPaths: Record<SoundType, string>;
  
  constructor() {
    this.sounds = new Map();
    this.defaultSoundPaths = {
      wheel_spin: '/sounds/wheel_spin.mp3',
      round_start: '/sounds/round_start.mp3',
      round_end: '/sounds/round_end.mp3',
      question_show: '/sounds/question_show.mp3',
      timer: '/sounds/timer.mp3',
      player_join: '/sounds/player_join.mp3',
      player_leave: '/sounds/player_leave.mp3',
      correct_answer: '/sounds/correct_answer.mp3',
      wrong_answer: '/sounds/wrong_answer.mp3',
      game_over: '/sounds/game_over.mp3',
      card_awarded: '/sounds/card_awarded.mp3',
      card_use: '/sounds/card_use.mp3',
    };
    this.initSounds();
  }

  private initSounds(): void {
    Object.entries(this.defaultSoundPaths).forEach(([type, path]) => {
      const audio = new Audio(path);
      audio.preload = 'auto';
      audio.volume = this.volume;
      this.sounds.set(type as SoundType, audio);
    });
  }

  play(type: SoundType): void {
    if (this.muted) return;
    
    const sound = this.sounds.get(type);
    if (!sound) return;

    // Reset the audio to the beginning in case it's already playing
    sound.pause();
    sound.currentTime = 0;
    sound.play().catch(error => {
      console.error(`Error playing sound ${type}:`, error);
    });
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    this.sounds.forEach(sound => {
      sound.volume = this.volume;
    });
  }

  mute(): void {
    this.muted = true;
    this.sounds.forEach(sound => {
      sound.pause();
      sound.currentTime = 0;
    });
  }

  unmute(): void {
    this.muted = false;
  }

  toggleMute(): void {
    if (this.muted) {
      this.unmute();
    } else {
      this.mute();
    }
  }

  isMuted(): boolean {
    return this.muted;
  }

  isSoundMuted(): boolean {
    return this.muted;
  }

  getVolume(): number {
    return this.volume;
  }

  // Pre-load audio to avoid delays
  preload(): void {
    this.sounds.forEach(sound => {
      sound.load();
    });
  }

  // Set custom sound
  async setCustomSound(type: SoundType, file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          const audio = new Audio(e.target?.result as string);
          audio.volume = this.volume;
          this.sounds.set(type, audio);
          resolve();
        };
        reader.onerror = (e) => {
          reject(new Error('Error reading sound file'));
        };
        reader.readAsDataURL(file);
      } catch (error) {
        reject(error);
      }
    });
  }

  // Reset sound to default
  resetSound(type: SoundType): void {
    const defaultPath = this.defaultSoundPaths[type];
    if (!defaultPath) return;
    
    const audio = new Audio(defaultPath);
    audio.preload = 'auto';
    audio.volume = this.volume;
    this.sounds.set(type, audio);
  }

  // Reset all sounds to defaults
  resetAllSounds(): void {
    this.initSounds();
  }
}

export const soundService = new SoundService();
