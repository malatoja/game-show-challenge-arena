
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGame } from '@/context/GameContext';
import { useGameControl } from '../context/GameControlContext';
import { Check, X, Star } from 'lucide-react';
import { toast } from 'sonner';
import { Question, Player } from '@/types/gameTypes';

export default function EliminationsTab() {
  const { state } = useGame();
  const { 
    activePlayerId, 
    handleAnswerQuestion,
    handleSelectPlayer
  } = useGameControl();
  
  const [luckyLoser, setLuckyLoser] = useState<Player | null>(null);
  
  const activePlayer = state.players.find(player => player.id === activePlayerId);
  const currentQuestion = state.currentQuestion;
  
  // Find potential lucky losers - eliminated players with highest points
  const findLuckyLoser = () => {
    const eliminatedPlayers = state.players.filter(player => player.eliminated);
    if (eliminatedPlayers.length === 0) {
      toast.info("Brak wyeliminowanych graczy");
      return;
    }
    
    // Sort by points in descending order
    const sorted = [...eliminatedPlayers].sort((a, b) => b.points - a.points);
    const candidate = sorted[0];
    
    setLuckyLoser(candidate);
    toast.success(`Lucky Loser: ${candidate.name} (${candidate.points} punktów)`);
  };
  
  const restoreLuckyLoser = () => {
    if (!luckyLoser) {
      toast.error("Nie wybrano Lucky Loser");
      return;
    }
    
    // Logic to restore player would go here
    // This would be connected to the game state management
    toast.success(`Przywrócono gracza ${luckyLoser.name} do gry!`);
    
    // Reset lucky loser
    setLuckyLoser(null);
  };
  
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
              
              <div className="mt-4 space-y-2">
                {currentQuestion.answers.map((answer, index) => (
                  <div 
                    key={index}
                    className={`p-2 border rounded ${
                      index === currentQuestion.correctAnswerIndex 
                        ? 'border-green-500 bg-green-500/10' 
                        : 'border-gray-300'
                    }`}
                  >
                    {answer.text}
                    {index === currentQuestion.correctAnswerIndex && (
                      <span className="ml-2 text-green-500">(Poprawna)</span>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-gameshow-muted italic">Brak aktualnego pytania</p>
          )}
        </CardContent>
      </Card>
      
      {/* Player Answer Controls */}
      <Card className="bg-gameshow-card shadow-md">
        <CardContent className="p-4">
          <h3 className="text-xl font-bold mb-4">Ocena odpowiedzi</h3>
          
          {activePlayer ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: activePlayer.color || '#ff5722' }}
                />
                <span className="font-medium">{activePlayer.name}</span>
                <span className="text-gameshow-muted">
                  ({activePlayer.points} pkt, {activePlayer.lives} życia)
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                  onClick={() => handleAnswerQuestion(true, 0)}
                  size="lg"
                >
                  <Check size={20} />
                  Odpowiedź poprawna
                </Button>
                
                <Button 
                  className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                  onClick={() => handleAnswerQuestion(false, 0)}
                  size="lg"
                >
                  <X size={20} />
                  Odpowiedź niepoprawna
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-gameshow-muted italic">Wybierz aktywnego gracza</p>
          )}
        </CardContent>
      </Card>
      
      {/* Lucky Loser Controls */}
      <Card className="bg-gameshow-card shadow-md">
        <CardContent className="p-4">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Star className="text-yellow-400" size={20} />
            Lucky Loser
          </h3>
          
          <div className="space-y-4">
            <p className="text-sm">
              Funkcja Lucky Loser pozwala przywrócić jednego wyeliminowanego gracza z najwyższym wynikiem punktowym.
            </p>
            
            {luckyLoser ? (
              <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold">{luckyLoser.name}</div>
                    <div className="text-sm">{luckyLoser.points} punktów</div>
                  </div>
                  <Button onClick={restoreLuckyLoser} variant="secondary">
                    Przywróć do gry
                  </Button>
                </div>
              </div>
            ) : (
              <Button onClick={findLuckyLoser} variant="outline">
                Znajdź Lucky Loser
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Players Status Overview */}
      <Card className="bg-gameshow-card shadow-md">
        <CardContent className="p-4">
          <h3 className="text-xl font-bold mb-4">Status graczy</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {state.players.map(player => (
              <div 
                key={player.id}
                className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                  player.eliminated 
                    ? 'bg-red-500/10 border-red-500/30' 
                    : player.id === activePlayerId 
                      ? 'bg-blue-500/20 border-blue-500/30' 
                      : 'hover:bg-gameshow-primary/10'
                }`}
                onClick={() => handleSelectPlayer(player)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: player.color || '#ff5722' }}
                    />
                    <span className="font-medium">{player.name}</span>
                  </div>
                  <div className="text-sm font-semibold">
                    {player.points} pkt
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
