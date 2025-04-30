
import React, { useEffect, useState } from 'react';
import { Player } from '@/types/gameTypes';
import { motion, AnimatePresence } from 'framer-motion';

interface PlayerCameraProps {
  player: Player;
  position?: 'top' | 'bottom';
}

export const PlayerCamera: React.FC<PlayerCameraProps> = ({ player, position = 'top' }) => {
  const [lifePercentage, setLifePercentage] = useState(100);
  const [isEliminated, setIsEliminated] = useState(false);
  
  useEffect(() => {
    // Convert raw lives value to percentage
    const maxLives = 100;
    const percentage = (player.lives / maxLives) * 100;
    setLifePercentage(Math.max(0, Math.min(100, percentage)));
    
    // Check if player is eliminated
    setIsEliminated(player.eliminated || player.lives <= 0);
  }, [player.lives, player.eliminated]);

  // Get color based on life percentage
  const getLifeColor = () => {
    if (lifePercentage > 60) return '#39FF14';
    if (lifePercentage > 30) return '#FFC107';
    return '#FF3864';
  };

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
            <div 
              className="absolute inset-0 rounded-lg border-2 animate-pulse"
              style={{
                borderColor: '#39FF14',
                boxShadow: '0 0 10px #39FF14, 0 0 20px rgba(57, 255, 20, 0.5)'
              }}
            ></div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Player camera container */}
      <motion.div 
        className={`player-camera w-full h-full bg-[#0A0A1A] rounded-lg overflow-hidden relative border border-white/10 flex flex-col justify-end shadow-lg z-1 ${position === 'top' ? 'origin-bottom' : 'origin-top'}`}
        animate={isEliminated ? { 
          filter: 'grayscale(100%)', 
          opacity: 0.6,
          scale: 0.95
        } : { 
          filter: 'grayscale(0%)', 
          opacity: 1,
          scale: 1
        }}
        transition={{ duration: 0.5 }}
      >
        {/* Player stream/image placeholder */}
        {player.streamUrl ? (
          <iframe 
            src={player.streamUrl} 
            className="absolute inset-0 w-full h-full"
            title={`Stream of ${player.name}`}
            allowFullScreen
          ></iframe>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-gameshow-background/50 to-gameshow-background/90 flex items-center justify-center">
            {player.avatarUrl ? (
              <img 
                src={player.avatarUrl} 
                alt={player.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-gameshow-muted text-xs">No Camera</div>
            )}
          </div>
        )}
        
        {/* Player health bar */}
        <div className="absolute bottom-[25px] left-0 w-full h-[5px] bg-black/50">
          <motion.div 
            className="h-full transition-all"
            initial={{ width: 0 }}
            animate={{ width: `${lifePercentage}%` }}
            transition={{ duration: 0.5 }}
            style={{ 
              backgroundColor: getLifeColor(),
              boxShadow: `0 0 5px ${getLifeColor()}`
            }}
          ></motion.div>
        </div>
        
        {/* Player name */}
        <div className="absolute bottom-[5px] left-0 w-full text-center text-white text-xs font-bold px-[5px] py-[2px] truncate">
          {player.name}
        </div>
        
        {/* Points display */}
        <div className="absolute top-[5px] right-[5px] bg-black/60 text-[#39FF14] text-[10px] px-[5px] py-[2px] rounded-[3px] font-bold">
          {player.points} pkt
        </div>
        
        {/* Cards indicator - if player has cards */}
        {player.cards && player.cards.length > 0 && !player.cards.every(card => card.isUsed) && (
          <div className="absolute top-[5px] left-[5px]">
            <motion.div 
              className="bg-neon-pink/80 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              {player.cards.filter(card => !card.isUsed).length}
            </motion.div>
          </div>
        )}
        
        {/* Eliminated overlay */}
        <AnimatePresence>
          {isEliminated && (
            <motion.div 
              className="absolute inset-0 bg-black/70 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.p 
                className="text-red-500 font-bold bg-black/50 px-2 py-1 rounded-md"
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [-5, 0, 5, 0] }}
                transition={{ duration: 0.5, rotate: { repeat: Infinity, duration: 2 } }}
              >
                WYELIMINOWANY
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
