
import { useCallback, useState } from 'react';
import { useGame } from '@/context/GameContext';
import { useGameHistory } from '@/components/host/context/GameHistoryContext';
import { Player } from '@/types/gameTypes';
import { toast } from 'sonner';
import { useSocket } from '@/context/SocketContext';

export const usePlayerHandlers = () => {
  const { state, dispatch } = useGame();
  const { addAction } = useGameHistory();
  const { emit } = useSocket();
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null);

  const handleUpdatePoints = useCallback((playerId: string, points: number) => {
    const player = state.players.find(p => p.id === playerId);
    if (!player) return;

    const previousState = { ...player };
    const updatedPlayer = { ...player, points };

    dispatch({ type: 'UPDATE_PLAYER', player: updatedPlayer });
    
    addAction(
      'UPDATE_POINTS',
      `Zmieniono punkty gracza ${player.name} z ${player.points} na ${points}`,
      [playerId],
      { oldPoints: player.points, newPoints: points },
      previousState
    );

    // Emit player update to socket
    emit('player:update', { player: updatedPlayer });
  }, [state.players, dispatch, addAction, emit]);

  const handleUpdateLives = useCallback((playerId: string, lives: number) => {
    const player = state.players.find(p => p.id === playerId);
    if (!player) return;

    const previousState = { ...player };
    const updatedPlayer = { ...player, lives };

    dispatch({ type: 'UPDATE_PLAYER', player: updatedPlayer });
    
    addAction(
      'UPDATE_LIVES',
      `Zmieniono życia gracza ${player.name} z ${player.lives} na ${lives}`,
      [playerId],
      { oldLives: player.lives, newLives: lives },
      previousState
    );

    // Emit player update to socket
    emit('player:update', { player: updatedPlayer });
  }, [state.players, dispatch, addAction, emit]);

  // Changed signature to match the context
  const handleSelectPlayer = useCallback((playerId: string) => {
    setActivePlayerId(playerId);
    handleSetActivePlayer(playerId);
  }, []);

  const handleEliminatePlayer = useCallback((playerId: string) => {
    const player = state.players.find(p => p.id === playerId);
    if (!player) return;

    const previousState = { ...player };
    const updatedPlayer = { ...player, isEliminated: true };

    dispatch({ type: 'UPDATE_PLAYER', player: updatedPlayer });
    
    addAction(
      'ELIMINATE_PLAYER',
      `Wyeliminowano gracza ${player.name}`,
      [playerId],
      { eliminated: true },
      previousState
    );

    toast.error(`${player.name} został wyeliminowany!`);

    // Emit player update to socket
    emit('player:update', { player: updatedPlayer });
    emit('player:eliminate', { playerId });
  }, [state.players, dispatch, addAction, emit]);

  const handleRestorePlayer = useCallback((playerId: string) => {
    const player = state.players.find(p => p.id === playerId);
    if (!player) return;

    const previousState = { ...player };
    const updatedPlayer = { ...player, isEliminated: false };

    dispatch({ type: 'UPDATE_PLAYER', player: updatedPlayer });
    
    addAction(
      'RESTORE_PLAYER',
      `Przywrócono gracza ${player.name} do gry`,
      [playerId],
      { eliminated: false },
      previousState
    );

    toast.success(`${player.name} został przywrócony do gry!`);

    // Emit player update to socket
    emit('player:update', { player: updatedPlayer });
  }, [state.players, dispatch, addAction, emit]);

  const handleSetActivePlayer = useCallback((playerId: string) => {
    dispatch({ type: 'SET_ACTIVE_PLAYER', playerId });
    
    const player = state.players.find(p => p.id === playerId);
    if (player) {
      toast.info(`Aktywny gracz: ${player.name}`);
    }

    // Emit active player to socket
    emit('player:active', { playerId });
    emit('overlay:update', { activePlayerId: playerId });
  }, [state.players, dispatch, emit]);

  const handleResetPlayers = useCallback(() => {
    dispatch({ type: 'RESTART_GAME' });
    
    addAction(
      'RESET_PLAYERS',
      'Zresetowano stan graczy',
      [],
      {},
      { players: [...state.players] }
    );
    
    toast.success('Zresetowano stan graczy');
    
    // Emit player reset to socket
    emit('player:reset', {});
  }, [dispatch, addAction, state.players, emit]);

  // Changed to match the expected signature in GameControlContext
  const handleAddPlayer = useCallback(() => {
    const playerNumber = state.players.length + 1;
    const newPlayer: Player = {
      id: `player-${Date.now()}`,
      name: `Gracz ${playerNumber}`,
      lives: 3,
      points: 0,
      cards: [],
      isActive: state.players.length === 0,
      eliminated: false
    };
    
    dispatch({ type: 'ADD_PLAYER', player: newPlayer });
    toast.success(`Dodano gracza: ${newPlayer.name}`);
    
    // Emit player update to socket
    emit('player:update', { player: newPlayer });
  }, [state.players, dispatch, emit]);

  const handleAddTestCards = useCallback((playerId: string) => {
    const player = state.players.find(p => p.id === playerId);
    if (!player) return;

    // This is a mock function that would add test cards to a player
    // Implement the actual logic based on your requirements
    toast.info(`Dodano testowe karty dla gracza ${player.name}`);
  }, [state.players]);

  return {
    activePlayerId,
    handleSelectPlayer,
    handleUpdatePoints,
    handleUpdateLives,
    handleEliminatePlayer,
    handleRestorePlayer,
    handleSetActivePlayer,
    handleResetPlayers,
    handleAddPlayer,
    handleAddTestCards
  };
};
