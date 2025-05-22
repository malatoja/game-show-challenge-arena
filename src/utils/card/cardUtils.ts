
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
    return savedRules ? JSON.parse(savedRules) : [];
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
