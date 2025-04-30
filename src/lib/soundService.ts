
// Sound service for playing game sounds

export type SoundType = 
  | 'correct'
  | 'incorrect'
  | 'card-use'
  | 'card-award'
  | 'round-start'
  | 'round-end'
  | 'game-over'
  | 'wheel-spin'
  | 'countdown'
  | 'hint'
  | 'hint-sound'
  | 'timer'
  | 'wrong'
  | 'buzzer'
  | 'winner'
  | 'question-show';

/**
 * Plays a sound by type
 * @param soundType The type of sound to play
 */
export const playSound = (soundType: SoundType): void => {
  try {
    // Different sound handling based on the type
    console.log(`Playing sound: ${soundType}`);
    
    // Path to the sounds folder
    const soundPath = `/sounds/${soundType}.mp3`;
    
    // Create audio element and play
    const audio = new Audio(soundPath);
    audio.volume = 0.5; // Set default volume
    
    audio.play().catch(error => {
      console.error(`Error playing sound ${soundType}:`, error);
    });
  } catch (error) {
    console.error(`Error in playSound for ${soundType}:`, error);
  }
};

// Alias for playing card sounds specifically
export const playCardSound = (cardType: string): void => {
  playSound('card-use');
};

// SoundService class for managing sounds with more functionality
class SoundService {
  private volume: number = 0.5;
  private muted: boolean = false;
  private customSounds: Map<string, string> = new Map();

  constructor() {
    this.loadSettings();
  }

  private loadSettings() {
    try {
      const storedVolume = localStorage.getItem('gameshow_volume');
      const storedMuted = localStorage.getItem('gameshow_muted');
      
      if (storedVolume) {
        this.volume = parseFloat(storedVolume);
      }
      
      if (storedMuted) {
        this.muted = storedMuted === 'true';
      }
      
      // Load custom sounds if any
      const storedCustomSounds = localStorage.getItem('gameshow_custom_sounds');
      if (storedCustomSounds) {
        this.customSounds = new Map(JSON.parse(storedCustomSounds));
      }
    } catch (error) {
      console.error('Error loading sound settings:', error);
    }
  }

  private saveSettings() {
    try {
      localStorage.setItem('gameshow_volume', this.volume.toString());
      localStorage.setItem('gameshow_muted', this.muted.toString());
      
      // Save custom sounds
      const customSoundsArray = Array.from(this.customSounds.entries());
      localStorage.setItem('gameshow_custom_sounds', JSON.stringify(customSoundsArray));
    } catch (error) {
      console.error('Error saving sound settings:', error);
    }
  }

  public play(soundType: SoundType): void {
    if (this.muted) return;
    
    try {
      // Check if there's a custom sound for this type
      const customSound = this.customSounds.get(soundType);
      
      // Path to the sound file
      const soundPath = customSound || `/sounds/${soundType}.mp3`;
      
      // Create audio element and play
      const audio = new Audio(soundPath);
      audio.volume = this.volume;
      
      audio.play().catch(error => {
        console.error(`Error playing sound ${soundType}:`, error);
      });
    } catch (error) {
      console.error(`Error in soundService.play for ${soundType}:`, error);
    }
  }

  public setVolume(value: number): void {
    this.volume = Math.min(1, Math.max(0, value));
    this.saveSettings();
  }

  public getVolume(): number {
    return this.volume;
  }

  public setMuted(value: boolean): void {
    this.muted = value;
    this.saveSettings();
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public toggleMute(): void {
    this.muted = !this.muted;
    this.saveSettings();
  }

  public async setCustomSound(type: SoundType, file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const reader = new FileReader();
        
        reader.onload = (event) => {
          if (event.target?.result) {
            this.customSounds.set(type, event.target.result.toString());
            this.saveSettings();
            resolve();
          } else {
            reject(new Error('Failed to read file'));
          }
        };
        
        reader.onerror = () => {
          reject(reader.error);
        };
        
        reader.readAsDataURL(file);
      } catch (error) {
        reject(error);
      }
    });
  }

  public resetSound(type: SoundType): void {
    this.customSounds.delete(type);
    this.saveSettings();
  }

  public resetAllSounds(): void {
    this.customSounds.clear();
    this.saveSettings();
  }
}

// Export a singleton instance
export const soundService = new SoundService();
