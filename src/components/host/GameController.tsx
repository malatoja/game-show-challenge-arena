
import React from 'react';
import { useGame } from '@/context/GameContext';
import { useEvents } from './EventsContext';
import { useTimer } from './TimerContext';
import GameLayout from './GameLayout';
import GameResultsWrapper from './components/GameResultsWrapper';
import { useGameHandlers } from './hooks/useGameHandlers';
import { useSocket } from '@/context/SocketContext';

interface GameControllerProps {
  children?: React.ReactNode;
}

export function GameController({ children }: GameControllerProps) {
  const { state } = useGame();
  const { addEvent } = useEvents();
  const { emit } = useSocket();
  
  const {
    activePlayerId,
    showResults,
    resultType,
    canStartRound,
    canEndRound,
    isRoundActive,
    handleSelectPlayer,
    handleStartRound,
    handleEndRound,
    handleEndGame,
    handleSelectQuestion,
    handleAnswerQuestion,
    handleSpinWheel,
    handleWheelSpinEnd,
    handleSelectCategory,
    handleSkipQuestion,
    handlePause,
    handleResetGame,
    handleUseCard,
    handleAddPlayer,
    handleAddTestCards,
    setShowResults
  } = useGameHandlers();

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
  
  // Context object with all the handler functions
  const gameControlContext = {
    activePlayerId,
    canStartRound,
    canEndRound,
    isRoundActive,
    handleSelectPlayer,
    handleStartRound,
    handleEndRound,
    handleEndGame,
    handleSkipQuestion,
    handleSelectQuestion,
    handleAnswerQuestion,
    handleSpinWheel,
    handleWheelSpinEnd,
    handleSelectCategory,
    handlePause,
    handleResetGame,
    handleUseCard,
    handleAddPlayer,
    handleAddTestCards,
    gameControl: { state } // Pass the state via gameControl
  };

  // Return GameLayout with gameControl prop
  return <GameLayout gameControl={gameControlContext} />;
}

export default GameController;
