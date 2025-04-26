
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  RefreshCw, 
  PauseCircle, 
  SkipForward, 
  Power
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RightColumnProps {
  onEndRound: () => void;
  onResetRound: () => void;
  onPause: () => void;
  onSkipQuestion: () => void;
  onEndGame: () => void;
  canEndRound: boolean;
}

export function RightColumn({
  onEndRound,
  onResetRound,
  onPause,
  onSkipQuestion,
  onEndGame,
  canEndRound
}: RightColumnProps) {
  return (
    <div className="w-full md:w-64 lg:w-72 p-2 flex flex-col space-y-4">
      <div className="bg-gameshow-card p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gameshow-text text-center">
          Kontrola Gry
        </h2>
        
        <div className="space-y-4">
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start border-gameshow-primary/30",
              canEndRound 
                ? "hover:bg-gameshow-primary/10" 
                : "opacity-50 cursor-not-allowed"
            )}
            onClick={onEndRound}
            disabled={!canEndRound}
          >
            <RefreshCw className="mr-2" />
            Zakończ Rundę
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start border-gameshow-accent/30 hover:bg-gameshow-accent/10"
            onClick={onPause}
          >
            <PauseCircle className="mr-2" />
            Przerwa
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start border-gameshow-muted/30 hover:bg-gameshow-muted/10"
            onClick={onSkipQuestion}
          >
            <SkipForward className="mr-2" />
            Pomiń Pytanie
          </Button>
          
          <hr className="border-gameshow-card/60 my-4" />
          
          <Button
            variant="default"
            className="w-full bg-red-600 hover:bg-red-700"
            onClick={onEndGame}
          >
            <Power className="mr-2" />
            Zakończ Grę
          </Button>
        </div>
      </div>
      
      <div className="bg-gameshow-card p-4 rounded-lg shadow-lg flex-1">
        <h2 className="text-lg font-bold mb-3 text-gameshow-text">
          Informacja
        </h2>
        <div className="text-sm text-gameshow-muted space-y-2">
          <p>Używaj panelu po prawej stronie do zarządzania grą.</p>
          <p>Wybierz gracza z siatki, aby zobaczyć więcej opcji.</p>
        </div>
      </div>
    </div>
  );
}

export default RightColumn;
