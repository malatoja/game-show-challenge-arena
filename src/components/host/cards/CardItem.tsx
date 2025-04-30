
import React from 'react';
import { Button } from '@/components/ui/button';
import SpecialCard from '@/components/cards/SpecialCard';
import { Card } from '@/types/gameTypes';
import { CARD_DETAILS } from '@/constants/gameConstants';

interface CardItemProps {
  card: Card;
  onUse?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

export const CardItem: React.FC<CardItemProps> = ({ 
  card, 
  onUse,
  size = 'sm' 
}) => {
  return (
    <Button
      onClick={!card.isUsed ? onUse : undefined}
      className="justify-start text-left px-2 py-1 bg-neon-purple/20 hover:bg-neon-purple/30 h-auto"
    >
      <div className="w-full flex items-center gap-2">
        <SpecialCard card={card} size={size} />
        <div>
          <div className="font-bold text-neon-purple">{CARD_DETAILS[card.type].name}</div>
          <div className="text-xs text-gameshow-muted">{card.description}</div>
        </div>
      </div>
    </Button>
  );
};

export default CardItem;
