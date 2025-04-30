
import { CardType, Player } from '@/types/gameTypes';

export const loadCardRules = () => {
  try {
    const storedRules = localStorage.getItem('customCardRules');
    if (storedRules) {
      return JSON.parse(storedRules);
    }
    return [];
  } catch (error) {
    console.error('Error loading card rules:', error);
    return [];
  }
};

export const shouldAwardBonusCard = (player: Player, action: 'correctAnswer' | 'wrongAnswer' | 'roundComplete') => {
  // Default logic for awarding bonus cards
  switch (action) {
    case 'correctAnswer':
      // Award a card after 3 consecutive correct answers
      return player.consecutiveCorrect && player.consecutiveCorrect >= 3;
    
    case 'wrongAnswer':
      // Possible logic for wrong answers
      return false;
    
    case 'roundComplete':
      // Possible logic for round completion
      return false;
    
    default:
      return false;
  }
};

export const getRandomCardForAction = (action: 'correctAnswer' | 'wrongAnswer' | 'roundComplete'): CardType => {
  // Different sets of cards based on the triggering action
  const cardSets = {
    correctAnswer: ['turbo', 'refleks2', 'lustro', 'oswiecenie'],
    wrongAnswer: ['dejavu', 'reanimacja'],
    roundComplete: ['kontra', 'skip', 'refleks3'],
    all: ['dejavu', 'kontra', 'reanimacja', 'skip', 'turbo', 'refleks2', 'refleks3', 'lustro', 'oswiecenie']
  };
  
  // Get the appropriate set of cards
  const cardSet = cardSets[action] || cardSets.all;
  
  // Return a random card from the set
  const randomIndex = Math.floor(Math.random() * cardSet.length);
  return cardSet[randomIndex] as CardType;
};
