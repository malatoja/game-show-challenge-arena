
// Define socket event types
export type SocketEvent = 
  // Game state events
  | 'round:start'
  | 'round:end' 
  | 'question:show'
  | 'question:answer'
  | 'player:eliminate'
  // Card events
  | 'card:use'
  | 'card:resolve'
  // Player events
  | 'player:update'
  | 'player:active'
  | 'player:reset'
  // Overlay events
  | 'overlay:update'
  | 'overlay:confetti'
  // Connection events
  | 'connection:status'
  | 'connection:error';

// Define payload types for each event
export interface SocketPayloads {
  'round:start': { roundType: import('@/types/gameTypes').RoundType, roundName: string };
  'round:end': { roundType: import('@/types/gameTypes').RoundType };
  'question:show': { question: import('@/types/gameTypes').Question };
  'question:answer': { playerId: string, correct: boolean, answerIndex: number };
  'player:eliminate': { playerId: string };
  'card:use': { playerId: string, cardType: import('@/types/gameTypes').CardType };
  'card:resolve': { playerId: string, cardType: import('@/types/gameTypes').CardType, success: boolean };
  'player:update': { player: import('@/types/gameTypes').Player };
  'player:active': { playerId: string };
  'player:reset': {};
  'overlay:update': { 
    question?: import('@/types/gameTypes').Question, 
    activePlayerId?: string, 
    category?: string, 
    difficulty?: number,
    timeRemaining?: number
  };
  'overlay:confetti': { playerId: string };
  'connection:status': { connected: boolean };
  'connection:error': { message: string };
}

// Socket connection options type
export interface SocketOptions {
  reconnectionAttempts: number;
  reconnectionDelay: number;
  autoConnect: boolean;
  transports: string[];
}
