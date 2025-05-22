
import { GameState } from '@/types/gameTypes';
import { GameAction } from './actions';
import * as gameHandlers from './handlers/gameHandlers';
import * as playerHandlers from './handlers/playerHandlers';
import * as questionHandlers from './handlers/questionHandlers';
import * as cardHandlers from './handlers/cardHandlers';
import { initialState, initialStateWithSavedQuestions } from './initialState';

// Export initialStateWithSavedQuestions to fix the import error in GameContext
export { initialStateWithSavedQuestions };

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
      return playerHandlers.handleAddPlayer(state, action.player);
    case 'UPDATE_PLAYER':
      return playerHandlers.handleUpdatePlayer(state, action.player);
    case 'REMOVE_PLAYER':
      return playerHandlers.handleRemovePlayer(state, action.playerId);
    case 'SET_ACTIVE_PLAYER':
      return playerHandlers.handleSetActivePlayer(state, action.playerId);
    case 'ANSWER_QUESTION':
      return playerHandlers.handleAnswerQuestion(state, action.playerId, action.isCorrect);
    
    // Question-related actions
    case 'SET_CURRENT_QUESTION':
      return questionHandlers.handleSetCurrentQuestion(state, action.question);
    case 'ADD_QUESTION':
      return questionHandlers.handleAddQuestion(state, action.question);
    case 'UPDATE_QUESTION':
      return questionHandlers.handleUpdateQuestion(state, action.question);
    case 'REMOVE_QUESTION':
      return questionHandlers.handleRemoveQuestion(state, action.questionId);
    case 'REVERT_QUESTION':
      return questionHandlers.handleRevertQuestion(state, action.questionId);
    case 'MARK_QUESTION_USED':
      return questionHandlers.handleMarkQuestionUsed(state, action.questionId);
    
    // Card-related actions
    case 'USE_CARD':
      return cardHandlers.handleUseCard(state, action.playerId, action.cardType);
    case 'AWARD_CARD':
      return cardHandlers.handleAwardCard(state, action.playerId, action.cardType);
    
    // Wheel actions
    case 'SPIN_WHEEL':
      return { ...state, wheelSpinning: action.spinning };
    case 'SET_CATEGORY':
      return { ...state, selectedCategory: action.category };
      
    default:
      return state;
  }
}
