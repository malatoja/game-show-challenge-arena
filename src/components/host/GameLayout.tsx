
import React, { useState } from 'react';
import { Player, CardType, RoundType } from '@/types/gameTypes';
import PlayerGrid from './PlayerGrid';
import GameControls from './GameControls';
import RightColumn from './RightColumn';
import ActivePlayerPanel from './panels/ActivePlayerPanel';
import GameTabContent from './panels/GameTabContent';
import QuestionListPanel from './panels/QuestionListPanel';
import { useSocket } from '@/context/SocketContext';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

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
  handleSpinWheel?: () => void;
  handleWheelSpinEnd?: () => void; 
  handleSelectCategory?: (category: string) => void;
  gameState?: {
    players: Player[];
    currentRound: RoundType;
    currentQuestion?: any | null;
    wheelSpinning?: boolean;
    selectedCategory?: string | null;
    remainingQuestions?: any[];
  };
}

// Define props for GameLayout component
export interface GameLayoutProps {
  gameControl: GameControlContext;
  children?: React.ReactNode;
}

const GameLayout: React.FC<GameLayoutProps> = ({ gameControl }) => {
  const { emit } = useSocket();
  const [extensionFactor, setExtensionFactor] = useState(1);
  
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
    handleSpinWheel,
    handleWheelSpinEnd,
    handleSelectCategory,
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

  // Send update to overlay whenever a significant event happens
  const syncWithOverlay = () => {
    if (activePlayer && currentQuestion) {
      emit('overlay:update', {
        activePlayerId: activePlayer.id,
        question: currentQuestion,
        category: selectedCategory,
        timeRemaining: currentRound === 'speed' ? 5 : 30
      });
    }
  };

  // Map round type to proper layout class
  const getRoundLayoutClass = () => {
    switch (currentRound) {
      case 'knowledge':
        return 'layout-round-1';
      case 'speed':
        return 'layout-round-2';
      case 'wheel':
        return 'layout-round-3';
      default:
        return 'layout-round-1';
    }
  };

  // Handle using refleks card to extend time
  const handleExtendTime = (factor: number) => {
    setExtensionFactor(factor);
    toast.success(`Czas wydłużony x${factor}!`);
    
    if (currentQuestion) {
      emit('overlay:update', {
        timeRemaining: (currentRound === 'speed' ? 5 : 30) * factor
      });
    }
  };

  return (
    <motion.div 
      className={`container mx-auto p-4 bg-gameshow-background min-h-screen ${getRoundLayoutClass()}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
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
        <div className="bg-gameshow-card p-4 rounded-lg shadow-lg">
          <PlayerGrid
            players={players}
            onSelectPlayer={handleSelectPlayer}
            onAddTestCards={handleAddTestCards}
            onUseCard={handleUseCard}
          />
        </div>
        
        {/* Main Game Interface */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Active player */}
          <div className="bg-gameshow-card p-4 rounded-lg shadow-neon-primary">
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
          <div className="bg-gameshow-card p-4 rounded-lg shadow-neon-secondary">
            <GameTabContent 
              currentRound={currentRound}
              currentQuestion={currentQuestion}
              wheelSpinning={wheelSpinning}
              activePlayerId={activePlayerId}
              extensionFactor={extensionFactor}
              onSpinWheel={handleSpinWheel || (() => {})}
              onWheelSpinEnd={handleWheelSpinEnd || (() => {})}
              onSelectCategory={handleSelectCategory || (() => {})}
              onAnswerQuestion={handleAnswerQuestion || (() => {})}
            />
          </div>
          
          {/* Right column - Question selection */}
          <div className="bg-gameshow-card p-4 rounded-lg shadow-neon-primary">
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
    </motion.div>
  );
};

export default GameLayout;
