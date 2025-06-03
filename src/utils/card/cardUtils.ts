
import { CardType, Player } from '@/types/gameTypes';

interface CardRule {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  condition: string;
  cardType: CardType;
}

/**
 * Load card rules from localStorage
 */
export const loadCardRules = (): CardRule[] => {
  try {
    const savedRules = localStorage.getItem('customCardRules');
    if (savedRules) {
      return JSON.parse(savedRules);
    }
    
    // Default rules if none are saved
    return [
      {
        id: 'topPoints',
        name: 'Top Points Player',
        description: 'Award card to player with highest points after Round 1',
        isEnabled: true,
        condition: 'top_player',
        cardType: 'dejavu'
      },
      {
        id: 'lowestPoints',
        name: 'Lowest Points Player',
        description: 'Award card to player with lowest points after Round 1',
        isEnabled: true,
        condition: 'lowest_points',
        cardType: 'reanimacja'
      },
      {
        id: 'advanceRound',
        name: 'Advance Round',
        description: 'Award card to players who advance to next round',
        isEnabled: true,
        condition: 'advance_round',
        cardType: 'kontra'
      }
    ];
  } catch (error) {
    console.error('Error loading card rules:', error);
    return [];
  }
};

/**
 * Save card rules to localStorage
 */
export const saveCardRules = (rules: CardRule[]): void => {
  try {
    localStorage.setItem('customCardRules', JSON.stringify(rules));
  } catch (error) {
    console.error('Error saving card rules:', error);
  }
};

/**
 * Check if a player should be awarded a bonus card based on their performance
 */
export const shouldAwardBonusCard = (player: Player): boolean => {
  // This is a simplified implementation
  // In a real implementation, you would check various conditions
  
  // Example: Award a card for every 50 points
  if (player.points % 50 === 0 && player.points > 0) {
    return true;
  }
  
  // Example: Award a card for 3 consecutive correct answers
  if (player.consecutiveCorrect && player.consecutiveCorrect >= 3) {
    return true;
  }
  
  return false;
};

/**
 * Get a random card type based on an action or condition
 */
export const getRandomCardForAction = (action: string): CardType => {
  const cardTypes: CardType[] = [
    'dejavu', 'kontra', 'reanimacja', 'skip', 'turbo', 
    'refleks2', 'refleks3', 'lustro', 'oswiecenie'
  ];
  
  // This is a simplified implementation
  // In a real implementation, you might have weighted probabilities
  // or specific cards for different actions
  
  // For now, just return a random card type
  const randomIndex = Math.floor(Math.random() * cardTypes.length);
  return cardTypes[randomIndex];
};

// Export the CardRule interface
export type { CardRule };
