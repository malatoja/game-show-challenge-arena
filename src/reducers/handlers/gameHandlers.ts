import { GameState, RoundType } from '../../types/gameTypes';

// Start the game
export const handleStartGame = (state: GameState): GameState => {
  return {
    ...state,
    gameStarted: true,
    roundActive: false,
    roundStarted: false,
    roundEnded: false,
    currentRound: 'knowledge',
    players: state.players.map(player => ({ ...player, points: 0, lives: 3, eliminated: false })),
    usedQuestions: [],
    remainingQuestions: [...state.questions],
    currentQuestion: null,
    selectedCategory: '',
    wheelSpinning: false,
    activePlayerId: state.players.find(player => player.isActive)?.id || null,
    currentPlayerIndex: 0
  };
};

// Start a new round
export const handleStartRound = (state: GameState, action: { round: RoundType }): GameState => {
  return {
    ...state,
    roundActive: true,
    roundStarted: true,
    roundEnded: false,
    currentRound: action.round,
    currentQuestion: null,
    selectedCategory: '',
    wheelSpinning: false
  };
};

// End the current round
export const handleEndRound = (state: GameState): GameState => {
  return {
    ...state,
    roundActive: false,
    roundStarted: false,
    roundEnded: true,
    currentQuestion: null,
    selectedCategory: '',
    wheelSpinning: false
  };
};

// Reset the round
export const handleResetRound = (state: GameState): GameState => {
  return {
    ...state,
    roundActive: false,
    roundStarted: false,
    roundEnded: false,
    currentQuestion: null,
    selectedCategory: '',
    wheelSpinning: false
  };
};

export const handleRestartGame = (): GameState => {
  return {
    gameStarted: false,
    roundActive: false,
    roundStarted: false,
    roundEnded: false,
    currentRound: 'knowledge',
    players: [],
    questions: [],
    usedQuestions: [],
    remainingQuestions: [],
    currentQuestion: null,
    selectedCategory: '',
    wheelSpinning: false,
    activePlayerId: null,
    currentPlayerIndex: 0
  };
};
