
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CardType, PlayerId } from '@/types/gameTypes';
import { useGame } from '@/context/GameContext';
import { CreditCard, Gift, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CARD_DETAILS } from '@/constants/gameConstants';

interface CardManagementProps {
  playerId: PlayerId | null;
}

export function CardManagement({ playerId }: CardManagementProps) {
  const { state, dispatch } = useGame();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  
  const player = playerId ? state.players.find(p => p.id === playerId) : null;
  const allCardTypes = Object.keys(CARD_DETAILS) as CardType[];
  
  const handleAwardCard = (cardType: CardType) => {
    if (!playerId) {
      toast.error("Wybierz gracza aby przyznać kartę!");
      return;
    }
    
    dispatch({ type: 'AWARD_CARD', playerId, cardType });
    toast.success(`Przyznano kartę ${CARD_DETAILS[cardType].name} graczowi ${player?.name}`);
    setIsOpen(false);
  };

  const handleUseCard = (cardType: CardType) => {
    if (!playerId) {
      toast.error("Wybierz gracza aby użyć kartę!");
      return;
    }
    
    dispatch({ type: 'USE_CARD', playerId, cardType });
    toast.success(`Aktywowano kartę ${CARD_DETAILS[cardType].name} dla gracza ${player?.name}`);
    setIsOpen(false);
  };
  
  if (!player) {
    return (
      <div className="bg-gameshow-card/50 p-4 rounded-lg text-center text-gameshow-muted">
        <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>Wybierz gracza aby zarządzać kartami</p>
      </div>
    );
  }
  
  return (
    <div className="bg-gameshow-card p-4 rounded-lg shadow-[0_0_15px_rgba(255,56,100,0.2)]">
      <h3 className="text-lg font-semibold text-neon-pink animate-neon-pulse mb-2 flex items-center">
        <CreditCard className="w-5 h-5 mr-2" />
        Karty specjalne
      </h3>
      
      <div className="mt-2">
        {player.cards.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {player.cards.map((card, index) => (
              <Button
                key={index}
                onClick={() => handleUseCard(card.type)}
                className={`justify-start text-left px-2 py-1 ${
                  card.isUsed ? 'opacity-50 cursor-not-allowed' : 'bg-neon-purple/20 hover:bg-neon-purple/30'
                }`}
                disabled={card.isUsed}
              >
                <div className="w-full truncate">
                  <div className="font-bold text-neon-purple">{CARD_DETAILS[card.type].name}</div>
                  <div className="text-xs truncate">{card.isUsed ? 'Użyta' : 'Dostępna'}</div>
                </div>
              </Button>
            ))}
          </div>
        ) : (
          <p className="text-center text-gameshow-muted py-2">Brak kart</p>
        )}
      </div>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            className="w-full mt-3 bg-neon-pink/20 hover:bg-neon-pink/30 border border-neon-pink text-neon-pink shadow-[0_0_10px_rgba(255,56,100,0.3)]"
          >
            <Gift className="h-5 w-5 mr-2" />
            Przyznaj kartę
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-gameshow-card border-gameshow-primary/30">
          <DialogHeader>
            <DialogTitle className="text-neon-pink">Przyznaj kartę dla {player.name}</DialogTitle>
            <DialogDescription>
              Wybierz kartę, którą chcesz przyznać graczowi
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-2 mt-4">
            {allCardTypes.map((cardType) => (
              <Button
                key={cardType}
                onClick={() => handleAwardCard(cardType)}
                className="justify-start text-left px-2 py-3 bg-neon-purple/10 hover:bg-neon-purple/20 border border-neon-purple/30"
              >
                <div>
                  <div className="font-bold text-neon-purple">{CARD_DETAILS[cardType].name}</div>
                  <div className="text-xs text-gameshow-muted">{CARD_DETAILS[cardType].description}</div>
                </div>
              </Button>
            ))}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Anuluj
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CardManagement;
