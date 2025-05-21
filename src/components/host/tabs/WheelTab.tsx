
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGame } from '@/context/GameContext';
import { useGameControl } from '../context/GameControlContext';
import { Loader2, Check, X, Award } from 'lucide-react';
import { toast } from 'sonner';

export default function WheelTab() {
  const { state } = useGame();
  const { 
    activePlayerId, 
    handleAnswerQuestion,
    handleSpinWheel,
    handleWheelSpinEnd,
    handleSelectCategory,
  } = useGameControl();
  
  const activePlayer = state.players.find(player => player.id === activePlayerId);
  const currentQuestion = state.currentQuestion;
  const [spinDuration, setSpinDuration] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [finalWinner, setFinalWinner] = useState<string | null>(null);
  
  // Sample categories for the wheel
  const wheelCategories = [
    "MEMY", "TRENDY", "TWITCH", "INTERNET", "CIEKAWOSTKI", 
    "GRY", "HISTORIA", "FILMY", "MUZYKA", "SPORT"
  ];
  
  // Start wheel spin
  const startSpin = () => {
    if (!activePlayer) {
      toast.error("Wybierz aktywnego gracza przed kręceniem kołem");
      return;
    }
    
    setIsSpinning(true);
    const duration = Math.floor(Math.random() * 3000) + 2000; // Between 2-5 seconds
    setSpinDuration(duration);
    handleSpinWheel();
    
    // After spin animation completes
    setTimeout(() => {
      setIsSpinning(false);
      handleWheelSpinEnd();
      
      // Select random category
      const randomCategory = wheelCategories[Math.floor(Math.random() * wheelCategories.length)];
      handleSelectCategory(randomCategory);
      toast.success(`Wylosowana kategoria: ${randomCategory}`);
    }, duration);
  };
  
  // Check if we have a winner at the end of Round 3
  const checkForWinner = () => {
    const activePlayers = state.players.filter(p => !p.eliminated);
    
    if (activePlayers.length === 1) {
      setFinalWinner(activePlayers[0].id);
      toast.success(`Zwycięzca teleturnieju: ${activePlayers[0].name}!`);
    } else if (activePlayers.length === 0) {
      toast.error("Wszyscy gracze zostali wyeliminowani!");
    } else {
      // Sort by points to find the player with the highest score
      const sortedPlayers = [...activePlayers].sort((a, b) => b.points - a.points);
      if (sortedPlayers[0].points > sortedPlayers[1].points) {
        setFinalWinner(sortedPlayers[0].id);
        toast.success(`Zwycięzca teleturnieju: ${sortedPlayers[0].name}!`);
      } else {
        toast.info("Nie ma jednoznacznego zwycięzcy. Kilku graczy ma tę samą liczbę punktów.");
      }
    }
  };
  
  // Calculate rotation for the wheel animation
  const getWheelStyle = () => {
    if (!isSpinning) return {};
    
    const rotations = Math.floor(Math.random() * 5) + 5; // 5-10 rotations
    const degrees = rotations * 360 + Math.floor(Math.random() * 360);
    
    return {
      transform: `rotate(${degrees}deg)`,
      transition: `transform ${spinDuration}ms cubic-bezier(0.2, 0.8, 0.3, 1.0)`
    };
  };
  
  return (
    <div className="space-y-6">
      {/* Wheel Display */}
      <Card className="bg-gameshow-card shadow-md">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-4 text-center">Koło Fortuny</h3>
          
          {finalWinner ? (
            <div className="bg-yellow-500/20 border-2 border-yellow-500 rounded-lg p-6 text-center">
              <Award className="w-12 h-12 mx-auto text-yellow-500 mb-4" />
              <h3 className="text-2xl font-bold mb-2">
                {state.players.find(p => p.id === finalWinner)?.name || "Nieznany gracz"}
              </h3>
              <p className="mb-4">Zwycięzca teleturnieju!</p>
              <Button onClick={() => setFinalWinner(null)}>
                Kontynuuj grę
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div 
                className="relative w-64 h-64 mb-6 rounded-full border-8 border-gameshow-primary overflow-hidden"
                style={getWheelStyle()}
              >
                {wheelCategories.map((category, index) => {
                  const angle = (index * 360) / wheelCategories.length;
                  const skewAngle = 90 - (360 / wheelCategories.length);
                  
                  return (
                    <div
                      key={category}
                      className="absolute w-full h-full origin-center"
                      style={{
                        transform: `rotate(${angle}deg)`,
                      }}
                    >
                      <div
                        className={`absolute h-full w-[50%] right-0 origin-left text-center 
                                  flex items-center justify-center overflow-hidden
                                  ${index % 2 === 0 ? 'bg-purple-600' : 'bg-purple-800'}`}
                        style={{
                          transform: `skewY(${skewAngle}deg)`,
                        }}
                      >
                        <span 
                          className="text-xs font-bold text-white rotate-90"
                          style={{ marginLeft: '60%' }}
                        >
                          {category}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {isSpinning && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full">
                    <Loader2 className="h-12 w-12 text-white animate-spin" />
                  </div>
                )}
              </div>
              
              <div className="text-center">
                <Button 
                  onClick={startSpin} 
                  disabled={isSpinning || !activePlayer}
                  size="lg"
                  className="animate-pulse"
                >
                  {isSpinning ? "Kręcenie..." : "Zakręć kołem"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Selected Category and Question */}
      <Card className="bg-gameshow-card shadow-md">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Kategoria: {state.selectedCategory || "Nie wybrano"}</h3>
            <Button variant="outline" onClick={() => setIsSpinning(false)}>
              Ustaw ręcznie
            </Button>
          </div>
          
          {currentQuestion ? (
            <>
              <p className="text-lg mb-4">{currentQuestion.text}</p>
              
              <div className="space-y-2">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        
        <Card className="bg-gameshow-card shadow-md">
          <CardContent className="p-4">
            <h3 className="text-xl font-bold mb-4">Finał teleturnieju</h3>
            <p className="mb-4">
              W rundzie finałowej, gracz z największą liczbą punktów wygrywa teleturniej. 
              Jeśli kilku graczy ma taką samą liczbę punktów, możesz wskazać zwycięzcę ręcznie.
            </p>
            
            <Button 
              onClick={checkForWinner}
              className="bg-yellow-600 hover:bg-yellow-700 text-white w-full"
              size="lg"
            >
              <Award className="mr-2" />
              Wyłoń zwycięzcę
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
