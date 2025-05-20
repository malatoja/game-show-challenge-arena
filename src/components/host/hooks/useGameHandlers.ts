
import { useState, useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import { useTimer } from '../TimerContext';
import { useSocket } from '@/context/SocketContext';
import { usePlayerHandlers } from './gameHandlers/playerHandlers';
import { useRoundHandlers } from './gameHandlers/roundHandlers';
import { useQuestionHandlers } from './gameHandlers/questionHandlers';
import { useWheelHandlers } from './gameHandlers/wheelHandlers';
import { useCardHandlers } from './gameHandlers/cardHandlers';
import { useUtilHandlers } from './gameHandlers/utilHandlers';

export function useGameHandlers() {
  const { state } = useGame();
  const { timerValue } = useTimer();
  const { emit } = useSocket();
  
  // Import all the handlers
  const playerHandlers = usePlayerHandlers();
  const roundHandlers = useRoundHandlers();
  const questionHandlers = useQuestionHandlers();
  const wheelHandlers = useWheelHandlers();
  const cardHandlers = useCardHandlers();
  const utilHandlers = useUtilHandlers();

  // Update timer on all clients
  useEffect(() => {
    if (timerValue !== undefined) {
      emit('overlay:update', {
        timeRemaining: timerValue
      });
    }
  }, [timerValue, emit]);

  // Combine all the handlers into a single object
  return {
    state,
    // Player handlers
    activePlayerId: playerHandlers.activePlayerId,
    handleSelectPlayer: playerHandlers.handleSelectPlayer,
    handleAddPlayer: playerHandlers.handleAddPlayer,
    handleAddTestCards: playerHandlers.handleAddTestCards,
    handleUpdatePoints: playerHandlers.handleUpdatePoints,
    handleUpdateLives: playerHandlers.handleUpdateLives,
    handleEliminatePlayer: playerHandlers.handleEliminatePlayer,
    handleRestorePlayer: playerHandlers.handleRestorePlayer,
    
    // Round handlers
    showResults: roundHandlers.showResults,
    resultType: roundHandlers.resultType,
    canStartRound: roundHandlers.canStartRound,
    canEndRound: roundHandlers.canEndRound,
    isRoundActive: roundHandlers.isRoundActive,
    handleStartRound: roundHandlers.handleStartRound,
    handleEndRound: roundHandlers.handleEndRound,
    handleEndGame: roundHandlers.handleEndGame,
    handleResetGame: roundHandlers.handleResetGame,
    setShowResults: roundHandlers.setShowResults,
    
    // Question handlers
    handleSelectQuestion: questionHandlers.handleSelectQuestion,
    handleAnswerQuestion: questionHandlers.handleAnswerQuestion,
    handleSkipQuestion: questionHandlers.handleSkipQuestion,
    
    // Wheel handlers
    handleSpinWheel: wheelHandlers.handleSpinWheel,
    handleWheelSpinEnd: wheelHandlers.handleWheelSpinEnd,
    handleSelectCategory: wheelHandlers.handleSelectCategory,
    
    // Card handlers
    handleUseCard: cardHandlers.handleUseCard,
    
    // Utility handlers
    handlePause: utilHandlers.handlePause
  };
}
