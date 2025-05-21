
// Sound file paths
type SoundType = 'card-use' | 'correct-answer' | 'wrong-answer' | 'hint' | 'timeout' | 'round-end' | 'reward';

// Sound configuration
const SOUND_PATHS: Record<SoundType, string> = {
  'card-use': '/sounds/card-use.mp3',
  'correct-answer': '/sounds/correct.mp3',
  'wrong-answer': '/sounds/wrong.mp3',
  'hint': '/sounds/hint.mp3',
  'timeout': '/sounds/timeout.mp3',
  'round-end': '/sounds/round-end.mp3',
  'reward': '/sounds/reward.mp3'
};

// Volume settings
const VOLUME_SETTINGS: Record<SoundType, number> = {
  'card-use': 0.6,
  'correct-answer': 0.5,
  'wrong-answer': 0.5,
  'hint': 0.4,
  'timeout': 0.5,
  'round-end': 0.6,
  'reward': 0.7
};

// Current sound settings
let soundEnabled = true;
let masterVolume = 0.5;

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
