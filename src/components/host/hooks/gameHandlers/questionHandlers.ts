
import { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { Question } from '@/types/gameTypes';
import { useEvents } from '../../EventsContext';
import { useSocket } from '@/context/SocketContext';
import { toast } from 'sonner';

export function useQuestionHandlers() {
  const { state, dispatch } = useGame();
  const { addEvent } = useEvents();
  const { emit } = useSocket();
  
  const [lastAnswerWasIncorrect, setLastAnswerWasIncorrect] = useState<boolean>(false);
  const [questionTransferTarget, setQuestionTransferTarget] = useState<string | null>(null);

  const handleSelectQuestion = (question: Question) => {
    dispatch({ type: 'SET_CURRENT_QUESTION', question });
    
    // Emit the question:show event
    emit('question:show', { question });
    
    addEvent(`Wybrano pytanie: ${question.text.substring(0, 30)}...`);
  };
  
  const handleAnswerQuestion = (isCorrect: boolean, answerIndex: number) => {
    const activePlayerId = state.players.find(p => p.isActive)?.id;
    
    if (activePlayerId) {
      const activePlayer = state.players.find(p => p.id === activePlayerId);
      if (activePlayer) {
        dispatch({ type: 'ANSWER_QUESTION', playerId: activePlayer.id, isCorrect });
        
        // Update the last answer state
        setLastAnswerWasIncorrect(!isCorrect);
        
        // If the answer was incorrect and this is round 2 or 3, player may lose a life
        if (!isCorrect && (state.currentRound === 'speed' || state.currentRound === 'wheel')) {
          // Check if player is eliminated
          const updatedPlayer = state.players.find(p => p.id === activePlayerId);
          if (updatedPlayer && updatedPlayer.lives <= 0) {
            // Emit player elimination event
            emit('player:eliminate', { playerId: activePlayerId });
          }
        }
        
        // Emit the player update event
        const updatedPlayer = state.players.find(p => p.id === activePlayerId);
        if (updatedPlayer) {
          emit('player:update', { player: updatedPlayer });
        }
        
        // Emit the answer event
        emit('question:answer', {
          playerId: activePlayerId,
          correct: isCorrect,
          answerIndex
        });
        
        addEvent(`${activePlayer.name} odpowiedział ${isCorrect ? 'poprawnie' : 'niepoprawnie'}`);
      }
    }
  };

  const handleSkipQuestion = () => {
    addEvent("Pytanie pominięte");
    toast.info("Pytanie pominięte");
    
    // Mark current question as used if we have one
    if (state.currentQuestion) {
      dispatch({ type: 'MARK_QUESTION_USED', questionId: state.currentQuestion.id });
    }
  };

  return {
    lastAnswerWasIncorrect,
    questionTransferTarget,
    setQuestionTransferTarget,
    handleSelectQuestion,
    handleAnswerQuestion,
    handleSkipQuestion
  };
}
