
import { GameState, RoundType } from '../../types/gameTypes';
import { INITIAL_LIVES } from '../../constants/gameConstants';
import { initialStateWithSavedQuestions } from '../initialState';

// Game stage handlers
export const handleGameStart = (state: GameState): GameState => {
  return {
    ...state,
    roundStarted: false,
    roundEnded: false,
    currentRound: 'knowledge',
    remainingQuestions: [...state.questions.filter(q => !q.used)],
  };
};

export const handleRoundStart = (state: GameState, roundType: RoundType): GameState => {
  return {
    ...state,
    currentRound: roundType,
    roundStarted: true,
    roundEnded: false,
    
    // Reset lives if starting Round 3 (Wheel)
    players: roundType === 'wheel' ? 
      state.players.map(player => ({
        ...player,
        lives: INITIAL_LIVES,
      })) : state.players
  };
};

export const handleRoundEnd = (state: GameState): GameState => {
  return {
    ...state,
    roundStarted: false,
    roundEnded: true,
  };
};

export const handleRestartGame = (state: GameState): GameState => {
  return {
    ...initialStateWithSavedQuestions(),
    players: state.players.map(player => ({
      ...player,
      points: 0,
      lives: INITIAL_LIVES,
      cards: [],
      eliminated: false,
      isActive: false
    }))
  };
};
