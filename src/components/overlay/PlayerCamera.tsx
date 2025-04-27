
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
    <div className="player-container">
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
      <div className={`player-camera ${position === 'top' ? 'top-camera' : 'bottom-camera'}`}>
        {/* Player health bar */}
        <div className="health-bar-container">
          <div 
            className="health-bar"
            style={{ 
              width: `${lifePercentage}%`,
              backgroundColor: lifePercentage > 50 ? '#39FF14' : lifePercentage > 20 ? '#FFC107' : '#FF3864',
              boxShadow: `0 0 5px ${lifePercentage > 50 ? '#39FF14' : lifePercentage > 20 ? '#FFC107' : '#FF3864'}`
            }}
          ></div>
        </div>
        
        {/* Player name */}
        <div className="player-name">
          {player.name}
        </div>
        
        {/* Points display */}
        <div className="player-points">
          {player.points} pkt
        </div>
      </div>
      
      {/* Style for the component */}
      <style jsx>{`
        .player-container {
          position: relative;
          width: 150px;
          height: 150px;
          margin: 0 10px;
        }
        
        .player-camera {
          width: 100%;
          height: 100%;
          background-color: #0A0A1A;
          border-radius: 8px;
          overflow: hidden;
          position: relative;
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          z-index: 1;
        }
        
        .player-camera.top-camera {
          transform-origin: bottom center;
        }
        
        .player-camera.bottom-camera {
          transform-origin: top center;
        }
        
        .health-bar-container {
          position: absolute;
          bottom: 25px;
          left: 0;
          width: 100%;
          height: 5px;
          background-color: rgba(0, 0, 0, 0.5);
        }
        
        .health-bar {
          height: 100%;
          background-color: #39FF14;
          transition: width 0.5s ease, background-color 0.5s ease;
        }
        
        .player-name {
          position: absolute;
          bottom: 5px;
          left: 0;
          width: 100%;
          text-align: center;
          color: white;
          font-size: 12px;
          padding: 2px 5px;
          font-weight: bold;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
        }
        
        .player-points {
          position: absolute;
          top: 5px;
          right: 5px;
          background-color: rgba(0, 0, 0, 0.6);
          color: #39FF14;
          font-size: 10px;
          padding: 2px 5px;
          border-radius: 3px;
          font-weight: bold;
          text-shadow: 0 0 2px #39FF14;
        }
      `}</style>
    </div>
  );
};
