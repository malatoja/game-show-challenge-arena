
import React from 'react';
import { Card as CardType } from '../../types/gameTypes';
import SpecialCard from './SpecialCard';
import { motion } from 'framer-motion';

interface CardDeckProps {
  cards: CardType[];
  onUseCard?: (card: CardType) => void;
  animate?: boolean;
}

export function CardDeck({ cards, onUseCard, animate = true }: CardDeckProps) {
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
      {cards.map((card, index) => (
        <motion.div key={`${card.type}-${index}`} variants={item}>
          <SpecialCard 
            card={card}
            onClick={() => onUseCard && onUseCard(card)}
            size="sm"
          />
        </motion.div>
      ))}
      {cards.length === 0 && (
        <motion.p 
          className="text-gameshow-muted text-center py-6 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Brak kart
        </motion.p>
      )}
    </motion.div>
  );
}

export default CardDeck;
