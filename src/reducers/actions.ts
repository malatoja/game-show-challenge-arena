
import { PlayerId, Question, RoundType, CardType } from '../types/gameTypes';

// Define all action types
export type GameAction = 
  | { type: 'START_GAME' }
  | { type: 'START_ROUND'; roundType: RoundType }
  | { type: 'END_ROUND' }
  | { type: 'RESET_ROUND' }
  | { type: 'SET_ACTIVE_PLAYER'; playerId: PlayerId }
  | { type: 'SET_CURRENT_QUESTION'; question: Question }
  | { type: 'ANSWER_QUESTION'; playerId: PlayerId; isCorrect: boolean }
  | { type: 'ADD_PLAYER'; player: import('../types/gameTypes').Player }
  | { type: 'UPDATE_PLAYER'; player: import('../types/gameTypes').Player }
  | { type: 'REMOVE_PLAYER'; playerId: PlayerId }
  | { type: 'SPIN_WHEEL'; spinning: boolean }
  | { type: 'SET_CATEGORY'; category: string }
  | { type: 'USE_CARD'; playerId: PlayerId; cardType: CardType }
  | { type: 'AWARD_CARD'; playerId: PlayerId; cardType: CardType }
  | { type: 'ADD_QUESTION'; question: Question }
  | { type: 'UPDATE_QUESTION'; question: Question }
  | { type: 'REMOVE_QUESTION'; questionId: string }
  | { type: 'RESTART_GAME' }
  | { type: 'REVERT_QUESTION'; questionId: string }
  | { type: 'MARK_QUESTION_USED'; questionId: string };
