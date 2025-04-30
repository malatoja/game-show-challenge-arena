
import React from 'react';
import { Card } from '@/types/gameTypes';
import SpecialCard from '@/components/cards/SpecialCard';

interface UsedCardsListProps {
  cards: Card[];
}

export const UsedCardsList: React.FC<UsedCardsListProps> = ({ cards }) => {
  if (cards.length === 0) return null;

  return (
    <div>
      <h4 className="text-sm font-medium text-gameshow-muted mb-2">Karty użyte:</h4>
      <div className="flex flex-wrap gap-1">
        {cards.map((card, index) => (
          <SpecialCard key={index} card={card} size="sm" />
        ))}
      </div>
    </div>
  );
};

export default UsedCardsList;
