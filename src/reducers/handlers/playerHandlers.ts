import { GameState, Player, PlayerId } from '@/types/gameTypes';
import { toast } from 'sonner';

// Add a player to the game
export function handleAddPlayer(state: GameState, player: Player): GameState {
  return {
    ...state,
    players: [...state.players, player]
  };
}

// Update player data
export function handleUpdatePlayer(state: GameState, player: Player): GameState {
  const updatedPlayers = state.players.map(p => 
    p.id === player.id ? { ...p, ...player } : p
  );
  
  return {
    ...state,
    players: updatedPlayers
  };
}

// Remove a player from the game
export function handleRemovePlayer(state: GameState, playerId: string): GameState {
  return {
    ...state,
    players: state.players.filter(p => p.id !== playerId)
  };
}

// Set the active player
export function handleSetActivePlayer(state: GameState, playerId: string): GameState {
  const updatedPlayers = state.players.map(p => ({
    ...p,
    isActive: p.id === playerId
  }));
  
  return {
    ...state,
    players: updatedPlayers,
    currentPlayerIndex: state.players.findIndex(p => p.id === playerId)
  };
}

// Handle answering a question - Add this missing handler
export function handleAnswerQuestion(state: GameState, playerId: string, isCorrect: boolean): GameState {
  const playerIndex = state.players.findIndex(p => p.id === playerId);
  if (playerIndex === -1) return state;

  const player = state.players[playerIndex];
  let updatedPlayer = { ...player };

  // Update player based on answer correctness
  if (isCorrect) {
    // Increase points for correct answer
    updatedPlayer.points += state.currentQuestion?.points || 10;
    
    // Track consecutive correct answers if property exists
    if (updatedPlayer.consecutiveCorrect !== undefined) {
      updatedPlayer.consecutiveCorrect += 1;
    }
  } else {
    // Decrease lives for incorrect answer
    updatedPlayer.lives = Math.max(0, updatedPlayer.lives - 1);
    
    // Reset consecutive correct answers if property exists
    if (updatedPlayer.consecutiveCorrect !== undefined) {
      updatedPlayer.consecutiveCorrect = 0;
    }
    
    // Check if player is eliminated
    if (updatedPlayer.lives === 0) {
      updatedPlayer.eliminated = true;
    }
  }

  // Update players array with the modified player
  const updatedPlayers = [...state.players];
  updatedPlayers[playerIndex] = updatedPlayer;
  
  // Mark the current question as used
  let updatedQuestion = state.currentQuestion;
  if (updatedQuestion) {
    updatedQuestion = { ...updatedQuestion, used: true };
  }
  
  // Update remaining questions to exclude the current one
  const updatedRemainingQuestions = state.remainingQuestions.filter(
    q => q.id !== updatedQuestion?.id
  );

  return {
    ...state,
    players: updatedPlayers,
    currentQuestion: null,
    remainingQuestions: updatedRemainingQuestions
  };
}

// Update player points
export function handleUpdatePoints(state: GameState, playerId: string, points: number): GameState {
  const updatedPlayers = state.players.map(p => 
    p.id === playerId ? { ...p, points: p.points + points } : p
  );
  
  return {
    ...state,
    players: updatedPlayers
  };
}

// Update player lives
export function handleUpdateLives(state: GameState, playerId: string, lives: number): GameState {
  const player = state.players.find(p => p.id === playerId);
  if (!player) return state;
  
  const newLives = Math.max(0, player.lives + lives);
  const isEliminated = newLives <= 0;
  
  const updatedPlayers = state.players.map(p => 
    p.id === playerId ? { 
      ...p, 
      lives: newLives,
      eliminated: isEliminated
    } : p
  );
  
  return {
    ...state,
    players: updatedPlayers
  };
}

// Eliminate a player
export function handleEliminatePlayer(state: GameState, playerId: string): GameState {
  const updatedPlayers = state.players.map(p => 
    p.id === playerId ? { ...p, eliminated: true, lives: 0 } : p
  );
  
  return {
    ...state,
    players: updatedPlayers
  };
}

// Restore an eliminated player
export function handleRestorePlayer(state: GameState, playerId: string): GameState {
  const updatedPlayers = state.players.map(p => 
    p.id === playerId ? { ...p, eliminated: false, lives: 1 } : p
  );
  
  return {
    ...state,
    players: updatedPlayers
  };
}

// Reset all players (keep names but reset points, lives, etc.)
export function handleResetPlayers(state: GameState): GameState {
  const resetPlayers = state.players.map(p => ({
    ...p,
    points: 0,
    lives: 3, // Reset to starting lives
    eliminated: false,
    cards: [], // Remove all cards
    isActive: false, // Reset active state
    consecutiveCorrect: 0 // Reset streak if it exists
  }));
  
  return {
    ...state,
    players: resetPlayers
  };
}
