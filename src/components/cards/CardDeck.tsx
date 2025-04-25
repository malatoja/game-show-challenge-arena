
import React from 'react';
import { Card as CardType } from '../../types/gameTypes';
import SpecialCard from './SpecialCard';

interface CardDeckProps {
  cards: CardType[];
  onUseCard?: (card: CardType) => void;
}

export function CardDeck({ cards, onUseCard }: CardDeckProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {cards.map((card, index) => (
        <SpecialCard 
          key={`${card.type}-${index}`} 
          card={card}
          onClick={() => onUseCard && onUseCard(card)}
          size="sm"
        />
      ))}
      {cards.length === 0 && (
        <p className="text-gameshow-muted text-center py-2">Brak kart</p>
      )}
    </div>
  );
}

export default CardDeck;
