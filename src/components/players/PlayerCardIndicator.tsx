
import React from 'react';
import { Card, CardType } from '@/types/gameTypes';
import { CARD_IMAGES } from '@/constants/cardImages';
import { CARD_DETAILS } from '@/constants/gameConstants';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PlayerCardIndicatorProps {
  card: Card;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

const PlayerCardIndicator: React.FC<PlayerCardIndicatorProps> = ({
  card,
  size = 'md',
  showTooltip = true
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const content = (
    <div 
      className={`relative ${sizeClasses[size]} rounded-full overflow-hidden ${
        card.isUsed ? 'opacity-40 grayscale' : 'shadow-glow-sm'
      }`}
    >
      {CARD_IMAGES[card.type] ? (
        <img 
          src={CARD_IMAGES[card.type]} 
          alt={card.name} 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gameshow-primary/30 flex items-center justify-center text-xs font-bold">
          {card.name ? card.name.substring(0, 1) : card.type.substring(0, 1)}
        </div>
      )}
    </div>
  );

  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {content}
          </TooltipTrigger>
          <TooltipContent side="top" className="bg-gameshow-card border-gameshow-primary p-2">
            <p className="font-bold text-sm">{card.name || CARD_DETAILS[card.type].name}</p>
            <p className="text-xs text-gameshow-muted">{CARD_DETAILS[card.type].description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return content;
};

// Add a cards collection variant
interface PlayerCardCollectionProps {
  cards: Card[];
  onUseCard?: (cardType: CardType) => void;
}

export const PlayerCardCollection: React.FC<PlayerCardCollectionProps> = ({ cards, onUseCard }) => {
  if (!cards || cards.length === 0) {
    return <div className="text-xs text-gameshow-muted">No cards</div>;
  }

  return (
    <div className="flex gap-1">
      {cards.map((card, index) => (
        <div 
          key={index} 
          onClick={() => !card.isUsed && onUseCard?.(card.type)}
          className={!card.isUsed && onUseCard ? "cursor-pointer" : ""}
        >
          <PlayerCardIndicator card={card} size="sm" />
        </div>
      ))}
    </div>
  );
};

export default PlayerCardIndicator;
