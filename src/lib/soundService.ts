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

// Preload all sounds
export const preloadAllSounds = (): void => {
  Object.keys(SOUND_FILES).forEach(type => {
    initSound(type as SoundType);
  });
};
