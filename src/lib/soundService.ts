
import { SoundType } from '@/types/soundTypes';

// Sound file paths
const SOUND_PATHS: Record<SoundType, string> = {
  'card-use': '/sounds/card-use.mp3',
  'correct-answer': '/sounds/correct.mp3',
  'wrong-answer': '/sounds/wrong.mp3',
  'hint': '/sounds/hint.mp3',
  'timeout': '/sounds/timeout.mp3',
  'round-end': '/sounds/round-end.mp3',
  'reward': '/sounds/reward.mp3',
  'round-start': '/sounds/round-start.mp3',
  'wheel-spin': '/sounds/wheel-spin.mp3',
  'countdown': '/sounds/countdown.mp3',
  'buzzer': '/sounds/buzzer.mp3',
  'correct': '/sounds/correct.mp3',
  'incorrect': '/sounds/wrong.mp3',
  'elimination': '/sounds/elimination.mp3',
  'timer-end': '/sounds/timer-end.mp3',
  'winner': '/sounds/winner.mp3',
  'game-over': '/sounds/game-over.mp3',
  'card-activate': '/sounds/card-activate.mp3',
  'hint-sound': '/sounds/hint-sound.mp3'
};

// Volume settings
const VOLUME_SETTINGS: Record<SoundType, number> = {
  'card-use': 0.6,
  'correct-answer': 0.5,
  'wrong-answer': 0.5,
  'hint': 0.4,
  'timeout': 0.5,
  'round-end': 0.6,
  'reward': 0.7,
  'round-start': 0.6,
  'wheel-spin': 0.5,
  'countdown': 0.5,
  'buzzer': 0.4,
  'correct': 0.5,
  'incorrect': 0.5,
  'elimination': 0.6,
  'timer-end': 0.5,
  'winner': 0.7,
  'game-over': 0.7,
  'card-activate': 0.6,
  'hint-sound': 0.5
};

// Current sound settings
let soundEnabled = true;
let masterVolume = 0.5;
let isMuted = false;

// Audio elements cache
const audioCache: Partial<Record<SoundType, HTMLAudioElement>> = {};

/**
 * Play a sound effect
 * @param sound Sound type to play
 * @param volume Optional volume override
 * @returns Promise that resolves when sound starts playing, or rejects on error
 */
export const playSound = (sound: SoundType, volume?: number): Promise<void> => {
  if (!soundEnabled || typeof window === 'undefined') {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    try {
      // Create or reuse audio element
      if (!audioCache[sound]) {
        audioCache[sound] = new Audio(SOUND_PATHS[sound]);
      }
      
      const audio = audioCache[sound]!;
      
      // Set the volume
      audio.volume = volume !== undefined ? 
        volume * masterVolume : 
        VOLUME_SETTINGS[sound] * masterVolume;
      
      // Reset and play
      audio.currentTime = 0;
      
      // When the audio starts playing, resolve the promise
      audio.onplay = () => resolve();
      
      // Play the sound
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // Auto-play might be blocked by browser
          console.error(`Sound playback error: ${error}`);
          reject(error);
        });
      }
    } catch (error) {
      console.error(`Failed to play sound: ${error}`);
      reject(error);
    }
  });
};

/**
 * Enable or disable all sounds
 * @param enabled Whether sounds should be enabled
 */
export const setSoundEnabled = (enabled: boolean): void => {
  soundEnabled = enabled;
  isMuted = !enabled;
};

/**
 * Set the master volume for all sounds
 * @param volume Volume level from 0 to 1
 */
export const setMasterVolume = (volume: number): void => {
  masterVolume = Math.max(0, Math.min(1, volume));
};

/**
 * Check if sound is currently enabled
 * @returns Current sound enabled state
 */
export const isSoundEnabled = (): boolean => soundEnabled;

/**
 * Get the current master volume
 * @returns Current master volume (0-1)
 */
export const getMasterVolume = (): number => masterVolume;

/**
 * Get mute status
 * @returns True if sounds are muted
 */
export const isSoundMuted = (): boolean => isMuted;

/**
 * Toggle mute state
 */
export const toggleMute = (): void => {
  isMuted = !isMuted;
  soundEnabled = !isMuted;
};

/**
 * Set a custom sound
 * @param type Sound type to customize
 * @param file Audio file to use
 */
export const setCustomSound = (type: SoundType, file: File): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      const url = URL.createObjectURL(file);
      
      // Clean up existing audio if present
      if (audioCache[type]) {
        audioCache[type]!.src = '';
        delete audioCache[type];
      }
      
      // Create new audio with custom file
      audioCache[type] = new Audio(url);
      
      // Store in localStorage for persistence
      localStorage.setItem(`sound_${type}`, url);
      
      resolve();
    } catch (error) {
      console.error(`Failed to set custom sound: ${error}`);
      reject(error);
    }
  });
};

/**
 * Reset a sound to default
 * @param type Sound type to reset
 */
export const resetSound = (type: SoundType): void => {
  // Remove from cache
  if (audioCache[type]) {
    audioCache[type]!.src = '';
    delete audioCache[type];
  }
  
  // Remove from localStorage
  localStorage.removeItem(`sound_${type}`);
  
  // Create new audio with default path
  audioCache[type] = new Audio(SOUND_PATHS[type]);
};

/**
 * Reset all sounds to defaults
 */
export const resetAllSounds = (): void => {
  // Clean up all custom sounds
  Object.keys(audioCache).forEach(key => {
    const soundType = key as SoundType;
    resetSound(soundType);
  });
};

/**
 * Preload sounds for better performance
 * @param sounds Array of sound types to preload, or all if not specified
 */
export const preloadSounds = (sounds?: SoundType[]): void => {
  if (typeof window === 'undefined') return;
  
  const soundsToLoad = sounds || Object.keys(SOUND_PATHS) as SoundType[];
  
  soundsToLoad.forEach(sound => {
    if (!audioCache[sound]) {
      audioCache[sound] = new Audio(SOUND_PATHS[sound]);
      audioCache[sound]!.load();
    }
  });
};

// Cleanup function to release audio resources
export const cleanupSounds = (): void => {
  Object.values(audioCache).forEach(audio => {
    if (audio) {
      audio.pause();
      audio.src = '';
    }
  });
  
  Object.keys(audioCache).forEach(key => {
    delete audioCache[key as SoundType];
  });
};

// Re-export individual functions as a service object
export const setVolume = setMasterVolume;
export const setEnabled = setSoundEnabled;
export const isEnabled = isSoundEnabled;
export const getVolume = getMasterVolume;
export const play = playSound;

// Export the sound service object for components that need full service access
export const soundService = {
  play: playSound,
  setEnabled: setSoundEnabled,
  isEnabled: isSoundEnabled,
  setVolume: setMasterVolume,
  getVolume: getMasterVolume,
  preload: preloadSounds,
  cleanup: cleanupSounds,
  isMuted: isSoundMuted,
  toggleMute: toggleMute,
  setCustomSound: setCustomSound,
  resetSound: resetSound,
  resetAllSounds: resetAllSounds
};

export default {
  play,
  setEnabled,
  isEnabled,
  setVolume,
  getVolume,
  preload: preloadSounds,
  cleanup: cleanupSounds,
  isMuted,
  toggleMute,
  setCustomSound,
  resetSound,
  resetAllSounds
};
