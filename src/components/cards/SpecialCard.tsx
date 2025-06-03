
import React, { useState } from 'react';
import { Card as CardType } from '../../types/gameTypes';
import { 
  Clock, Star, SkipForward, RefreshCw, Eye, 
  HelpCircle, Undo, ArrowRight, Heart 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
import { CARD_IMAGES } from '@/constants/cardImages';
import { CARD_DETAILS } from '@/constants/gameConstants';

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
  const details = CARD_DETAILS[card.type];

  const sizeClasses = {
    sm: 'w-16 h-24',
    md: 'w-24 h-36',
    lg: 'w-32 h-48'
  };
  
  // Get the card image URL based on the card type
  const cardImage = CARD_IMAGES[card.type];

  // Get card icon component based on type
  const getCardIcon = () => {
    switch (card.type) {
      case 'dejavu': return <RefreshCw className="h-6 w-6 text-white" />;
      case 'kontra': return <ArrowRight className="h-6 w-6 text-white" />;
      case 'reanimacja': return <Heart className="h-6 w-6 text-white" />;
      case 'skip': return <SkipForward className="h-6 w-6 text-white" />;
      case 'turbo': return <Star className="h-6 w-6 text-white" />;
      case 'refleks2': return <Clock className="h-6 w-6 text-white" />;
      case 'refleks3': return <Clock className="h-6 w-6 text-white" />;
      case 'lustro': return <Undo className="h-6 w-6 text-white" />;
      case 'oswiecenie': return <Eye className="h-6 w-6 text-white" />;
      default: return <HelpCircle className="h-6 w-6 text-white" />;
    }
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <motion.div 
            className={cn(
              'game-card relative flex flex-col items-center justify-center cursor-pointer overflow-hidden rounded-lg',
              sizeClasses[size],
              'shadow-[0_0_15px_rgba(150,150,240,0.3)]',
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
            whileHover={!card.isUsed ? { scale: 1.05, boxShadow: '0 0 25px rgba(150,150,240,0.6)' } : {}}
            whileTap={!card.isUsed ? { scale: 0.95 } : {}}
            initial={showAnimation ? { scale: 0, rotate: -10 } : { scale: 1 }}
            animate={showAnimation ? 
              { scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 260, damping: 20 } } 
              : {}
            }
          >
            {/* Glow effect for special cards */}
            {!card.isUsed && (
              <motion.div 
                className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent z-0" 
                animate={{ 
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2,
                  ease: "easeInOut"
                }}
              />
            )}
            
            {/* Card icon */}
            <div className="absolute top-2 left-2">
              {getCardIcon()}
            </div>
            
            {/* Card name on the bottom */}
            <div className="absolute bottom-0 inset-x-0 bg-black/70 py-1 px-2 text-center">
              <p className="text-xs text-white font-semibold">
                {details?.name || card.type}
              </p>
            </div>

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
        <TooltipContent side="top" className="bg-gameshow-background border-gameshow-primary p-3">
          <p className="font-semibold text-gameshow-text">{details?.name || card.type}</p>
          <p className="text-sm">{details?.description || card.description}</p>
          {card.isUsed && <p className="text-xs text-red-400 mt-1">Karta została użyta</p>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default SpecialCard;
