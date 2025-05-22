
import { GameState, Player, PlayerId } from '../../types/gameTypes';

// Add player handler
export const handleAddPlayer = (state: GameState, player: Player): GameState => {
  return {
    ...state,
    players: [...state.players, player]
  };
};

// Update player handler
export const handleUpdatePlayer = (state: GameState, player: Player): GameState => {
  const updatedPlayers = state.players.map(p => 
    p.id === player.id ? player : p
  );
  
  return {
    ...state,
    players: updatedPlayers
  };
};

// Remove player handler
export const handleRemovePlayer = (state: GameState, playerId: PlayerId): GameState => {
  return {
    ...state,
    players: state.players.filter(p => p.id !== playerId)
  };
};

// Set active player handler
export const handleSetActivePlayer = (state: GameState, playerId: PlayerId): GameState => {
  return {
    ...state,
    activePlayerId: playerId,
    players: state.players.map(player => ({
      ...player,
      isActive: player.id === playerId
    }))
  };
};

// Handle answer question
export const handleAnswerQuestion = (state: GameState, playerId: PlayerId, isCorrect: boolean): GameState => {
  // Find the player
  const playerIndex = state.players.findIndex(p => p.id === playerId);
  if (playerIndex === -1) return state;
  
  // Update player based on correct/incorrect answer
  const updatedPlayers = [...state.players];
  const player = { ...updatedPlayers[playerIndex] };
  
  if (isCorrect) {
    // Calculate points based on difficulty
    const difficulty = state.currentQuestion?.difficulty || 'medium';
    let pointsToAdd = 10; // Default
    
    if (difficulty === 'easy') pointsToAdd = 5;
    else if (difficulty === 'hard') pointsToAdd = 15;
    
    player.points += pointsToAdd;
    player.consecutiveCorrect = (player.consecutiveCorrect || 0) + 1;
  } else {
    // Wrong answer decreases lives
    player.lives = Math.max(0, player.lives - 1);
    player.consecutiveCorrect = 0;
  }
  
  updatedPlayers[playerIndex] = player;
  
  return {
    ...state,
    players: updatedPlayers
  };
};

// Add other missing player handlers
export const handleUpdatePoints = (state: GameState, playerId: PlayerId, points: number): GameState => {
  return {
    ...state,
    players: state.players.map(player => 
      player.id === playerId ? { ...player, points } : player
    )
  };
};

export const handleUpdateLives = (state: GameState, playerId: PlayerId, lives: number): GameState => {
  return {
    ...state,
    players: state.players.map(player => 
      player.id === playerId ? { ...player, lives } : player
    )
  };
};

export const handleEliminatePlayer = (state: GameState, playerId: PlayerId): GameState => {
  return {
    ...state,
    players: state.players.map(player => 
      player.id === playerId ? { ...player, eliminated: true, lives: 0 } : player
    )
  };
};

export const handleRestorePlayer = (state: GameState, playerId: PlayerId): GameState => {
  return {
    ...state,
    players: state.players.map(player => 
      player.id === playerId ? { ...player, eliminated: false, lives: 1 } : player
    )
  };
};

export const handleResetPlayers = (state: GameState): GameState => {
  return {
    ...state,
    players: state.players.map(player => ({
      ...player,
      points: 0,
      lives: 3,
      eliminated: false,
      cards: []
    }))
  };
};
