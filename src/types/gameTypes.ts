
export type PlayerId = string;
export type RoundType = 'knowledge' | 'speed' | 'wheel' | 'standard' | 'all';

export type CardType = 
  | 'dejavu'     // Retry after wrong answer
  | 'kontra'     // Pass question to another player
  | 'reanimacja' // Prevent life loss in Round 2
  | 'skip'       // Skip a question
  | 'turbo'      // Double points
  | 'refleks2'   // Double answer time
  | 'refleks3'   // Triple answer time
  | 'lustro'     // Remove wrong answer
  | 'oswiecenie'; // Get a hint

export interface Player {
  id: PlayerId;
  name: string;
  avatarUrl?: string;
  lives: number;
  points: number;
  cards: Card[];
  isActive: boolean;
  streamUrl?: string; // URL to Twitch stream
  eliminated: boolean;
  color?: string; // Adding color property
}

export interface Card {
  id?: string; // Adding id as optional
  type: CardType;
  name?: string; // Adding name as optional
  description: string;
  isUsed: boolean;
}

export interface Question {
  id: string;
  text: string;
  category: string;
  answers: Answer[];
  correctAnswerIndex: number;
  timeLimit?: number; // in seconds
  round?: RoundType; // Adding round property
  difficulty?: 'easy' | 'medium' | 'hard'; // Adding difficulty property
  used?: boolean; // Adding used property
  favorite?: boolean; // Adding favorite property
  points?: number; // Adding points property
}

export interface Answer {
  text: string;
  isCorrect: boolean;
}

export interface GameState {
  currentRound: RoundType;
  players: Player[];
  currentPlayerIndex: number;
  currentQuestion?: Question;
  questions: Question[];
  remainingQuestions: Question[];
  roundStarted: boolean;
  roundEnded: boolean;
  wheelSpinning: boolean;
  selectedCategory?: string;
}
