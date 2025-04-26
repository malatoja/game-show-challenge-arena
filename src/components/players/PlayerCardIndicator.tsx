
import React from 'react';
import { Card } from '@/types/gameTypes';
import { cn } from '@/lib/utils';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';

interface PlayerCardIndicatorProps {
  cards: Card[];
  onUseCard?: (cardType: Card['type']) => void;
}

export function PlayerCardIndicator({ cards, onUseCard }: PlayerCardIndicatorProps) {
  // Group cards by type
  const cardsByType: Record<string, { card: Card; count: number }> = {};
  
  cards.forEach(card => {
    if (!card.isUsed) {  // Only show unused cards
      const key = card.type;
      if (!cardsByType[key]) {
        cardsByType[key] = { card, count: 1 };
      } else {
        cardsByType[key].count++;
      }
    }
  });
  
  // Get card color by type
  const getCardColor = (cardType: string): string => {
    switch (cardType) {
      case 'dejavu': return 'bg-blue-500';
      case 'kontra': return 'bg-red-500';
      case 'reanimacja': return 'bg-green-500';
      case 'skip': return 'bg-yellow-500';
      case 'turbo': return 'bg-purple-500';
      case 'refleks2': return 'bg-cyan-500';
      case 'refleks3': return 'bg-cyan-700';
      case 'lustro': return 'bg-indigo-500'; 
      case 'oswiecenie': return 'bg-amber-500';
      default: return 'bg-gray-500';
    }
  };
  
  // Get card icon by type
  const getCardIcon = (cardType: string): string => {
    switch (cardType) {
      case 'dejavu': return 'D';
      case 'kontra': return 'K';
      case 'reanimacja': return 'R';
      case 'skip': return 'S';
      case 'turbo': return 'T';
      case 'refleks2': return '2x';
      case 'refleks3': return '3x';
      case 'lustro': return 'L';
      case 'oswiecenie': return 'O';
      default: return '?';
    }
  };
  
  return (
    <div className="flex flex-wrap gap-1">
      {Object.values(cardsByType).map(({ card, count }) => (
        <TooltipProvider key={card.type}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div 
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer relative",
                  getCardColor(card.type)
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onUseCard && onUseCard(card.type);
                }}
              >
                {getCardIcon(card.type)}
                {count > 1 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center">
                    <span className="text-[8px] font-bold text-black">{count}</span>
                  </div>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="font-semibold">{card.name || card.type}</p>
              <p className="text-xs">{card.description}</p>
              <p className="text-xs mt-1 font-semibold">Kliknij aby użyć</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}

export default PlayerCardIndicator;
