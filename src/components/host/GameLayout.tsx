
import React from 'react';
import { Player, CardType, RoundType } from '@/types/gameTypes';
import PlayerGrid from './PlayerGrid';
import GameControls from './GameControls';
import RightColumn from './RightColumn';
import ActivePlayerPanel from './panels/ActivePlayerPanel';
import GameTabContent from './panels/GameTabContent';
import QuestionListPanel from './panels/QuestionListPanel';

// Define the context type for game controls
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
  handleSelectQuestion?: (question: any) => void;
  handleAnswerQuestion?: (isCorrect: boolean, answerIndex: number) => void;
  gameState?: {
    players: Player[];
    currentRound: RoundType;
    currentQuestion: any | null;
    wheelSpinning: boolean;
    selectedCategory: string | null;
    remainingQuestions: any[];
  };
}

// Define props for GameLayout component
export interface GameLayoutProps {
  gameControl: GameControlContext;
  children?: React.ReactNode;
}

const GameLayout: React.FC<GameLayoutProps> = ({ gameControl }) => {
  const { 
    activePlayerId,
    canStartRound,
    canEndRound,
    isRoundActive,
    handleSelectPlayer,
    handleStartRound,
    handleEndRound,
    handleEndGame,
    handleSkipQuestion,
    handlePause,
    handleResetGame,
    handleUseCard,
    handleAddPlayer,
    handleAddTestCards,
    handleSelectQuestion,
    handleAnswerQuestion,
    gameState
  } = gameControl;

  // Get players and other game state
  const players = gameState?.players || [];
  const currentRound = gameState?.currentRound || 'knowledge';
  const currentQuestion = gameState?.currentQuestion || null;
  const wheelSpinning = gameState?.wheelSpinning || false;
  const selectedCategory = gameState?.selectedCategory || '';
  const remainingQuestions = gameState?.remainingQuestions || [];

  const activePlayer = players.find(player => player.id === activePlayerId) || null;

  return (
    <div className="container mx-auto p-4 bg-gameshow-background min-h-screen">
      <div className="flex flex-col space-y-6">
        {/* Game Controls */}
        <GameControls
          canStartRound={canStartRound}
          canEndRound={canEndRound}
          onStartRound={handleStartRound}
          onEndRound={handleEndRound}
          onAddPlayer={handleAddPlayer}
          onResetGame={handleResetGame}
          onEndGame={handleEndGame}
        />
        
        {/* Players Grid */}
        <PlayerGrid
          players={players}
          onSelectPlayer={handleSelectPlayer}
          onAddTestCards={handleAddTestCards}
          onUseCard={handleUseCard}
        />
        
        {/* Main Game Interface */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Active player */}
          <div className="bg-gameshow-card p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-gameshow-text mb-3 flex items-center justify-between">
              <span>Aktywny gracz</span>
              {activePlayer && (
                <span className="text-sm bg-gameshow-primary/20 px-2 py-1 rounded-full">
                  {activePlayer.points} pkt | {activePlayer.lives} życia
                </span>
              )}
            </h2>
            
            <ActivePlayerPanel 
              activePlayer={activePlayer} 
              onAddTestCards={handleAddTestCards}
              onUseCard={handleUseCard}
            />
          </div>
          
          {/* Center column - Current question or wheel */}
          <div className="bg-gameshow-card p-4 rounded-lg">
            <GameTabContent 
              currentRound={currentRound}
              currentQuestion={currentQuestion}
              wheelSpinning={wheelSpinning}
              activePlayerId={activePlayerId}
              extensionFactor={1}
              onSpinWheel={() => {}}
              onWheelSpinEnd={() => {}}
              onSelectCategory={(category: string) => {}}
              onAnswerQuestion={handleAnswerQuestion || (() => {})}
            />
          </div>
          
          {/* Right column - Question selection */}
          <div className="bg-gameshow-card p-4 rounded-lg">
            <QuestionListPanel
              questions={remainingQuestions}
              selectedCategory={selectedCategory}
              onSelectQuestion={handleSelectQuestion || (() => {})}
            />
          </div>
        </div>
        
        {/* Right sidebar with additional controls */}
        <div className="mt-4">
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
    </div>
  );
};

export default GameLayout;
