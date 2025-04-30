
import { GameState } from '../types/gameTypes';
import { toast } from 'sonner';
import { GameAction } from './actions';
import { initialStateWithSavedQuestions } from './initialState';

// Import all handlers
import { 
  handleGameStart, 
  handleRoundStart, 
  handleRoundEnd,
  handleRestartGame
} from './handlers/gameHandlers';

import {
  handleSetActivePlayer,
  handleAddPlayer,
  handleUpdatePlayer,
  handleRemovePlayer
} from './handlers/playerHandlers';

import {
  handleSetCurrentQuestion,
  handleAddQuestion,
  handleUpdateQuestion,
  handleRemoveQuestion,
  handleRevertQuestion,
  handleMarkQuestionUsed
} from './handlers/questionHandlers';

import { handleAnswerQuestion } from './handlers/answerHandlers';
import { handleUseCard, handleAwardCard } from './handlers/cardHandlers';

// Main reducer function
export function gameReducer(state: GameState, action: GameAction): GameState {
  try {
    switch (action.type) {
      case 'START_GAME':
        return handleGameStart(state);
      
      case 'START_ROUND':
        return handleRoundStart(state, action.roundType);
      
      case 'END_ROUND':
        return handleRoundEnd(state);
      
      case 'SET_ACTIVE_PLAYER':
        return handleSetActivePlayer(state, action.playerId);
      
      case 'SET_CURRENT_QUESTION':
        return handleSetCurrentQuestion(state, action.question);
      
      case 'ANSWER_QUESTION':
        return handleAnswerQuestion(state, action.playerId, action.isCorrect);
      
      case 'ADD_PLAYER':
        return handleAddPlayer(state, action.player);

      case 'UPDATE_PLAYER':
        return handleUpdatePlayer(state, action.player);
      
      case 'REMOVE_PLAYER':
        return handleRemovePlayer(state, action.playerId);
      
      case 'SPIN_WHEEL':
        return {
          ...state,
          wheelSpinning: action.spinning
        };
      
      case 'SET_CATEGORY':
        return {
          ...state,
          selectedCategory: action.category
        };
      
      case 'USE_CARD':
        return handleUseCard(state, action.playerId, action.cardType);
      
      case 'AWARD_CARD':
        return handleAwardCard(state, action.playerId, action.cardType);

      case 'ADD_QUESTION':
        return handleAddQuestion(state, action.question);
      
      case 'UPDATE_QUESTION':
        return handleUpdateQuestion(state, action.question);
      
      case 'REMOVE_QUESTION':
        return handleRemoveQuestion(state, action.questionId);
      
      case 'REVERT_QUESTION':
        return handleRevertQuestion(state, action.questionId);

      case 'MARK_QUESTION_USED':
        return handleMarkQuestionUsed(state, action.questionId);
      
      case 'RESTART_GAME':
        return handleRestartGame(state);
      
      default:
        return state;
    }
  } catch (error) {
    console.error('Unhandled error in game reducer:', error);
    toast.error(`An unexpected error occurred: ${(error as Error).message || 'Unknown error'}`);
    return state;
  }
}

// Re-export everything from initialState for backward compatibility
export { initialState, initialStateWithSavedQuestions, loadQuestionsFromStorage } from './initialState';
