
import { GameState } from '@/types/gameTypes';
import { GameAction } from './actions';
import * as gameHandlers from './handlers/gameHandlers';
import * as playerHandlers from './handlers/playerHandlers';
import * as questionHandlers from './handlers/questionHandlers';
import * as cardHandlers from './handlers/cardHandlers';

// Main game reducer
export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    // Game state actions
    case 'START_GAME':
      return gameHandlers.handleStartGame(state);
    case 'START_ROUND':
      return gameHandlers.handleStartRound(state, action);
    case 'END_ROUND':
      return gameHandlers.handleEndRound(state);
    case 'RESTART_GAME':
      return gameHandlers.handleRestartGame();
    case 'RESET_ROUND':
      return gameHandlers.handleResetRound(state);
    
    // Player-related actions
    case 'ADD_PLAYER':
      return playerHandlers.handleAddPlayer(state, action);
    case 'UPDATE_PLAYER':
      return playerHandlers.handleUpdatePlayer(state, action);
    case 'REMOVE_PLAYER':
      return playerHandlers.handleRemovePlayer(state, action);
    case 'SET_ACTIVE_PLAYER':
      return playerHandlers.handleSetActivePlayer(state, action);
    case 'ANSWER_QUESTION':
      return playerHandlers.handleAnswerQuestion(state, action);
    
    // Question-related actions
    case 'SET_CURRENT_QUESTION':
      return questionHandlers.handleSetCurrentQuestion(state, action);
    case 'ADD_QUESTION':
      return questionHandlers.handleAddQuestion(state, action);
    case 'UPDATE_QUESTION':
      return questionHandlers.handleUpdateQuestion(state, action);
    case 'REMOVE_QUESTION':
      return questionHandlers.handleRemoveQuestion(state, action);
    case 'REVERT_QUESTION':
      return questionHandlers.handleRevertQuestion(state, action);
    case 'MARK_QUESTION_USED':
      return questionHandlers.handleMarkQuestionUsed(state, action);
    
    // Card-related actions
    case 'USE_CARD':
      return cardHandlers.handleUseCard(state, action);
    case 'AWARD_CARD':
      return cardHandlers.handleAwardCard(state, action);
    
    // Wheel actions
    case 'SPIN_WHEEL':
      return { ...state, wheelSpinning: action.spinning };
    case 'SET_CATEGORY':
      return { ...state, selectedCategory: action.category };
      
    default:
      return state;
  }
}
