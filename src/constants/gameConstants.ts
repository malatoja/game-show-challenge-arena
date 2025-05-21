
import { CardType, Card } from '@/types/gameTypes';

export const ROUND_NAMES: Record<string, string> = {
  knowledge: 'Eliminacje',
  speed: 'Szybka odpowiedź',
  wheel: 'Koło fortuny',
  standard: 'Standardowa',
  all: 'Wszystkie rundy'
};

export const CARD_DETAILS: Record<CardType, { name: string; description: string }> = {
  dejavu: {
    name: 'Deja Vu',
    description: 'Pozwala powtórnie odpowiedzieć na pytanie po udzieleniu błędnej odpowiedzi'
  },
  kontra: {
    name: 'Kontra',
    description: 'Przekazuje pytanie innemu graczowi'
  },
  reanimacja: {
    name: 'Reanimacja',
    description: 'Zapobiega utracie życia w 2 rundzie'
  },
  skip: {
    name: 'Skip',
    description: 'Pomija aktualne pytanie bez konsekwencji'
  },
  turbo: {
    name: 'Turbo',
    description: 'Podwaja liczbę punktów za poprawną odpowiedź'
  },
  refleks2: {
    name: 'Refleks x2',
    description: 'Podwaja dostępny czas na odpowiedź'
  },
  refleks3: {
    name: 'Refleks x3',
    description: 'Potraja dostępny czas na odpowiedź'
  },
  lustro: {
    name: 'Lustro',
    description: 'Usuwa jedną niepoprawną odpowiedź'
  },
  oswiecenie: {
    name: 'Oświecenie',
    description: 'Daje wskazówkę do aktualnego pytania'
  }
};

// Card conflict definitions
export const CONFLICTING_CARDS: Record<CardType, CardType[]> = {
  dejavu: ['skip', 'kontra'],
  kontra: ['skip', 'dejavu'],
  reanimacja: [],
  skip: ['dejavu', 'kontra'],
  turbo: [],
  refleks2: ['refleks3'],
  refleks3: ['refleks2'],
  lustro: [],
  oswiecenie: []
};

// Create a card instance
export function createCard(type: CardType): Card {
  return {
    id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, // Generate unique id
    type,
    name: CARD_DETAILS[type].name,
    description: CARD_DETAILS[type].description,
    isUsed: false
  };
}

// Check if two cards conflict
export function doCardsConflict(cardType1: CardType, cardType2: CardType): boolean {
  return CONFLICTING_CARDS[cardType1]?.includes(cardType2) || 
         CONFLICTING_CARDS[cardType2]?.includes(cardType1);
}

// Difficulty options
export const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Łatwy' },
  { value: 'medium', label: 'Średni' },
  { value: 'hard', label: 'Trudny' }
];

// Round options
export const ROUND_OPTIONS = [
  { value: 'knowledge', label: 'Runda 1: Eliminacje' },
  { value: 'speed', label: 'Runda 2: Szybka odpowiedź' },
  { value: 'wheel', label: 'Runda 3: Koło fortuny' },
  { value: 'standard', label: 'Standardowa (poza rundami)' },
  { value: 'all', label: 'Wszystkie rundy' }
];
