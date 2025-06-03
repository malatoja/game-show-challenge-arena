
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useGame } from '@/context/GameContext';
import { GameAction, ActionType } from '@/types/historyTypes';
import { Player, CardType } from '@/types/gameTypes';

const MAX_HISTORY_ACTIONS = 20;

export function useGameHistoryImplementation() {
  const { state, dispatch } = useGame();
  const [actionHistory, setActionHistory] = useState<GameAction[]>([]);

  const addAction = useCallback((
    type: ActionType, 
    description: string, 
    playerIds: string[] = [], 
    data?: any,
    previousState?: any
  ) => {
    const newAction: GameAction = {
      id: `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      timestamp: Date.now(),
      description,
      playerIds,
      undoable: true,
      data,
      previousState
    };

    setActionHistory(prev => {
      if (prev.length >= MAX_HISTORY_ACTIONS) {
        return [newAction, ...prev.slice(0, MAX_HISTORY_ACTIONS - 1)];
      }
      return [newAction, ...prev];
    });
  }, []);

  const undoLastAction = useCallback(() => {
    if (actionHistory.length === 0) {
      toast.error('Brak akcji do cofnięcia');
      return;
    }

    const lastAction = actionHistory[0];
    if (!lastAction.undoable) {
      toast.error('Ta akcja nie może być cofnięta');
      return;
    }

    // Handle undo based on action type
    switch (lastAction.type) {
      case 'ANSWER_QUESTION':
        if (lastAction.previousState && lastAction.playerIds[0]) {
          const prevPlayer = lastAction.previousState as Player;
          dispatch({ type: 'UPDATE_PLAYER', player: prevPlayer });
          toast.success(`Cofnięto odpowiedź gracza ${prevPlayer.name}`);
        }
        break;
      
      case 'USE_CARD':
        if (lastAction.data && lastAction.playerIds[0]) {
          const playerId = lastAction.playerIds[0];
          const cardType = lastAction.data.cardType as CardType;
          const player = state.players.find(p => p.id === playerId);
          
          if (player) {
            // Add the card back to the player
            const updatedCards = [...player.cards, {
              type: cardType,
              description: "Przywrócona karta",
              isUsed: false
            }];
            
            dispatch({ 
              type: 'UPDATE_PLAYER', 
              player: { ...player, cards: updatedCards } 
            });
            
            toast.success(`Przywrócono kartę ${cardType} dla gracza ${player.name}`);
          }
        }
        break;

      case 'AWARD_CARD':
        if (lastAction.data && lastAction.playerIds[0]) {
          const playerId = lastAction.playerIds[0];
          const player = state.players.find(p => p.id === playerId);
          
          if (player && lastAction.data.cardIndex !== undefined) {
            // Remove the last awarded card
            const updatedCards = [...player.cards];
            updatedCards.splice(lastAction.data.cardIndex, 1);
            
            dispatch({ 
              type: 'UPDATE_PLAYER', 
              player: { ...player, cards: updatedCards } 
            });
            
            toast.success(`Cofnięto przyznanie karty dla gracza ${player.name}`);
          }
        }
        break;

      case 'UPDATE_POINTS':
      case 'UPDATE_LIVES':
      case 'ELIMINATE_PLAYER':
      case 'RESTORE_PLAYER':
        if (lastAction.previousState && lastAction.playerIds[0]) {
          const prevPlayer = lastAction.previousState as Player;
          dispatch({ type: 'UPDATE_PLAYER', player: prevPlayer });
          toast.success(`Cofnięto zmianę dla gracza ${prevPlayer.name}`);
        }
        break;

      default:
        toast.error('Nie można cofnąć tej akcji');
        break;
    }

    // Remove the action from history
    setActionHistory(prev => prev.slice(1));
  }, [actionHistory, dispatch, state.players]);

  const clearHistory = useCallback(() => {
    setActionHistory([]);
    toast.success('Historia akcji została wyczyszczona');
  }, []);

  return {
    actions: actionHistory,
    addAction,
    undoLastAction,
    clearHistory,
    hasActions: actionHistory.length > 0
  };
}

// For backward compatibility
export function useGameHistory() {
  return useGameHistoryImplementation();
}
