
export type PlayerId = string;
export type RoundType = 'knowledge' | 'speed' | 'wheel' | 'standard';

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
  avatar?: string; // Added for compatibility
  lives: number;
  points: number;
  cards: Card[];
  isActive: boolean;
  streamUrl?: string; // URL to Twitch stream
  cameraUrl?: string; // Added for camera URL
  eliminated: boolean;
  color?: string; // Adding color property
  consecutiveCorrect?: number; // Track consecutive correct answers
  token?: string; // Added for player token
}

export interface Card {
  id?: string;
  type: CardType;
  name?: string;
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
  round?: RoundType;
  difficulty?: 'easy' | 'medium' | 'hard';
  used?: boolean;
  favorite?: boolean;
  points?: number;
  hint?: string;
  imageUrl?: string; // Added for question images
}

export interface Answer {
  text: string;
  isCorrect: boolean;
}

export interface GameState {
  gameStarted: boolean;
  roundActive: boolean;
  currentRound: RoundType;
  players: Player[];
  questions: Question[];
  usedQuestions: Question[];
  remainingQuestions: Question[];
  currentQuestion: Question | null;
  selectedCategory: string;
  wheelSpinning: boolean;
  activePlayerId: string | null;
  timeRemaining?: number; // Added for timer functionality
  // Adding missing properties
  roundStarted: boolean;
  roundEnded: boolean;
  currentPlayerIndex?: number;
}
