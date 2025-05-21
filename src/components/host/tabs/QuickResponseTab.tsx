
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGame } from '@/context/GameContext';
import { useGameControl } from '../context/GameControlContext';
import { useTimer } from '../TimerContext';
import { Check, X, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Player } from '@/types/gameTypes';
import { cn } from '@/lib/utils';

export default function QuickResponseTab() {
  const { state } = useGame();
  const { 
    handleAnswerQuestion,
    handleSelectPlayer
  } = useGameControl();
  const { 
    startTimer, 
    stopTimer, 
    resetTimer, 
    timerValue,
    isTimerRunning
  } = useTimer();
  
  const [selectedPlayers, setSelectedPlayers] = useState<Set<string>>(new Set());
  const currentQuestion = state.currentQuestion;
  
  // Set quick response timer to 5 seconds
  const startQuickTimer = () => {
    resetTimer();
    startTimer(5);
    toast.info("Rozpoczęto odliczanie 5 sekund!");
  };
  
  // Toggle player selection
  const togglePlayerSelection = (playerId: string) => {
    const newSelection = new Set(selectedPlayers);
    if (newSelection.has(playerId)) {
      newSelection.delete(playerId);
    } else {
      newSelection.add(playerId);
    }
    setSelectedPlayers(newSelection);
  };
  
  // Mark all selected players as correct
  const markSelectedCorrect = () => {
    if (selectedPlayers.size === 0) {
      toast.error("Nie wybrano żadnych graczy");
      return;
    }
    
    // Process each selected player
    selectedPlayers.forEach(playerId => {
      const player = state.players.find(p => p.id === playerId);
      if (player) {
        handleSelectPlayer(player);
        handleAnswerQuestion(true, 0);
      }
    });
    
    toast.success(`Zaznaczono ${selectedPlayers.size} poprawnych odpowiedzi`);
    setSelectedPlayers(new Set());
  };
  
  // Mark all selected players as incorrect
  const markSelectedIncorrect = () => {
    if (selectedPlayers.size === 0) {
      toast.error("Nie wybrano żadnych graczy");
      return;
    }
    
    // Process each selected player
    selectedPlayers.forEach(playerId => {
      const player = state.players.find(p => p.id === playerId);
      if (player) {
        handleSelectPlayer(player);
        handleAnswerQuestion(false, 0);
      }
    });
    
    toast.error(`Zaznaczono ${selectedPlayers.size} niepoprawnych odpowiedzi`);
    setSelectedPlayers(new Set());
  };
  
  // Clear selection
  const clearSelection = () => {
    setSelectedPlayers(new Set());
    toast.info("Wyczyszczono zaznaczenie graczy");
  };
  
  // Timer effect
  useEffect(() => {
    if (timerValue === 0 && isTimerRunning) {
      stopTimer();
      toast.warning("Czas minął!");
      
      // Optionally mark all non-responding players as incorrect
      // This would require tracking who hasn't answered
    }
  }, [timerValue, isTimerRunning, stopTimer]);
  
  return (
    <div className="space-y-6">
      {/* Current Question Display */}
      <Card className="bg-gameshow-card shadow-md">
        <CardContent className="p-4">
          <h3 className="text-xl font-bold mb-2">Aktualne pytanie</h3>
          {currentQuestion ? (
            <>
              <div className="mb-2 text-sm bg-gameshow-primary/20 inline-block px-2 py-1 rounded">
                Kategoria: {currentQuestion.category}
              </div>
              <p className="text-lg">{currentQuestion.text}</p>
            </>
          ) : (
            <p className="text-gameshow-muted italic">Brak aktualnego pytania</p>
          )}
          
          {/* Quick Timer Controls */}
          <div className="mt-4 flex items-center space-x-4">
            <Button 
              onClick={startQuickTimer}
              disabled={isTimerRunning}
              className="flex items-center gap-2"
            >
              <Clock size={16} />
              Rozpocznij odliczanie 5s
            </Button>
            
            <div className="text-2xl font-bold">
              {isTimerRunning ? timerValue : "5"}s
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Rapid Answer Interface */}
      <Card className="bg-gameshow-card shadow-md">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Szybka ocena odpowiedzi</h3>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={clearSelection}
              >
                Wyczyść zaznaczenie
              </Button>
              <div className="text-sm bg-gameshow-primary/20 px-2 py-1 rounded">
                Zaznaczono: {selectedPlayers.size} graczy
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
              onClick={markSelectedCorrect}
              disabled={selectedPlayers.size === 0}
              size="lg"
            >
              <Check size={20} />
              Poprawne odpowiedzi
            </Button>
            
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
              onClick={markSelectedIncorrect}
              disabled={selectedPlayers.size === 0}
              size="lg"
            >
              <X size={20} />
              Niepoprawne odpowiedzi
            </Button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {state.players.map(player => (
              <div 
                key={player.id}
                className={cn(
                  "border rounded-lg p-3 cursor-pointer transition-colors",
                  player.eliminated 
                    ? "opacity-50 bg-red-500/10 border-red-500/30" 
                    : selectedPlayers.has(player.id)
                      ? "bg-blue-500/30 border-blue-500" 
                      : "hover:bg-gameshow-primary/10"
                )}
                onClick={() => !player.eliminated && togglePlayerSelection(player.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: player.color || '#ff5722' }}
                    />
                    <span className="font-medium">{player.name}</span>
                  </div>
                </div>
                <div className="mt-2 flex justify-between items-center">
                  <div className="flex space-x-1">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} 
                        className={`w-2 h-2 rounded-full ${
                          i < player.lives ? "bg-red-500" : "bg-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                  {player.eliminated && (
                    <span className="text-xs bg-red-500/20 text-red-500 px-1.5 py-0.5 rounded">
                      Wyeliminowany
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
