
import React from 'react';
import { Card, CardType } from '@/types/gameTypes';
import { cn } from '@/lib/utils';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
import { CARD_DETAILS } from '@/constants/gameConstants';

interface PlayerCardIndicatorProps {
  cards: Card[];
  onUseCard?: (cardType: CardType) => void;
  animateNew?: boolean;
}

export function PlayerCardIndicator({ cards, onUseCard, animateNew = false }: PlayerCardIndicatorProps) {
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
  const getCardColor = (cardType: CardType): string => {
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
  const getCardIcon = (cardType: CardType): string => {
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

  const cardItems = Object.values(cardsByType);
  
  if (cardItems.length === 0) {
    return null;
  }
  
  return (
    <motion.div 
      className="flex flex-wrap gap-1"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 1 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      {cardItems.map(({ card, count }) => (
        <TooltipProvider key={card.type}>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div 
                className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer relative",
                  getCardColor(card.type),
                  "shadow-[0_0_8px_rgba(255,255,255,0.5)]",
                  "hover:shadow-[0_0_12px_rgba(255,255,255,0.8)]"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onUseCard && onUseCard(card.type);
                }}
                variants={animateNew ? {
                  hidden: { scale: 0, rotate: -10 },
                  visible: { 
                    scale: 1, 
                    rotate: 0,
                    transition: { 
                      type: 'spring', 
                      stiffness: 260, 
                      damping: 20 
                    } 
                  }
                } : undefined}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                {getCardIcon(card.type)}
                {count > 1 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full flex items-center justify-center shadow">
                    <span className="text-[8px] font-bold text-black">{count}</span>
                  </div>
                )}
              </motion.div>
            </TooltipTrigger>
            <TooltipContent side="top" className="bg-gameshow-background border-gameshow-primary p-3">
              <p className="font-semibold text-gameshow-text">{CARD_DETAILS[card.type].name || card.type}</p>
              <p className="text-xs text-gameshow-muted">{CARD_DETAILS[card.type].description}</p>
              <p className="text-xs mt-1 font-semibold text-neon-pink">Kliknij aby użyć</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </motion.div>
  );
}

export default PlayerCardIndicator;
