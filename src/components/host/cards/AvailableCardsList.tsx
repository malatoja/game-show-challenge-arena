
import React from 'react';
import { Card, CardType } from '@/types/gameTypes';
import CardItem from './CardItem';

interface AvailableCardsListProps {
  cards: Card[];
  onUseCard: (cardType: CardType) => void;
}

export const AvailableCardsList: React.FC<AvailableCardsListProps> = ({ 
  cards,
  onUseCard
}) => {
  if (cards.length === 0) return null;
  
  return (
    <div className="grid grid-cols-2 gap-2 mb-4">
      {cards.map((card, index) => (
        <CardItem
          key={index}
          card={card}
          onUse={() => onUseCard(card.type)}
        />
      ))}
    </div>
  );
};

export default AvailableCardsList;
