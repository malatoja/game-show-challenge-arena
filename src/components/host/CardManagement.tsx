
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CardType, PlayerId } from '@/types/gameTypes';
import { useGame } from '@/context/GameContext';
import { CreditCard, Gift, X, Zap } from 'lucide-react';
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
import SpecialCard from '../cards/SpecialCard';
import { motion } from 'framer-motion';
import { playCardSound } from '@/lib/soundService';

interface CardManagementProps {
  playerId: PlayerId | null;
}

export function CardManagement({ playerId }: CardManagementProps) {
  const { state, dispatch } = useGame();
  const [isOpen, setIsOpen] = useState(false);
  const [activeCardType, setActiveCardType] = useState<CardType | null>(null);
  const [showActivation, setShowActivation] = useState(false);
  
  const player = playerId ? state.players.find(p => p.id === playerId) : null;
  const allCardTypes = Object.keys(CARD_DETAILS) as CardType[];
  
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
    toast.success(`Przyznano kartę ${CARD_DETAILS[cardType].name} graczowi ${player?.name}`);
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
      
      playCardSound(cardType);
      
      toast.success(`Aktywowano kartę ${CARD_DETAILS[cardType].name} dla gracza ${player?.name}`);
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
      {showActivation && activeCardType && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="text-center"
          >
            <div className="flex justify-center mb-2">
              <SpecialCard 
                card={{ 
                  type: activeCardType, 
                  description: CARD_DETAILS[activeCardType].description, 
                  isUsed: false 
                }}
                size="lg"
                showAnimation={true}
              />
            </div>
            <motion.h3 
              className="text-2xl font-bold text-neon-pink animate-pulse"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {CARD_DETAILS[activeCardType].name}
            </motion.h3>
            <motion.p 
              className="text-lg text-white/80 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {CARD_DETAILS[activeCardType].description}
            </motion.p>
          </motion.div>
        </div>
      )}
      
      <h3 className="text-lg font-semibold text-neon-pink animate-neon-pulse mb-2 flex items-center">
        <CreditCard className="w-5 h-5 mr-2" />
        Karty specjalne
      </h3>
      
      {player.cards.length === 0 ? (
        <div className="text-center py-4 text-gameshow-muted">
          <p className="mb-3">Gracz nie posiada kart specjalnych</p>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button 
                className="bg-neon-pink/20 hover:bg-neon-pink/30 border border-neon-pink text-neon-pink shadow-[0_0_10px_rgba(255,56,100,0.3)]"
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
              
              <div className="grid grid-cols-3 gap-2 mt-4">
                {allCardTypes.map((cardType) => (
                  <Button
                    key={cardType}
                    onClick={() => handleAwardCard(cardType)}
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
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Anuluj
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <>
          <div className="mb-3">
            <p className="text-sm text-gameshow-muted mb-1">Dostępne karty: {availableCards.length}/3</p>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-4">
            {availableCards.map((card, index) => (
              <Button
                key={index}
                onClick={() => handleUseCard(card.type)}
                className="justify-start text-left px-2 py-1 bg-neon-purple/20 hover:bg-neon-purple/30 h-auto"
              >
                <div className="w-full flex items-center gap-2">
                  <SpecialCard card={card} size="sm" />
                  <div>
                    <div className="font-bold text-neon-purple">{CARD_DETAILS[card.type].name}</div>
                    <div className="text-xs text-gameshow-muted">{card.description}</div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
          
          {usedCards.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gameshow-muted mb-2">Karty użyte:</h4>
              <div className="flex flex-wrap gap-1">
                {usedCards.map((card, index) => (
                  <SpecialCard key={index} card={card} size="sm" />
                ))}
              </div>
            </div>
          )}
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button 
                className="w-full mt-3 bg-neon-pink/20 hover:bg-neon-pink/30 border border-neon-pink text-neon-pink shadow-[0_0_10px_rgba(255,56,100,0.3)]"
                disabled={availableCards.length >= 3}
              >
                <Gift className="h-5 w-5 mr-2" />
                {availableCards.length >= 3 ? 'Osiągnięto limit kart (3)' : 'Przyznaj kartę'}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gameshow-card border-gameshow-primary/30">
              <DialogHeader>
                <DialogTitle className="text-neon-pink">Przyznaj kartę dla {player.name}</DialogTitle>
                <DialogDescription>
                  Wybierz kartę, którą chcesz przyznać graczowi
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-3 gap-2 mt-4">
                {allCardTypes.map((cardType) => (
                  <Button
                    key={cardType}
                    onClick={() => handleAwardCard(cardType)}
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
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Anuluj
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}

export default CardManagement;
