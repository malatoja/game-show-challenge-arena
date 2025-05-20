import { useGame } from '@/context/GameContext';
import { Player, CardType } from '@/types/gameTypes';
import { useEvents } from '../../EventsContext';
import { useSocket } from '@/context/SocketContext';
import { useState } from 'react';
import { useGameHistory } from '../../context/GameHistoryContext';

export function usePlayerHandlers() {
  const { state, dispatch } = useGame();
  const { addEvent } = useEvents();
  const { emit } = useSocket();
  const { addAction } = useGameHistory();
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null);

  const handleSelectPlayer = (player: Player) => {
    dispatch({ type: 'SET_ACTIVE_PLAYER', playerId: player.id });
    setActivePlayerId(player.id);
    addEvent(`Wybrano gracza: ${player.name}`);
    
    // Add to action history
    addAction(
      'UPDATE_PLAYER',
      `Wybrano gracza: ${player.name}`,
      [player.id]
    );
    
    // Emit the player:active event
    emit('player:active', { playerId: player.id });
  };
  
  const handleAddPlayer = () => {
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
    
    // Emit player update event
    emit('player:update', { player: newPlayer });
    
    addEvent(`Dodano gracza: ${newPlayer.name}`);
  };

  const handleAddTestCards = (playerId: string) => {
    // Add one of each card type for testing
    // Define card types with the correct CardType type
    const cardTypes: CardType[] = [
      'dejavu', 'kontra', 'reanimacja', 'skip', 
      'turbo', 'refleks2', 'refleks3', 'lustro', 'oswiecenie'
    ];
    
    cardTypes.forEach(cardType => {
      dispatch({ type: 'AWARD_CARD', playerId, cardType });
    });
    
    // Update the player
    const updatedPlayer = state.players.find(p => p.id === playerId);
    if (updatedPlayer) {
      emit('player:update', { player: updatedPlayer });
    }
    
    addEvent(`Dodano testowe karty dla gracza`);
  };

  return {
    activePlayerId,
    setActivePlayerId,
    handleSelectPlayer,
    handleAddPlayer,
    handleAddTestCards
  };
}
