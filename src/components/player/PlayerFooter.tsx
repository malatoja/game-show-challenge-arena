
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

interface PlayerFooterProps {
  player: Player;
  onUseCard: (cardType: CardType) => void;
}

const PlayerFooter: React.FC<PlayerFooterProps> = ({ player, onUseCard }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Filter out used cards
  const availableCards = player.cards.filter(card => !card.isUsed);
  const hasCards = availableCards.length > 0;

  return (
    <footer className="bg-gameshow-card border-t border-gameshow-primary/30 p-4 shadow-lg">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          {/* Use card dropdown */}
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <Button 
                className="game-btn flex items-center gap-2"
                disabled={!hasCards}
              >
                <Zap className="h-5 w-5" />
                Użyj karty
                <ChevronUp className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gameshow-card border-gameshow-primary/30">
              <DropdownMenuLabel className="text-gameshow-muted">Dostępne karty</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {!hasCards && (
                <DropdownMenuItem className="text-gameshow-muted">
                  Nie masz dostępnych kart
                </DropdownMenuItem>
              )}
              {availableCards.map((card) => (
                <DropdownMenuItem 
                  key={card.type}
                  onClick={() => {
                    onUseCard(card.type);
                    setIsOpen(false);
                  }}
                  className="cursor-pointer hover:bg-gameshow-primary/20"
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{
                        background: getCardColor(card.type)
                      }}
                    ></div>
                    <span>{card.name || card.type}</span>
                    <span className="text-xs text-gameshow-muted">
                      ({card.description})
                    </span>
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
    case 'dejavu': return '#3b82f6'; // blue
    case 'kontra': return '#ef4444'; // red
    case 'reanimacja': return '#10b981'; // green
    case 'skip': return '#f59e0b'; // amber
    case 'turbo': return '#8b5cf6'; // purple
    case 'refleks2': return '#06b6d4'; // cyan
    case 'refleks3': return '#0284c7'; // darker cyan
    case 'lustro': return '#6366f1'; // indigo
    case 'oswiecenie': return '#f97316'; // orange
    default: return '#6b7280'; // gray
  }
}

export default PlayerFooter;
