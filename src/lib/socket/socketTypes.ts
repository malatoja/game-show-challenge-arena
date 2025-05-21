// Define event types for the socket
export type SocketEvent = 
  | 'player:connected'
  | 'player:disconnected'
  | 'player:ready'
  | 'player:answer'
  | 'player:card'
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
  | 'overlay:sound'  // Add the overlay:sound event
  | 'game:state';

// Define payload types for each event
export interface SocketPayloads {
  'player:connected': { playerId: string; name: string };
  'player:disconnected': { playerId: string };
  'player:ready': { playerId: string };
  'player:answer': { playerId: string; answerId: number };
  'player:card': { playerId: string; cardType: string };
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
}

// Helper type to extract payload type for a specific event
export type PayloadFor<E extends SocketEvent> = SocketPayloads[E];
