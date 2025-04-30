
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CardType } from '@/types/gameTypes';
import { CARD_EFFECTS } from '@/constants/cardEffects';
import { CARD_IMAGES } from '@/constants/cardImages';

interface CardEffectOverlayProps {
  cardType: CardType | null;
  playerName: string;
  show: boolean;
  onComplete: () => void;
}

const CardEffectOverlay: React.FC<CardEffectOverlayProps> = ({
  cardType,
  playerName,
  show,
  onComplete
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (show && cardType) {
      setIsAnimating(true);
      const cardEffect = CARD_EFFECTS[cardType];
      
      // Play sound effect here if needed
      
      // End animation after duration
      const timer = setTimeout(() => {
        setIsAnimating(false);
        onComplete();
      }, cardEffect?.animationDuration || 2000);
      
      return () => clearTimeout(timer);
    }
  }, [show, cardType, onComplete]);

  if (!show || !cardType) return null;
  
  const cardEffect = CARD_EFFECTS[cardType];
  const cardImage = CARD_IMAGES[cardType];
  
  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.div 
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="relative flex flex-col items-center max-w-3xl">
            <motion.div
              className="text-xl text-white mb-4 font-semibold"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {playerName} używa karty:
            </motion.div>
            
            <motion.div 
              className="relative w-48 h-72 bg-gradient-to-br from-purple-600 to-blue-700 rounded-xl overflow-hidden border-4 border-white"
              initial={{ scale: 0, rotate: -15 }}
              animate={{ 
                scale: 1, 
                rotate: 0,
                y: [0, -10, 0],
              }}
              transition={{ 
                type: 'spring', 
                stiffness: 200, 
                damping: 20,
                y: { 
                  repeat: Infinity, 
                  duration: 2,
                  ease: "easeInOut"
                }
              }}
            >
              {cardImage && (
                <img 
                  src={cardImage} 
                  alt={cardEffect?.name || cardType} 
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
              )}
              
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 flex flex-col justify-end p-4">
                <h3 className="text-2xl font-bold text-white drop-shadow-lg">
                  {cardEffect?.name}
                </h3>
              </div>
              
              <motion.div 
                className="absolute inset-0 bg-white/30"
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ 
                  duration: 0.8, 
                  repeat: 3,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
            
            <motion.div 
              className="mt-5 text-center text-xl text-white bg-purple-700/50 backdrop-blur-md py-3 px-6 rounded-lg border border-purple-500"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {cardEffect?.description}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CardEffectOverlay;
