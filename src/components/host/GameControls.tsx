
import React from 'react';
import { Button } from '@/components/ui/button';
import { RoundType } from '@/types/gameTypes';
import { ROUND_NAMES } from '@/constants/gameConstants';

interface GameControlsProps {
  canStartRound: boolean;
  canEndRound: boolean;
  onStartRound: (roundType: RoundType) => void;
  onEndRound: () => void;
  onAddPlayer: () => void;
  onResetGame: () => void;
  onEndGame: () => void;
}

export function GameControls({
  canStartRound,
  canEndRound,
  onStartRound,
  onEndRound,
  onAddPlayer,
  onResetGame,
  onEndGame
}: GameControlsProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gameshow-card p-4 rounded-lg">
      <div>
        <h1 className="text-3xl font-bold text-gameshow-text">
          Panel Hosta
        </h1>
        <div className="flex flex-wrap gap-2 mt-2">
          {canStartRound && (
            <>
              <Button 
                onClick={() => onStartRound('knowledge')} 
                variant="default"
                className="bg-blue-600 hover:bg-blue-700"
              >
                Rozpocznij Rundę 1
              </Button>
              <Button 
                onClick={() => onStartRound('speed')} 
                variant="default"
                className="bg-amber-600 hover:bg-amber-700"
              >
                Rozpocznij Rundę 2
              </Button>
              <Button 
                onClick={() => onStartRound('wheel')} 
                variant="default"
                className="bg-purple-600 hover:bg-purple-700"
              >
                Rozpocznij Rundę 3
              </Button>
            </>
          )}
          {canEndRound && (
            <Button 
              onClick={onEndRound} 
              variant="destructive"
            >
              Zakończ rundę
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button onClick={onAddPlayer} variant="outline">
          Dodaj gracza
        </Button>
        <Button onClick={onResetGame} variant="outline" className="border-red-400 text-red-500 hover:bg-red-50">
          Reset gry
        </Button>
        <Button onClick={onEndGame} variant="outline" className="border-green-400 text-green-500 hover:bg-green-50">
          Zakończ grę
        </Button>
      </div>
    </div>
  );
}

export default GameControls;
