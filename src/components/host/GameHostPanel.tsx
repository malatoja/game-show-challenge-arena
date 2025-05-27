
import React, { useState, useEffect } from 'react';
import { EventsProvider } from './EventsContext';
import { TimerProvider } from './TimerContext';
import { GameHistoryProvider } from './context/GameHistoryContext';
import { GameControlProvider } from './context/GameControlContext';
import { useGameControlProvider } from './hooks/useGameControlProvider';
import TabsHostPanel from './TabsHostPanel';
import ConnectionStatus from './ConnectionStatus';
import GameResultsWrapper from './components/GameResultsWrapper';
import { useGame } from '@/context/GameContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, Trophy, Gamepad2 } from 'lucide-react';

// Inner component that uses the game control provider within the context
function GameHostPanelInner() {
  const { state } = useGame();
  const gameControl = useGameControlProvider();
  const { showResults, resultType, handleResetGame, setShowResults } = gameControl;
  
  // Show results screen if needed
  if (showResults) {
    return (
      <GameResultsWrapper
        players={state.players}
        currentRound={state.currentRound}
        resultType={resultType}
        onResetGame={handleResetGame}
        onCloseResults={() => setShowResults(false)}
      />
    );
  }
  
  const activePlayers = state.players.filter(p => !p.eliminated).length;
  const totalPlayers = state.players.length;
  const currentRoundName = {
    'knowledge': 'Eliminacje',
    'speed': 'Szybka odpowiedź', 
    'wheel': 'Koło fortuny'
  }[state.currentRound] || 'Nieznana runda';

  return (
    <GameControlProvider value={gameControl}>
      <div className="min-h-screen bg-gameshow-background">
        {/* Header with game status */}
        <header className="bg-gameshow-card border-b border-gameshow-accent/20 sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gameshow-primary/20 rounded-lg">
                    <Gamepad2 className="h-6 w-6 text-gameshow-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Panel Hosta</h1>
                    <p className="text-gameshow-muted">Quiz Show Master</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    {currentRoundName}
                  </Badge>
                  
                  <Badge variant="secondary" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {activePlayers}/{totalPlayers} graczy
                  </Badge>
                  
                  {state.roundStarted && !state.roundEnded && (
                    <Badge className="bg-green-500 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Runda aktywna
                    </Badge>
                  )}
                </div>
              </div>
              
              <ConnectionStatus />
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main>
          <TabsHostPanel />
        </main>
      </div>
    </GameControlProvider>
  );
}

export function GameHostPanel() {
  return (
    <GameHistoryProvider>
      <EventsProvider>
        <TimerProvider>
          <GameHostPanelInner />
        </TimerProvider>
      </EventsProvider>
    </GameHistoryProvider>
  );
}

export default GameHostPanel;
