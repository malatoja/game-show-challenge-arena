
import React from 'react';
import { Player, CardType } from '@/types/gameTypes';
import PlayerCamera from '../players/PlayerCamera';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface PlayerGridProps {
  players: Player[];
  onSelectPlayer: (player: Player) => void;
  onAddTestCards: (playerId: string) => void;
}

export function PlayerGrid({ players, onSelectPlayer, onAddTestCards }: PlayerGridProps) {
  return (
    <div className="bg-gameshow-card p-4 rounded-lg">
      <h2 className="text-xl font-semibold text-gameshow-text mb-3">
        Gracze
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {players.map((player) => (
          <div 
            key={player.id}
            className={`cursor-pointer transition-all p-2 rounded-lg ${
              player.isActive ? 'bg-gameshow-primary/20 ring-2 ring-gameshow-primary' : 
              'hover:bg-gameshow-card/80'
            }`}
            onClick={() => onSelectPlayer(player)}
          >
            <PlayerCamera player={player} size="sm" />
            <div className="mt-2">
              <div className="flex justify-between items-center">
                <h3 className="font-bold truncate">{player.name}</h3>
                <span className="text-sm font-semibold">{player.points}p</span>
              </div>
              
              <div className="mt-1 flex items-center gap-2">
                <Progress 
                  value={player.lives * 33.33} 
                  className="h-2" 
                  style={{
                    background: 'rgba(255,0,0,0.2)',
                  }}
                />
                <span className="text-xs font-semibold">{player.lives}/3</span>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-1 mt-2">
              <Button 
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddTestCards(player.id);
                }}
                className="text-xs px-2 py-0 h-7"
              >
                + Karty
              </Button>
              
              {player.cards.length > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectPlayer(player);
                  }}
                  className="text-xs px-2 py-0 h-7 bg-gameshow-primary/10"
                >
                  {player.cards.length} kart
                </Button>
              )}
            </div>
          </div>
        ))}
        
        {players.length < 5 && (
          <div 
            className="flex items-center justify-center border-2 border-dashed border-gameshow-primary/30 rounded-lg h-full min-h-[150px] cursor-pointer hover:bg-gameshow-primary/5 transition-all"
            onClick={() => onSelectPlayer({ id: 'new', name: '', points: 0, lives: 3, cards: [], isActive: false, eliminated: false })}
          >
            <div className="text-center text-gameshow-muted">
              <div className="w-10 h-10 mx-auto mb-2 flex items-center justify-center rounded-full bg-gameshow-primary/20">
                <span className="text-2xl">+</span>
              </div>
              <p>Dodaj gracza</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlayerGrid;
