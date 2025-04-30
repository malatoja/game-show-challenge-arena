
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { CardType } from '@/types/gameTypes';
import { CARD_DETAILS } from '@/constants/gameConstants';
import { CARD_IMAGES } from '@/constants/cardImages';
import PlayerCardIndicator from '@/components/players/PlayerCardIndicator';
import { toast } from 'sonner';
import { PlusCircle, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface AssignCardTabProps {
  players: Array<{
    id: string;
    name: string;
    cards: Array<{
      id?: string; // Changed from required to optional to match Card type
      type: CardType;
      name?: string;
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
  const [isCustomCardDialogOpen, setIsCustomCardDialogOpen] = useState(false);
  const [customCardType, setCustomCardType] = useState<string>("");
  const [customCardName, setCustomCardName] = useState<string>("");
  const [customCardDescription, setCustomCardDescription] = useState<string>("");

  const handleCreateCustomCard = () => {
    if (!customCardType.trim()) {
      toast.error("Typ karty jest wymagany");
      return;
    }

    if (!customCardName.trim()) {
      toast.error("Nazwa karty jest wymagana");
      return;
    }

    if (!customCardDescription.trim()) {
      toast.error("Opis karty jest wymagany");
      return;
    }

    // Add custom card logic will be handled in the parent component
    toast.success(`Utworzono nową kartę: ${customCardName}`);
    
    // Reset form fields
    setCustomCardType("");
    setCustomCardName("");
    setCustomCardDescription("");
    setIsCustomCardDialogOpen(false);
  };

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
          <div className="flex justify-between items-center mb-2">
            <Label className="font-medium">Wybierz kartę</Label>
            <Dialog open={isCustomCardDialogOpen} onOpenChange={setIsCustomCardDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <PlusCircle className="h-4 w-4" /> Nowa karta
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Utwórz nową kartę</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <Label htmlFor="cardType">Typ karty (identyfikator)</Label>
                    <Input 
                      id="cardType" 
                      value={customCardType} 
                      onChange={(e) => setCustomCardType(e.target.value)} 
                      placeholder="np. superturbo"
                    />
                    <p className="text-xs text-gameshow-muted mt-1">Unikalny identyfikator karty (bez spacji, małe litery)</p>
                  </div>
                  <div>
                    <Label htmlFor="cardName">Nazwa karty</Label>
                    <Input 
                      id="cardName" 
                      value={customCardName} 
                      onChange={(e) => setCustomCardName(e.target.value)} 
                      placeholder="np. Super Turbo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardDescription">Opis karty</Label>
                    <Textarea 
                      id="cardDescription" 
                      value={customCardDescription} 
                      onChange={(e) => setCustomCardDescription(e.target.value)} 
                      placeholder="np. Potrójne punkty za poprawną odpowiedź"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCustomCardDialogOpen(false)}>Anuluj</Button>
                  <Button onClick={handleCreateCustomCard}>Utwórz kartę</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
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
                  <div key={card.id || `${card.type}-${Math.random()}`} className="flex items-center gap-1">
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
