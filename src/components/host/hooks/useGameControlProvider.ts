
import { useState, useCallback } from 'react';
import { useGame } from '@/context/GameContext';
import { useEvents } from '../EventsContext';
import { useTimer } from '../TimerContext';
import { useRoundHandlers } from './gameHandlers/roundHandlers';
import { useQuestionHandlers } from './gameHandlers/questionHandlers';
import { usePlayerHandlers } from './gameHandlers/playerHandlers';
import { useCardHandlers } from './gameHandlers/cardHandlers';
import { useWheelHandlers } from './gameHandlers/wheelHandlers';
import { useUtilHandlers } from './gameHandlers/utilHandlers';
import { CardType, Question, Player, RoundType } from '@/types/gameTypes';

// Create a hook that provides all game control functionality
export function useGameControlProvider() {
  const { state } = useGame();
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null);

  // Import all handler hooks
  const roundHandlers = useRoundHandlers();
  const questionHandlers = useQuestionHandlers();
  const playerHandlers = usePlayerHandlers();
  const cardHandlers = useCardHandlers();
  const wheelHandlers = useWheelHandlers();
  const utilHandlers = useUtilHandlers();
  
  // Extract specific handlers and values
  const { showResults, resultType, canStartRound, canEndRound, isRoundActive,
          handleStartRound, handleEndRound, handleEndGame, handleResetGame, handleResetRound, setShowResults } = roundHandlers;
  
  const { handleSelectQuestion, handleAnswerQuestion, handleSkipQuestion } = questionHandlers;
  
  const { handleSelectPlayer: playerHandlerSelectPlayer, handleAddPlayer } = playerHandlers;
  
  const { handleUseCard, handleAddTestCards } = cardHandlers;
  
  const { handleSpinWheel, handleWheelSpinEnd, handleSelectCategory } = wheelHandlers;
  
  const { handlePause } = utilHandlers;
  
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
    handleEndGame,
    handleResetGame,
    handleResetRound,
    
    // Question handlers
    handleSelectQuestion,
    handleAnswerQuestion,
    handleSkipQuestion,
    
    // Player handlers
    handleSelectPlayer: (player: Player) => {
      setActivePlayerId(player.id);
      playerHandlerSelectPlayer(player.id); // Modified to pass player.id instead of player
    },
    handleAddPlayer,
    
    // Card handlers
    handleUseCard,
    handleAddTestCards,
    
    // Wheel handlers
    handleSpinWheel,
    handleWheelSpinEnd,
    handleSelectCategory,
    
    // Util handlers
    handlePause,
    
    // Control functions
    setShowResults
  };
}
