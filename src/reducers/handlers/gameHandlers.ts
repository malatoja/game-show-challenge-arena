import { initialState } from '../initialState';
import { GameState, RoundType } from '@/types/gameTypes';
import * as Actions from '../actions';

// Start a new game
export function handleStartGame(state: GameState): GameState {
  return {
    ...state,
    gameStarted: true,
    currentRound: 'knowledge' as RoundType,
    roundStarted: false,
    roundEnded: false
  };
}

// Start a new round
export function handleStartRound(
  state: GameState,
  action: Extract<Actions.GameAction, { type: 'START_ROUND' }>
): GameState {
  return {
    ...state,
    currentRound: action.roundType,
    roundStarted: true,
    roundEnded: false,
    // Reset the current question when starting a new round
    currentQuestion: null
  };
}

// End the current round
export function handleEndRound(state: GameState): GameState {
  return {
    ...state,
    roundEnded: true,
    // Reset current question at the end of the round
    currentQuestion: null
  };
}

// Reset the current round but keep scores
export function handleResetRound(state: GameState): GameState {
  return {
    ...state,
    roundStarted: true,
    roundEnded: false,
    currentQuestion: null,
    wheelSpinning: false
  };
}

// Restart the game completely
export function handleRestartGame(): GameState {
  return {
    ...initialState,
    // Preserve some settings if needed
    questions: initialState.questions
  };
}
