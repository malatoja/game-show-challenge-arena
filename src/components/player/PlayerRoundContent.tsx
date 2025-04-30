
import React, { useState, useEffect } from 'react';
import { Question } from '@/types/gameTypes';
import QuestionDisplay from '@/components/questions/QuestionDisplay';
import FortuneWheel from '@/components/wheel/FortuneWheel';
import { useSocket } from '@/context/SocketContext';
import { toast } from 'sonner';

// We need to define interface for FortuneWheel and QuestionDisplay props
interface PlayerRoundContentProps {
  roundType: string; 
  activeQuestion: Question | null;
  onAnswer: (isCorrect: boolean, answerIndex: number) => void;
}

export function PlayerRoundContent({ roundType, activeQuestion, onAnswer }: PlayerRoundContentProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [timeLimit, setTimeLimit] = useState(30);
  const [disableAnswering, setDisableAnswering] = useState(false);
  const [category, setCategory] = useState<string>('');
  const { on } = useSocket();

  // Listen for wheel spin command
  useEffect(() => {
    const unsubscribe = on('overlay:update', (data) => {
      if (data.category) {
        setCategory(data.category);
        toast.info(`Wybrana kategoria: ${data.category}`);
      }

      if (data.timeRemaining !== undefined) {
        setTimeLimit(data.timeRemaining);
      }
    });

    return unsubscribe;
  }, [on]);

  // Reset disableAnswering when a new question is received
  useEffect(() => {
    if (activeQuestion) {
      setDisableAnswering(false);
    }
  }, [activeQuestion]);

  return (
    <div className="h-full flex items-center justify-center p-4">
      {roundType === 'wheel' && !activeQuestion && (
        <div className="text-center">
          {!category ? (
            <FortuneWheel 
              isSpinning={true} 
              onSpinEnd={() => {}}
              // Remove the className prop as it's not in the interface
            />
          ) : (
            <div>
              <h2 className="text-2xl font-bold mb-4">Kategoria:</h2>
              <div className="text-4xl font-extrabold text-neon-blue animate-neon-pulse">
                {category}
              </div>
            </div>
          )}
        </div>
      )}
      
      {activeQuestion && (
        <QuestionDisplay 
          question={activeQuestion} 
          timeLimit={timeLimit} 
          onAnswer={(isCorrect, answerIndex) => {
            setDisableAnswering(true);
            onAnswer(isCorrect, answerIndex);
          }}
          // Remove disableAnswering prop as it's not in the interface
        />
      )}
      
      {!activeQuestion && roundType !== 'wheel' && (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Oczekiwanie na pytanie...</h2>
          <p>Host wybierze kolejne pytanie za chwilę.</p>
        </div>
      )}
    </div>
  );
}

export default PlayerRoundContent;
