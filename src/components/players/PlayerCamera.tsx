
import React from 'react';
import { Player } from '../../types/gameTypes';
import { cn } from '@/lib/utils';

interface PlayerCameraProps {
  player: Player;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export function PlayerCamera({ player, size = 'md', showDetails = true }: PlayerCameraProps) {
  const sizeClasses = {
    sm: 'w-32 h-24',
    md: 'w-48 h-36',
    lg: 'w-64 h-48',
  };

  const placeholderUrl = "https://images.unsplash.com/photo-1605810230434-7631ac76ec81";

  return (
    <div className="flex flex-col items-center">
      <div 
        className={cn(
          'player-camera-box relative',
          sizeClasses[size],
          player.isActive && 'active',
          player.eliminated && 'opacity-50 grayscale'
        )}
      >
        {/* Placeholder or actual stream */}
        <div className="w-full h-full bg-gameshow-background">
          {player.streamUrl ? (
            <iframe 
              src={player.streamUrl}
              className="w-full h-full"
              title={`${player.name}'s stream`}
              allowFullScreen
            ></iframe>
          ) : (
            <img 
              src={player.avatarUrl || placeholderUrl} 
              alt={player.name}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        
        {/* Player name overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-1 text-white text-center">
          <p className="text-sm font-semibold truncate">{player.name}</p>
        </div>
        
        {/* Active indicator */}
        {player.isActive && (
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-gameshow-accent rounded-full"></div>
        )}
        
        {/* Eliminated overlay */}
        {player.eliminated && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <p className="text-red-500 font-bold">WYELIMINOWANY</p>
          </div>
        )}
      </div>
      
      {showDetails && (
        <div className="mt-2 text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="flex gap-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} 
                  className={cn(
                    "w-4 h-4 rounded-full",
                    i < player.lives ? "bg-red-500" : "bg-gray-400"
                  )}
                />
              ))}
            </div>
            <p className="font-semibold">{player.points} pkt</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlayerCamera;
