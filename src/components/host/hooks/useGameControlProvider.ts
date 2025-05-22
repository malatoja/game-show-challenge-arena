
import { useCallback, useState } from 'react';
import { useGame } from '@/context/GameContext';
import { useCardHandlers } from './gameHandlers/cardHandlers';
import { usePlayerHandlers } from './gameHandlers/playerHandlers';
import { useQuestionHandlers } from './gameHandlers/questionHandlers';
import { useRoundHandlers } from './gameHandlers/roundHandlers';
import { useWheelHandlers } from './gameHandlers/wheelHandlers';
import { useUtilHandlers } from './gameHandlers/utilHandlers';
import { Player, RoundType, CardType } from '@/types/gameTypes';

// Game control hook that combines all game operations
export function useGameControlProvider() {
  const { state } = useGame();
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [resultType, setResultType] = useState<'round' | 'final'>('round');
  
  // Import all handlers from various game operation hooks
  const { handleUseCard, handleAwardCard, handleAddTestCards } = useCardHandlers();
  const { 
    handleAnswerQuestion,
    handleUpdatePoints,
    handleEliminatePlayer,
    handleRestorePlayer
  } = usePlayerHandlers();
  
  const { handleSelectQuestion } = useQuestionHandlers();
  const { 
    handleStartRound,
    handleEndRound,
    handleResetRound,
    handleRoundResults
  } = useRoundHandlers();
  
  const { handleSpinWheel, handleWheelSpinEnd, handleSelectCategory } = useWheelHandlers();
  const { handlePause, handleSkipQuestion, handleEndGame, handleResetGame } = useUtilHandlers();
  
  // Select a player handler - updated to accept player object
  const handleSelectPlayer = useCallback((player: Player) => {
    setActivePlayerId(player.id);
  }, []);
  
  // Add new player handler
  const handleAddPlayer = useCallback(() => {
    const playerNumber = state.players.length + 1;
    const newPlayer: Player = {
      id: `player-${Date.now()}`,
      name: `Gracz ${playerNumber}`,
      lives: 3,
      points: 0,
      cards: [],
      isActive: state.players.length === 0,
      eliminated: false
    };
    
    // This would typically dispatch an ADD_PLAYER action
    console.log("Adding new player:", newPlayer);
  }, [state.players.length]);
  
  // Calculate if we can start a new round
  const canStartRound = !state.roundActive && state.players.length > 0;
  
  // Calculate if we can end the current round
  const canEndRound = state.roundActive;
  
  // Is a round currently active
  const isRoundActive = state.roundActive;
  
  return {
    // State
    activePlayerId,
    showResults,
    resultType,
    canStartRound,
    canEndRound,
    isRoundActive,
    
    // Round handlers
    handleStartRound,
    handleEndRound,
    handleResetRound,
    handleRoundResults,
    
    // Player handlers
    handleSelectPlayer,
    handleAnswerQuestion,
    handleEliminatePlayer,
    handleRestorePlayer,
    handleAddPlayer,
    
    // Question handlers
    handleSelectQuestion,
    handleSkipQuestion,
    
    // Card handlers
    handleUseCard,
    handleAwardCard,
    handleAddTestCards,
    
    // Wheel handlers
    handleSpinWheel,
    handleWheelSpinEnd,
    handleSelectCategory,
    
    // Utility handlers
    handlePause,
    handleEndGame,
    handleResetGame,
    
    // Result state setters
    setShowResults,
    setResultType
  };
}
