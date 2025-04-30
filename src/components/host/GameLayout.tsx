
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
import { Player, RoundType, CardType } from '@/types/gameTypes';

// Export this interface so it can be imported by GameController
export interface GameControlContext {
  activePlayerId: string | null;
  canStartRound: boolean;
  canEndRound: boolean;
  isRoundActive: boolean;
  handleSelectPlayer: (player: Player) => void;
  handleStartRound: (roundType: RoundType) => void;
  handleEndRound: () => void;
  handleEndGame: () => void;
  handleSkipQuestion: () => void;
  handlePause: () => void;
  handleResetGame: () => void;
  handleUseCard: (playerId: string, cardType: CardType) => void;
  handleAddPlayer: () => void;
  handleAddTestCards: (playerId: string) => void;
}

export interface GameLayoutProps {
  gameControl: GameControlContext;
}

export function GameLayout({ gameControl }: GameLayoutProps) {
  const { state } = useGame();
  const { currentRound } = state;
  const { timer, isTimerRunning, startTimer, stopTimer, resetTimer } = useTimer();
  const { events } = useEvents();
  
  return (
    <div className="min-h-screen bg-gameshow-background flex flex-col gap-4 p-4">
      <TopBar 
        currentRound={currentRound}
        timer={timer}
        isTimerRunning={isTimerRunning}
        canStartRound={gameControl.canStartRound}
        onStartRound={gameControl.handleStartRound}
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
              onSelectPlayer={gameControl.handleSelectPlayer}
              onAddTestCards={gameControl.handleAddTestCards}
              onUseCard={gameControl.handleUseCard}
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
                onSkipQuestion={gameControl.handleSkipQuestion}
              />
            </div>
            
            <div className="panel-section">
              <CardManagement playerId={gameControl.activePlayerId} />
            </div>
          </div>
        </div>
        
        {/* Right column - Game controls */}
        <div className="lg:col-span-1">
          <RightColumn 
            onEndRound={gameControl.handleEndRound}
            onResetRound={gameControl.handleResetGame}
            onPause={gameControl.handlePause}
            onSkipQuestion={gameControl.handleSkipQuestion}
            onEndGame={gameControl.handleEndGame}
            canEndRound={gameControl.canEndRound}
          />
        </div>
      </div>
      
      <BottomBar events={events} />
    </div>
  );
}

export default GameLayout;
