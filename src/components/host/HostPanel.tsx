import React, { useState, useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import { CardType, Player, Question, RoundType } from '@/types/gameTypes';
import { ROUND_NAMES } from '@/constants/gameConstants';
import PlayerCamera from '../players/PlayerCamera';
import QuestionDisplay from '../questions/QuestionDisplay';
import QuestionList from '../questions/QuestionList';
import FortuneWheel from '../wheel/FortuneWheel';
import CardDeck from '../cards/CardDeck';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { createCard } from '@/constants/gameConstants';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Trophy } from 'lucide-react';
import { toast } from 'sonner';

export function HostPanel() {
  const { state, dispatch } = useGame();
  const { 
    currentRound, 
    players, 
    currentQuestion, 
    wheelSpinning, 
    selectedCategory,
    roundStarted,
    roundEnded
  } = state;
  
  const [extensionFactor, setExtensionFactor] = useState(1);
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [resultType, setResultType] = useState<'round' | 'final'>('round');

  // Find the active player
  const activePlayer = players.find(player => player.isActive) || null;
  
  // Calculate round state for UI
  const isRoundActive = roundStarted && !roundEnded;
  const canStartRound = !roundStarted && !roundEnded;
  const canEndRound = roundStarted && !roundEnded;
  
  useEffect(() => {
    // Reset extension factor when active player changes
    setExtensionFactor(1);
  }, [activePlayerId]);

  const handleSelectPlayer = (player: Player) => {
    dispatch({ type: 'SET_ACTIVE_PLAYER', playerId: player.id });
    setActivePlayerId(player.id);
  };
  
  const handleStartRound = (roundType: RoundType) => {
    // Reset all players' active state before starting a new round
    players.forEach(player => {
      if (player.isActive) {
        dispatch({ type: 'SET_ACTIVE_PLAYER', playerId: '' });
      }
    });
    
    dispatch({ type: 'START_ROUND', roundType });
    toast.success(`Rozpoczęto rundę: ${ROUND_NAMES[roundType]}`);
  };
  
  const handleEndRound = () => {
    dispatch({ type: 'END_ROUND' });
    setShowResults(true);
    setResultType('round');
    
    // Auto advance top 5 players to next round logic would be here
    // For now, just display results
    toast.info('Runda zakończona. Wyświetlanie wyników...');
  };

  const handleEndGame = () => {
    setShowResults(true);
    setResultType('final');
    toast.success('Gra zakończona! Wyświetlanie końcowych wyników...');
  };
  
  const handleSelectQuestion = (question: Question) => {
    dispatch({ type: 'SET_CURRENT_QUESTION', question });
    toast(`Wybrano pytanie: ${question.text.substring(0, 30)}...`);
  };
  
  const handleAnswerQuestion = (isCorrect: boolean, answerIndex: number) => {
    if (activePlayer) {
      dispatch({ type: 'ANSWER_QUESTION', playerId: activePlayer.id, isCorrect });
      // Reset extension factor after question is answered
      setExtensionFactor(1);
    }
  };
  
  const handleSpinWheel = () => {
    dispatch({ type: 'SPIN_WHEEL', spinning: true });
    toast('Koło fortuny się kręci...');
  };
  
  const handleWheelSpinEnd = () => {
    dispatch({ type: 'SPIN_WHEEL', spinning: false });
  };
  
  const handleSelectCategory = (category: string) => {
    dispatch({ type: 'SET_CATEGORY', category });
    toast.success(`Wylosowano kategorię: ${category}`);
  };
  
  const handleUseCard = (playerId: string, cardType: CardType) => {
    dispatch({ type: 'USE_CARD', playerId, cardType });
    
    // Handle special card effects
    if (cardType === 'refleks2') {
      setExtensionFactor(2);
    } else if (cardType === 'refleks3') {
      setExtensionFactor(3);
    }
  };
  
  const handleAwardCard = (playerId: string, cardType: CardType) => {
    dispatch({ type: 'AWARD_CARD', playerId, cardType });
  };
  
  const handleAddPlayer = () => {
    const playerNumber = players.length + 1;
    const newPlayer: Player = {
      id: `player-${Date.now()}`,
      name: `Gracz ${playerNumber}`,
      lives: 3,
      points: 0,
      cards: [],
      isActive: players.length === 0,
      eliminated: false
    };
    
    dispatch({ type: 'ADD_PLAYER', player: newPlayer });
    toast.success(`Dodano gracza: ${newPlayer.name}`);
  };
  
  const handleResetGame = () => {
    if (confirm('Czy na pewno chcesz zresetować grę? Wszystkie postępy zostaną utracone.')) {
      dispatch({ type: 'RESTART_GAME' });
      setShowResults(false);
      toast.info('Gra została zresetowana');
    }
  };
  
  // Function to determine lucky loser
  const determineLuckyLoser = () => {
    // In a real implementation, this would apply complex logic
    // For now, pick the player with the highest score among eliminated players
    const eliminatedPlayers = players.filter(player => player.eliminated);
    if (eliminatedPlayers.length === 0) return null;
    
    return eliminatedPlayers.reduce((prev, current) => 
      (prev.points > current.points) ? prev : current
    );
  };
  
  // Test function to add cards for demonstration
  const handleAddTestCards = (playerId: string) => {
    // Add one of each card type for testing
    const cardTypes: CardType[] = [
      'dejavu', 'kontra', 'reanimacja', 'skip', 
      'turbo', 'refleks2', 'refleks3', 'lustro', 'oswiecenie'
    ];
    
    cardTypes.forEach(cardType => {
      handleAwardCard(playerId, cardType);
    });
  };

  // Replace Confetti with Star and Trophy in the results view
  if (showResults) {
    const sortedPlayers = [...players].sort((a, b) => b.points - a.points);
    const winner = sortedPlayers[0];
    const luckyLoser = determineLuckyLoser();
    
    return (
      <div className="container mx-auto p-4 bg-gameshow-background min-h-screen">
        <Card className="w-full bg-gameshow-card">
          <CardHeader className="text-center bg-gradient-to-r from-gameshow-primary/40 to-gameshow-secondary/40">
            <CardTitle className="text-3xl font-bold text-gameshow-text flex items-center justify-center gap-2">
              {resultType === 'final' ? (
                <>
                  <Star className="h-8 w-8 text-yellow-400 animate-bounce" />
                  Zwycięzca gry: {winner?.name}!
                  <Trophy className="h-8 w-8 text-yellow-400 animate-bounce" />
                </>
              ) : (
                `Wyniki rundy: ${ROUND_NAMES[currentRound]}`
              )}
            </CardTitle>
            <CardDescription className="text-gameshow-muted text-lg">
              {resultType === 'final' 
                ? 'Gratulacje dla zwycięzcy i wszystkich uczestników!'
                : 'Top 5 graczy awansuje do następnej rundy'}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-6">
              {sortedPlayers.map((player, index) => (
                <div 
                  key={player.id} 
                  className={`flex items-center p-4 rounded-lg transition-all ${
                    index === 0 && resultType === 'final' 
                      ? 'bg-gradient-to-r from-yellow-400/30 to-amber-500/30 shadow-lg scale-105' 
                      : index < 5 ? 'bg-gameshow-primary/20' : 'bg-gameshow-card'
                  }`}
                >
                  <div className="w-8 text-xl font-bold">{index + 1}.</div>
                  <PlayerCamera player={player} size="sm" showDetails={false} />
                  <div className="ml-4 flex-grow">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold">{player.name}</h3>
                      <div className="text-xl font-bold">{player.points} pkt</div>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gameshow-muted">Życia:</span>
                      <div className="flex space-x-1">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} 
                            className={`w-3 h-3 rounded-full ${
                              i < player.lives ? "bg-red-500" : "bg-gray-400"
                            }`}
                          />
                        ))}
                      </div>
                      {player.eliminated && (
                        <span className="text-xs bg-red-500/20 text-red-500 px-2 py-0.5 rounded-full">
                          Wyeliminowany
                        </span>
                      )}
                      {luckyLoser && player.id === luckyLoser.id && (
                        <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded-full ml-2 animate-pulse">
                          Lucky Loser
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-center gap-4 pt-4">
            {resultType === 'final' ? (
              <Button variant="default" onClick={() => handleResetGame()}>
                Nowa gra
              </Button>
            ) : (
              <>
                <Button variant="default" onClick={() => setShowResults(false)}>
                  Powrót do panelu
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowResults(false);
                    // Logic to automatically start next round would go here
                    // For now, just return to the panel
                    toast.info('Wróć do panelu i rozpocznij następną rundę');
                  }}
                >
                  Rozpocznij następną rundę
                </Button>
              </>
            )}
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 bg-gameshow-background min-h-screen">
      <div className="flex flex-col space-y-6">
        {/* Header with controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gameshow-card p-4 rounded-lg">
          <div>
            <h1 className="text-3xl font-bold text-gameshow-text">
              Panel Hosta - {ROUND_NAMES[currentRound]}
            </h1>
            <div className="flex flex-wrap gap-2 mt-2">
              {canStartRound && (
                <>
                  <Button 
                    onClick={() => handleStartRound('knowledge')} 
                    variant="default"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Rozpocznij Rundę 1
                  </Button>
                  <Button 
                    onClick={() => handleStartRound('speed')} 
                    variant="default"
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    Rozpocznij Rundę 2
                  </Button>
                  <Button 
                    onClick={() => handleStartRound('wheel')} 
                    variant="default"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Rozpocznij Rundę 3
                  </Button>
                </>
              )}
              {canEndRound && (
                <Button 
                  onClick={handleEndRound} 
                  variant="destructive"
                >
                  Zakończ rundę
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleAddPlayer} variant="outline">
              Dodaj gracza
            </Button>
            <Button onClick={handleResetGame} variant="outline" className="border-red-400 text-red-500 hover:bg-red-50">
              Reset gry
            </Button>
            <Button onClick={handleEndGame} variant="outline" className="border-green-400 text-green-500 hover:bg-green-50">
              Zakończ grę
            </Button>
          </div>
        </div>
        
        {/* Players grid */}
        <div className="bg-gameshow-card p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-gameshow-text mb-3">
            Gracze {isRoundActive ? `- ${ROUND_NAMES[currentRound]}` : ""}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {players.map((player) => (
              <div 
                key={player.id}
                className={`cursor-pointer transition-all p-2 rounded-lg ${player.isActive ? 'bg-gameshow-primary/20 ring-2 ring-gameshow-primary' : 'hover:bg-gameshow-card/80'}`}
                onClick={() => handleSelectPlayer(player)}
              >
                <PlayerCamera player={player} size="sm" />
                <div className="mt-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold truncate">{player.name}</h3>
                    <span className="text-sm font-semibold">{player.points}p</span>
                  </div>
                  
                  <div className="mt-1 flex items-center gap-2">
                    <Progress 
                      value={player.lives * 33.33} 
                      className="h-2" 
                      style={{
                        background: 'rgba(255,0,0,0.2)',
                      }}
                    />
                    <span className="text-xs font-semibold">{player.lives}/3</span>
                  </div>
                </div>
                
                {/* Card controls */}
                <div className="flex flex-wrap justify-center gap-1 mt-2">
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddTestCards(player.id);
                    }}
                    className="text-xs px-2 py-0 h-7"
                  >
                    + Karty
                  </Button>
                  
                  {player.cards.length > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectPlayer(player);
                      }}
                      className="text-xs px-2 py-0 h-7 bg-gameshow-primary/10"
                    >
                      {player.cards.length} kart
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            {/* Add player tile */}
            {players.length < 5 && (
              <div 
                className="flex items-center justify-center border-2 border-dashed border-gameshow-primary/30 rounded-lg h-full min-h-[150px] cursor-pointer hover:bg-gameshow-primary/5 transition-all"
                onClick={handleAddPlayer}
              >
                <div className="text-center text-gameshow-muted">
                  <div className="w-10 h-10 mx-auto mb-2 flex items-center justify-center rounded-full bg-gameshow-primary/20">
                    <span className="text-2xl">+</span>
                  </div>
                  <p>Dodaj gracza</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Main game interface */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Active player */}
          <div className="bg-gameshow-card p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-gameshow-text mb-3 flex items-center justify-between">
              <span>Aktywny gracz</span>
              {activePlayer && (
                <span className="text-sm bg-gameshow-primary/20 px-2 py-1 rounded-full">
                  {activePlayer.points} pkt | {activePlayer.lives} życia
                </span>
              )}
            </h2>
            {activePlayer ? (
              <div>
                <PlayerCamera player={activePlayer} size="lg" />
                
                <div className="mt-4 mb-2 flex items-center gap-2">
                  <h3 className="font-semibold">Życie:</h3>
                  <Progress 
                    value={activePlayer.lives * 33.33} 
                    className="h-3 flex-grow" 
                    style={{
                      background: 'rgba(255,0,0,0.2)',
                    }}
                  />
                  <span className="font-semibold">{activePlayer.lives}/3</span>
                </div>
                
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Karty specjalne:</h3>
                  {activePlayer.cards.length > 0 ? (
                    <CardDeck 
                      cards={activePlayer.cards}
                      onUseCard={(card) => handleUseCard(activePlayer.id, card.type)}
                    />
                  ) : (
                    <div className="text-center py-4 text-gameshow-muted">
                      <p>Brak kart</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAddTestCards(activePlayer.id)}
                        className="mt-2"
                      >
                        Dodaj karty testowe
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gameshow-muted bg-gameshow-background/50 rounded-lg">
                <p className="mb-4">Wybierz aktywnego gracza</p>
                <div className="flex justify-center">
                  <div className="player-camera-box w-32 h-24 opacity-40 flex items-center justify-center">
                    <span className="text-3xl text-gameshow-muted">?</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Center column - Current question or wheel */}
          <div className="bg-gameshow-card p-4 rounded-lg">
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
                  onAnswer={handleAnswerQuestion}
                  isTimeExtended={extensionFactor > 1}
                  extensionFactor={extensionFactor}
                />
              </TabsContent>
              
              <TabsContent value="wheel">
                <h2 className="text-xl font-semibold text-gameshow-text mb-3">Koło Fortuny</h2>
                <div className="flex flex-col items-center">
                  <FortuneWheel 
                    isSpinning={wheelSpinning} 
                    onSelectCategory={handleSelectCategory}
                    onSpinEnd={handleWheelSpinEnd}
                  />
                  <Button 
                    onClick={handleSpinWheel} 
                    className="mt-4"
                    disabled={wheelSpinning}
                  >
                    {wheelSpinning ? 'Kręcenie...' : 'Zakręć Kołem'}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Right column - Question selection */}
          <div className="bg-gameshow-card p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-gameshow-text mb-3">
              Lista Pytań {selectedCategory && `- ${selectedCategory}`}
            </h2>
            <QuestionList 
              questions={state.remainingQuestions}
              onSelectQuestion={handleSelectQuestion}
              currentCategory={selectedCategory}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HostPanel;
