
import React from 'react';
import { Player } from '@/types/gameTypes';
import { motion } from 'framer-motion';
import { Trophy, Heart, Star } from 'lucide-react';

interface PlayerCameraGridProps {
  players: Player[];
  isTopRow: boolean;
}

export function PlayerCameraGrid({ players, isTopRow }: PlayerCameraGridProps) {
  if (players.length === 0) {
    return (
      <div className="flex justify-center items-center h-full w-full opacity-50">
        <span className="text-gameshow-muted">Brak graczy</span>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center gap-4 h-full w-full max-w-[1920px]">
      {players.map((player, index) => (
        <motion.div
          key={player.id}
          className="relative"
          initial={{ opacity: 0, y: isTopRow ? -20 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <PlayerCameraWindow player={player} />
        </motion.div>
      ))}
    </div>
  );
}

function PlayerCameraWindow({ player }: { player: Player }) {
  const lifePercentage = (player.lives / 3) * 100;
  
  return (
    <div className={`
      relative w-[384px] h-[360px] rounded-lg overflow-hidden border-2 transition-all duration-300
      ${player.eliminated 
        ? 'border-red-500/50 bg-gray-800/50' 
        : player.isActive 
          ? 'border-neon-pink shadow-[0_0_20px_rgba(255,56,100,0.5)]' 
          : 'border-gameshow-secondary'
      }
    `}>
      {/* Camera/Video area */}
      <div className="w-full h-full bg-gradient-to-br from-gameshow-background to-gameshow-card relative">
        {player.cameraUrl || player.streamUrl ? (
          <video
            src={player.cameraUrl || player.streamUrl}
            className="w-full h-full object-cover"
            autoPlay
            muted
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {player.avatarUrl || player.avatar ? (
              <img 
                src={player.avatarUrl || player.avatar} 
                alt={player.name}
                className="w-32 h-32 rounded-full object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gameshow-primary/20 flex items-center justify-center">
                <span className="text-4xl font-bold text-gameshow-text">
                  {player.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Elimination overlay */}
        {player.eliminated && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="text-red-400 text-2xl font-bold">WYELIMINOWANY</span>
          </div>
        )}

        {/* Active player glow effect */}
        {player.isActive && !player.eliminated && (
          <div className="absolute inset-0 border-4 border-neon-pink animate-pulse" />
        )}
      </div>

      {/* Player info overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold text-lg">{player.name}</h3>
            <div className="flex items-center gap-3 mt-1">
              {/* Points */}
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 font-semibold">{player.points}</span>
              </div>
              
              {/* Lives */}
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4 text-red-400" />
                <span className="text-red-400 font-semibold">{player.lives}</span>
              </div>
              
              {/* Cards count */}
              {player.cards.length > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-400 font-semibold">{player.cards.length}</span>
                </div>
              )}
            </div>
          </div>

          {/* Life bar */}
          <div className="w-16 h-2 bg-gray-600 rounded-full overflow-hidden">
            <motion.div
              className={`h-full transition-colors duration-300 ${
                lifePercentage > 66 ? 'bg-green-400' :
                lifePercentage > 33 ? 'bg-yellow-400' : 'bg-red-400'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${lifePercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlayerCameraGrid;
