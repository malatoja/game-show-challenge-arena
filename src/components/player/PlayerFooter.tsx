
import React, { useState } from 'react';
import { Player, CardType } from '@/types/gameTypes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertCircle, Zap, ChevronUp } from 'lucide-react';
import { CARD_DETAILS } from '@/constants/gameConstants';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '@/lib/soundService';

interface PlayerFooterProps {
  player: Player;
  onUseCard: (cardType: CardType) => void;
}

const PlayerFooter: React.FC<PlayerFooterProps> = ({ player, onUseCard }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCardType, setActiveCardType] = useState<CardType | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  
  // Filter out used cards
  const availableCards = player.cards.filter(card => !card.isUsed);
  const hasCards = availableCards.length > 0;

  const handleUseCardWithAnimation = (cardType: CardType) => {
    setActiveCardType(cardType);
    setShowAnimation(true);
    setIsOpen(false);
    
    // Play card sound
    playSound('card-use');
    
    // Show animation for 1.5 seconds before calling the actual handler
    setTimeout(() => {
      setShowAnimation(false);
      onUseCard(cardType);
    }, 1500);
  };

  return (
    <footer className="bg-gameshow-card border-t border-gameshow-primary/30 p-4 shadow-lg relative">
      <AnimatePresence>
        {showAnimation && activeCardType && (
          <motion.div 
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="text-center max-w-lg"
            >
              <motion.div 
                className="w-40 h-60 mx-auto bg-cover bg-center rounded-lg shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                style={{
                  backgroundImage: `url('/images/cards/${activeCardType}.webp')`
                }}
                animate={{ 
                  boxShadow: [
                    '0 0 20px rgba(255,255,255,0.4)',
                    '0 0 40px rgba(255,255,255,0.6)',
                    '0 0 20px rgba(255,255,255,0.4)'
                  ]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.h2 
                className="text-3xl font-bold mt-4 text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {CARD_DETAILS[activeCardType].name}
              </motion.h2>
              <motion.p 
                className="text-lg mt-2 text-white/80"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {CARD_DETAILS[activeCardType].description}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          {/* Use card dropdown */}
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <Button 
                className="game-btn flex items-center gap-2 bg-gradient-to-r from-neon-purple to-neon-pink shadow-lg border border-white/10"
                disabled={!hasCards}
              >
                <Zap className="h-5 w-5" />
                Użyj karty
                <ChevronUp className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gameshow-card border-gameshow-primary/30 shadow-lg shadow-neon-purple/30">
              <DropdownMenuLabel className="text-gameshow-text font-bold">Dostępne karty</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gameshow-primary/20" />
              {!hasCards && (
                <DropdownMenuItem className="text-gameshow-muted">
                  Nie masz dostępnych kart
                </DropdownMenuItem>
              )}
              {availableCards.map((card) => (
                <DropdownMenuItem 
                  key={card.type}
                  onClick={() => handleUseCardWithAnimation(card.type)}
                  className="cursor-pointer hover:bg-gameshow-primary/20 focus:bg-gameshow-primary/30 py-3"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-inner" 
                      style={{
                        background: getCardColor(card.type)
                      }}
                    >
                      {getCardIcon(card.type)}
                    </div>
                    <div>
                      <div className="font-semibold text-gameshow-text">
                        {CARD_DETAILS[card.type].name || card.type}
                      </div>
                      <div className="text-xs text-gameshow-muted">
                        {card.description}
                      </div>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Report problem button */}
          <Button 
            variant="outline" 
            className="flex items-center gap-2 border-gameshow-primary/30 hover:bg-gameshow-primary/20"
          >
            <AlertCircle className="h-5 w-5" />
            Zgłoś problem
          </Button>
        </div>
      </div>
    </footer>
  );
};

// Helper function to get card color
function getCardColor(cardType: string): string {
  switch (cardType) {
    case 'dejavu': return 'linear-gradient(135deg, #3b82f6, #1d4ed8)';
    case 'kontra': return 'linear-gradient(135deg, #ef4444, #b91c1c)';
    case 'reanimacja': return 'linear-gradient(135deg, #10b981, #047857)';
    case 'skip': return 'linear-gradient(135deg, #f59e0b, #d97706)';
    case 'turbo': return 'linear-gradient(135deg, #8b5cf6, #6d28d9)';
    case 'refleks2': return 'linear-gradient(135deg, #06b6d4, #0891b2)';
    case 'refleks3': return 'linear-gradient(135deg, #0284c7, #075985)';
    case 'lustro': return 'linear-gradient(135deg, #6366f1, #4f46e5)';
    case 'oswiecenie': return 'linear-gradient(135deg, #f97316, #c2410c)';
    default: return 'linear-gradient(135deg, #6b7280, #4b5563)';
  }
}

// Helper function to get card icon
function getCardIcon(cardType: string): string {
  switch (cardType) {
    case 'dejavu': return 'D';
    case 'kontra': return 'K';
    case 'reanimacja': return 'R';
    case 'skip': return 'S';
    case 'turbo': return 'T';
    case 'refleks2': return '2x';
    case 'refleks3': return '3x';
    case 'lustro': return 'L';
    case 'oswiecenie': return 'O';
    default: return '?';
  }
}

export default PlayerFooter;
