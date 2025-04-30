
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RoundType } from '@/types/gameTypes';
import { playSound } from '@/lib/soundService';
import { ROUND_NAMES } from '@/constants/gameConstants';

interface RoundStartAnimationProps {
  roundType: RoundType;
  show: boolean;
  onComplete?: () => void;
}

const RoundStartAnimation: React.FC<RoundStartAnimationProps> = ({ roundType, show, onComplete }) => {
  // Play sound when animation starts
  useEffect(() => {
    if (show) {
      playSound('round_start.mp3');
      
      // Trigger onComplete callback after animation finishes
      const timer = setTimeout(() => {
        onComplete && onComplete();
      }, 3500);
      
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);
  
  // Get round color based on type
  const getRoundColor = () => {
    switch (roundType) {
      case 'knowledge':
        return 'from-blue-500 to-blue-700';
      case 'speed':
        return 'from-amber-500 to-amber-700';
      case 'wheel':
        return 'from-purple-500 to-purple-700';
      default:
        return 'from-neon-pink to-neon-purple';
    }
  };
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative">
            {/* Circle background */}
            <motion.div
              className={`w-96 h-96 rounded-full bg-gradient-to-r ${getRoundColor()} opacity-70`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: [0, 1.2, 1],
                opacity: [0, 0.8, 0.7],
              }}
              transition={{ 
                duration: 1,
                times: [0, 0.7, 1],
                ease: "easeInOut" 
              }}
            />
            
            {/* Text content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <motion.h2
                className="text-lg mb-2 text-white/80"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                ROZPOCZYNAMY
              </motion.h2>
              
              <motion.h1
                className="text-4xl font-bold animate-pulse"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                {ROUND_NAMES[roundType]}
              </motion.h1>
              
              <motion.div
                className="mt-6 h-1 bg-white"
                initial={{ width: 0 }}
                animate={{ width: 200 }}
                transition={{ delay: 1.2, duration: 1.5 }}
              />
              
              <motion.p
                className="mt-6 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
              >
                Przygotuj się!
              </motion.p>
            </div>
            
            {/* Pulsing outer circles */}
            <motion.div
              className={`absolute inset-0 rounded-full bg-gradient-to-r ${getRoundColor()} opacity-30`}
              initial={{ scale: 0.8 }}
              animate={{ 
                scale: [0.8, 1.5],
                opacity: [0.3, 0],
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 0.5,
              }}
            />
            
            <motion.div
              className={`absolute inset-0 rounded-full bg-gradient-to-r ${getRoundColor()} opacity-20`}
              initial={{ scale: 0.8 }}
              animate={{ 
                scale: [0.8, 1.8],
                opacity: [0.2, 0],
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 0.2,
                delay: 0.3,
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RoundStartAnimation;
