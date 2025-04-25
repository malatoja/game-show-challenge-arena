
import React, { useState } from 'react';
import { Card as CardType } from '../../types/gameTypes';
import { 
  Clock, Star, SkipForward, RefreshCcw, Eye, 
  HelpCircle, Undo, ArrowRight, Heart 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';

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
    sm: 'w-16 h-24',
    md: 'w-24 h-36',
    lg: 'w-32 h-48'
  };
  
  // Animation effects based on card type
  const getCardEffects = () => {
    switch (card.type) {
      case 'dejavu':
        return { background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' }; // Blue
      case 'kontra':
        return { background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }; // Red
      case 'reanimacja':
        return { background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }; // Green
      case 'skip':
        return { background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' }; // Amber
      case 'turbo':
        return { background: 'rgba(236, 72, 153, 0.2)', color: '#ec4899' }; // Pink
      case 'refleks2':
      case 'refleks3':
        return { background: 'rgba(139, 92, 246, 0.2)', color: '#8b5cf6' }; // Purple
      case 'lustro':
        return { background: 'rgba(14, 165, 233, 0.2)', color: '#0ea5e9' }; // Light blue
      case 'oswiecenie':
        return { background: 'rgba(168, 85, 247, 0.2)', color: '#a855f7' }; // Violet
      default:
        return { background: 'rgba(107, 114, 128, 0.2)', color: '#6b7280' }; // Gray
    }
  };
  
  const effects = getCardEffects();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <motion.div 
            className={cn(
              'game-card flex flex-col items-center justify-center cursor-pointer overflow-hidden',
              sizeClasses[size],
              card.isUsed && 'opacity-50 grayscale',
              className
            )}
            style={{
              borderColor: effects.color,
              boxShadow: isHovered && !card.isUsed ? `0 0 15px ${effects.color}` : 'none',
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
            {/* Animated glow effect */}
            {isHovered && !card.isUsed && (
              <motion.div 
                className="absolute inset-0 opacity-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                style={{ background: effects.background }}
              />
            )}
            
            {/* Card background gradient */}
            <div 
              className="absolute inset-0" 
              style={{
                background: `linear-gradient(135deg, ${effects.background} 0%, rgba(255,255,255,0.1) 100%)`,
              }}
            />
            
            {/* Used card overlay */}
            {card.isUsed && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10">
                <div className="bg-red-500/80 text-white text-xs font-bold py-1 px-2 rounded rotate-45">
                  UŻYTA
                </div>
              </div>
            )}
            
            {/* Card content */}
            <div className="flex flex-col items-center justify-center p-2 z-10 text-gameshow-text">
              <motion.div
                animate={showAnimation ? { 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0]
                } : {}}
                transition={{ duration: 1, repeat: showAnimation ? Infinity : 0 }}
                style={{ color: effects.color }}
              >
                {getCardIcon()}
              </motion.div>
              <h3 
                className="text-xs font-bold mt-2" 
                style={{ color: effects.color }}
              >
                {card.name}
              </h3>
            </div>
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
