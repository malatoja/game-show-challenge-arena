
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CardType } from '@/types/gameTypes';
import { CARD_DETAILS } from '@/constants/gameConstants';
import { CARD_IMAGES } from '@/constants/cardImages';
import PlayerCardIndicator from '@/components/players/PlayerCardIndicator';
import { toast } from 'sonner';

interface AssignCardTabProps {
  players: Array<{
    id: string;
    name: string;
    cards: Array<{
      id: string;
      type: CardType;
      name: string;
      description: string;
      isUsed: boolean;
    }>;
  }>;
  selectedPlayer: string;
  setSelectedPlayer: (id: string) => void;
  cardTypes: CardType[];
  handleAwardCard: (playerId: string, cardType: CardType) => void;
}

export function AssignCardTab({
  players,
  selectedPlayer,
  setSelectedPlayer,
  cardTypes,
  handleAwardCard
}: AssignCardTabProps) {
  return (
    <div className="bg-gameshow-card rounded-lg p-6 shadow-lg">
      <h3 className="text-xl font-semibold mb-4">Przydziel kartę graczowi</h3>
      <div className="space-y-4">
        <div>
          <Label className="font-medium mb-2 block">Wybierz gracza</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {players.map(player => (
              <Button
                key={player.id}
                variant={selectedPlayer === player.id ? "default" : "outline"}
                className={`${selectedPlayer === player.id ? 'bg-gameshow-primary' : 'bg-gameshow-card'}`}
                onClick={() => setSelectedPlayer(player.id)}
              >
                {player.name}
              </Button>
            ))}
            
            {players.length === 0 && (
              <p className="text-gameshow-muted col-span-full text-center py-2">
                Brak graczy. Dodaj graczy w zakładce "Gracze"
              </p>
            )}
          </div>
        </div>

        <div>
          <Label className="font-medium mb-2 block">Wybierz kartę</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {cardTypes.map(type => (
              <Button
                key={type}
                variant="outline"
                className="bg-gameshow-card flex items-center gap-2"
                onClick={() => handleAwardCard(selectedPlayer, type)}
                disabled={!selectedPlayer}
              >
                <div className="w-6 h-6 relative">
                  {CARD_IMAGES[type] && (
                    <img
                      src={CARD_IMAGES[type]}
                      alt={CARD_DETAILS[type].name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  )}
                </div>
                <span className="truncate">{CARD_DETAILS[type].name}</span>
              </Button>
            ))}
          </div>
        </div>

        {selectedPlayer && (
          <div>
            <Label className="font-medium mb-2 block">Karty gracza</Label>
            <div className="bg-gameshow-background p-3 rounded-lg flex flex-wrap gap-2">
              {players
                .find(p => p.id === selectedPlayer)
                ?.cards.map(card => (
                  <div key={card.id} className="flex items-center gap-1">
                    <PlayerCardIndicator card={card} />
                  </div>
                ))}
              
              {(!players.find(p => p.id === selectedPlayer)?.cards.length) && (
                <p className="text-gameshow-muted text-sm">Gracz nie posiada żadnych kart</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AssignCardTab;
