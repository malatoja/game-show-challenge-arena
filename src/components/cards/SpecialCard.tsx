
import React from 'react';
import { Card as CardType } from '../../types/gameTypes';
import { 
  Clock, Star, SkipForward, RefreshCcw, Eye, 
  HelpCircle, Undo, ArrowRight, Heart 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SpecialCardProps {
  card: CardType;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function SpecialCard({ card, onClick, size = 'md', className }: SpecialCardProps) {
  // Map card types to icons
  const getCardIcon = () => {
    switch (card.type) {
      case 'dejavu':
        return <Undo className="h-8 w-8" />;
      case 'kontra':
        return <ArrowRight className="h-8 w-8" />;
      case 'reanimacja':
        return <Heart className="h-8 w-8" />;
      case 'skip':
        return <SkipForward className="h-8 w-8" />;
      case 'turbo':
        return <Star className="h-8 w-8" />;
      case 'refleks2':
      case 'refleks3':
        return <Clock className="h-8 w-8" />;
      case 'lustro':
        return <Eye className="h-8 w-8" />;
      case 'oswiecenie':
        return <HelpCircle className="h-8 w-8" />;
      default:
        return <RefreshCcw className="h-8 w-8" />;
    }
  };

  const sizeClasses = {
    sm: 'w-14 h-20',
    md: 'w-24 h-36',
    lg: 'w-32 h-48'
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div 
            className={cn(
              'game-card flex flex-col items-center justify-center cursor-pointer',
              sizeClasses[size],
              card.isUsed && 'opacity-50 grayscale',
              className
            )}
            onClick={!card.isUsed ? onClick : undefined}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gameshow-primary/30 to-gameshow-secondary/20" />
            <div className="flex flex-col items-center justify-center p-2 z-10 text-gameshow-text">
              {getCardIcon()}
              <h3 className="text-xs font-bold mt-2">{card.name}</h3>
            </div>
          </div>
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
