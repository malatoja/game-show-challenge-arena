import { RoundType, CardType } from '@/types/gameTypes';

// This is a partial update to fix the error with ROUND_NAMES

export const ROUND_NAMES: Record<RoundType | 'all', string> = {
  'knowledge': 'Runda Wiedzy',
  'speed': 'Szybka Odpowiedź',
  'wheel': 'Koło Fortuny',
  'standard': 'Standardowa Runda',
  'all': 'Wszystkie Rundy'
};

export const CARD_DETAILS: Record<CardType, { name: string; description: string }> = {
  dejavu: {
    name: 'Dejavu',
    description: 'Powtórz pytanie po błędnej odpowiedzi.'
  },
  kontra: {
    name: 'Kontra',
    description: 'Przekaż pytanie innemu graczowi.'
  },
  reanimacja: {
    name: 'Reanimacja',
    description: 'Zapobiega utracie życia w Rundzie 2.'
  },
  skip: {
    name: 'Skip',
    description: 'Pomiń pytanie.'
  },
  turbo: {
    name: 'Turbo',
    description: 'Podwój punkty za pytanie.'
  },
  refleks2: {
    name: 'Refleks 2x',
    description: 'Podwój czas na odpowiedź.'
  },
  refleks3: {
    name: 'Refleks 3x',
    description: 'Potrój czas na odpowiedź.'
  },
  lustro: {
    name: 'Lustro',
    description: 'Usuwa błędną odpowiedź.'
  },
  oswiecenie: {
    name: 'Oswiecenie',
    description: 'Otrzymaj podpowiedź.'
  }
};

export const SAMPLE_QUESTIONS = [
  {
    id: '1',
    text: 'Co to jest JavaScript?',
    category: 'Programowanie',
    answers: [
      { text: 'Język programowania', isCorrect: true },
      { text: 'Rodzaj kawy', isCorrect: false },
      { text: 'System operacyjny', isCorrect: false },
      { text: 'Edytor tekstu', isCorrect: false },
    ],
    correctAnswerIndex: 0,
    difficulty: 'easy',
    round: 'knowledge',
    used: false,
    favorite: false,
  },
  {
    id: '2',
    text: 'Który operator służy do porównywania dwóch wartości w JavaScript?',
    category: 'Programowanie',
    answers: [
      { text: '=', isCorrect: false },
      { text: '==', isCorrect: true },
      { text: '===', isCorrect: false },
      { text: '!=', isCorrect: false },
    ],
    correctAnswerIndex: 1,
    difficulty: 'medium',
    round: 'knowledge',
    used: false,
    favorite: false,
  },
  {
    id: '3',
    text: 'Co oznacza skrót HTML?',
    category: 'Web Development',
    answers: [
      { text: 'Hyper Text Markup Language', isCorrect: true },
      { text: 'Highly Typed Machine Language', isCorrect: false },
      { text: 'Home Tool Markup Language', isCorrect: false },
      { text: 'Hyper Transfer Markup Language', isCorrect: false },
    ],
    correctAnswerIndex: 0,
    difficulty: 'easy',
    round: 'knowledge',
    used: false,
    favorite: false,
  },
  {
    id: '4',
    text: 'Który język jest często używany do stylizacji stron internetowych?',
    category: 'Web Development',
    answers: [
      { text: 'JavaScript', isCorrect: false },
      { text: 'HTML', isCorrect: false },
      { text: 'CSS', isCorrect: true },
      { text: 'Python', isCorrect: false },
    ],
    correctAnswerIndex: 2,
    difficulty: 'easy',
    round: 'knowledge',
    used: false,
    favorite: false,
  },
  {
    id: '5',
    text: 'Co to jest React?',
    category: 'Web Development',
    answers: [
      { text: 'Biblioteka JavaScript', isCorrect: true },
      { text: 'Język programowania', isCorrect: false },
      { text: 'System operacyjny', isCorrect: false },
      { text: 'Edytor tekstu', isCorrect: false },
    ],
    correctAnswerIndex: 0,
    difficulty: 'medium',
    round: 'knowledge',
    used: false,
    favorite: false,
  },
  {
    id: '6',
    text: 'Która firma stworzyła JavaScript?',
    category: 'Programowanie',
    answers: [
      { text: 'Microsoft', isCorrect: false },
      { text: 'Google', isCorrect: false },
      { text: 'Netscape', isCorrect: true },
      { text: 'Apple', isCorrect: false },
    ],
    correctAnswerIndex: 2,
    difficulty: 'hard',
    round: 'knowledge',
    used: false,
    favorite: false,
  },
  {
    id: '7',
    text: 'Co to jest algorytm?',
    category: 'Informatyka',
    answers: [
      { text: 'Przepis na ciasto', isCorrect: false },
      { text: 'Sposób na szybkie liczenie', isCorrect: false },
      { text: 'Uporządkowany sposób rozwiązania problemu', isCorrect: true },
      { text: 'Nowy model komputera', isCorrect: false },
    ],
    correctAnswerIndex: 2,
    difficulty: 'medium',
    round: 'knowledge',
    used: false,
    favorite: false,
  },
  {
    id: '8',
    text: 'Który z poniższych NIE jest językiem programowania?',
    category: 'Programowanie',
    answers: [
      { text: 'Python', isCorrect: false },
      { text: 'JavaScript', isCorrect: false },
      { text: 'HTML', isCorrect: true },
      { text: 'Java', isCorrect: false },
    ],
    correctAnswerIndex: 2,
    difficulty: 'easy',
    round: 'knowledge',
    used: false,
    favorite: false,
  },
  {
    id: '9',
    text: 'Co to jest API?',
    category: 'Web Development',
    answers: [
      { text: 'Application Programming Interface', isCorrect: true },
      { text: 'Advanced Program Integration', isCorrect: false },
      { text: 'Automated Processing Instruction', isCorrect: false },
      { text: 'Application Process Interaction', isCorrect: false },
    ],
    correctAnswerIndex: 0,
    difficulty: 'medium',
    round: 'knowledge',
    used: false,
    favorite: false,
  },
  {
    id: '10',
    text: 'Który z poniższych jest systemem kontroli wersji?',
    category: 'Informatyka',
    answers: [
      { text: 'Microsoft Word', isCorrect: false },
      { text: 'Git', isCorrect: true },
      { text: 'Adobe Photoshop', isCorrect: false },
      { text: 'Mozilla Firefox', isCorrect: false },
    ],
    correctAnswerIndex: 1,
    difficulty: 'medium',
    round: 'knowledge',
    used: false,
    favorite: false,
  },
];
