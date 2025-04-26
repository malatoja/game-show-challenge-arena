
import React, { useState } from 'react';
import { Card as CardType } from '../../types/gameTypes';
import { 
  Clock, Star, SkipForward, RefreshCcw, Eye, 
  HelpCircle, Undo, ArrowRight, Heart 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
import { CARD_IMAGES } from '@/constants/cardImages';

interface SpecialCardProps {
  card: CardType;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showAnimation?: boolean;
}

export function SpecialCard({ 
  card, 
  onClick, 
  size = 'md', 
  className,
  showAnimation = false
}: SpecialCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    sm: 'w-16 h-24',
    md: 'w-24 h-36',
    lg: 'w-32 h-48'
  };
  
  // Get the card image URL based on the card type
  const cardImage = CARD_IMAGES[card.type];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <motion.div 
            className={cn(
              'game-card relative flex flex-col items-center justify-center cursor-pointer overflow-hidden rounded-lg',
              sizeClasses[size],
              card.isUsed && 'opacity-50 grayscale',
              className
            )}
            style={{
              backgroundImage: `url(${cardImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            onClick={!card.isUsed ? onClick : undefined}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={!card.isUsed ? { scale: 1.05 } : {}}
            whileTap={!card.isUsed ? { scale: 0.95 } : {}}
            initial={showAnimation ? { scale: 0, rotate: -10 } : { scale: 1 }}
            animate={showAnimation ? 
              { scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } } 
              : {}
            }
          >
            {/* Card overlay for used cards */}
            {card.isUsed && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
                <div className="bg-red-500/80 text-white text-xs font-bold py-1 px-2 rounded rotate-45">
                  UŻYTA
                </div>
              </div>
            )}

            {/* Hover effect overlay */}
            {isHovered && !card.isUsed && (
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p className="text-sm">{card.description}</p>
          {card.isUsed && <p className="text-xs text-red-400">Karta została użyta</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default SpecialCard;
