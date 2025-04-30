
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const AutomatedMessages: React.FC = () => {
  return (
    <div className="bg-gameshow-background/20 p-4 rounded-lg">
      <h3 className="text-lg font-medium mb-3">Automatyczne wiadomości</h3>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Start rundy</label>
          <Input
            placeholder="np. Rozpoczynamy rundę {round}!"
            defaultValue="Rozpoczynamy rundę {round}! Powodzenia wszystkim graczom."
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1">Poprawna odpowiedź</label>
          <Input
            placeholder="np. {player} odpowiada poprawnie!"
            defaultValue="{player} odpowiada poprawnie i zdobywa {points} punktów!"
          />
        </div>
        
        <div>
          <label className="block text-sm mb-1">Użycie karty</label>
          <Input
            placeholder="np. {player} używa karty {card}!"
            defaultValue="{player} używa karty {card}! {effect}"
          />
        </div>
        
        <div className="pt-3">
          <Button size="sm">
            Zapisz wiadomości
          </Button>
        </div>
      </div>
    </div>
  );
};
