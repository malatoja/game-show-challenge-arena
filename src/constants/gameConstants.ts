
import { Card, CardType, Question, RoundType } from '@/types/gameTypes';

// Round names for display
export const ROUND_NAMES: Record<string, string> = {
  'knowledge': 'RUNDA 1: ZRÓŻNICOWANA WIEDZA',
  'speed': 'RUNDA 2: 5 SEKUND',
  'wheel': 'RUNDA 3: KOŁO FORTUNY',
  'standard': 'RUNDA STANDARDOWA',
  'all': 'WSZYSTKIE RUNDY'
};

// Initial lives for players
export const INITIAL_LIVES = 3;

// Wheel categories for Fortune Wheel
export const WHEEL_CATEGORIES = [
  'Memy',
  'Technologia',
  'Streaming',
  'Gry',
  'YouTube',
  'Media społecznościowe',
  'Discord',
  'Twitch',
  'Internet',
  'E-sport'
];

// Card details
export const CARD_DETAILS: Record<CardType, { name: string; description: string; }> = {
  'dejavu': { 
    name: 'Déjà Vu', 
    description: 'Powtórz ostatnie pytanie' 
  },
  'kontra': { 
    name: 'Kontra', 
    description: 'Przekaż pytanie innemu graczowi' 
  },
  'reanimacja': { 
    name: 'Na Ratunek', 
    description: 'Zapobiega utracie życia w tej rundzie' 
  },
  'skip': { 
    name: 'Pomiń', 
    description: 'Pomiń aktualne pytanie' 
  },
  'turbo': { 
    name: 'Turbo', 
    description: 'Podwójne punkty za poprawną odpowiedź' 
  },
  'refleks2': { 
    name: 'Refleks x2', 
    description: 'Podwójny czas na odpowiedź' 
  },
  'refleks3': { 
    name: 'Refleks x3', 
    description: 'Potrójny czas na odpowiedź' 
  },
  'lustro': { 
    name: 'Lustro', 
    description: 'Odbij efekt użytej karty' 
  },
  'oswiecenie': { 
    name: 'Oświecenie', 
    description: 'Podpowiedź do pytania' 
  }
};

// Create a new card
export const createCard = (cardType: CardType): Card => {
  return {
    id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: cardType,
    name: CARD_DETAILS[cardType].name,
    description: CARD_DETAILS[cardType].description,
    isUsed: false
  };
};

// Sample questions for testing
export const SAMPLE_QUESTIONS: Question[] = [
  {
    id: '1',
    text: 'Co to jest HTML?',
    category: 'Technologia',
    answers: [
      { text: 'Język programowania', isCorrect: false },
      { text: 'Język znaczników', isCorrect: true },
      { text: 'Rodzaj bazy danych', isCorrect: false },
      { text: 'Protokół internetowy', isCorrect: false }
    ],
    correctAnswerIndex: 1,
    round: 'knowledge' as RoundType,
    difficulty: 'easy',
    points: 5
  },
  {
    id: '2',
    text: 'Kto stworzył pierwszego cyfrowego mema?',
    category: 'Memy',
    answers: [
      { text: 'Steve Jobs', isCorrect: false },
      { text: 'Bill Gates', isCorrect: false },
      { text: 'Scott Fahlman', isCorrect: true },
      { text: 'Mark Zuckerberg', isCorrect: false }
    ],
    correctAnswerIndex: 2,
    round: 'knowledge' as RoundType,
    difficulty: 'medium',
    points: 10
  },
  {
    id: '3',
    text: 'Z jakiego kraju pochodzi Twitch?',
    category: 'Streaming',
    answers: [
      { text: 'USA', isCorrect: true },
      { text: 'Chiny', isCorrect: false },
      { text: 'Japonia', isCorrect: false },
      { text: 'Niemcy', isCorrect: false }
    ],
    correctAnswerIndex: 0,
    round: 'speed' as RoundType,
    difficulty: 'easy',
    points: 5
  },
  {
    id: '4',
    text: 'Co oznacza skrót PNG w formacie graficznym?',
    category: 'Technologia',
    answers: [
      { text: 'Photo New Generation', isCorrect: false },
      { text: 'Portable Network Graphics', isCorrect: true },
      { text: 'Programmable Net Graphics', isCorrect: false },
      { text: 'Personal Net Gallery', isCorrect: false }
    ],
    correctAnswerIndex: 1,
    round: 'wheel' as RoundType,
    difficulty: 'medium',
    points: 10
  },
  {
    id: '5',
    text: 'Która z platform streamingowych należy do Amazona?',
    category: 'Streaming',
    answers: [
      { text: 'YouTube', isCorrect: false },
      { text: 'Mixer', isCorrect: false },
      { text: 'Twitch', isCorrect: true },
      { text: 'Facebook Gaming', isCorrect: false }
    ],
    correctAnswerIndex: 2,
    round: 'knowledge' as RoundType,
    difficulty: 'easy',
    points: 5
  }
];

// Default questions that will be used when no questions are loaded from storage
export const DEFAULT_QUESTIONS = SAMPLE_QUESTIONS;
