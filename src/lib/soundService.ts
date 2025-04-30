
import { Howl } from 'howler';

// Define the sound types
export type SoundType = 
  | 'correct' | 'wrong' | 'buzzer' | 'start_round' | 'end_round' 
  | 'card_use' | 'wheel_spin' | 'winner' | 'timer' | 'question_show';

// Map of sound types to their file paths
const SOUND_FILES: Record<SoundType, string> = {
  'correct': '/sounds/correct.mp3',
  'wrong': '/sounds/wrong.mp3',
  'buzzer': '/sounds/buzzer.mp3',
  'start_round': '/sounds/start_round.mp3',
  'end_round': '/sounds/end_round.mp3',
  'card_use': '/sounds/card_use.mp3',
  'wheel_spin': '/sounds/wheel_spin.mp3',
  'winner': '/sounds/winner.mp3',
  'timer': '/sounds/timer.mp3',
  'question_show': '/sounds/question_show.mp3'
};

// Sound instances cache
const soundInstances: Partial<Record<SoundType, Howl>> = {};

// Volume settings
let masterVolume = 0.7;
let soundEnabled = true;

// Initialize a sound
const initSound = (type: SoundType): Howl => {
  if (!soundInstances[type]) {
    soundInstances[type] = new Howl({
      src: [SOUND_FILES[type]],
      volume: masterVolume,
      preload: true,
    });
  }
  return soundInstances[type]!;
};

// Play a sound
export const playSound = (type: SoundType): void => {
  if (!soundEnabled) return;
  
  const sound = initSound(type);
  sound.play();
};

// Play a card sound - wrapper for playSound specific to card activation
export const playCardSound = (cardType: string): void => {
  // Use the card_use sound for now, could be customized per card type in future
  playSound('card_use');
};

// Stop a sound
export const stopSound = (type: SoundType): void => {
  if (soundInstances[type]) {
    soundInstances[type]!.stop();
  }
};

// Set master volume
export const setVolume = (volume: number): void => {
  masterVolume = Math.max(0, Math.min(1, volume));
  
  // Update volume for all existing sound instances
  Object.values(soundInstances).forEach(sound => {
    if (sound) {
      sound.volume(masterVolume);
    }
  });
};

// Enable/disable all sounds
export const setSoundEnabled = (enabled: boolean): void => {
  soundEnabled = enabled;
  
  // If disabling, stop all currently playing sounds
  if (!enabled) {
    Object.values(soundInstances).forEach(sound => {
      if (sound) {
        sound.stop();
      }
    });
  }
};

// Get current volume
export const getVolume = (): number => masterVolume;

// Check if sound is enabled
export const isSoundEnabled = (): boolean => soundEnabled;

// Check if sound is muted (inverse of enabled)
export const isMuted = (): boolean => !soundEnabled;

// Toggle mute state
export const toggleMute = (): void => {
  setSoundEnabled(!soundEnabled);
};

// Preload all sounds
export const preloadAllSounds = (): void => {
  Object.keys(SOUND_FILES).forEach(type => {
    initSound(type as SoundType);
  });
};

// For custom sounds and sound management
export const setCustomSound = async (type: SoundType, file: File): Promise<void> => {
  // Create object URL from the file
  const objectUrl = URL.createObjectURL(file);
  
  // Stop and unload the existing sound if any
  if (soundInstances[type]) {
    soundInstances[type]!.stop();
    soundInstances[type]!.unload();
  }
  
  // Create a new sound instance with the custom file
  soundInstances[type] = new Howl({
    src: [objectUrl],
    volume: masterVolume,
    preload: true,
  });
  
  // Return after preloading
  return new Promise((resolve) => {
    soundInstances[type]!.once('load', () => {
      resolve();
    });
  });
};

// Reset a sound to its default
export const resetSound = (type: SoundType): void => {
  if (soundInstances[type]) {
    soundInstances[type]!.stop();
    soundInstances[type]!.unload();
    delete soundInstances[type];
  }
  // This will reinitialize with the default sound
  initSound(type);
};

// Reset all sounds to defaults
export const resetAllSounds = (): void => {
  Object.keys(soundInstances).forEach(key => {
    const type = key as SoundType;
    soundInstances[type]?.stop();
    soundInstances[type]?.unload();
    delete soundInstances[type];
  });
  
  // Reinitialize all default sounds
  preloadAllSounds();
};

// Export as a unified service object for components that need multiple functions
export const soundService = {
  play: playSound,
  stop: stopSound,
  playCardSound,
  setVolume,
  getVolume,
  setSoundEnabled,
  isSoundEnabled,
  isMuted,
  toggleMute,
  preloadAllSounds,
  setCustomSound,
  resetSound,
  resetAllSounds
};
