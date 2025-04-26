
import React from 'react';
import { Player, CardType } from '@/types/gameTypes';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Star, 
  Award, 
  PlusCircle
} from 'lucide-react';
import PlayerCardIndicator from '../players/PlayerCardIndicator';

interface PlayerGridProps {
  players: Player[];
  onSelectPlayer: (player: Player) => void;
  onAddTestCards: (playerId: string) => void;
  onUseCard: (playerId: string, cardType: CardType) => void;
}

export function PlayerGrid({ 
  players, 
  onSelectPlayer, 
  onAddTestCards, 
  onUseCard 
}: PlayerGridProps) {
  // Max number of players to display in the grid
  const MAX_PLAYERS = 10;
  
  // Create placeholder array for empty slots
  const playerSlots = [...players];
  while (playerSlots.length < MAX_PLAYERS) {
    playerSlots.push(null);
  }
  
  return (
    <div className="bg-gameshow-card/80 p-3 rounded-lg shadow-inner">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {playerSlots.map((player, index) => (
          <div 
            key={player ? player.id : `empty-${index}`}
            className={cn(
              "rounded-lg p-3 transition-all",
              player ? (
                player.isActive 
                  ? "bg-gameshow-primary/20 ring-2 ring-gameshow-primary animate-pulse-glow" 
                  : player.eliminated 
                    ? "bg-gameshow-card/60 opacity-60 grayscale"
                    : "bg-gameshow-card hover:bg-gameshow-primary/10"
              ) : "border-2 border-dashed border-gameshow-primary/30 flex items-center justify-center"
            )}
            onClick={() => player && onSelectPlayer(player)}
          >
            {player ? (
              <div className="space-y-2">
                {/* Player name and avatar */}
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg truncate">{player.name}</h3>
                  {player.isActive && (
                    <Badge variant="default" className="bg-gameshow-primary">
                      Aktywny
                    </Badge>
                  )}
                </div>
                
                {/* Player avatar placeholder */}
                <div className="w-full h-20 bg-gameshow-background/50 rounded-md flex items-center justify-center">
                  {/* This could be replaced with avatar component */}
                  <div className="w-12 h-12 rounded-full bg-gameshow-primary/30 flex items-center justify-center">
                    <span className="font-bold text-xl">{player.name.charAt(0)}</span>
                  </div>
                </div>
                
                {/* Lives and points */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold">Życia:</span>
                  <div className="flex-1">
                    <Progress 
                      value={player.lives * 33.33} 
                      className="h-2"
                      style={{background: 'rgba(255,0,0,0.2)'}}
                    />
                  </div>
                  <span className="text-xs font-bold">{player.lives}/3</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <Award className="w-4 h-4 text-gameshow-accent" />
                    <span className="font-bold">{player.points} pkt</span>
                  </div>
                  
                  {player.cards.length > 0 && (
                    <Badge variant="outline" className="bg-gameshow-card/60">
                      <Star className="w-3 h-3 mr-1" />
                      {player.cards.length} kart
                    </Badge>
                  )}
                </div>
                
                {/* Card indicators */}
                {player.cards.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    <PlayerCardIndicator 
                      cards={player.cards} 
                      onUseCard={(cardType) => onUseCard(player.id, cardType)} 
                    />
                  </div>
                )}
                
                {/* Actions */}
                <div className="flex justify-center mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddTestCards(player.id);
                    }}
                    className="text-xs h-7 px-2 py-0 border-gameshow-primary/30 hover:bg-gameshow-primary/10"
                  >
                    <PlusCircle className="w-3 h-3 mr-1" /> Karty
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="ghost"
                className="h-full w-full flex flex-col items-center justify-center text-gameshow-muted hover:text-gameshow-primary hover:bg-transparent border-none"
              >
                <Plus className="w-8 h-8 mb-2" />
                <span>Dodaj gracza</span>
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlayerGrid;
