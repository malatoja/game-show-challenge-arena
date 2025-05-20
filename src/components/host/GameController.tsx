
import React from 'react';
import { useGame } from '@/context/GameContext';
import { useEvents } from './EventsContext';
import { useTimer } from './TimerContext';
import GameLayout from './GameLayout';
import GameResultsWrapper from './components/GameResultsWrapper';
import { useGameControlProvider } from './hooks/useGameControlProvider';
import { GameControlProvider } from './context/GameControlContext';
import { GameHistoryProvider } from './context/GameHistoryContext';

interface GameControllerProps {
  children?: React.ReactNode;
}

export function GameController({ children }: GameControllerProps) {
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
  
  // Provide game control context to all components below
  return (
    <GameControlProvider value={gameControl}>
      <GameHistoryProvider>
        <GameLayout />
      </GameHistoryProvider>
    </GameControlProvider>
  );
}

export default GameController;
