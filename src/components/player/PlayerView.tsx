
import React, { useState, useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import { CardType, Player } from '@/types/gameTypes';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import QuestionDisplay from '../questions/QuestionDisplay';
import CardDeck from '../cards/CardDeck';
import FortuneWheel from '../wheel/FortuneWheel';
import { ROUND_NAMES } from '@/constants/gameConstants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Trophy, AlertCircle, Zap } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import PlayerHeader from './PlayerHeader';
import PlayerRoundContent from './PlayerRoundContent';
import PlayerFooter from './PlayerFooter';

export function PlayerView({ playerId }: { playerId: string }) {
  const { state } = useGame();
  const { currentRound, players, currentQuestion, wheelSpinning, roundEnded } = state;
  const [selectedCard, setSelectedCard] = useState<CardType | null>(null);
  const [showCardAnimation, setShowCardAnimation] = useState(false);
  
  // Find this player
  const player = players.find(p => p.id === playerId);
  
  // Show card animation if player has just received a new card
  useEffect(() => {
    if (player?.cards && player.cards.some(card => !card.isUsed)) {
      const unusedCardType = player.cards.find(card => !card.isUsed)?.type || null;
      if (unusedCardType && unusedCardType !== selectedCard) {
        setSelectedCard(unusedCardType);
        setShowCardAnimation(true);
        
        // Hide animation after 3 seconds
        const timer = setTimeout(() => {
          setShowCardAnimation(false);
        }, 3000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [player?.cards, selectedCard]);

  const handleUseCard = (cardType: CardType) => {
    if (!player) return;
    
    toast(`Używasz karty: ${cardType}`, {
      description: "Poinformuj prowadzącego o chęci użycia karty.",
      duration: 5000,
    });
  };
  
  if (!player) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center h-screen bg-gameshow-background">
        <Card className="max-w-md w-full bg-gameshow-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-red-500">Gracz nie znaleziony</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gameshow-muted text-center mb-4">Ten gracz nie istnieje w aktualnej grze.</p>
            <div className="flex justify-center">
              <a href="/" className="game-btn inline-block">Wróć do strony głównej</a>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // If the round has ended, show a different view
  if (roundEnded) {
    return (
      <div className="container mx-auto p-4 bg-gameshow-background min-h-screen flex items-center justify-center">
        <Card className="max-w-lg w-full bg-gameshow-card">
          <CardHeader className="text-center bg-gradient-to-r from-gameshow-primary/30 to-gameshow-secondary/30">
            <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
              <Star className="h-6 w-6 text-yellow-400" />
              Koniec rundy: {ROUND_NAMES[currentRound]}
              <Trophy className="h-6 w-6 text-yellow-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 text-center">
            <h3 className="text-xl font-semibold mb-4">Twój wynik:</h3>
            <div className="flex justify-center items-center gap-3 text-3xl font-bold mb-6">
              {player.points} punktów
            </div>
            
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-sm">Życia:</span>
              <div className="flex gap-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} 
                    className={`w-4 h-4 rounded-full ${
                      i < player.lives ? "bg-red-500" : "bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <p className="text-gameshow-muted">
              Poczekaj na rozpoczęcie kolejnej rundy...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gameshow-background">
      {/* Top section - Player header */}
      <PlayerHeader player={player} />
      
      {/* Middle section - Content based on round */}
      <PlayerRoundContent 
        player={player}
        currentRound={currentRound}
        currentQuestion={currentQuestion}
        wheelSpinning={wheelSpinning}
      />
      
      {/* Bottom section - Actions */}
      <PlayerFooter 
        player={player}
        onUseCard={handleUseCard}
      />
      
      {/* Card animation overlay */}
      {showCardAnimation && selectedCard && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
          <div className="text-center">
            <div className="text-2xl text-white mb-4">Otrzymujesz nową kartę!</div>
            <div className="animate-bounce scale-150 mb-8">
              {/* This would use your SpecialCard component to show the card with animation */}
              <div className="game-card w-32 h-48 mx-auto">
                <div className="p-4 text-center">
                  <div className="text-lg font-bold mt-2">
                    {selectedCard}
                  </div>
                </div>
              </div>
            </div>
            <Button 
              onClick={() => setShowCardAnimation(false)}
              className="mt-4"
            >
              Zamknij
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlayerView;
