
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
  roundType: RoundType
): { award: boolean; cardType: CardType } => {
  // Award for consecutive correct answers
  if (consecutiveCorrect >= 3) {
    return { award: true, cardType: 'dejavu' };
  }
  
  // Award for reaching points threshold in round 1
  if (roundType === 'knowledge' && currentPoints >= pointsThreshold) {
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
    'all': ['dejavu', 'skip', 'turbo'] // Adding the 'all' option to fix the TypeScript error
  };
  
  const availableCards = roundCards[roundType] || ['dejavu'];
  const randomIndex = Math.floor(Math.random() * availableCards.length);
  return availableCards[randomIndex];
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
