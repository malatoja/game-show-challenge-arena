
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

// Card descriptions and effects
export const CARD_DESCRIPTIONS: Record<CardType, string> = {
  dejavu: 'Pozwala na ponowną próbę odpowiedzi po błędzie',
  kontra: 'Przekazuje pytanie innemu graczowi',
  reanimacja: 'Zapobiega utracie życia w Rundzie 2',
  skip: 'Pozwala pominąć pytanie',
  turbo: 'Podwaja zdobyte punkty',
  refleks2: 'Podwaja czas na odpowiedź',
  refleks3: 'Potraja czas na odpowiedź',
  lustro: 'Usuwa jedną błędną odpowiedź',
  oswiecenie: 'Daje podpowiedź do pytania'
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
