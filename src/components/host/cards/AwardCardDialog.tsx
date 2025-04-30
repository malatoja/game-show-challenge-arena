
import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { CardType } from '@/types/gameTypes';
import { CARD_DETAILS } from '@/constants/gameConstants';
import SpecialCard from '@/components/cards/SpecialCard';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AwardCardDialogProps {
  playerName: string;
  isOpen: boolean;
  onClose: () => void;
  onAwardCard: (cardType: CardType) => void;
}

export const AwardCardDialog: React.FC<AwardCardDialogProps> = ({
  playerName,
  isOpen,
  onClose,
  onAwardCard
}) => {
  const allCardTypes = Object.keys(CARD_DETAILS) as CardType[];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gameshow-card border-gameshow-primary/30">
        <DialogHeader>
          <DialogTitle className="text-neon-pink">Przyznaj kartę dla {playerName}</DialogTitle>
          <DialogDescription>
            Wybierz kartę, którą chcesz przyznać graczowi
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-3 gap-2 mt-4">
          {allCardTypes.map((cardType) => (
            <Button
              key={cardType}
              onClick={() => onAwardCard(cardType)}
              className="justify-start text-left p-2 bg-neon-purple/10 hover:bg-neon-purple/20 border border-neon-purple/30 h-auto flex flex-col items-center"
            >
              <SpecialCard 
                card={{ 
                  type: cardType, 
                  description: CARD_DETAILS[cardType].description, 
                  isUsed: false 
                }}
                size="sm"
              />
              <div className="mt-2 text-center">
                <div className="font-bold text-neon-purple">{CARD_DETAILS[cardType].name}</div>
              </div>
            </Button>
          ))}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Anuluj
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AwardCardDialog;
