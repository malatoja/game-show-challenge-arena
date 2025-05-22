
import { GameState, Question, Player } from '../types/gameTypes';
import * as Actions from './actions';
import * as playerHandlers from './handlers/playerHandlers';
import * as questionHandlers from './handlers/questionHandlers';
import * as cardHandlers from './handlers/cardHandlers';
import * as gameHandlers from './handlers/gameHandlers';
import * as answerHandlers from './handlers/answerHandlers';

export function gameReducer(state: GameState, action: Actions.GameAction): GameState {
  try {
    switch (action.type) {
      // Game state management actions
      case 'START_GAME':
        return gameHandlers.handleStartGame(state);
      
      case 'START_ROUND':
        return gameHandlers.handleStartRound(state, action);
      
      case 'END_ROUND':
        return gameHandlers.handleEndRound(state);
      
      case 'RESET_ROUND':
        return gameHandlers.handleResetRound(state);
      
      case 'RESTART_GAME':
        return gameHandlers.handleRestartGame();
      
      // Player management actions
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
      
      // Question management actions
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
      
      // Category and wheel management
      case 'SET_CATEGORY':
        return questionHandlers.handleSetCategory(state, action.category);
      
      case 'SPIN_WHEEL':
        return gameHandlers.handleSpinWheel(state, action.spinning);
      
      // Card management actions
      case 'USE_CARD':
        return cardHandlers.handleUseCard(state, action.playerId, action.cardType);
      
      case 'AWARD_CARD':
        return cardHandlers.handleAwardCard(state, action.playerId, action.cardType);
      
      // Point and life management actions
      case 'UPDATE_POINTS':
        return playerHandlers.handleUpdatePoints(state, action.playerId, action.points);
      
      case 'UPDATE_LIVES':
        return playerHandlers.handleUpdateLives(state, action.playerId, action.lives);
      
      case 'ELIMINATE_PLAYER':
        return playerHandlers.handleEliminatePlayer(state, action.playerId);
      
      case 'RESTORE_PLAYER':
        return playerHandlers.handleRestorePlayer(state, action.playerId);
      
      case 'RESET_PLAYERS':
        return playerHandlers.handleResetPlayers(state);
      
      default:
        return state;
    }
  } catch (error) {
    console.error('Error in game reducer:', error);
    // Return current state if there's an error
    return state;
  }
}
