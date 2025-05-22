
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface BroadcastBarProps {
  text: string;
  backgroundColor?: string;
  textColor?: string;
  position?: 'top' | 'bottom';
  animation?: 'slide' | 'fade' | 'static';
  scrollSpeed?: number;
}

export const BroadcastBar: React.FC<BroadcastBarProps> = ({
  text,
  backgroundColor = '#000000',
  textColor = '#ffffff',
  position = 'bottom',
  animation = 'slide',
  scrollSpeed = 5
}) => {
  const [marqueeWidth, setMarqueeWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isOverflowing, setIsOverflowing] = useState(false);
  
  // Reference for the text and container to calculate width
  const textRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (textRef.current && containerRef.current) {
      const textWidth = textRef.current.scrollWidth;
      const containerWidth = containerRef.current.clientWidth;
      
      setMarqueeWidth(textWidth);
      setContainerWidth(containerWidth);
      setIsOverflowing(textWidth > containerWidth);
    }
  }, [text]);
  
  // Calculate the animation duration based on text length and speed
  const animationDuration = Math.max(5, marqueeWidth / (scrollSpeed * 30));
  
  // Position style
  const positionStyle = position === 'top' 
    ? { top: 0 } 
    : { bottom: 0 };
  
  // Get the appropriate motion props based on animation type
  const getMotionProps = () => {
    if (animation === 'static') {
      return {}; // No animation
    } else if (animation === 'slide' && isOverflowing) {
      return {
        animate: {
          x: [containerWidth, -marqueeWidth],
          transition: {
            duration: animationDuration,
            repeat: Infinity,
            ease: "linear"
          }
        }
      };
    } else if (animation === 'fade') {
      return {
        animate: {
          opacity: [0, 1, 1, 0],
          transition: {
            duration: 5,
            repeat: Infinity,
            repeatType: "loop" as "loop"
          }
        }
      };
    }
    
    return {}; // Default case
  };
  
  return (
    <div
      ref={containerRef}
      className="broadcast-bar w-full absolute overflow-hidden"
      style={{
        backgroundColor,
        color: textColor,
        height: '40px',
        ...positionStyle,
        zIndex: 100
      }}
    >
      <motion.div
        ref={textRef}
        className="h-full flex items-center px-4 whitespace-nowrap"
        initial={animation !== 'static' ? { x: isOverflowing ? containerWidth : 0 } : {}}
        {...getMotionProps()}
      >
        <span className="text-lg font-semibold">{text}</span>
      </motion.div>
    </div>
  );
};

export default BroadcastBar;
