
import React, { useState, useEffect } from 'react';
import { Question } from '@/types/gameTypes';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface QuestionDisplayProps {
  question?: Question;
  timeLimit?: number;
  onAnswer?: (isCorrect: boolean, answerIndex: number) => void;
  isTimeExtended?: boolean;
  extensionFactor?: number;
}

export function QuestionDisplay({ 
  question, 
  timeLimit = 30, 
  onAnswer,
  isTimeExtended = false,
  extensionFactor = 1
}: QuestionDisplayProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(timeLimit * extensionFactor);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);

  // Reset state when question changes
  useEffect(() => {
    if (question) {
      setSelectedAnswer(null);
      setTimeLeft(timeLimit * extensionFactor);
      setIsAnswered(false);
      setIsTimeUp(false);
    }
  }, [question, timeLimit, extensionFactor]);

  // Timer countdown
  useEffect(() => {
    if (!question || isAnswered || isTimeUp) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsTimeUp(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [question, isAnswered, isTimeUp]);

  // Handle time up
  useEffect(() => {
    if (isTimeUp && !isAnswered && onAnswer) {
      setIsAnswered(true);
      onAnswer(false, -1);
    }
  }, [isTimeUp, isAnswered, onAnswer]);

  const handleSelectAnswer = (answerIndex: number) => {
    if (isAnswered || isTimeUp) return;
    
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    
    const isCorrect = question?.correctAnswerIndex === answerIndex;
    if (onAnswer) {
      onAnswer(isCorrect, answerIndex);
    }
  };

  if (!question) {
    return (
      <div className="p-8 bg-gameshow-card rounded-lg text-center">
        <p className="text-gameshow-muted">Brak aktualnego pytania</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gameshow-card rounded-lg shadow-lg">
      {/* Timer */}
      <div className="mb-4 flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={cn(
              "h-full transition-all duration-1000",
              timeLeft > timeLimit * 0.6 ? "bg-green-500" : 
              timeLeft > timeLimit * 0.3 ? "bg-yellow-500" : "bg-red-500"
            )}
            style={{ width: `${(timeLeft / (timeLimit * extensionFactor)) * 100}%` }}
          ></div>
        </div>
        <span className={cn(
          "font-mono text-sm font-bold",
          timeLeft > timeLimit * 0.6 ? "text-green-500" : 
          timeLeft > timeLimit * 0.3 ? "text-yellow-500" : "text-red-500"
        )}>
          {timeLeft}s
        </span>
        {isTimeExtended && (
          <span className="text-gameshow-accent text-xs">
            (x{extensionFactor})
          </span>
        )}
      </div>
      
      {/* Question */}
      <h3 className="text-xl font-bold text-gameshow-text mb-4">{question.text}</h3>
      
      {/* Category */}
      <div className="mb-4 inline-block px-3 py-1 bg-gameshow-primary/30 rounded-full">
        <span className="text-sm font-semibold text-gameshow-muted">{question.category}</span>
      </div>
      
      {/* Answers */}
      <div className="grid grid-cols-1 gap-3 mt-4">
        {question.answers.map((answer, index) => (
          <Button
            key={index}
            variant={
              isAnswered ? 
                (index === question.correctAnswerIndex ? "default" : 
                 index === selectedAnswer ? "destructive" : "outline") : 
                "outline"
            }
            className={cn(
              "text-left justify-start p-4 h-auto",
              isAnswered && index === question.correctAnswerIndex && "bg-green-600 hover:bg-green-700",
              isAnswered && index === selectedAnswer && index !== question.correctAnswerIndex && "bg-red-600 hover:bg-red-700"
            )}
            disabled={isAnswered || isTimeUp}
            onClick={() => handleSelectAnswer(index)}
          >
            <span className="mr-2 font-bold">{String.fromCharCode(65 + index)}.</span>
            {answer.text}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default QuestionDisplay;
