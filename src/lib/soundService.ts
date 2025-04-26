
export type SoundType = 
  | 'timer'
  | 'correct'
  | 'wrong'
  | 'round_start'
  | 'round_end'
  | 'card_use'
  | 'wheel_spin'
  | 'player_join'
  | 'player_leave'
  | 'game_over';

class SoundService {
  private sounds: Map<SoundType, HTMLAudioElement> = new Map();
  private isMuted: boolean = false;
  private volume: number = 1.0;

  // Default sound paths
  private defaultSoundPaths: Record<SoundType, string> = {
    timer: '/sounds/timer.mp3',
    correct: '/sounds/correct.mp3',
    wrong: '/sounds/wrong.mp3',
    round_start: '/sounds/round_start.mp3',
    round_end: '/sounds/round_end.mp3',
    card_use: '/sounds/card_use.mp3',
    wheel_spin: '/sounds/wheel_spin.mp3',
    player_join: '/sounds/player_join.mp3',
    player_leave: '/sounds/player_leave.mp3',
    game_over: '/sounds/game_over.mp3',
  };

  constructor() {
    // Load user sound preferences from localStorage
    this.loadPreferences();
    
    // Preload sounds
    this.preloadSounds();
  }

  private loadPreferences(): void {
    const savedVolume = localStorage.getItem('gameShowSoundVolume');
    if (savedVolume !== null) {
      this.volume = parseFloat(savedVolume);
    }
    
    const savedMuteState = localStorage.getItem('gameShowSoundMuted');
    if (savedMuteState !== null) {
      this.isMuted = savedMuteState === 'true';
    }
  }

  private savePreferences(): void {
    localStorage.setItem('gameShowSoundVolume', this.volume.toString());
    localStorage.setItem('gameShowSoundMuted', this.isMuted.toString());
  }

  private preloadSounds(): void {
    Object.entries(this.defaultSoundPaths).forEach(([type, path]) => {
      // Check if there is a custom path defined in localStorage
      const customSoundPath = localStorage.getItem(`gameShowSound_${type}`);
      const finalPath = customSoundPath || path;
      
      // Create audio element
      const audio = new Audio(finalPath);
      audio.preload = 'auto';
      audio.volume = this.volume;
      
      // Store in map
      this.sounds.set(type as SoundType, audio);
    });
  }

  public play(type: SoundType): void {
    if (this.isMuted) return;
    
    const sound = this.sounds.get(type);
    if (sound) {
      // Reset sound to beginning if it's already playing
      sound.pause();
      sound.currentTime = 0;
      
      // Play sound
      sound.play().catch(error => {
        console.error(`Error playing sound (${type}):`, error);
      });
    } else {
      console.warn(`Sound '${type}' not found`);
    }
  }

  public setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    
    // Apply new volume to all sounds
    this.sounds.forEach(sound => {
      sound.volume = this.volume;
    });
    
    this.savePreferences();
  }

  public mute(): void {
    this.isMuted = true;
    this.savePreferences();
  }

  public unmute(): void {
    this.isMuted = false;
    this.savePreferences();
  }

  public toggleMute(): void {
    this.isMuted = !this.isMuted;
    this.savePreferences();
  }

  public isSoundMuted(): boolean {
    return this.isMuted;
  }

  public getVolume(): number {
    return this.volume;
  }

  public setCustomSound(type: SoundType, file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          // Create object URL for the file
          const blob = new Blob([event.target!.result as ArrayBuffer], { type: file.type });
          const objectUrl = URL.createObjectURL(blob);
          
          // Update sound in the map
          const audio = new Audio(objectUrl);
          audio.volume = this.volume;
          this.sounds.set(type, audio);
          
          // Store path in localStorage
          localStorage.setItem(`gameShowSound_${type}`, objectUrl);
          
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read sound file'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  }

  public resetSound(type: SoundType): void {
    // Remove custom sound path from localStorage
    localStorage.removeItem(`gameShowSound_${type}`);
    
    // Reset to default sound
    const defaultPath = this.defaultSoundPaths[type];
    const audio = new Audio(defaultPath);
    audio.volume = this.volume;
    this.sounds.set(type, audio);
  }

  public resetAllSounds(): void {
    // Clear all custom sound paths
    Object.keys(this.defaultSoundPaths).forEach(type => {
      localStorage.removeItem(`gameShowSound_${type}`);
    });
    
    // Reload all sounds with default paths
    this.preloadSounds();
  }
}

// Create a singleton instance
export const soundService = new SoundService();
