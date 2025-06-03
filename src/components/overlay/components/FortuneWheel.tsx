
import React from 'react';
import { motion } from 'framer-motion';

interface FortuneWheelProps {
  spinning: boolean;
  selectedCategory?: string;
}

export function FortuneWheel({ spinning, selectedCategory }: FortuneWheelProps) {
  const categories = ['MEMY', 'TRENDY', 'TWITCH', 'INTERNET', 'CIEKAWOSTKI', 'LOSOWA'];
  
  return (
    <div className="w-full h-full bg-gameshow-card rounded-lg border border-gameshow-secondary p-4 flex flex-col items-center justify-center">
      <div className="relative w-64 h-64">
        {/* Wheel background */}
        <motion.div
          className="w-full h-full rounded-full border-4 border-gameshow-primary relative overflow-hidden"
          animate={spinning ? { rotate: 360 } : {}}
          transition={spinning ? { duration: 3, ease: "easeOut" } : {}}
        >
          {/* Wheel segments */}
          {categories.map((category, index) => {
            const angle = (360 / categories.length) * index;
            const nextAngle = (360 / categories.length) * (index + 1);
            
            return (
              <div
                key={category}
                className={`absolute w-full h-full ${
                  selectedCategory === category ? 'bg-gameshow-primary/30' : 'bg-gameshow-background/50'
                }`}
                style={{
                  clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos((angle * Math.PI) / 180)}% ${50 + 50 * Math.sin((angle * Math.PI) / 180)}%, ${50 + 50 * Math.cos((nextAngle * Math.PI) / 180)}% ${50 + 50 * Math.sin((nextAngle * Math.PI) / 180)}%)`
                }}
              >
                <div
                  className="absolute text-xs font-bold text-gameshow-text"
                  style={{
                    top: `${50 + 30 * Math.sin(((angle + nextAngle) / 2 * Math.PI) / 180)}%`,
                    left: `${50 + 30 * Math.cos(((angle + nextAngle) / 2 * Math.PI) / 180)}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  {category}
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Wheel pointer */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
          <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-gameshow-accent"></div>
        </div>
      </div>

      <div className="mt-4 text-center">
        {spinning ? (
          <p className="text-gameshow-text animate-pulse">Kręci się...</p>
        ) : selectedCategory ? (
          <p className="text-gameshow-primary font-bold">Wybrana: {selectedCategory}</p>
        ) : (
          <p className="text-gameshow-muted">Kliknij, aby zakręcić</p>
        )}
      </div>
    </div>
  );
}

export default FortuneWheel;
