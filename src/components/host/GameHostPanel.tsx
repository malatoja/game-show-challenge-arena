
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

export function GameHostPanel() {
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
  
  return (
    <>
      <div className="absolute top-4 right-4 z-10">
        <ConnectionStatus />
      </div>
      <GameHistoryProvider>
        <EventsProvider>
          <TimerProvider>
            <GameControlProvider value={gameControl}>
              <TabsHostPanel />
            </GameControlProvider>
          </TimerProvider>
        </EventsProvider>
      </GameHistoryProvider>
    </>
  );
}

export default GameHostPanel;
