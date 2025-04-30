
import React from 'react';
import { Player, Question, RoundType } from '@/types/gameTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';
import QuestionDisplay from '../questions/QuestionDisplay';
import FortuneWheel from '../wheel/FortuneWheel';

interface PlayerRoundContentProps {
  player: Player;
  currentRound: RoundType;
  currentQuestion: Question | null;
  wheelSpinning: boolean;
  onAnswer?: (isCorrect: boolean, answerIndex: number) => void;
}

const PlayerRoundContent: React.FC<PlayerRoundContentProps> = ({
  player,
  currentRound,
  currentQuestion,
  wheelSpinning,
  onAnswer
}) => {
  // Do not allow answering if player is not active
  const handleAnswerQuestion = (isCorrect: boolean, answerIndex: number) => {
    if (player.isActive && onAnswer) {
      onAnswer(isCorrect, answerIndex);
    }
  };
  
  // Default content when no question is active
  if (!currentQuestion) {
    return (
      <div className="flex-grow flex items-center justify-center p-4">
        <Card className="max-w-lg w-full bg-gameshow-card">
          <CardHeader className="text-center bg-gradient-to-r from-gameshow-primary/30 to-gameshow-secondary/30">
            <CardTitle className="text-xl font-bold">Oczekiwanie na pytanie</CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center">
            {currentRound === 'wheel' && wheelSpinning ? (
              <div className="py-6 animate-pulse">
                <FortuneWheel isSpinning={true} className="max-w-xs mx-auto" />
              </div>
            ) : (
              <p className="text-gameshow-muted">
                Poczekaj, aż prowadzący wybierze pytanie...
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-grow flex items-center justify-center p-4">
      <Card className="max-w-lg w-full bg-gameshow-card">
        <CardHeader className="text-center bg-gradient-to-r from-gameshow-primary/30 to-gameshow-secondary/30">
          <CardTitle className="text-xl font-bold">Pytanie</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <QuestionDisplay
            question={currentQuestion}
            timeLimit={currentRound === 'speed' ? 5 : 30}
            onAnswer={handleAnswerQuestion}
            disableAnswering={!player.isActive}
          />
          
          {!player.isActive && (
            <div className="mt-4 flex items-center justify-center text-gameshow-muted text-sm p-2 bg-gameshow-background/50 rounded-lg">
              <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />
              <span>Możesz odpowiadać tylko gdy jesteś aktywnym graczem</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerRoundContent;
