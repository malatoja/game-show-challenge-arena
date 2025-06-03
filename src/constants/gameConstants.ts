
import { CardType, Card, RoundType } from '../types/gameTypes';

// Points per question
export const MAX_POINTS_PER_QUESTION = 10;

// Categories for the wheel round
export const WHEEL_CATEGORIES = [
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

// Function to create a new card
export const createCard = (type: CardType, description?: string): Card => {
  return {
    id: `card-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    type,
    description: description || CARD_DETAILS[type].description,
    isUsed: false
  };
};

// Round names
export const ROUND_NAMES: Record<RoundType | 'all', string> = {
  'all': 'Wszystkie rundy',
  'knowledge': 'Runda Wiedzy',
  'speed': 'Runda Szybka',
  'wheel': 'Koło Fortuny',
  'standard': 'Standardowa'
};

// Card details with descriptions and effects
export const CARD_DETAILS: Record<CardType, { name: string, description: string, effect?: string }> = {
  'dejavu': { 
    name: 'Déjà Vu', 
    description: 'Pozwala na powtórzenie pytania po złej odpowiedzi', 
    effect: 'Gracz dostaje szansę odpowiedzieć ponownie na to samo pytanie.' 
  },
  'kontra': { 
    name: 'Kontra', 
    description: 'Przekazuje pytanie innemu graczowi', 
    effect: 'Pytanie zostaje przekazane wybranemu przeciwnikowi.' 
  },
  'reanimacja': { 
    name: 'Reanimacja', 
    description: 'Zapobiega utracie życia w Rundzie 2', 
    effect: 'Gracz nie traci życia przy błędnej odpowiedzi.' 
  },
  'skip': { 
    name: 'Skip', 
    description: 'Pomija aktualne pytanie', 
    effect: 'Pytanie zostaje pominięte bez kary.' 
  },
  'turbo': { 
    name: 'Turbo', 
    description: 'Podwaja zdobyte punkty', 
    effect: 'Punkty za poprawną odpowiedź zostają podwojone.' 
  },
  'refleks2': { 
    name: 'Refleks x2', 
    description: 'Podwaja czas na odpowiedź', 
    effect: 'Czas na odpowiedź zostaje podwojony.' 
  },
  'refleks3': { 
    name: 'Refleks x3', 
    description: 'Potraja czas na odpowiedź', 
    effect: 'Czas na odpowiedź zostaje potrojony.' 
  },
  'lustro': { 
    name: 'Lustro', 
    description: 'Usuwa jedną błędną odpowiedź', 
    effect: 'Jedna niepoprawna odpowiedź zostaje usunięta z opcji.' 
  },
  'oswiecenie': { 
    name: 'Oświecenie', 
    description: 'Daje wskazówkę do pytania', 
    effect: 'Gracz otrzymuje dodatkową wskazówkę.' 
  }
};

// Sample questions for testing
export const SAMPLE_QUESTIONS = [
  {
    id: "q-1",
    text: "Która planeta jest najbliżej Słońca?",
    category: "Nauka",
    answers: [
      { text: "Merkury", isCorrect: true },
      { text: "Wenus", isCorrect: false },
      { text: "Mars", isCorrect: false },
      { text: "Ziemia", isCorrect: false }
    ],
    correctAnswerIndex: 0,
    round: "knowledge",
    difficulty: "easy",
    points: 10
  },
  {
    id: "q-2",
    text: "Kto napisał 'Pan Tadeusz'?",
    category: "Literatura",
    answers: [
      { text: "Juliusz Słowacki", isCorrect: false },
      { text: "Adam Mickiewicz", isCorrect: true },
      { text: "Henryk Sienkiewicz", isCorrect: false },
      { text: "Cyprian Kamil Norwid", isCorrect: false }
    ],
    correctAnswerIndex: 1,
    round: "knowledge",
    difficulty: "easy",
    points: 10
  }
];
