
import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface TimerProps {
  currentTime: number;
  maxTime: number;
  isPulsing?: boolean;
}

export const Timer: React.FC<TimerProps> = ({ currentTime, maxTime, isPulsing = false }) => {
  const percentage = (currentTime / maxTime) * 100;
  const controls = useAnimation();
  
  // Animation effect for pulsing timer
  useEffect(() => {
    if (isPulsing) {
      controls.start({
        scale: [1, 1.1, 1],
        filter: [
          'drop-shadow(0 0 5px rgba(255,56,100,0.7))', 
          'drop-shadow(0 0 15px rgba(255,56,100,0.9))', 
          'drop-shadow(0 0 5px rgba(255,56,100,0.7))'
        ],
        transition: {
          duration: 0.7,
          repeat: Infinity,
          repeatType: 'loop'
        }
      });
    } else {
      controls.start({
        scale: 1,
        filter: 'drop-shadow(0 0 5px rgba(255,56,100,0.5))',
        transition: { duration: 0.3 }
      });
    }
  }, [isPulsing, controls]);
  
  // Timer color based on remaining time
  const getTimerColor = () => {
    if (currentTime <= 5) return '#FF3864';
    if (currentTime <= 10) return '#FFC107';
    return '#39FF14';
  };
  
  return (
    <motion.div 
      className="absolute top-5 right-5 z-10"
      animate={controls}
    >
      <div className="relative flex justify-center items-center w-24 h-24">
        <svg width="100" height="100" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="transparent"
            stroke="rgba(0,0,0,0.5)"
            strokeWidth="8"
          />
          
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="transparent"
            stroke={getTimerColor()}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            initial={{ strokeDashoffset: 0 }}
            animate={{ 
              strokeDashoffset: `${2 * Math.PI * 45 * (1 - percentage / 100)}` 
            }}
            transition={{
              duration: 0.5,
              ease: "easeInOut"
            }}
            transform="rotate(-90 50 50)"
          />
          
          {/* Additional decorative circles */}
          <circle
            cx="50"
            cy="50"
            r="38"
            fill="transparent"
            stroke="rgba(0,0,0,0.3)"
            strokeWidth="1"
          />
        </svg>
        
        {/* Timer text */}
        <motion.span 
          className="absolute text-3xl font-bold text-white"
          animate={{ 
            scale: currentTime <= 5 ? [1, 1.2, 1] : 1,
          }}
          transition={{ 
            duration: 0.5,
            repeat: currentTime <= 5 ? Infinity : 0,
            repeatType: "reverse"
          }}
          style={{
            textShadow: '0 0 10px rgba(255,255,255,0.7)'
          }}
        >
          {currentTime}
        </motion.span>
      </div>
    </motion.div>
  );
};
