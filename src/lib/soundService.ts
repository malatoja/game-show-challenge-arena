// soundService.ts

// Function to play a sound
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

// Add card sound function
export const playCardSound = (cardType: string) => {
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
  
  try {
    sound.play().catch(err => {
      console.log('Audio play error:', err);
    });
  } catch (error) {
    console.error('Error playing card sound:', error);
  }
};
