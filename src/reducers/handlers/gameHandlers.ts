
import { GameState } from '../../types/gameTypes';
import { GameAction } from '../actions';

export const handleStartGame = (state: GameState): GameState => {
  return {
    ...state,
    gameStarted: true
  };
};

export const handleStartRound = (state: GameState, action: { roundType: string }): GameState => {
  // Ensure roundType is a valid RoundType
  const validRoundType = action.roundType as 'knowledge' | 'speed' | 'wheel' | 'standard';
  
  return {
    ...state,
    roundActive: true,
    currentRound: validRoundType
  };
};

export const handleEndRound = (state: GameState): GameState => {
  return {
    ...state,
    roundActive: false,
  };
};

export const handleResetRound = (state: GameState): GameState => {
  return {
    ...state,
    roundActive: false,
    currentQuestion: null,
    selectedCategory: '',
  };
};

export const handleRestartGame = (): GameState => {
  // Reset to initial state but keep questions
  const questions = [...(JSON.parse(localStorage.getItem('gameQuestions') || '[]'))];
  return {
    gameStarted: false,
    roundActive: false,
    currentRound: 'knowledge',
    players: [],
    questions: questions,
    usedQuestions: [],
    remainingQuestions: [...questions],
    currentQuestion: null,
    selectedCategory: '',
    wheelSpinning: false,
    activePlayerId: null
  };
};

export const handleSpinWheel = (state: GameState, spinning: boolean): GameState => {
  return {
    ...state,
    wheelSpinning: spinning
  };
};
