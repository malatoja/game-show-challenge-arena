
import React from 'react';
import { Card } from '@/types/gameTypes';
import { Button } from '@/components/ui/button';
import { Undo } from 'lucide-react';
import CardItem from './CardItem';

interface AvailableCardsListProps {
  cards: Card[];
  onUseCard: (cardType: Card['type']) => void;
  onUndoCardUsage?: (cardId: string) => void;
}

const AvailableCardsList: React.FC<AvailableCardsListProps> = ({ 
  cards,
  onUseCard,
  onUndoCardUsage
}) => {
  if (!cards || cards.length === 0) {
    return (
      <div className="text-center py-3 border border-dashed border-gameshow-primary/20 rounded-lg mb-3">
        <p className="text-sm text-gameshow-muted">Gracz nie ma dostępnych kart</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 mb-3">
      <h4 className="text-sm text-gameshow-muted font-medium mb-2">
        Dostępne karty
      </h4>
      
      {cards.map((card, index) => (
        <CardItem
          key={`available-${card.type}-${index}`}
          card={card}
          onUse={() => onUseCard(card.type)}
        />
      ))}
    </div>
  );
};

export default AvailableCardsList;
