import { GameState, Player, PlayerId } from '../../types/gameTypes';

// Add the handleAnswerQuestion function to fix errors
export const handleAnswerQuestion = (state: GameState, playerId: PlayerId, isCorrect: boolean): GameState => {
  // Find the player
  const playerIndex = state.players.findIndex(p => p.id === playerId);
  if (playerIndex === -1) return state;
  
  // Update player based on correct/incorrect answer
  const updatedPlayers = [...state.players];
  const player = { ...updatedPlayers[playerIndex] };
  
  if (isCorrect) {
    // Calculate points based on difficulty
    const difficulty = state.currentQuestion?.difficulty || 1;
    const pointsToAdd = difficulty * 10;
    player.points += pointsToAdd;
  } else {
    // Wrong answer decreases lives
    player.lives = Math.max(0, player.lives - 1);
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
      player.id === playerId ? { ...player, points: points } : player
    )
  };
};

export const handleUpdateLives = (state: GameState, playerId: PlayerId, lives: number): GameState => {
  return {
    ...state,
    players: state.players.map(player => 
      player.id === playerId ? { ...player, lives: lives } : player
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
