
import { CardType } from '@/types/gameTypes';

export interface CardEffect {
  name: string;
  description: string;
  shortDescription: string;
  applyEffect: (state: any) => any;
  animationDuration?: number;
}

export const CARD_EFFECTS: Record<CardType, CardEffect> = {
  dejavu: {
    name: "Deja Vu",
    description: "Pozwala powtórnie odpowiedzieć na pytanie po udzieleniu błędnej odpowiedzi",
    shortDescription: "Dodatkowa szansa",
    animationDuration: 2000,
    applyEffect: (state) => {
      return {
        ...state,
        canRetry: true
      };
    }
  },
  
  kontra: {
    name: "Kontra",
    description: "Przekazuje pytanie innemu graczowi",
    shortDescription: "Przekaż pytanie",
    animationDuration: 1500,
    applyEffect: (state) => {
      return {
        ...state,
        canTransferQuestion: true
      };
    }
  },
  
  reanimacja: {
    name: "Reanimacja",
    description: "Zapobiega utracie życia w 2 rundzie",
    shortDescription: "Zapobiega śmierci",
    animationDuration: 2500,
    applyEffect: (state) => {
      return {
        ...state,
        preventLifeLoss: true
      };
    }
  },
  
  skip: {
    name: "Skip",
    description: "Pomija aktualne pytanie bez konsekwencji",
    shortDescription: "Pomiń pytanie",
    animationDuration: 1000,
    applyEffect: (state) => {
      return {
        ...state,
        skipQuestion: true
      };
    }
  },
  
  turbo: {
    name: "Turbo",
    description: "Podwaja liczbę punktów za poprawną odpowiedź",
    shortDescription: "Podwójne punkty",
    animationDuration: 2000,
    applyEffect: (state) => {
      return {
        ...state,
        pointMultiplier: 2
      };
    }
  },
  
  refleks2: {
    name: "Refleks x2",
    description: "Podwaja dostępny czas na odpowiedź",
    shortDescription: "Podwójny czas",
    animationDuration: 1500,
    applyEffect: (state) => {
      return {
        ...state,
        timeExtensionFactor: 2
      };
    }
  },
  
  refleks3: {
    name: "Refleks x3",
    description: "Potraja dostępny czas na odpowiedź",
    shortDescription: "Potrójny czas",
    animationDuration: 1500,
    applyEffect: (state) => {
      return {
        ...state,
        timeExtensionFactor: 3
      };
    }
  },
  
  lustro: {
    name: "Lustro",
    description: "Usuwa jedną niepoprawną odpowiedź",
    shortDescription: "Usuń błędną odpowiedź",
    animationDuration: 2000,
    applyEffect: (state) => {
      return {
        ...state,
        removeWrongAnswer: true
      };
    }
  },
  
  oswiecenie: {
    name: "Oświecenie",
    description: "Daje wskazówkę do aktualnego pytania",
    shortDescription: "Otrzymaj wskazówkę",
    animationDuration: 2000,
    applyEffect: (state) => {
      return {
        ...state,
        showHint: true
      };
    }
  }
};

export const getCardById = (cardType: CardType): CardEffect => CARD_EFFECTS[cardType];
