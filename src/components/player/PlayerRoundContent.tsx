
import React from 'react';
import { PlayerRoundContentProps } from './PlayerRoundContentProps';
import QuestionDisplay from '../questions/QuestionDisplay';
import FortuneWheel from '../wheel/FortuneWheel';
import { Card } from '@/components/ui/card';

const PlayerRoundContent: React.FC<PlayerRoundContentProps> = ({ 
  player, 
  currentRound, 
  currentQuestion, 
  wheelSpinning,
  onAnswer 
}) => {
  // Render different content based on round type
  const renderRoundContent = () => {
    if (currentQuestion) {
      return (
        <QuestionDisplay 
          question={currentQuestion} 
          onAnswer={onAnswer} 
          timeLimit={currentRound === 'speed' ? 5 : 30}
        />
      );
    }
    
    if (currentRound === 'wheel' && wheelSpinning) {
      return <FortuneWheel />;
    }
    
    // Default waiting state
    return (
      <Card className="p-6 text-center">
        <h3 className="text-xl font-semibold mb-2">Czekam na pytanie...</h3>
        <p className="text-gameshow-muted">
          {currentRound === 'wheel' 
            ? 'Oczekiwanie na zakręcenie kołem fortuny' 
            : 'Prowadzący wybiera aktualnie pytanie'}
        </p>
      </Card>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gameshow-background">
      <div className="max-w-4xl mx-auto">
        {renderRoundContent()}
      </div>
    </div>
  );
};

export default PlayerRoundContent;
