import React from 'react';
import { Player } from '@/types/gameTypes';

interface PlayerCameraProps {
  player: Player;
  position: 'top' | 'bottom';
}

export const PlayerCamera: React.FC<PlayerCameraProps> = ({ player, position }) => {
  const playerColor = player.color || getRandomNeonColor(player.id);
  
  return (
    <div className="flex flex-col items-center w-[18%] min-w-[150px]">
      <div 
        className={`w-full aspect-video border-2 rounded-md overflow-hidden transition-all duration-300 ${player.isActive ? 'animate-pulse' : ''}`}
        style={{ 
          borderColor: playerColor,
          boxShadow: player.isActive ? `0 0 10px ${playerColor}, 0 0 20px ${playerColor}` : 'none'
        }}
      >
        <div className="w-full h-full bg-black/50 flex justify-center items-center">
          {player.streamUrl ? (
            <img src={player.streamUrl} alt={player.name} className="w-full h-full object-cover" />
          ) : (
            <div className="text-white/50 text-sm">No Feed</div>
          )}
        </div>
      </div>
      <div 
        className="mt-1 font-bold text-center text-shadow-neon"
        style={{ color: playerColor }}
      >
        {player.name}
      </div>
      {position === 'bottom' && (
        <div className="w-full h-1.5 bg-white/20 rounded-full mt-1 overflow-hidden">
          <div 
            className="h-full transition-all duration-500 ease-in-out"
            style={{ 
              width: `${player.lives}%`,
              backgroundColor: getHealthColor(player.lives)
            }}
          ></div>
        </div>
      )}
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
