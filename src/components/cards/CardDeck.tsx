
import React from 'react';
import { Card as CardType } from '../../types/gameTypes';
import SpecialCard from './SpecialCard';
import { motion } from 'framer-motion';

interface CardDeckProps {
  cards: CardType[];
  onUseCard?: (card: CardType) => void;
  animate?: boolean;
  compact?: boolean;
}

export function CardDeck({ cards, onUseCard, animate = true, compact = false }: CardDeckProps) {
  // Filter cards to separate used and unused
  const unusedCards = cards.filter(card => !card.isUsed);
  const usedCards = cards.filter(card => card.isUsed);
  
  // Show all unused cards and optionally show used cards if there are some
  const cardsToShow = compact 
    ? unusedCards.length > 0 ? unusedCards : usedCards.slice(0, 1)
    : cards;
  
  // Animation variants
  const container = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="flex flex-wrap gap-2 justify-center"
      variants={container}
      initial={animate ? "hidden" : "show"}
      animate="show"
    >
      {cardsToShow.map((card, index) => (
        <motion.div 
          key={`${card.type}-${index}`} 
          variants={item}
          className={compact ? "-ml-4 first:ml-0" : ""}
          style={{ zIndex: cardsToShow.length - index }}
        >
          <SpecialCard 
            card={card}
            onClick={() => onUseCard && onUseCard(card)}
            size="sm"
            showAnimation={animate && index === 0}
          />
        </motion.div>
      ))}
      
      {cardsToShow.length === 0 && (
        <motion.p 
          className="text-gameshow-muted text-center py-6 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Brak kart
        </motion.p>
      )}
      
      {compact && unusedCards.length > 0 && unusedCards.length > 1 && (
        <motion.div 
          className="ml-1 flex items-center justify-center text-xs font-bold bg-gameshow-primary/20 rounded-full w-6 h-6 text-gameshow-text"
          variants={item}
        >
          +{unusedCards.length - 1}
        </motion.div>
      )}
    </motion.div>
  );
}

export default CardDeck;
