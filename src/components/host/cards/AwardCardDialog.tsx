
import React, { useState } from 'react';
import { CardType } from '@/types/gameTypes';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { CARD_EFFECTS } from '@/constants/cardEffects';

interface AwardCardDialogProps {
  playerName: string;
  isOpen: boolean;
  onClose: () => void;
  onAwardCard: (cardType: CardType) => void;
}

const AwardCardDialog: React.FC<AwardCardDialogProps> = ({ 
  playerName, 
  isOpen, 
  onClose,
  onAwardCard
}) => {
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);

  const cardEffects = CARD_EFFECTS;

  // Function to get color class for card type
  const getCardColorClass = (cardType: CardType) => {
    switch (cardType) {
      case 'dejavu':
      case 'refleks2':
      case 'refleks3':
        return 'bg-blue-500/20 border-blue-500 text-blue-500';
      case 'kontra':
      case 'lustro':
        return 'bg-purple-500/20 border-purple-500 text-purple-500';
      case 'reanimacja':
        return 'bg-green-500/20 border-green-500 text-green-500';
      case 'skip':
        return 'bg-red-500/20 border-red-500 text-red-500';
      case 'turbo':
        return 'bg-amber-500/20 border-amber-500 text-amber-500';
      case 'oswiecenie':
        return 'bg-cyan-500/20 border-cyan-500 text-cyan-500';
      default:
        return 'bg-gray-500/20 border-gray-500 text-gray-500';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gameshow-card border-gameshow-primary">
        <DialogHeader>
          <DialogTitle className="text-gameshow-text">
            Przyznaj kartę dla {playerName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-3 mt-4">
          {(Object.entries(cardEffects) as [CardType, typeof CARD_EFFECTS[CardType]][]).map(([type, effect]) => (
            <Button 
              key={type}
              variant="outline" 
              className={`h-auto px-3 py-3 flex flex-col items-center justify-start ${
                selectedCard === type 
                  ? getCardColorClass(type as CardType)
                  : 'hover:bg-gameshow-primary/10'
              } transition-colors`}
              onClick={() => setSelectedCard(type as CardType)}
            >
              <span className="font-bold mb-1">{effect.name}</span>
              <span className="text-xs text-center">{effect.shortDescription}</span>
            </Button>
          ))}
        </div>
        
        <DialogFooter className="mt-4">
          <Button 
            variant="destructive" 
            className="w-full" 
            onClick={onClose}
          >
            Anuluj
          </Button>
          <Button 
            disabled={!selectedCard}
            className="w-full"
            onClick={() => selectedCard && onAwardCard(selectedCard)}
          >
            Przyznaj kartę
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AwardCardDialog;
