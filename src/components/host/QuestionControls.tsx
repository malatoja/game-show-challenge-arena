
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Play, Square, SkipForward, Check, X, RefreshCw, User } from 'lucide-react';
import { RoundType } from '@/types/gameTypes';
import { useGame } from '@/context/GameContext';

interface QuestionControlsProps {
  currentRound: RoundType;
  isTimerRunning: boolean;
  onStartTimer: () => void;
  onStopTimer: () => void;
  onResetTimer: () => void;
  onSkipQuestion: () => void;
}

export function QuestionControls({
  currentRound,
  isTimerRunning,
  onStartTimer,
  onStopTimer,
  onResetTimer,
  onSkipQuestion
}: QuestionControlsProps) {
  const { state, dispatch } = useGame();
  const { currentQuestion, activePlayerId } = state;
  
  const handleAskQuestion = () => {
    onResetTimer();
    onStartTimer();
    
    // Play sound effect
    const audio = new Audio('/sounds/countdown.mp3');
    audio.play().catch(err => console.error("Error playing sound:", err));
    
    toast.info("Pytanie zadane! Czas start!");
  };
  
  const handleCorrectAnswer = () => {
    if (!activePlayerId) {
      toast.error("Wybierz gracza przed oceną odpowiedzi!");
      return;
    }
    
    const activePlayer = state.players.find(p => p.id === activePlayerId);
    if (activePlayer) {
      dispatch({ 
        type: 'ANSWER_QUESTION', 
        playerId: activePlayer.id, 
        isCorrect: true 
      });
      toast.success(`${activePlayer.name} odpowiedział poprawnie!`);
      onResetTimer();
    }
  };
  
  const handleIncorrectAnswer = () => {
    if (!activePlayerId) {
      toast.error("Wybierz gracza przed oceną odpowiedzi!");
      return;
    }
    
    const activePlayer = state.players.find(p => p.id === activePlayerId);
    if (activePlayer) {
      dispatch({ 
        type: 'ANSWER_QUESTION', 
        playerId: activePlayer.id, 
        isCorrect: false 
      });
      toast.error(`${activePlayer.name} odpowiedział niepoprawnie!`);
      onResetTimer();
    }
  };
  
  const handleNextPlayer = () => {
    // Find current player index
    const currentPlayerIndex = state.players.findIndex(p => p.id === activePlayerId);
    const nextIndex = (currentPlayerIndex + 1) % state.players.length;
    const nextPlayer = state.players[nextIndex];
    
    if (nextPlayer) {
      dispatch({ type: 'SET_ACTIVE_PLAYER', playerId: nextPlayer.id });
      toast.info(`Aktualny gracz: ${nextPlayer.name}`);
      onResetTimer();
    }
  };
  
  const handleRevertQuestion = () => {
    if (!currentQuestion) return;
    
    // Add question back to available questions
    dispatch({ 
      type: 'REVERT_QUESTION', 
      questionId: currentQuestion.id 
    });
    
    toast.info("Pytanie zostało cofnięte i dodane z powrotem do puli");
    onResetTimer();
  };
  
  return (
    <div className="space-y-4 bg-gameshow-card p-4 rounded-lg shadow-[0_0_15px_rgba(46,156,202,0.2)]">
      <h3 className="text-lg font-semibold text-neon-blue animate-neon-pulse mb-2">
        Kontrola pytania
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Button 
          onClick={handleAskQuestion}
          className="bg-neon-green/20 hover:bg-neon-green/30 border border-neon-green text-neon-green shadow-[0_0_10px_rgba(57,255,20,0.3)]"
          disabled={isTimerRunning}
        >
          <Play className="h-5 w-5 mr-2" />
          Zadaj pytanie
        </Button>
        
        <Button 
          onClick={onSkipQuestion}
          className="bg-neon-yellow/20 hover:bg-neon-yellow/30 border border-neon-yellow text-neon-yellow shadow-[0_0_10px_rgba(255,215,0,0.3)]"
        >
          <SkipForward className="h-5 w-5 mr-2" />
          Pomiń pytanie
        </Button>
        
        <Button
          onClick={handleRevertQuestion}
          className="bg-neon-purple/20 hover:bg-neon-purple/30 border border-neon-purple text-neon-purple shadow-[0_0_10px_rgba(157,78,221,0.3)]"
          disabled={!currentQuestion}
        >
          <RefreshCw className="h-5 w-5 mr-2" />
          Cofnij pytanie
        </Button>
        
        <Button 
          onClick={handleNextPlayer}
          className="bg-neon-blue/20 hover:bg-neon-blue/30 border border-neon-blue text-neon-blue shadow-[0_0_10px_rgba(46,156,202,0.3)]"
        >
          <User className="h-5 w-5 mr-2" />
          Następny gracz
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mt-3">
        <Button 
          onClick={handleCorrectAnswer}
          className="bg-neon-green/20 hover:bg-neon-green/30 border border-neon-green text-neon-green shadow-[0_0_10px_rgba(57,255,20,0.3)]"
          size="lg"
        >
          <Check className="h-6 w-6 mr-2" />
          Poprawna
        </Button>
        
        <Button 
          onClick={handleIncorrectAnswer}
          className="bg-neon-red/20 hover:bg-neon-red/30 border border-neon-red text-neon-red shadow-[0_0_10px_rgba(255,41,87,0.3)]"
          size="lg"
        >
          <X className="h-6 w-6 mr-2" />
          Niepoprawna
        </Button>
      </div>
    </div>
  );
}

export default QuestionControls;
