
import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { CardType, Player, Question, RoundType } from '@/types/gameTypes';
import GameControls from './GameControls';
import GameResults from './GameResults';
import PlayerGrid from './PlayerGrid';
import { toast } from 'sonner';
import { ROUND_NAMES } from '@/constants/gameConstants';
import ActivePlayerPanel from './panels/ActivePlayerPanel';
import GameTabContent from './panels/GameTabContent';
import QuestionListPanel from './panels/QuestionListPanel';

export function HostPanel() {
  const { state, dispatch } = useGame();
  const { 
    currentRound, 
    players, 
    currentQuestion, 
    wheelSpinning, 
    selectedCategory,
    roundStarted,
    roundEnded,
    remainingQuestions
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
          onUseCard={handleUseCard}
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
            
            <ActivePlayerPanel 
              activePlayer={activePlayer} 
              onAddTestCards={handleAddTestCards}
              onUseCard={handleUseCard}
            />
          </div>
          
          {/* Center column - Current question or wheel */}
          <div className="bg-gameshow-card p-4 rounded-lg">
            <GameTabContent 
              currentRound={currentRound}
              currentQuestion={currentQuestion}
              wheelSpinning={wheelSpinning}
              activePlayerId={activePlayerId}
              extensionFactor={extensionFactor}
              onSpinWheel={handleSpinWheel}
              onWheelSpinEnd={handleWheelSpinEnd}
              onSelectCategory={handleSelectCategory}
              onAnswerQuestion={handleAnswerQuestion}
            />
          </div>
          
          {/* Right column - Question selection */}
          <QuestionListPanel
            questions={remainingQuestions}
            selectedCategory={selectedCategory}
            onSelectQuestion={handleSelectQuestion}
          />
        </div>
      </div>
    </div>
  );
}

export default HostPanel;
