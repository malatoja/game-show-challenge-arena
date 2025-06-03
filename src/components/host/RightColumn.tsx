
import React from 'react';
import { Button } from '@/components/ui/button';
import { SkipForward, Pause, RefreshCw } from 'lucide-react';
import { ActionHistoryButton } from './components/ActionHistoryButton';

interface RightColumnProps {
  onEndRound: () => void;
  onResetRound: () => void;
  onPause: () => void;
  onSkipQuestion: () => void;
  onEndGame: () => void;
  canEndRound: boolean;
}

const RightColumn: React.FC<RightColumnProps> = ({
  onEndRound,
  onResetRound,
  onPause,
  onSkipQuestion,
  onEndGame,
  canEndRound
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        onClick={onSkipQuestion} 
        variant="outline"
        className="flex items-center gap-2"
        size="sm"
      >
        <SkipForward size={16} />
        Pomiń pytanie
      </Button>
      
      <Button 
        onClick={onPause} 
        variant="outline"
        className="flex items-center gap-2"
        size="sm"
      >
        <Pause size={16} />
        Pauza
      </Button>
      
      <Button 
        onClick={onResetRound} 
        variant="outline"
        className="flex items-center gap-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-600"
        size="sm"
      >
        <RefreshCw size={16} />
        Reset rundy
      </Button>
      
      <ActionHistoryButton />
      
      {canEndRound && (
        <Button 
          onClick={onEndRound} 
          variant="destructive"
          size="sm"
        >
          Zakończ rundę
        </Button>
      )}
    </div>
  );
};

export default RightColumn;
