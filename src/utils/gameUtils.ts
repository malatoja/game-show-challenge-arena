import { CardType, Question, RoundType } from '@/types/gameTypes';
import { SAMPLE_QUESTIONS } from '@/constants/gameConstants';

// Function to generate a unique ID for questions
export const generateQuestionId = (): string => {
  return `question-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
};

// Function to filter questions based on search term, round, and category
export const filterQuestions = (
  questions: Question[],
  searchTerm: string,
  roundFilter: RoundType | 'all',
  categoryFilter: string | 'all'
): Question[] => {
  let filteredQuestions = [...questions];

  if (searchTerm) {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    filteredQuestions = filteredQuestions.filter(question =>
      question.text.toLowerCase().includes(lowerCaseSearchTerm) ||
      question.category.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }

  if (roundFilter !== 'all') {
    filteredQuestions = filteredQuestions.filter(question => question.round === roundFilter);
  }

  if (categoryFilter !== 'all') {
    filteredQuestions = filteredQuestions.filter(question => question.category === categoryFilter);
  }

  return filteredQuestions;
};

// Function to sort questions alphabetically by text
export const sortQuestionsAlphabetically = (questions: Question[]): Question[] => {
  return [...questions].sort((a, b) => a.text.localeCompare(b.text));
};

// Function to create a card
export const createCard = (cardType: CardType) => {
  switch (cardType) {
    case 'dejavu':
      return {
        type: 'dejavu',
        name: 'Dejavu',
        description: 'Powtórzenie pytania po błędnej odpowiedzi',
        isUsed: false
      };
    case 'kontra':
      return {
        type: 'kontra',
        name: 'Kontra',
        description: 'Przekazanie pytania innemu graczowi',
        isUsed: false
      };
    case 'reanimacja':
      return {
        type: 'reanimacja',
        name: 'Reanimacja',
        description: 'Ochrona przed utratą życia w rundzie 2',
        isUsed: false
      };
    case 'skip':
      return {
        type: 'skip',
        name: 'Skip',
        description: 'Pominięcie pytania',
        isUsed: false
      };
    case 'turbo':
      return {
        type: 'turbo',
        name: 'Turbo',
        description: 'Podwojenie punktów za pytanie',
        isUsed: false
      };
    case 'refleks2':
      return {
        type: 'refleks2',
        name: 'Refleks x2',
        description: 'Podwojenie czasu na odpowiedź',
        isUsed: false
      };
    case 'refleks3':
      return {
        type: 'refleks3',
        name: 'Refleks x3',
        description: 'Potrojenie czasu na odpowiedź',
        isUsed: false
      };
    case 'lustro':
      return {
        type: 'lustro',
        name: 'Lustro',
        description: 'Usunięcie błędnej odpowiedzi',
        isUsed: false
      };
    case 'oswiecenie':
      return {
        type: 'oswiecenie',
        name: 'Oświecenie',
        description: 'Podpowiedź do pytania',
        isUsed: false
      };
    default:
      return {
        type: 'dejavu',
        name: 'Dejavu',
        description: 'Powtórzenie pytania po błędnej odpowiedzi',
        isUsed: false
      };
  }
};

// Default categories
const DEFAULT_CATEGORIES = [
  'Historia', 
  'Geografia', 
  'Nauka', 
  'Sztuka', 
  'Sport', 
  'Rozrywka',
  'Technologia',
  'Muzyka',
  'Film',
  'Literatura'
];

// Get all categories from localStorage or use defaults
export const getAllCategories = (): string[] => {
  try {
    const savedCategories = localStorage.getItem('gameShowCategories');
    if (savedCategories) {
      return JSON.parse(savedCategories);
    }
    
    // If no saved categories, store defaults and return them
    localStorage.setItem('gameShowCategories', JSON.stringify(DEFAULT_CATEGORIES));
    return DEFAULT_CATEGORIES;
  } catch (error) {
    console.error('Error loading categories:', error);
    return DEFAULT_CATEGORIES;
  }
};

// Add a new category
export const addCategory = (category: string): string[] => {
  try {
    const categories = getAllCategories();
    
    // Check if category already exists (case insensitive)
    if (categories.some(cat => cat.toLowerCase() === category.toLowerCase())) {
      throw new Error(`Kategoria "${category}" już istnieje`);
    }
    
    // Add new category
    const updatedCategories = [...categories, category];
    localStorage.setItem('gameShowCategories', JSON.stringify(updatedCategories));
    
    return updatedCategories;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

// Remove a category
export const removeCategory = (category: string): string[] => {
  try {
    const categories = getAllCategories();
    
    // Check if it's the last category
    if (categories.length <= 1) {
      throw new Error('Nie można usunąć ostatniej kategorii');
    }
    
    // Remove category
    const updatedCategories = categories.filter(cat => cat !== category);
    localStorage.setItem('gameShowCategories', JSON.stringify(updatedCategories));
    
    return updatedCategories;
  } catch (error) {
    console.error('Error removing category:', error);
    throw error;
  }
};

// Default card rules
const DEFAULT_CARD_RULES = {
  consecutiveCorrect: {
    threshold: 3,
    cards: ['dejavu', 'refleks2']
  },
  pointsThreshold: {
    threshold: 50,
    cards: ['turbo']
  },
  roundSpecific: {
    knowledge: ['dejavu', 'kontra', 'skip'],
    speed: ['reanimacja', 'turbo', 'refleks2'],
    wheel: ['refleks3', 'lustro', 'oswiecenie'],
    standard: ['dejavu', 'skip', 'turbo'],
    all: ['dejavu', 'skip', 'turbo']
  }
};

// Load card rules from storage or use defaults
export const loadCardRules = () => {
  try {
    const savedRules = localStorage.getItem('gameShowCardRules');
    if (savedRules) {
      return JSON.parse(savedRules);
    }
    
    // If no saved rules, store defaults and return them
    localStorage.setItem('gameShowCardRules', JSON.stringify(DEFAULT_CARD_RULES));
    return DEFAULT_CARD_RULES;
  } catch (error) {
    console.error('Error loading card rules:', error);
    return DEFAULT_CARD_RULES;
  }
};

// Function to decide if a player should get a bonus card
export const shouldAwardBonusCard = (
  consecutiveCorrect: number,
  pointsThreshold: number,
  playerPoints: number,
  currentRound: import('@/types/gameTypes').RoundType,
  cardRules: any
): { award: boolean; cardType: import('@/types/gameTypes').CardType } => {
  // Check consecutive correct answers rule
  if (cardRules.consecutiveCorrect && 
      consecutiveCorrect >= cardRules.consecutiveCorrect.threshold) {
    const possibleCards = cardRules.consecutiveCorrect.cards;
    const randomCard = possibleCards[Math.floor(Math.random() * possibleCards.length)];
    return { award: true, cardType: randomCard as import('@/types/gameTypes').CardType };
  }
  
  // Check points threshold rule
  if (cardRules.pointsThreshold && 
      playerPoints >= cardRules.pointsThreshold.threshold) {
    const possibleCards = cardRules.pointsThreshold.cards;
    const randomCard = possibleCards[Math.floor(Math.random() * possibleCards.length)];
    return { award: true, cardType: randomCard as import('@/types/gameTypes').CardType };
  }
  
  // No card award
  return { award: false, cardType: 'dejavu' };
};

/**
 * Returns a random card type appropriate for the given action and round
 * @param action The action that triggered the card award
 * @param roundType The current round type
 * @returns A random card type suitable for the action and round
 */
export const getRandomCardForAction = (
  action: 'top_score' | 'lowest_score' | 'round_win' | 'consecutive_correct' | 'high_points',
  roundType: RoundType
): CardType => {
  // Get card rules from storage or use defaults
  const cardRules = loadCardRules();
  let possibleCards: CardType[] = [];
  
  // Select appropriate cards based on the action and round
  switch (action) {
    case 'top_score':
      // For top score, give strategic cards like turbo or dejavu
      possibleCards = ['turbo', 'dejavu', 'skip'];
      break;
    case 'lowest_score':
      // For lowest score (help cards)
      possibleCards = ['reanimacja', 'refleks2', 'oswiecenie'];
      break;
    case 'round_win':
      // For advancing to next round
      possibleCards = ['lustro', 'turbo', 'refleks3'];
      break;
    case 'consecutive_correct':
      // For consecutive correct answers
      possibleCards = cardRules.consecutiveCorrect?.cards || ['dejavu', 'refleks2'];
      break;
    case 'high_points':
      // For reaching high points
      possibleCards = cardRules.pointsThreshold?.cards || ['turbo'];
      break;
    default:
      // Default cards based on current round
      if (cardRules.roundSpecific && cardRules.roundSpecific[roundType]) {
        possibleCards = cardRules.roundSpecific[roundType] as CardType[];
      } else {
        // Fallback cards if round specific not found
        possibleCards = ['dejavu', 'skip', 'turbo'];
      }
  }
  
  // Return a random card from the possible options
  return possibleCards[Math.floor(Math.random() * possibleCards.length)] as CardType;
};
