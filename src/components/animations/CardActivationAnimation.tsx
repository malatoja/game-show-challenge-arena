
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CardType } from '@/types/gameTypes';
import { playSound } from '@/lib/soundService';
import SpecialCard from '../cards/SpecialCard';
import { CARD_DETAILS } from '@/constants/gameConstants';
import { CARD_ANIMATIONS } from '@/constants/cardImages';

interface CardActivationAnimationProps {
  cardType: CardType | null;
  show: boolean;
  playerName?: string;
  onComplete?: () => void;
}

const CardActivationAnimation: React.FC<CardActivationAnimationProps> = ({ 
  cardType, 
  show, 
  playerName,
  onComplete 
}) => {
  // Play sound when animation starts
  useEffect(() => {
    if (show && cardType) {
      playSound('card-use');
      
      // Trigger onComplete callback after animation finishes
      const timer = setTimeout(() => {
        onComplete && onComplete();
      }, 2500);
      
      return () => clearTimeout(timer);
    }
  }, [show, cardType, onComplete]);
  
  if (!cardType) return null;
  
  // Get animation source based on card type
  const animationSource = CARD_ANIMATIONS[cardType];
  const isDataUrl = animationSource?.startsWith('data:');
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="flex justify-center mb-2"
            >
              {/* Show card animation if available */}
              {animationSource && (
                <div className="mb-4 relative w-72 h-40 flex items-center justify-center">
                  <video
                    autoPlay
                    loop={false}
                    muted
                    className="w-full h-full object-contain"
                    onEnded={() => {
                      // Optional: Do something when video ends
                    }}
                  >
                    <source src={animationSource} type={isDataUrl ? "video/mp4" : "video/webm"} />
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
              
              <SpecialCard 
                card={{ 
                  type: cardType, 
                  description: CARD_DETAILS[cardType].description, 
                  isUsed: false 
                }}
                size="lg"
                showAnimation={true}
              />
            </motion.div>
            <motion.h3 
              className="text-2xl font-bold text-neon-pink animate-pulse"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {CARD_DETAILS[cardType].name}
            </motion.h3>
            {playerName && (
              <motion.p
                className="text-lg text-white/80 mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {playerName} używa karty!
              </motion.p>
            )}
            <motion.p 
              className="text-lg text-white/80 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {CARD_DETAILS[cardType].description}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CardActivationAnimation;
