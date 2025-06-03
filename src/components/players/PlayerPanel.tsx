
import React from 'react';
import { Player } from '../../types/gameTypes';
import PlayerCamera from './PlayerCamera';
import CardDeck from '../cards/CardDeck';
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';

interface PlayerPanelProps {
  players: Player[];
  onUseCard?: (playerId: string, cardType: string) => void;
}

export function PlayerPanel({ players, onUseCard }: PlayerPanelProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {players.map((player) => (
        <motion.div 
          key={player.id} 
          className="flex flex-col items-center"
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="relative w-full">
            <PlayerCamera player={player} />
            
            {/* Player status indicators */}
            <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
              <Badge variant="outline" className="bg-gameshow-background/80 backdrop-blur-sm">
                {player.points} pkt
              </Badge>
              
              <div className="flex items-center gap-1 bg-gameshow-background/80 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs">
                <Heart className="h-3 w-3 fill-red-500 stroke-red-500" />
                <span>{player.lives}</span>
              </div>
            </div>
            
            {/* Eliminate overlay */}
            {player.eliminated && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-md">
                <p className="text-red-500 font-bold text-lg">WYELIMINOWANY</p>
              </div>
            )}
          </div>
          
          <div className="mt-2 w-full">
            <h3 className="text-center font-semibold">{player.name}</h3>
            <div className="mt-1">
              <CardDeck 
                cards={player.cards} 
                onUseCard={(card) => onUseCard && onUseCard(player.id, card.type)}
                compact={true}
              />
            </div>
          </div>
        </motion.div>
      ))}
      
      {players.length === 0 && (
        <div className="col-span-5 text-center py-10">
          <p className="text-gameshow-muted">Brak graczy. Dodaj graczy, aby rozpocząć.</p>
        </div>
      )}
    </div>
  );
}

export default PlayerPanel;
