
import { useCallback } from 'react';
import { useGame } from '@/context/GameContext';
import { useSocket } from '@/context/SocketContext';
import { CardType } from '@/types/gameTypes';
import { toast } from 'sonner';
import { useGameHistory } from '@/components/host/context/GameHistoryContext';

export const useCardHandlers = () => {
  const { state, dispatch } = useGame();
  const { emit } = useSocket();
  const { addAction } = useGameHistory();
  
  const handleUseCard = useCallback((playerId: string, cardType: CardType) => {
    dispatch({ type: 'USE_CARD', playerId, cardType });
    
    const player = state.players.find(p => p.id === playerId);
    if (player) {
      addAction(
        'USE_CARD',
        `${player.name} używa karty: ${cardType}`,
        [playerId],
        { cardType },
        null
      );
      
      toast.info(`${player.name} użył karty: ${cardType}`);
      
      // Emit card use event
      emit('card:use', { playerId, cardType });
    }
  }, [state.players, dispatch, emit, addAction]);
  
  const handleAwardCard = useCallback((playerId: string, cardType: CardType) => {
    dispatch({ type: 'AWARD_CARD', playerId, cardType });
    
    const player = state.players.find(p => p.id === playerId);
    if (player) {
      addAction(
        'AWARD_CARD',
        `${player.name} otrzymał kartę: ${cardType}`,
        [playerId],
        { cardType },
        null
      );
      
      toast.success(`${player.name} otrzymał kartę: ${cardType}`);
      
      // Emit card award event
      emit('card:award', { playerId, cardType });
    }
  }, [state.players, dispatch, emit, addAction]);

  // Add handleAddTestCards function to match the expected signature
  const handleAddTestCards = useCallback((playerId: string) => {
    const player = state.players.find(p => p.id === playerId);
    if (!player) return;
    
    // Add one of each card type for testing
    const cardTypes: CardType[] = [
      'dejavu', 'kontra', 'reanimacja', 'skip', 
      'turbo', 'refleks2', 'refleks3', 'lustro', 'oswiecenie'
    ];
    
    cardTypes.forEach(cardType => {
      handleAwardCard(playerId, cardType);
    });
    
    toast.info(`Dodano testowe karty dla gracza ${player.name}`);
  }, [state.players, handleAwardCard]);
  
  return {
    handleUseCard,
    handleAwardCard,
    handleAddTestCards
  };
};
