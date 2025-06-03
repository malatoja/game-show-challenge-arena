
import React from 'react';
import { Question, CardType } from '@/types/gameTypes';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QuestionDisplay from '@/components/questions/QuestionDisplay';
import FortuneWheel from '@/components/wheel/FortuneWheel';

interface GameTabContentProps {
  currentRound: string;
  currentQuestion: Question | null;
  wheelSpinning: boolean;
  activePlayerId: string | null;
  extensionFactor: number;
  onSpinWheel: () => void;
  onWheelSpinEnd: () => void;
  onSelectCategory: (category: string) => void;
  onAnswerQuestion: (isCorrect: boolean, answerIndex: number) => void;
}

export function GameTabContent({
  currentRound,
  currentQuestion,
  wheelSpinning,
  activePlayerId,
  extensionFactor,
  onSpinWheel,
  onWheelSpinEnd,
  onSelectCategory,
  onAnswerQuestion
}: GameTabContentProps) {
  return (
    <Tabs defaultValue="question">
      <TabsList className="mb-4 w-full">
        <TabsTrigger value="question" className="flex-1">Pytanie</TabsTrigger>
        {currentRound === 'wheel' && (
          <TabsTrigger value="wheel" className="flex-1">Koło Fortuny</TabsTrigger>
        )}
      </TabsList>
      
      <TabsContent value="question">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold text-gameshow-text">Aktualne Pytanie</h2>
          
          {extensionFactor > 1 && (
            <div className="px-2 py-1 bg-blue-500/20 text-blue-500 rounded-full text-xs">
              Czas x{extensionFactor}
            </div>
          )}
        </div>
        <QuestionDisplay 
          question={currentQuestion}
          timeLimit={currentRound === 'speed' ? 5 : 30}
          onAnswer={onAnswerQuestion}
          isTimeExtended={extensionFactor > 1}
          extensionFactor={extensionFactor}
        />
      </TabsContent>
      
      <TabsContent value="wheel">
        <h2 className="text-xl font-semibold text-gameshow-text mb-3">Koło Fortuny</h2>
        <div className="flex flex-col items-center">
          <FortuneWheel 
            isSpinning={wheelSpinning} 
            onSelectCategory={onSelectCategory}
            onSpinEnd={onWheelSpinEnd}
          />
          <Button 
            onClick={onSpinWheel} 
            className="mt-4"
            disabled={wheelSpinning}
          >
            {wheelSpinning ? 'Kręcenie...' : 'Zakręć Kołem'}
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}

export default GameTabContent;
