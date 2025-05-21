
import React, { useState } from 'react';
import { Card } from '@/types/gameTypes';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import CardItem from './CardItem';
import { useGameHistory } from '@/components/host/context/GameHistoryContext';
import { useGameControl } from '@/components/host/context/GameControlContext';
import { toast } from 'sonner';

interface UsedCardsListProps {
  cards: Card[];
}

const UsedCardsList: React.FC<UsedCardsListProps> = ({ cards }) => {
  // Track cards that have been undone to prevent multiple undoes
  const [undoneCardIds] = useState<Set<string>>(new Set());
  const { actions, undoLastAction } = useGameHistory();

  if (!cards || cards.length === 0) {
    return null;
  }

  // Find the last USE_CARD action for a specific card
  const findLastCardAction = (cardType: Card['type']) => {
    return actions.find(action => 
      action.type === 'USE_CARD' && 
      action.data?.cardType === cardType &&
      !undoneCardIds.has(action.id)
    );
  };

  // Handler to undo the last usage of a card
  const handleUndoCardUsage = (cardType: Card['type']) => {
    const lastAction = findLastCardAction(cardType);
    
    if (!lastAction) {
      toast.error("Nie znaleziono akcji do cofnięcia");
      return;
    }
    
    // Add to set of undone cards to prevent multiple undoes
    undoneCardIds.add(lastAction.id);
    
    // Perform the undo
    undoLastAction();
    
    toast.success(`Cofnięto użycie karty ${cardType}`);
  };

  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm text-gameshow-muted font-medium">
          Użyte karty
        </h4>
        <Badge variant="outline" className="text-xs">
          {cards.length}
        </Badge>
      </div>
      
      <div className="space-y-1.5">
        {cards.map((card, index) => (
          <div key={`used-${card.type}-${index}`} className="relative group">
            <div className="opacity-60">
              <CardItem 
                card={card}
                size="sm"
              />
            </div>
            
            {/* Undo button that appears on hover */}
            {findLastCardAction(card.type) && !undoneCardIds.has(findLastCardAction(card.type)?.id || '') && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 hover:bg-black/60 text-white"
                onClick={() => handleUndoCardUsage(card.type)}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Cofnij
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsedCardsList;
