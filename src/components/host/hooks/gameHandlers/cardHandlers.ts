
import { useState, useCallback } from 'react';
import { useGame } from '@/context/GameContext';
import { useEvents } from '@/components/host/EventsContext';
import { useSocket } from '@/context/SocketContext';
import { CardType } from '@/types/gameTypes';
import { toast } from 'sonner';
import { SocketEvent } from '@/lib/socketService';

// Hook for card-related game handlers
export function useCardHandlers() {
  const { state, dispatch } = useGame();
  const { addEvent } = useEvents();
  const { emit, connected } = useSocket();
  const [activeCardType, setActiveCardType] = useState<CardType | null>(null);

  // Handle using a card by a player
  const handleUseCard = useCallback((playerId: string, cardType: CardType) => {
    const player = state.players.find(p => p.id === playerId);
    if (!player) return;
    
    // Find the card in the player's inventory
    const cardToUse = player.cards.find(card => card.type === cardType && !card.isUsed);
    
    if (!cardToUse) {
      toast.error(`${player.name} nie posiada karty ${cardType} lub została już użyta`);
      return;
    }
    
    // Dispatch the use card action
    dispatch({ type: 'USE_CARD', playerId, cardType });
    
    // Log the event
    addEvent(`${player.name} użył kartę ${cardType}`);
    
    // If connected to socket, emit the event
    if (connected) {
      emit('card:use' as SocketEvent, { cardType, playerId: player.id });
    }
    
    // Set the active card type for animations
    setActiveCardType(cardType);
    
    // Show toast notification
    toast.success(`${player.name} użył kartę ${cardType}`);
  }, [state.players, dispatch, addEvent, emit, connected]);
  
  // Handle awarding a card to a player
  const handleAwardCard = useCallback((playerId: string, cardType: CardType) => {
    dispatch({ type: 'AWARD_CARD', playerId, cardType });
    
    const player = state.players.find(p => p.id === playerId);
    if (player) {
      addEvent(`${player.name} otrzymał kartę ${cardType}`);
      
      // If connected to socket, emit the event
      if (connected) {
        emit('card:awarded' as SocketEvent, { cardType, playerId });
      }
      
      toast.success(`${player.name} otrzymał kartę ${cardType}`);
    }
  }, [state.players, dispatch, addEvent, emit, connected]);
  
  // Add test cards for testing purposes
  const handleAddTestCards = useCallback((playerId: string) => {
    // Add one of each card type for testing
    const cardTypes: CardType[] = [
      'dejavu', 'kontra', 'reanimacja', 'skip', 
      'turbo', 'refleks2', 'refleks3', 'lustro', 'oswiecenie'
    ];
    
    cardTypes.forEach(cardType => {
      handleAwardCard(playerId, cardType);
    });
    
    toast.success('Dodano testowe karty');
  }, [handleAwardCard]);

  return {
    activeCardType,
    handleUseCard,
    handleAwardCard,
    handleAddTestCards
  };
}
