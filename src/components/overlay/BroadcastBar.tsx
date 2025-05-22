
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface BroadcastBarProps {
  text: string;
  backgroundColor?: string;
  textColor?: string;
  animation?: 'slide' | 'fade' | 'static';
  scrollSpeed?: number;
  position?: 'top' | 'bottom';
}

export const BroadcastBar: React.FC<BroadcastBarProps> = ({
  text,
  backgroundColor = '#000000',
  textColor = '#ffffff',
  animation = 'slide',
  scrollSpeed = 5,
  position = 'bottom'
}) => {
  const [animatedText, setAnimatedText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(animation === 'slide');
  
  // Calculate animation duration based on text length and speed
  const calculateDuration = () => {
    if (animation === 'static') return 0;
    const baseSpeed = 20; // base speed in seconds
    const textFactor = text.length / 50; // adjust based on text length
    return baseSpeed * textFactor / scrollSpeed;
  };

  // Update text when props change
  useEffect(() => {
    setAnimatedText(text);
    setIsAnimating(animation === 'slide');
  }, [text, animation]);

  // Animation variants based on type
  const getAnimationVariants = () => {
    switch (animation) {
      case 'slide':
        return {
          initial: { x: '100%' },
          animate: { x: '-100%' },
          transition: { 
            duration: calculateDuration(),
            repeat: Infinity,
            ease: 'linear'
          }
        };
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          transition: {
            duration: 1.5,
            repeatType: 'reverse' as const,
            repeat: Infinity
          }
        };
      case 'static':
      default:
        return {
          initial: { opacity: 1 },
          animate: { opacity: 1 }
        };
    }
  };

  // Position style
  const positionClass = position === 'top' 
    ? 'top-0' 
    : 'bottom-0';

  // Animation variants
  const animationVariants = getAnimationVariants();

  return (
    <div 
      className={`fixed left-0 right-0 z-50 ${positionClass}`}
      style={{ backgroundColor }}
    >
      <div className="relative h-12 overflow-hidden flex items-center px-4">
        {animation === 'slide' ? (
          <motion.div
            className="whitespace-nowrap absolute"
            initial={animationVariants.initial}
            animate={animationVariants.animate}
            transition={animationVariants.transition}
            style={{ color: textColor }}
          >
            {animatedText}
          </motion.div>
        ) : (
          <motion.div
            className="text-center w-full"
            initial={animationVariants.initial}
            animate={animationVariants.animate}
            transition={animationVariants.transition}
            style={{ color: textColor }}
          >
            {animatedText}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BroadcastBar;
