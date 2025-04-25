
import React from 'react';
import { useGame } from '@/context/GameContext';
import { CardType } from '@/types/gameTypes';
import { Button } from '@/components/ui/button';
import QuestionDisplay from '../questions/QuestionDisplay';
import CardDeck from '../cards/CardDeck';
import FortuneWheel from '../wheel/FortuneWheel';
import { ROUND_NAMES } from '@/constants/gameConstants';

export function PlayerView({ playerId }: { playerId: string }) {
  const { state } = useGame();
  const { currentRound, players, currentQuestion, wheelSpinning } = state;
  
  // Find this player
  const player = players.find(p => p.id === playerId);
  
  if (!player) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500">Gracz nie znaleziony</h1>
          <p className="text-gameshow-muted mt-2">Ten gracz nie istnieje w aktualnej grze.</p>
          <a href="/" className="mt-4 inline-block game-btn">Wróć do strony głównej</a>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 bg-gameshow-background min-h-screen">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="bg-gameshow-card p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <h1 className="text-xl md:text-3xl font-bold text-gameshow-text">
              {player.name} - {player.points} punktów
            </h1>
            
            <div className="flex items-center space-x-2">
              <span className="text-gameshow-muted">Życia:</span>
              <div className="flex space-x-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} 
                    className={`w-4 h-4 rounded-full ${
                      i < player.lives ? "bg-red-500" : "bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-2">
            <div className="inline-block px-3 py-1 bg-gameshow-primary/30 rounded-full">
              <span className="text-sm text-gameshow-muted">
                {ROUND_NAMES[currentRound]}
              </span>
            </div>
            {player.isActive && (
              <div className="inline-block ml-2 px-3 py-1 bg-gameshow-accent rounded-full">
                <span className="text-sm font-semibold text-white">Twoja kolej!</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Player's cards */}
        <div className="bg-gameshow-card p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-gameshow-text mb-3">Twoje karty</h2>
          <CardDeck cards={player.cards} />
          <div className="mt-4 text-center text-sm text-gameshow-muted">
            <p>Aby użyć karty, powiedz prowadzącemu, którą kartę chcesz aktywować.</p>
          </div>
        </div>
        
        {/* Current question or wheel */}
        <div className="bg-gameshow-card p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-gameshow-text mb-3">
            {currentRound === 'wheel' && wheelSpinning 
              ? 'Koło Fortuny' 
              : 'Aktualne Pytanie'}
          </h2>
          
          {currentRound === 'wheel' && wheelSpinning ? (
            <div className="flex justify-center">
              <FortuneWheel isSpinning={wheelSpinning} />
            </div>
          ) : (
            <QuestionDisplay 
              question={currentQuestion}
              timeLimit={currentRound === 'speed' ? 5 : 30}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default PlayerView;
