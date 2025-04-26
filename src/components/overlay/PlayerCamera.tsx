
import React from 'react';
import { Player } from '@/types/gameTypes';

interface PlayerCameraProps {
  player: Player;
  position: 'top' | 'bottom';
}

export const PlayerCamera: React.FC<PlayerCameraProps> = ({ player, position }) => {
  const playerColor = player.color || getRandomNeonColor(player.id);
  
  return (
    <div className="player-camera-container">
      <div 
        className={`player-camera ${player.isActive ? 'active' : ''}`}
        style={{ 
          borderColor: playerColor,
          boxShadow: player.isActive ? `0 0 10px ${playerColor}, 0 0 20px ${playerColor}` : 'none'
        }}
      >
        {/* This would be a placeholder for the actual camera feed */}
        <div className="camera-placeholder">
          {player.streamUrl ? (
            <img src={player.streamUrl} alt={player.name} className="camera-feed" />
          ) : (
            <div className="no-stream">No Feed</div>
          )}
        </div>
      </div>
      <div 
        className="player-name"
        style={{ color: playerColor }}
      >
        {player.name}
      </div>
      {position === 'bottom' && (
        <div className="player-health-bar-container">
          <div 
            className="player-health-bar"
            style={{ 
              width: `${player.lives}%`,
              backgroundColor: getHealthColor(player.lives)
            }}
          ></div>
        </div>
      )}
      <style jsx>{`
        .player-camera-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 18%;
          min-width: 150px;
        }
        
        .player-camera {
          width: 100%;
          aspect-ratio: 16/9;
          border: 2px solid;
          border-radius: 4px;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        
        .player-camera.active {
          animation: glow 1.5s infinite;
        }
        
        .camera-placeholder {
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .camera-feed {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .no-stream {
          color: rgba(255, 255, 255, 0.5);
          font-size: 14px;
        }
        
        .player-name {
          margin-top: 5px;
          font-weight: bold;
          text-align: center;
          text-shadow: 0 0 5px currentColor, 0 0 10px currentColor;
        }
        
        .player-health-bar-container {
          width: 100%;
          height: 6px;
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
          margin-top: 5px;
          overflow: hidden;
        }
        
        .player-health-bar {
          height: 100%;
          transition: width 0.5s ease, background-color 0.5s ease;
        }
      `}</style>
    </div>
  );
};

// Helper function to generate a random neon color based on player ID
function getRandomNeonColor(playerId: string): string {
  const neonColors = [
    '#2E9CCA', // blue
    '#9D4EDD', // purple
    '#39FF14', // green
    '#FF3864', // pink
    '#FF6B35', // orange
    '#FFD700', // yellow
  ];
  
  // Use player ID to consistently get the same color for a player
  const index = playerId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % neonColors.length;
  return neonColors[index];
}

// Helper function to determine health bar color based on percentage
function getHealthColor(percentage: number): string {
  if (percentage > 60) return '#39FF14'; // Neon green
  if (percentage > 30) return '#FFD700'; // Neon yellow
  return '#FF3864'; // Neon red
}
