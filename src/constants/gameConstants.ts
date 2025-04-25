
import { Card, CardType, Question } from "../types/gameTypes";

export const ROUND_TIME_LIMITS = {
  knowledge: 30, // seconds
  speed: 5,      // seconds
  wheel: 20      // seconds
};

export const ROUND_NAMES = {
  knowledge: "Zróżnicowana Wiedza z Polskiego Internetu",
  speed: "Runda 5 sekund",
  wheel: "Koło fortuny"
};

export const INITIAL_LIVES = 3;

export const CARD_DETAILS: Record<CardType, { name: string; description: string }> = {
  dejavu: {
    name: "Dejavu",
    description: "Pozwala na ponowną odpowiedź po błędnej odpowiedzi"
  },
  kontra: {
    name: "Kontra",
    description: "Przekazuje pytanie innemu graczowi"
  },
  reanimacja: {
    name: "Reanimacja",
    description: "Zapobiega utracie życia w Rundzie 2"
  },
  skip: {
    name: "Skip",
    description: "Pomija pytanie bez kary"
  },
  turbo: {
    name: "Turbo",
    description: "Podwaja liczbę zdobytych punktów"
  },
  refleks2: {
    name: "Refleks x2",
    description: "Podwaja czas na odpowiedź"
  },
  refleks3: {
    name: "Refleks x3",
    description: "Potraja czas na odpowiedź"
  },
  lustro: {
    name: "Lustro",
    description: "Usuwa jedną błędną odpowiedź"
  },
  oswiecenie: {
    name: "Oświecenie",
    description: "Host może udzielić wskazówki"
  }
};

export const WHEEL_CATEGORIES = [
  "Język polskiego internetu",
  "Polska scena Twitcha",
  "Zagadki",
  "Kalambury wizualne",
  "Gry, które podbiły Polskę",
  "Technologie i internet w Polsce"
];

// Sample questions for testing
export const SAMPLE_QUESTIONS: Question[] = [
  {
    id: "1",
    text: "Co oznacza skrót 'JD' w polskim internecie?",
    category: "Język polskiego internetu",
    answers: [
      { text: "Jestem Dumny", isCorrect: false },
      { text: "Ja Dziękuję", isCorrect: true },
      { text: "Jutro Dobranoc", isCorrect: false },
      { text: "Już Dawno", isCorrect: false }
    ],
    correctAnswerIndex: 1
  },
  {
    id: "2",
    text: "Kto jest twórcą popularnego formatu 'Dwóch Typów Podcast'?",
    category: "Polska scena Twitcha",
    answers: [
      { text: "Gimper i Rojo", isCorrect: false },
      { text: "Włodek i Popo", isCorrect: false },
      { text: "Izak i Friz", isCorrect: false },
      { text: "Vogule Poland i Quebonafide", isCorrect: true }
    ],
    correctAnswerIndex: 3
  },
  {
    id: "3",
    text: "Co oznacza termin 'Janusz' w polskiej kulturze internetowej?",
    category: "Język polskiego internetu",
    answers: [
      { text: "Stereotypowy starszy mężczyzna szukający promocji", isCorrect: true },
      { text: "Popularny youtuber z lat 2010-2015", isCorrect: false },
      { text: "Postać z polskiego mema", isCorrect: false },
      { text: "Bohater gry 'Wiedźmin'", isCorrect: false }
    ],
    correctAnswerIndex: 0
  }
];

export function createCard(type: CardType): Card {
  const details = CARD_DETAILS[type];
  return {
    type,
    name: details.name,
    description: details.description,
    isUsed: false
  };
}
