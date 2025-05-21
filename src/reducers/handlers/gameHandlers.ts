import { GameState, Player, RoundType } from '../../types/gameTypes';
import { toast } from 'sonner';
import { INITIAL_LIVES } from "../../constants/gameConstants";

// Handle game start
export const handleGameStart = (state: GameState): GameState => {
  return {
    ...state,
    roundStarted: true,
    roundEnded: false
  };
};

// Handle round start
export const handleRoundStart = (state: GameState, roundType: RoundType): GameState => {
  // Reset all players' active state
  const updatedPlayers = state.players.map(player => ({
    ...player,
    isActive: false
  }));
  
  // Activate the first non-eliminated player
  const firstActivePlayerIndex = updatedPlayers.findIndex(p => !p.eliminated);
  if (firstActivePlayerIndex !== -1) {
    updatedPlayers[firstActivePlayerIndex] = {
      ...updatedPlayers[firstActivePlayerIndex],
      isActive: true
    };
  }
  
  // Filter questions for the current round
  const roundQuestions = state.questions.filter(q => 
    !q.used && (q.round === roundType || roundType === 'all' || !q.round)
  );
  
  return {
    ...state,
    currentRound: roundType,
    roundStarted: true,
    roundEnded: false,
    players: updatedPlayers,
    currentPlayerIndex: firstActivePlayerIndex !== -1 ? firstActivePlayerIndex : 0,
    remainingQuestions: roundQuestions,
    currentQuestion: undefined
  };
};

// Handle round end
export const handleRoundEnd = (state: GameState): GameState => {
  return {
    ...state,
    roundEnded: true,
    currentQuestion: undefined
  };
};

// Handle game restart
export const handleRestartGame = (state: GameState): GameState => {
  // Reset player stats but keep their names and avatars
  const resetPlayers = state.players.map(player => ({
    ...player,
    points: 0,
    lives: INITIAL_LIVES || 3,
    cards: [],
    isActive: false,
    eliminated: false,
    consecutiveCorrect: 0
  }));
  
  // If there are players, make the first one active
  if (resetPlayers.length > 0) {
    resetPlayers[0] = { ...resetPlayers[0], isActive: true };
  }
  
  // Reset question usage
  const resetQuestions = state.questions.map(question => ({
    ...question,
    used: false
  }));
  
  return {
    ...state,
    currentRound: 'knowledge',
    roundStarted: false,
    roundEnded: false,
    currentPlayerIndex: 0,
    players: resetPlayers,
    questions: resetQuestions,
    remainingQuestions: resetQuestions,
    currentQuestion: undefined,
    wheelSpinning: false,
    selectedCategory: undefined
  };
};
