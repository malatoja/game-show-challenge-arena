
import React from 'react';
import { Player, CardType } from '@/types/gameTypes';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import CardDeck from '@/components/cards/CardDeck';

interface ActivePlayerPanelProps {
  activePlayer: Player | null;
  onAddTestCards: (playerId: string) => void;
  onUseCard: (playerId: string, cardType: CardType) => void;
}

export function ActivePlayerPanel({ 
  activePlayer, 
  onAddTestCards, 
  onUseCard 
}: ActivePlayerPanelProps) {
  if (!activePlayer) {
    return (
      <div className="text-center py-8 text-gameshow-muted bg-gameshow-background/50 rounded-lg">
        <p className="mb-4">Wybierz aktywnego gracza</p>
        <div className="flex justify-center">
          <div className="player-camera-box w-32 h-24 opacity-40 flex items-center justify-center">
            <span className="text-3xl text-gameshow-muted">?</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Placeholder for PlayerCamera */}
      <div className="player-camera-box w-full h-36 bg-gray-700 rounded-lg mb-4">
        {/* Placeholder content, replace with actual PlayerCamera component */}
        <div className="flex items-center justify-center h-full text-white text-xl">
          {activePlayer.name}
        </div>
      </div>
      
      <div className="mt-4 mb-2 flex items-center gap-2">
        <h3 className="font-semibold">Życie:</h3>
        <div className="w-2/3 bg-gray-400 h-2 rounded-full relative">
          <div 
            className="bg-red-500 h-2 rounded-full absolute top-0 left-0"
            style={{ width: `${(activePlayer.lives / 3) * 100}%` }}
          />
        </div>
        <span className="font-semibold">{activePlayer.lives}/3</span>
      </div>
      
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Karty specjalne:</h3>
        {activePlayer.cards.length > 0 ? (
          <CardDeck 
            cards={activePlayer.cards}
            onUseCard={(card) => onUseCard(activePlayer.id, card.type)}
          />
        ) : (
          <div className="text-center py-4 text-gameshow-muted">
            <p>Brak kart</p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAddTestCards(activePlayer.id)}
              className="mt-2"
            >
              Dodaj karty testowe
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ActivePlayerPanel;
