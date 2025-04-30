
import { CardType, PlayerId, Question, RoundType } from '../types/gameTypes';
import { createCard } from '../constants/gameConstants';

/**
 * Utility functions for game operations
 */

// Filter questions by category and difficulty
export const filterQuestions = (
  questions: Question[], 
  category?: string, 
  round?: RoundType
): Question[] => {
  return questions.filter(question => {
    const matchesCategory = !category || question.category === category;
    const matchesRound = !round || question.round === round;
    return matchesCategory && matchesRound && !question.used;
  });
};

// Check if a player has a specific card type that is not used
export const playerHasUnusedCard = (
  playerId: PlayerId, 
  cardType: CardType, 
  players: Array<{ id: PlayerId; cards: Array<{ type: CardType; isUsed: boolean }> }>
): boolean => {
  const player = players.find(p => p.id === playerId);
  if (!player) return false;
  
  return player.cards.some(card => card.type === cardType && !card.isUsed);
};

// Count unused cards for a player
export const countUnusedCards = (
  playerId: PlayerId,
  players: Array<{ id: PlayerId; cards: Array<{ isUsed: boolean }> }>
): number => {
  const player = players.find(p => p.id === playerId);
  if (!player) return 0;
  
  return player.cards.filter(card => !card.isUsed).length;
};

// Check if player can receive more cards (max 3 unused)
export const canReceiveMoreCards = (
  playerId: PlayerId,
  players: Array<{ id: PlayerId; cards: Array<{ isUsed: boolean }> }>
): boolean => {
  return countUnusedCards(playerId, players) < 3;
};

// Calculate if player should be awarded a bonus card
export const shouldAwardBonusCard = (
  consecutiveCorrect: number, 
  pointsThreshold: number, 
  currentPoints: number, 
  roundType: RoundType,
  cardRules: Record<string, boolean> = {}
): { award: boolean; cardType: CardType } => {
  // Load custom rules from localStorage
  try {
    const storedRules = localStorage.getItem('customCardRules');
    const customRules = storedRules ? JSON.parse(storedRules) : [];
    
    // Check if any enabled custom rules apply
    for (const rule of customRules) {
      if (rule.isEnabled) {
        // Check rule conditions
        if (rule.condition === 'consecutive_correct' && consecutiveCorrect >= 3) {
          return { award: true, cardType: rule.cardType };
        }
        
        if (rule.condition === 'points_threshold' && currentPoints >= pointsThreshold) {
          return { award: true, cardType: rule.cardType };
        }
      }
    }
  } catch (error) {
    console.error('Error checking custom rules:', error);
  }
  
  // Check default built-in rules
  // Award for consecutive correct answers
  if (cardRules.consecutiveCorrect !== false && consecutiveCorrect >= 3) {
    return { award: true, cardType: 'dejavu' };
  }
  
  // Award for reaching points threshold in round 1
  if (cardRules.pointsThreshold !== false && roundType === 'knowledge' && currentPoints >= pointsThreshold) {
    return { award: true, cardType: 'turbo' };
  }
  
  return { award: false, cardType: 'dejavu' };
};

// Get random card of specified type (for rewards)
export const getRandomCardForReward = (roundType: RoundType): CardType => {
  const roundCards: Record<RoundType, CardType[]> = {
    'knowledge': ['dejavu', 'kontra', 'skip'],
    'speed': ['reanimacja', 'turbo', 'refleks2'],
    'wheel': ['refleks3', 'lustro', 'oswiecenie'],
    'standard': ['dejavu', 'skip', 'turbo'],
    'all': ['dejavu', 'skip', 'turbo']
  };
  
  const availableCards = roundCards[roundType] || ['dejavu'];
  const randomIndex = Math.floor(Math.random() * availableCards.length);
  return availableCards[randomIndex];
};

// Get a random card based on specific game conditions
export const getRandomCardForAction = (
  action: 'consecutive_correct' | 'round_win' | 'no_life_loss' | 'top_score' | 'lowest_score',
  roundType: RoundType
): CardType => {
  // Define card pools for different actions
  const actionCardPools: Record<string, CardType[]> = {
    consecutive_correct: ['dejavu', 'turbo', 'refleks2'],
    round_win: ['kontra', 'skip', 'oswiecenie'],
    no_life_loss: ['reanimacja', 'lustro'],
    top_score: ['turbo', 'refleks3'],
    lowest_score: ['reanimacja', 'dejavu', 'refleks2']
  };
  
  // Get the appropriate pool
  const cardPool = actionCardPools[action] || ['dejavu'];
  
  // Select a random card from the pool
  const randomIndex = Math.floor(Math.random() * cardPool.length);
  return cardPool[randomIndex];
};

// Create a new player with default values
export const createNewPlayer = (name: string): { id: string, name: string, lives: number, points: number, cards: any[], isActive: boolean, eliminated: boolean } => {
  return {
    id: `player-${Date.now()}`,
    name,
    lives: 3,
    points: 0,
    cards: [],
    isActive: false,
    eliminated: false
  };
};

// Load card rules from localStorage
export const loadCardRules = (): Record<string, boolean> => {
  try {
    const savedRules = localStorage.getItem('cardRules');
    if (savedRules) {
      return JSON.parse(savedRules);
    }
  } catch (error) {
    console.error('Error loading card rules:', error);
  }
  
  // Default rules
  return {
    consecutiveCorrect: true,
    pointsThreshold: true,
    noLifeLoss: true,
    topPoints: true,
    advanceRound: true,
    lowestPoints: true,
    lowestLives: true
  };
};

// Save card rules to localStorage
export const saveCardRules = (rules: Record<string, boolean>): void => {
  try {
    localStorage.setItem('cardRules', JSON.stringify(rules));
  } catch (error) {
    console.error('Error saving card rules:', error);
  }
};
