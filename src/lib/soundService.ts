
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
  | 'hint-sound';

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
