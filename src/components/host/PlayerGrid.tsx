import React from 'react';
import { Player } from '@/types/gameTypes';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import PlayerCardIndicator from '../players/PlayerCardIndicator';

interface PlayerGridProps {
  players: Player[];
  onSelectPlayer: (player: Player) => void;
  onAddTestCards: (playerId: string) => void;
  onUseCard: (playerId: string, cardType: string) => void;
}

export function PlayerGrid({ players, onSelectPlayer, onAddTestCards, onUseCard }: PlayerGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {players.map((player) => (
        <div
          key={player.id}
          className={`bg-gameshow-card rounded-lg p-4 cursor-pointer transition-shadow shadow-[0_0_10px_rgba(0,0,0,0.1)] hover:shadow-[0_0_15px_rgba(255,56,100,0.3)] ${player.isActive ? 'border-2 border-neon-pink' : ''}`}
          onClick={() => onSelectPlayer(player)}
        >
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={player.avatarUrl} />
              <AvatarFallback>{player.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            
            <div className="space-y-1 font-medium">
              <div className="text-gameshow-text">{player.name}</div>
              <p className="text-sm text-gameshow-muted">
                {player.points} pkt | {player.lives} życia
              </p>
            </div>
          </div>
          
          <div className="mt-3 flex justify-between items-center">
            <Button 
              variant="outline" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onAddTestCards(player.id);
              }}
              className="border-gameshow-primary/30 hover:bg-gameshow-primary/20"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Test Karty
            </Button>
            
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gameshow-muted">Karty:</span>
              <PlayerCardIndicator 
                cards={player.cards} 
                onUseCard={(cardType) => onUseCard(player.id, cardType)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PlayerGrid;
