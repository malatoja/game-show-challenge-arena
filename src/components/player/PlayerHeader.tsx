
import React from 'react';
import { Player } from '@/types/gameTypes';
import { Progress } from '@/components/ui/progress';
import { Heart, Award } from 'lucide-react';
import { PlayerCardCollection } from '../players/PlayerCardIndicator';

interface PlayerHeaderProps {
  player: Player;
}

const PlayerHeader: React.FC<PlayerHeaderProps> = ({ player }) => {
  return (
    <header className="bg-gameshow-card border-b border-gameshow-primary/30 p-4 shadow-lg">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Player name and active status */}
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold text-gameshow-text">
              {player.name}
            </h1>
            
            {player.isActive && (
              <div className="px-3 py-1 bg-gameshow-accent rounded-full animate-pulse">
                <span className="text-sm font-semibold text-white">Twoja kolej!</span>
              </div>
            )}
          </div>
          
          {/* Player stats */}
          <div className="flex items-center gap-6">
            {/* Points */}
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-gameshow-primary" />
              <span className="text-xl font-bold">{player.points}</span>
              <span className="text-sm text-gameshow-muted">pkt</span>
            </div>
            
            {/* Lives */}
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              <div className="flex space-x-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} 
                    className={`w-4 h-4 rounded-full ${
                      i < player.lives ? "bg-red-500" : "bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>
            
            {/* Cards */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gameshow-muted">Karty:</span>
              <PlayerCardCollection cards={player.cards} />
            </div>
          </div>
        </div>
        
        {/* Progress bar for lives */}
        <div className="mt-3">
          <Progress 
            value={player.lives * 33.33} 
            className="h-2" 
            style={{
              background: 'rgba(255,0,0,0.2)',
            }}
          />
        </div>
      </div>
    </header>
  );
};

export default PlayerHeader;
