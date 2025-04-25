
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { WHEEL_CATEGORIES } from '@/constants/gameConstants';
import { motion } from 'framer-motion';

interface FortuneWheelProps {
  onSelectCategory?: (category: string) => void;
  isSpinning: boolean;
  onSpinEnd?: () => void;
}

export function FortuneWheel({ onSelectCategory, isSpinning, onSpinEnd }: FortuneWheelProps) {
  const [rotation, setRotation] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [spinAngle, setSpinAngle] = useState(0);
  const categories = WHEEL_CATEGORIES;

  useEffect(() => {
    if (isSpinning) {
      // Calculate random rotation (2-5 full rotations + random angle)
      const randomRotations = Math.floor(Math.random() * 3) + 2; // 2-5 rotations
      const randomAngle = Math.floor(Math.random() * 360);
      const totalRotation = 360 * randomRotations + randomAngle;
      
      setSpinAngle(totalRotation);
      setRotation(prevRotation => prevRotation + totalRotation);
      
      // Calculate which category the wheel lands on
      const sectorSize = 360 / categories.length;
      const normalizedRotation = randomAngle % 360;
      const sectorIndex = Math.floor(normalizedRotation / sectorSize);
      const selectedCategory = categories[sectorIndex];
      
      // Wait for animation to complete, then set the selected category
      const timer = setTimeout(() => {
        setSelectedCategory(selectedCategory);
        if (onSelectCategory) onSelectCategory(selectedCategory);
        if (onSpinEnd) onSpinEnd();
      }, 5000); // Match this to the CSS animation duration
      
      return () => clearTimeout(timer);
    }
  }, [isSpinning, categories, onSelectCategory, onSpinEnd]);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-64 h-64">
        {/* Wheel pointer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-0 h-0">
          <motion.div 
            className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[20px] border-b-gameshow-accent"
            animate={isSpinning ? {
              scale: [1, 1.2, 1],
            } : {}}
            transition={{ duration: 0.5, repeat: isSpinning ? Infinity : 0, repeatType: "reverse" }}
          />
        </div>
        
        {/* Wheel base and shadow */}
        <div className="absolute inset-0 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.3)]" />
        
        {/* Wheel */}
        <motion.div 
          className="relative w-full h-full rounded-full overflow-hidden border-4 border-gameshow-accent"
          animate={{ rotate: rotation }}
          transition={isSpinning ? { 
            duration: 5, 
            ease: [0.3, 0.8, 0.2, 1],
            type: "tween"
          } : {}}
          style={{ 
            boxShadow: isSpinning ? "0 0 20px rgba(255,215,0,0.5)" : "none" 
          }}
        >
          {categories.map((category, index) => {
            const sectorSize = 360 / categories.length;
            const rotation = index * sectorSize;
            const isEven = index % 2 === 0;
            
            return (
              <div
                key={category}
                className={cn(
                  "absolute w-full h-full origin-center",
                  isEven ? "bg-gameshow-primary" : "bg-gameshow-secondary",
                )}
                style={{
                  transform: `rotate(${rotation}deg)`,
                  clipPath: `polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)`,
                  backgroundImage: isEven 
                    ? 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0.1) 100%)' 
                    : 'radial-gradient(circle, rgba(0,0,0,0.1) 0%, rgba(255,255,255,0.1) 100%)'
                }}
              >
                <div 
                  className="absolute top-5 left-1/2 transform text-white text-xs whitespace-nowrap font-semibold"
                  style={{ 
                    transform: `translateX(30%) rotate(${-rotation - 90}deg)`,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                  }}
                >
                  {category}
                </div>
              </div>
            );
          })}
          
          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gameshow-accent z-10" />
          
          {/* Bolts/studs around the wheel */}
          {Array.from({ length: 8 }).map((_, idx) => (
            <div 
              key={idx} 
              className="absolute w-3 h-3 rounded-full bg-gray-300 border border-gray-400"
              style={{
                top: `${50 + 47 * Math.sin(idx * Math.PI / 4)}%`,
                left: `${50 + 47 * Math.cos(idx * Math.PI / 4)}%`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
        </motion.div>
      </div>
      
      {selectedCategory && !isSpinning && (
        <motion.div 
          className="mt-4 p-4 bg-gameshow-card rounded-lg text-center shadow-lg border border-gameshow-accent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-gameshow-muted font-bold mb-1">Kategoria:</h3>
          <p className="text-xl text-white font-extrabold">{selectedCategory}</p>
        </motion.div>
      )}
      
      {isSpinning && (
        <motion.div 
          className="mt-4 flex items-center justify-center gap-2 p-2 bg-gameshow-primary/20 rounded-full"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        >
          <div className="w-2 h-2 bg-gameshow-accent rounded-full animate-pulse" />
          <p className="text-sm font-medium text-gameshow-accent">Kręcenie kołem...</p>
        </motion.div>
      )}
    </div>
  );
}

export default FortuneWheel;
