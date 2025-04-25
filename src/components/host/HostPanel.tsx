
import React, { useState } from 'react';
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
import { createCard } from '@/constants/gameConstants';

export function HostPanel() {
  const { state, dispatch } = useGame();
  const { currentRound, players, currentQuestion, wheelSpinning, selectedCategory } = state;
  
  const [extensionFactor, setExtensionFactor] = useState(1);
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null);

  // Find the active player
  const activePlayer = players.find(player => player.isActive) || null;
  
  const handleSelectPlayer = (player: Player) => {
    dispatch({ type: 'SET_ACTIVE_PLAYER', playerId: player.id });
    setActivePlayerId(player.id);
  };
  
  const handleStartRound = (roundType: RoundType) => {
    dispatch({ type: 'START_ROUND', roundType });
  };
  
  const handleEndRound = () => {
    dispatch({ type: 'END_ROUND' });
  };
  
  const handleSelectQuestion = (question: Question) => {
    dispatch({ type: 'SET_CURRENT_QUESTION', question });
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
  };
  
  const handleWheelSpinEnd = () => {
    dispatch({ type: 'SPIN_WHEEL', spinning: false });
  };
  
  const handleSelectCategory = (category: string) => {
    dispatch({ type: 'SET_CATEGORY', category });
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
  };
  
  const handleResetGame = () => {
    dispatch({ type: 'RESTART_GAME' });
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
  
  return (
    <div className="container mx-auto p-4 bg-gameshow-background min-h-screen">
      <div className="flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gameshow-text">
            Panel Hosta - {ROUND_NAMES[currentRound]}
          </h1>
          
          <div className="flex space-x-2">
            <Button onClick={handleResetGame} variant="outline">Reset Gry</Button>
            <Button onClick={handleAddPlayer} variant="default">Dodaj Gracza</Button>
          </div>
        </div>
        
        {/* Round selector */}
        <div className="bg-gameshow-card p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-gameshow-text mb-3">Wybierz Rundę</h2>
          <div className="flex space-x-2">
            <Button 
              onClick={() => handleStartRound('knowledge')} 
              variant={currentRound === 'knowledge' ? 'default' : 'outline'}
            >
              Runda 1 - Wiedza
            </Button>
            <Button 
              onClick={() => handleStartRound('speed')} 
              variant={currentRound === 'speed' ? 'default' : 'outline'}
            >
              Runda 2 - 5 Sekund
            </Button>
            <Button 
              onClick={() => handleStartRound('wheel')} 
              variant={currentRound === 'wheel' ? 'default' : 'outline'}
            >
              Runda 3 - Koło Fortuny
            </Button>
          </div>
        </div>
        
        {/* Player selection */}
        <div className="bg-gameshow-card p-4 rounded-lg">
          <h2 className="text-xl font-semibold text-gameshow-text mb-3">Gracze</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {players.map((player) => (
              <div 
                key={player.id}
                className="cursor-pointer"
                onClick={() => handleSelectPlayer(player)}
              >
                <PlayerCamera player={player} size="sm" />
                <div className="flex justify-center mt-1">
                  <Button 
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddTestCards(player.id);
                    }}
                  >
                    Dodaj Karty (Test)
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Main game interface */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Active player */}
          <div className="bg-gameshow-card p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-gameshow-text mb-3">Aktywny Gracz</h2>
            {activePlayer ? (
              <div>
                <PlayerCamera player={activePlayer} size="lg" />
                <div className="mt-4">
                  <h3 className="font-semibold">Karty:</h3>
                  <CardDeck 
                    cards={activePlayer.cards}
                    onUseCard={(card) => handleUseCard(activePlayer.id, card.type)}
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gameshow-muted">
                <p>Wybierz aktywnego gracza</p>
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
                <h2 className="text-xl font-semibold text-gameshow-text mb-3">Aktualne Pytanie</h2>
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
            <h2 className="text-xl font-semibold text-gameshow-text mb-3">Lista Pytań</h2>
            <QuestionList 
              questions={state.questions}
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
