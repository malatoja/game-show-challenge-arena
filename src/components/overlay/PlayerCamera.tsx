
import React, { useEffect, useState } from 'react';
import { Player } from '@/types/gameTypes';
import { motion, AnimatePresence } from 'framer-motion';

interface PlayerCameraProps {
  player: Player;
  position?: 'top' | 'bottom';
}

export const PlayerCamera: React.FC<PlayerCameraProps> = ({ player, position = 'top' }) => {
  const [lifePercentage, setLifePercentage] = useState(100);
  
  useEffect(() => {
    // Convert raw lives value to percentage
    const maxLives = 100;
    const percentage = (player.lives / maxLives) * 100;
    setLifePercentage(Math.max(0, Math.min(100, percentage)));
  }, [player.lives]);

  return (
    <div className="player-container relative w-[150px] h-[150px] mx-[10px]">
      {/* Active player indicator */}
      <AnimatePresence>
        {player.isActive && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 z-0"
          >
            <div className="absolute inset-0 rounded-lg border-2"
              style={{
                borderColor: '#39FF14',
                boxShadow: '0 0 10px #39FF14, 0 0 20px rgba(57, 255, 20, 0.5)'
              }}
            ></div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Player camera container */}
      <div className={`player-camera w-full h-full bg-[#0A0A1A] rounded-lg overflow-hidden relative border border-white/10 flex flex-col justify-end shadow-lg transition-transform duration-300 ease-in-out z-1 ${position === 'top' ? 'origin-bottom' : 'origin-top'}`}>
        {/* Player health bar */}
        <div className="absolute bottom-[25px] left-0 w-full h-[5px] bg-black/50">
          <div 
            className="h-full transition-all duration-500"
            style={{ 
              width: `${lifePercentage}%`,
              backgroundColor: lifePercentage > 50 ? '#39FF14' : lifePercentage > 20 ? '#FFC107' : '#FF3864',
              boxShadow: `0 0 5px ${lifePercentage > 50 ? '#39FF14' : lifePercentage > 20 ? '#FFC107' : '#FF3864'}`
            }}
          ></div>
        </div>
        
        {/* Player name */}
        <div className="absolute bottom-[5px] left-0 w-full text-center text-white text-xs font-bold px-[5px] py-[2px] truncate">
          {player.name}
        </div>
        
        {/* Points display */}
        <div className="absolute top-[5px] right-[5px] bg-black/60 text-[#39FF14] text-[10px] px-[5px] py-[2px] rounded-[3px] font-bold">
          {player.points} pkt
        </div>
      </div>
    </div>
  );
};
