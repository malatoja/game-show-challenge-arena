
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundService } from '@/lib/soundService';
import { RoundType } from '@/types/gameTypes';
import { ROUND_NAMES } from '@/constants/gameConstants';

interface RoundStartAnimationProps {
  roundType: RoundType;
  show: boolean;
  onComplete?: () => void;
}

export const RoundStartAnimation: React.FC<RoundStartAnimationProps> = ({ 
  roundType, 
  show, 
  onComplete 
}) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    if (show) {
      setVisible(true);
      soundService.play('round_start');
      
      const timer = setTimeout(() => {
        setVisible(false);
        if (onComplete) onComplete();
      }, 3500); // Animation lasts 3.5 seconds
      
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  // Get the appropriate color for the round
  const getRoundColor = (): string => {
    switch(roundType) {
      case 'knowledge': return '#39FF14'; // Green
      case 'speed': return '#FF3864'; // Pink
      case 'wheel': return '#2E9CCA'; // Blue
      default: return '#39FF14';
    }
  };
  
  const roundColor = getRoundColor();
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/80"
          style={{ backdropFilter: 'blur(8px)' }}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ 
              scale: [0.5, 1.2, 1],
              opacity: 1,
            }}
            transition={{
              duration: 1.2,
              times: [0, 0.7, 1],
              ease: "easeInOut"
            }}
            className="text-center"
          >
            <motion.div
              animate={{
                textShadow: [
                  `0 0 7px #fff, 0 0 10px #fff, 0 0 15px ${roundColor}, 0 0 20px ${roundColor}`,
                  `0 0 10px #fff, 0 0 15px #fff, 0 0 20px ${roundColor}, 0 0 30px ${roundColor}`,
                  `0 0 7px #fff, 0 0 10px #fff, 0 0 15px ${roundColor}, 0 0 20px ${roundColor}`
                ],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: 0, 
                repeatType: "loop",
                times: [0, 0.5, 1]
              }}
              className="text-5xl md:text-7xl font-bold uppercase text-white mb-4"
              style={{
                textShadow: `0 0 7px #fff, 0 0 10px #fff, 0 0 15px ${roundColor}, 0 0 20px ${roundColor}`
              }}
            >
              {`Runda ${roundType === 'knowledge' ? '1' : roundType === 'speed' ? '2' : '3'}`}
            </motion.div>
            
            <motion.div
              animate={{
                opacity: [0, 1, 1]
              }}
              transition={{ 
                duration: 1.5,
                delay: 0.8
              }}
              className="text-2xl md:text-3xl text-white"
            >
              {ROUND_NAMES[roundType]}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RoundStartAnimation;
