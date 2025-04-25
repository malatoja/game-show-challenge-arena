
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { WHEEL_CATEGORIES } from '@/constants/gameConstants';

interface FortuneWheelProps {
  onSelectCategory?: (category: string) => void;
  isSpinning: boolean;
  onSpinEnd?: () => void;
}

export function FortuneWheel({ onSelectCategory, isSpinning, onSpinEnd }: FortuneWheelProps) {
  const [rotation, setRotation] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const categories = WHEEL_CATEGORIES;

  useEffect(() => {
    if (isSpinning) {
      // Calculate random rotation (2-5 full rotations + random angle)
      const randomRotations = Math.floor(Math.random() * 3) + 2; // 2-5 rotations
      const randomAngle = Math.floor(Math.random() * 360);
      const totalRotation = 360 * randomRotations + randomAngle;
      
      setRotation(totalRotation);
      
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
          <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[20px] border-b-gameshow-accent"></div>
        </div>
        
        {/* Wheel */}
        <div 
          className={cn(
            "relative w-full h-full rounded-full overflow-hidden",
            isSpinning && "animate-wheel-spin"
          )}
          style={{ 
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? 'transform 5s cubic-bezier(0.3, 0.8, 0.2, 1)' : 'none'
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
                  "absolute w-full h-full origin-bottom-center",
                  isEven ? "bg-gameshow-primary" : "bg-gameshow-secondary",
                )}
                style={{
                  transform: `rotate(${rotation}deg)`,
                  clipPath: `polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%)`,
                }}
              >
                <div 
                  className="absolute top-5 left-1/2 transform -translate-x-1/2 -rotate-90 text-white text-xs whitespace-nowrap font-semibold"
                  style={{ transform: `translateX(30%) rotate(${-rotation - 90}deg)`}}
                >
                  {category}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {selectedCategory && !isSpinning && (
        <div className="mt-4 p-3 bg-gameshow-card rounded-lg text-center animate-pulse-glow">
          <h3 className="text-gameshow-text font-bold">Kategoria:</h3>
          <p className="text-xl text-white font-extrabold">{selectedCategory}</p>
        </div>
      )}
    </div>
  );
}

export default FortuneWheel;
