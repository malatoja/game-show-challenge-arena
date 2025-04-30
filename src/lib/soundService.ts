// soundService.ts

// Sound type definition
export type SoundType = 
  | 'timer'
  | 'correct_answer'
  | 'wrong_answer'
  | 'round_start'
  | 'round_end'
  | 'card_use'
  | 'wheel_spin'
  | 'player_join'
  | 'player_leave'
  | 'game_over';

// Create a class to handle all sound functionality
class SoundService {
  private volume: number = 0.7;
  private muted: boolean = false;
  private customSounds: Map<string, string> = new Map();
  
  // Function to play a sound
  public play(soundType: SoundType): void {
    if (this.muted) return;
    
    // Check if we have a custom sound for this type
    const customSoundUrl = this.customSounds.get(soundType);
    
    let soundPath = customSoundUrl ? 
      customSoundUrl : 
      `/sounds/${soundType}.mp3`;
    
    const sound = new Audio(soundPath);
    sound.volume = this.volume;
    
    try {
      sound.play().catch(err => {
        console.log('Audio play error:', err);
      });
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }

  // Function to play a card sound
  public playCardSound(cardType: string): void {
    if (this.muted) return;
    
    const soundMap: Record<string, string> = {
      'dejavu': 'dejavu.mp3',
      'kontra': 'kontra.mp3',
      'reanimacja': 'reanimacja.mp3',
      'skip': 'skip.mp3',
      'turbo': 'turbo.mp3',
      'refleks2': 'refleks2.mp3',
      'refleks3': 'refleks3.mp3',
      'lustro': 'lustro.mp3',
      'oswiecenie': 'oswiecenie.mp3',
    };

    const soundFile = soundMap[cardType] || 'card.mp3';
    const sound = new Audio(`/sounds/cards/${soundFile}`);
    sound.volume = this.volume;
    
    try {
      sound.play().catch(err => {
        console.log('Audio play error:', err);
      });
    } catch (error) {
      console.error('Error playing card sound:', error);
    }
  }
  
  // Get current volume
  public getVolume(): number {
    return this.volume;
  }
  
  // Set volume
  public setVolume(value: number): void {
    this.volume = Math.min(1, Math.max(0, value)); // Ensure volume is between 0 and 1
    // Update active sounds if needed
  }
  
  // Toggle mute
  public toggleMute(): void {
    this.muted = !this.muted;
  }
  
  // Check if sound is muted
  public isMuted(): boolean {
    return this.muted;
  }
  
  // Set custom sound
  public async setCustomSound(type: SoundType, file: File): Promise<void> {
    // Create an object URL for the file
    const url = URL.createObjectURL(file);
    this.customSounds.set(type, url);
    // In a real app, you might want to persist this in localStorage or on a server
    return Promise.resolve();
  }
  
  // Reset sound to default
  public resetSound(type: SoundType): void {
    this.customSounds.delete(type);
  }
  
  // Reset all sounds to default
  public resetAllSounds(): void {
    this.customSounds.clear();
  }
}

// Export singleton instance
export const soundService = new SoundService();

// Keep the original functions for backward compatibility
export const playSound = (soundFile: string) => {
  const sound = new Audio(`/sounds/${soundFile}`);
  try {
    sound.play().catch(err => {
      console.log('Audio play error:', err);
    });
  } catch (error) {
    console.error('Error playing sound:', error);
  }
};

export const playCardSound = (cardType: string) => {
  soundService.playCardSound(cardType);
};
