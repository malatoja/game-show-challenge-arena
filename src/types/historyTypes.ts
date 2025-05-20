
import { Player, CardType, Question } from './gameTypes';

export type ActionType = 
  | 'ANSWER_QUESTION'
  | 'USE_CARD'
  | 'AWARD_CARD'
  | 'ELIMINATE_PLAYER'
  | 'RESTORE_PLAYER'
  | 'UPDATE_POINTS'
  | 'UPDATE_LIVES'
  | 'RESET_PLAYERS';

export interface GameAction {
  id: string;
  type: ActionType;
  timestamp: number;
  description: string;
  playerIds: string[];
  undoable: boolean;
  data?: any;
  previousState?: any;
}

export interface GameHistory {
  actions: GameAction[];
  maxActions: number;
}
