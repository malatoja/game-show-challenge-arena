
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
        return gameHandlers.handleStartRound(state, { round: action.roundType });
      
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
        return answerHandlers.handleAnswerQuestion(state, action.playerId, action.isCorrect);
      
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
        return { ...state, selectedCategory: action.category };
      
      case 'SPIN_WHEEL':
        return { ...state, wheelSpinning: action.spinning };
      
      // Card management actions
      case 'USE_CARD':
        return cardHandlers.handleUseCard(state, action.playerId, action.cardType);
      
      case 'AWARD_CARD':
        return cardHandlers.handleAwardCard(state, action.playerId, action.cardType);
      
      // Point and life management actions - new handlers
      case 'UPDATE_POINTS':
        return {
          ...state,
          players: state.players.map(player => 
            player.id === action.playerId 
              ? { ...player, points: action.points } 
              : player
          )
        };
      
      case 'UPDATE_LIVES':
        return {
          ...state,
          players: state.players.map(player => 
            player.id === action.playerId 
              ? { ...player, lives: action.lives } 
              : player
          )
        };
      
      case 'ELIMINATE_PLAYER':
        return {
          ...state,
          players: state.players.map(player => 
            player.id === action.playerId 
              ? { ...player, eliminated: true } 
              : player
          )
        };
      
      case 'RESTORE_PLAYER':
        return {
          ...state,
          players: state.players.map(player => 
            player.id === action.playerId 
              ? { ...player, eliminated: false } 
              : player
          )
        };
      
      case 'RESET_PLAYERS':
        return {
          ...state,
          players: state.players.map(player => ({
            ...player,
            points: 0,
            lives: 3,
            cards: [],
            eliminated: false
          }))
        };
      
      default:
        return state;
    }
  } catch (error) {
    console.error('Error in game reducer:', error);
    // Return current state if there's an error
    return state;
  }
}
