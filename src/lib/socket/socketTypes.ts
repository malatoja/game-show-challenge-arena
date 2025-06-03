
// Define event types for the socket
export type SocketEvent = 
  | 'player:connected'
  | 'player:disconnected'
  | 'player:ready'
  | 'player:answer'
  | 'player:card'
  | 'player:update'
  | 'player:eliminate'
  | 'player:active'
  | 'player:reset'
  | 'admin:start'
  | 'admin:question'
  | 'admin:round'
  | 'admin:correct'
  | 'admin:incorrect'
  | 'admin:reset'
  | 'admin:points'
  | 'admin:timer'
  | 'overlay:confetti'
  | 'overlay:update'
  | 'overlay:sound'
  | 'game:state'
  | 'connection:status'
  | 'connection:error'
  | 'card:use'
  | 'card:resolve'
  | 'question:show'
  | 'question:answer'
  | 'round:start'
  | 'round:end'
  // Add Discord Game Show specific events
  | 'updatePlayer'
  | 'questionUpdate'
  | 'cardUsed'
  | 'elimination'
  | 'victory'
  | 'players:update';

// Define socket connection options
export interface SocketOptions {
  reconnectionAttempts?: number;
  reconnectionDelay?: number;
  autoConnect?: boolean;
  transports?: string[];
  cors?: {
    origin: string[];
    methods: string[];
    credentials?: boolean;
  };
}

// Define payload types for each event
export interface SocketPayloads {
  'player:connected': { playerId: string; name: string };
  'player:disconnected': { playerId: string };
  'player:ready': { playerId: string };
  'player:answer': { playerId: string; answerId: number };
  'player:card': { playerId: string; cardType: string };
  'player:update': { player: Record<string, any> };
  'player:eliminate': { playerId: string };
  'player:active': { playerId: string };
  'player:reset': {};
  'admin:start': { roundType: string };
  'admin:question': { questionId: string };
  'admin:round': { roundType: string };
  'admin:correct': { playerId: string };
  'admin:incorrect': { playerId: string };
  'admin:reset': {};
  'admin:points': { playerId: string; points: number };
  'admin:timer': { seconds: number };
  'overlay:confetti': { playerId: string };
  'overlay:update': Record<string, any>;
  'overlay:sound': { type: string };
  'game:state': Record<string, any>;
  'connection:status': { connected: boolean };
  'connection:error': { message: string };
  'card:use': { playerId: string; cardType: string };
  'card:resolve': { playerId: string; cardType: string; success: boolean };
  'question:show': { question: Record<string, any> };
  'question:answer': { playerId: string; correct: boolean; answerIndex: number };
  'round:start': { roundType: string; roundName: string };
  'round:end': { roundType: string };
  // Discord Game Show specific events
  'updatePlayer': Record<string, any>;
  'questionUpdate': Record<string, any>;
  'cardUsed': Record<string, any>;
  'elimination': Record<string, any>;
  'victory': Record<string, any>;
  'players:update': any[];
}

// Helper type to extract payload type for a specific event
export type PayloadFor<E extends SocketEvent> = SocketPayloads[E];
