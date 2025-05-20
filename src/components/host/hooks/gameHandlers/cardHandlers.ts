import { useGame } from '@/context/GameContext';
import { CardType } from '@/types/gameTypes';
import { useEvents } from '../../EventsContext';
import { useSocket } from '@/context/SocketContext';
import { useGameHistory } from '../../context/GameHistoryContext';

export function useCardHandlers() {
  const { state, dispatch } = useGame();
  const { addEvent } = useEvents();
  const { emit } = useSocket();
  const { addAction } = useGameHistory();
  
  const handleUseCard = (playerId: string, cardType: CardType) => {
    // Get player before changes for undo
    const player = state.players.find(p => p.id === playerId);
    if (!player) return;
    
    const previousPlayerState = {...player};
    
    dispatch({ type: 'USE_CARD', playerId, cardType });
    
    // Add to action history
    addAction(
      'USE_CARD',
      `${player.name} użył karty ${cardType}`,
      [playerId],
      { cardType },
      previousPlayerState
    );
    
    // Emit the card:use event
    emit('card:use', { playerId, cardType });
    
    addEvent(`Gracz użył karty: ${cardType}`);
  };
  
  const handleAwardCard = (playerId: string, cardType: CardType) => {
    // Get player before changes for undo
    const player = state.players.find(p => p.id === playerId);
    if (!player) return;
    
    const previousPlayerState = {...player};
    const previousCardCount = player.cards.length;
    
    dispatch({ type: 'AWARD_CARD', playerId, cardType });
    
    // Add to action history
    addAction(
      'AWARD_CARD',
      `Przyznano kartę ${cardType} dla ${player.name}`,
      [playerId],
      { cardType, cardIndex: previousCardCount },
      previousPlayerState
    );
    
    // Update the player
    const updatedPlayer = state.players.find(p => p.id === playerId);
    if (updatedPlayer) {
      emit('player:update', { player: updatedPlayer });
    }
  };

  return {
    handleUseCard,
    handleAwardCard
  };
}
