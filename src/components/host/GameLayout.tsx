
import React, { useState, useEffect } from 'react';
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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGame } from '@/context/GameContext';
import { useGameControl } from './context/GameControlContext';

const GameLayout: React.FC = () => {
  const { connected, mockMode, reconnect } = useSocket();
  const { state } = useGame();
  const gameControl = useGameControl();
  const [extensionFactor, setExtensionFactor] = useState(1);
  const [showConnectionError, setShowConnectionError] = useState(false);
  
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
    handleResetRound, // Add the reset round handler
    handleUseCard,
    handleAddPlayer,
    handleAddTestCards,
    handleSelectQuestion,
    handleAnswerQuestion,
    handleSpinWheel,
    handleWheelSpinEnd,
    handleSelectCategory,
  } = gameControl;

  // Get players and other game state
  const players = state.players || [];
  const currentRound = state.currentRound || 'knowledge';
  const currentQuestion = state.currentQuestion || null;
  const wheelSpinning = state.wheelSpinning || false;
  const selectedCategory = state.selectedCategory || '';
  const remainingQuestions = state.remainingQuestions || [];

  const activePlayer = players.find(player => player.id === activePlayerId) || null;

  // Check connection status
  useEffect(() => {
    if (!mockMode && !connected) {
      setShowConnectionError(true);
    } else {
      setShowConnectionError(false);
    }
  }, [connected, mockMode]);

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

  return (
    <motion.div 
      className={`container mx-auto p-4 bg-gameshow-background min-h-screen ${getRoundLayoutClass()}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {showConnectionError && !mockMode && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Problem z połączeniem WebSocket. Nakładka może nie działać poprawnie.</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={reconnect}
              className="ml-2 flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" /> Połącz ponownie
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
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
              onSpinWheel={handleSpinWheel}
              onWheelSpinEnd={handleWheelSpinEnd}
              onSelectCategory={handleSelectCategory}
              onAnswerQuestion={handleAnswerQuestion}
            />
          </div>
          
          {/* Right column - Question selection */}
          <div className="bg-gameshow-card p-4 rounded-lg shadow-neon-primary">
            <QuestionListPanel
              questions={remainingQuestions}
              selectedCategory={selectedCategory}
              onSelectQuestion={handleSelectQuestion}
            />
          </div>
        </div>
        
        {/* Right sidebar with additional controls */}
        <div className="mt-4">
          <RightColumn 
            onEndRound={handleEndRound}
            onResetRound={handleResetRound} // Pass the new handler
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
