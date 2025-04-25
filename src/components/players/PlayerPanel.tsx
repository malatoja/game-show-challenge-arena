
import React from 'react';
import { Player } from '../../types/gameTypes';
import PlayerCamera from './PlayerCamera';
import CardDeck from '../cards/CardDeck';

interface PlayerPanelProps {
  players: Player[];
  onUseCard?: (playerId: string, cardType: string) => void;
}

export function PlayerPanel({ players, onUseCard }: PlayerPanelProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {players.map((player) => (
        <div key={player.id} className="flex flex-col items-center">
          <PlayerCamera player={player} />
          <div className="mt-2 w-full">
            <h3 className="text-center font-semibold">{player.name}</h3>
            <div className="mt-1">
              <CardDeck 
                cards={player.cards} 
                onUseCard={(card) => onUseCard && onUseCard(player.id, card.type)}
              />
            </div>
          </div>
        </div>
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
