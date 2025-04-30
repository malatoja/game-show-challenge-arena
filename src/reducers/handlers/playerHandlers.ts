
import { GameState, PlayerId } from '../../types/gameTypes';

// Player management
export const handleSetActivePlayer = (state: GameState, playerId: PlayerId): GameState => {
  return {
    ...state,
    players: state.players.map(player => ({
      ...player,
      isActive: player.id === playerId
    })),
    currentPlayerIndex: state.players.findIndex(p => p.id === playerId)
  };
};

export const handleAddPlayer = (state: GameState, player: import('../../types/gameTypes').Player): GameState => {
  return {
    ...state,
    players: [...state.players, player]
  };
};

export const handleUpdatePlayer = (state: GameState, updatedPlayer: import('../../types/gameTypes').Player): GameState => {
  return {
    ...state,
    players: state.players.map(player => 
      player.id === updatedPlayer.id ? updatedPlayer : player
    )
  };
};

export const handleRemovePlayer = (state: GameState, playerId: PlayerId): GameState => {
  return {
    ...state,
    players: state.players.filter(player => player.id !== playerId)
  };
};
