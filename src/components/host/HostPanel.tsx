import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { CardType, Player, Question, RoundType } from '@/types/gameTypes';
import GameControls from './GameControls';
import GameResults from './GameResults';
import PlayerGrid from './PlayerGrid';
import QuestionDisplay from '../questions/QuestionDisplay';
import QuestionList from '../questions/QuestionList';
import FortuneWheel from '../wheel/FortuneWheel';
import CardDeck from '../cards/CardDeck';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  
  const [showResults, setShowResults] = useState<boolean>(false);
  const [resultType, setResultType] = useState<'round' | 'final'>('round');
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null);
  const [extensionFactor, setExtensionFactor] = useState(1);
  
  // Calculate round state for UI
  const isRoundActive = roundStarted && !roundEnded;
  const canStartRound = !roundStarted && !roundEnded;
  const canEndRound = roundStarted && !roundEnded;

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
    if (activePlayerId) {
      const activePlayer = state.players.find(p => p.id === activePlayerId);
      if (activePlayer) {
        dispatch({ type: 'ANSWER_QUESTION', playerId: activePlayer.id, isCorrect });
        // Reset extension factor after question is answered
        setExtensionFactor(1);
      }
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

  const activePlayer = players.find(player => player.id === activePlayerId) || null;
  
  if (showResults) {
    return (
      <GameResults
        players={players}
        currentRound={currentRound}
        resultType={resultType}
        onResetGame={handleResetGame}
        onCloseResults={() => setShowResults(false)}
      />
    );
  }
  
  return (
    <div className="container mx-auto p-4 bg-gameshow-background min-h-screen">
      <div className="flex flex-col space-y-6">
        {/* Game Controls */}
        <GameControls
          canStartRound={canStartRound}
          canEndRound={canEndRound}
          onStartRound={handleStartRound}
          onEndRound={handleEndRound}
          onAddPlayer={handleAddPlayer}
          onResetGame={handleResetGame}
          onEndGame={handleEndGame}
        />
        
        {/* Players Grid */}
        <PlayerGrid
          players={players}
          onSelectPlayer={(player) => handleSelectPlayer(player)}
          onAddTestCards={handleAddTestCards}
        />
        
        {/* Main Game Interface */}
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
                {/* Placeholder for PlayerCamera */}
                <div className="player-camera-box w-full h-36 bg-gray-700 rounded-lg mb-4">
                  {/* Placeholder content, replace with actual PlayerCamera component */}
                  <div className="flex items-center justify-center h-full text-white text-xl">
                    {activePlayer.name}
                  </div>
                </div>
                
                <div className="mt-4 mb-2 flex items-center gap-2">
                  <h3 className="font-semibold">Życie:</h3>
                  <div className="w-2/3 bg-gray-400 h-2 rounded-full relative">
                    <div 
                      className="bg-red-500 h-2 rounded-full absolute top-0 left-0"
                      style={{ width: `${(activePlayer.lives / 3) * 100}%` }}
                    />
                  </div>
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
