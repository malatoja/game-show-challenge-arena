
import React from 'react';
import TopBar from './TopBar';
import BottomBar from './BottomBar';
import RightColumn from './RightColumn';
import PlayerGrid from './PlayerGrid';
import QuestionControls from './QuestionControls';
import CardManagement from './CardManagement';
import { useTimer } from './TimerContext';
import { useEvents } from './EventsContext';
import { useGame } from '@/context/GameContext';

interface GameControlContext {
  activePlayerId: string | null;
  canStartRound: boolean;
  canEndRound: boolean;
  handleSelectPlayer: Function;
  handleStartRound: Function;
  handleEndRound: Function;
  handleEndGame: Function;
  handleSkipQuestion: Function;
  handlePause: Function;
  handleResetGame: Function;
  handleUseCard: Function;
  handleAddPlayer: Function;
  handleAddTestCards: Function;
}

interface GameLayoutProps {
  gameControl: GameControlContext;
}

export function GameLayout({ gameControl }: GameLayoutProps) {
  const { state } = useGame();
  const { currentRound } = state;
  const { timer, isTimerRunning, startTimer, stopTimer, resetTimer } = useTimer();
  const { events } = useEvents();
  
  const { 
    activePlayerId,
    canStartRound,
    canEndRound,
    handleSelectPlayer,
    handleStartRound,
    handleEndRound,
    handleEndGame,
    handleSkipQuestion,
    handlePause,
    handleResetGame,
    handleUseCard,
    handleAddTestCards
  } = gameControl;

  return (
    <div className="min-h-screen bg-gameshow-background flex flex-col gap-4 p-4">
      <TopBar 
        currentRound={currentRound}
        timer={timer}
        isTimerRunning={isTimerRunning}
        canStartRound={canStartRound}
        onStartRound={handleStartRound}
        onStartTimer={startTimer}
        onStopTimer={stopTimer}
        onResetTimer={resetTimer}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 flex-1">
        {/* Left column - Players */}
        <div className="lg:col-span-3">
          <div className="panel-section mb-4">
            <PlayerGrid
              players={state.players}
              onSelectPlayer={handleSelectPlayer}
              onAddTestCards={handleAddTestCards}
              onUseCard={handleUseCard}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="panel-section">
              <QuestionControls 
                currentRound={currentRound}
                isTimerRunning={isTimerRunning}
                onStartTimer={startTimer}
                onStopTimer={stopTimer}
                onResetTimer={resetTimer}
                onSkipQuestion={handleSkipQuestion}
              />
            </div>
            
            <div className="panel-section">
              <CardManagement playerId={activePlayerId} />
            </div>
          </div>
        </div>
        
        {/* Right column - Game controls */}
        <div className="lg:col-span-1">
          <RightColumn 
            onEndRound={handleEndRound}
            onResetRound={handleResetGame}
            onPause={handlePause}
            onSkipQuestion={handleSkipQuestion}
            onEndGame={handleEndGame}
            canEndRound={canEndRound}
          />
        </div>
      </div>
      
      <BottomBar events={events} />
    </div>
  );
}

export default GameLayout;
