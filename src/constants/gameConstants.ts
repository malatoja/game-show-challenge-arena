
import { CardType, RoundType, Question } from '@/types/gameTypes';

// Round names (for display)
export const ROUND_NAMES: Record<RoundType, string> = {
  knowledge: 'Runda Wiedzy',
  speed: 'Szybka Odpowiedź',
  wheel: 'Koło Fortuny',
  standard: 'Runda Standardowa',
  all: 'Wszystkie Rundy'
};

// Initial lives for players
export const INITIAL_LIVES = 3;

// Maximum points per question
export const MAX_POINTS_PER_QUESTION = 100;

// Card details with names, descriptions and effects
export const CARD_DETAILS: Record<CardType, { name: string, description: string, effect: string }> = {
  dejavu: {
    name: 'Déjà Vu',
    description: 'Pozwala na ponowną próbę odpowiedzi po błędzie',
    effect: 'Gracz może odpowiedzieć ponownie na pytanie, na które udzielił błędnej odpowiedzi'
  },
  kontra: {
    name: 'Kontra',
    description: 'Przekazuje pytanie innemu graczowi',
    effect: 'Gracz może przekazać trudne pytanie innemu graczowi'
  },
  reanimacja: {
    name: 'Reanimacja',
    description: 'Zapobiega utracie życia w Rundzie 2',
    effect: 'Gracz nie traci życia po udzieleniu błędnej odpowiedzi'
  },
  skip: {
    name: 'Pomiń',
    description: 'Pozwala pominąć pytanie',
    effect: 'Gracz może pominąć aktualne pytanie bez konsekwencji'
  },
  turbo: {
    name: 'Turbo',
    description: 'Podwaja zdobyte punkty',
    effect: 'Gracz otrzymuje podwójną liczbę punktów za poprawną odpowiedź'
  },
  refleks2: {
    name: 'Refleks x2',
    description: 'Podwaja czas na odpowiedź',
    effect: 'Gracz otrzymuje dwa razy więcej czasu na odpowiedź'
  },
  refleks3: {
    name: 'Refleks x3',
    description: 'Potraja czas na odpowiedź',
    effect: 'Gracz otrzymuje trzy razy więcej czasu na odpowiedź'
  },
  lustro: {
    name: 'Lustro',
    description: 'Usuwa jedną błędną odpowiedź',
    effect: 'Jedna z błędnych odpowiedzi zostaje usunięta z pytania'
  },
  oswiecenie: {
    name: 'Oświecenie',
    description: 'Daje podpowiedź do pytania',
    effect: 'Gracz otrzymuje dodatkową wskazówkę do pytania'
  }
};

// Function to create a new card object
export const createCard = (type: CardType, isUsed: boolean = false): import('@/types/gameTypes').Card => {
  return {
    id: `card-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    type,
    description: CARD_DETAILS[type].description,
    isUsed
  };
};

// Wheel categories
export const WHEEL_CATEGORIES = [
  'Nauka', 
  'Historia', 
  'Geografia', 
  'Film i TV', 
  'Muzyka', 
  'Sport', 
  'Literatura', 
  'Technologia', 
  'Gry', 
  'Sztuka', 
  'Jedzenie', 
  'Zwierzęta'
];

// Sample questions for initial state
export const SAMPLE_QUESTIONS: Question[] = [
  {
    id: '1',
    text: 'Który z tych języków NIE jest językiem programowania?',
    category: 'Programowanie',
    answers: [
      { text: 'Python', isCorrect: false },
      { text: 'HTML', isCorrect: true },
      { text: 'JavaScript', isCorrect: false },
      { text: 'Java', isCorrect: false }
    ],
    correctAnswerIndex: 1,
    round: 'knowledge',
    hint: 'To język znaczników, a nie programowania'
  },
  {
    id: '2',
    text: 'Ile wynosi wynik operacji 5 + 5 * 2?',
    category: 'Matematyka',
    answers: [
      { text: '15', isCorrect: true },
      { text: '20', isCorrect: false },
      { text: '25', isCorrect: false },
      { text: '10', isCorrect: false }
    ],
    correctAnswerIndex: 0,
    round: 'speed',
    hint: 'Pamiętaj o kolejności wykonywania działań'
  },
  {
    id: '3',
    text: 'Kto jest autorem "Pana Tadeusza"?',
    category: 'Literatura',
    answers: [
      { text: 'Juliusz Słowacki', isCorrect: false },
      { text: 'Henryk Sienkiewicz', isCorrect: false },
      { text: 'Adam Mickiewicz', isCorrect: true },
      { text: 'Bolesław Prus', isCorrect: false }
    ],
    correctAnswerIndex: 2,
    round: 'wheel',
    hint: 'Polski poeta narodowy, żył na emigracji'
  }
];
