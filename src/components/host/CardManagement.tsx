
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CardType, PlayerId } from '@/types/gameTypes';
import { useGame } from '@/context/GameContext';
import { CreditCard, Gift } from 'lucide-react';
import { motion } from 'framer-motion';
import CardActivationAnimation from '../animations/CardActivationAnimation';
import NoCardsView from './cards/NoCardsView';
import AvailableCardsList from './cards/AvailableCardsList';
import UsedCardsList from './cards/UsedCardsList';
import AwardCardDialog from './cards/AwardCardDialog';

interface CardManagementProps {
  playerId: PlayerId | null;
}

export function CardManagement({ playerId }: CardManagementProps) {
  const { state, dispatch } = useGame();
  const [isOpen, setIsOpen] = useState(false);
  const [activeCardType, setActiveCardType] = useState<CardType | null>(null);
  const [showActivation, setShowActivation] = useState(false);
  
  const player = playerId ? state.players.find(p => p.id === playerId) : null;
  
  const handleAwardCard = (cardType: CardType) => {
    if (!playerId) {
      toast.error("Wybierz gracza aby przyznać kartę!");
      return;
    }
    
    // Check if player already has 3 cards
    if (player && player.cards.filter(c => !c.isUsed).length >= 3) {
      toast.error(`${player.name} ma już maksymalną liczbę kart (3)`);
      return;
    }
    
    dispatch({ type: 'AWARD_CARD', playerId, cardType });
    toast.success(`Przyznano kartę ${player?.name} graczowi ${player?.name}`);
    setIsOpen(false);
  };

  const handleUseCard = (cardType: CardType) => {
    if (!playerId) {
      toast.error("Wybierz gracza aby użyć kartę!");
      return;
    }
    
    setActiveCardType(cardType);
    setShowActivation(true);
    
    setTimeout(() => {
      dispatch({ type: 'USE_CARD', playerId, cardType });
      
      toast.success(`Aktywowano kartę dla gracza ${player?.name}`);
      setTimeout(() => {
        setShowActivation(false);
        setActiveCardType(null);
      }, 1500);
    }, 500);
  };
  
  if (!player) {
    return (
      <div className="bg-gameshow-card/50 p-4 rounded-lg text-center text-gameshow-muted">
        <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>Wybierz gracza aby zarządzać kartami</p>
      </div>
    );
  }
  
  const availableCards = player.cards.filter(card => !card.isUsed);
  const usedCards = player.cards.filter(card => card.isUsed);
  
  return (
    <div className="bg-gameshow-card p-4 rounded-lg shadow-[0_0_15px_rgba(255,56,100,0.2)] relative">
      {/* Card activation animation */}
      {showActivation && activeCardType && (
        <CardActivationAnimation 
          cardType={activeCardType}
          playerName={player.name}
          show={showActivation}
          onComplete={() => setShowActivation(false)}
        />
      )}
      
      <h3 className="text-lg font-semibold text-neon-pink animate-neon-pulse mb-2 flex items-center">
        <CreditCard className="w-5 h-5 mr-2" />
        Karty specjalne
      </h3>
      
      <div className="mb-3">
        <p className="text-sm text-gameshow-muted mb-1">Dostępne karty: {availableCards.length}/3</p>
      </div>
      
      {player.cards.length === 0 ? (
        <NoCardsView onOpenAwardDialog={() => setIsOpen(true)} />
      ) : (
        <>
          <AvailableCardsList 
            cards={availableCards} 
            onUseCard={handleUseCard} 
          />
          
          <UsedCardsList cards={usedCards} />
          
          <Button 
            className="w-full mt-3 bg-neon-pink/20 hover:bg-neon-pink/30 border border-neon-pink text-neon-pink shadow-[0_0_10px_rgba(255,56,100,0.3)]"
            disabled={availableCards.length >= 3}
            onClick={() => setIsOpen(true)}
          >
            <Gift className="h-5 w-5 mr-2" />
            {availableCards.length >= 3 ? 'Osiągnięto limit kart (3)' : 'Przyznaj kartę'}
          </Button>
        </>
      )}
      
      <AwardCardDialog 
        playerName={player.name}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onAwardCard={handleAwardCard}
      />
    </div>
  );
}

export default CardManagement;
