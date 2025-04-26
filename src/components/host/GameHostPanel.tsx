
import React, { useState, useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import { Player, CardType, RoundType } from '@/types/gameTypes';
import { ROUND_NAMES } from '@/constants/gameConstants';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import PlayerGrid from './PlayerGrid';
import GameResults from './GameResults';
import TopBar from './TopBar';
import RightColumn from './RightColumn';
import BottomBar from './BottomBar';
import QuestionControls from './QuestionControls';
import CardManagement from './CardManagement';

export function GameHostPanel() {
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
  const [timer, setTimer] = useState<number>(30);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [events, setEvents] = useState<string[]>([]);

  // Calculate round state for UI
  const isRoundActive = roundStarted && !roundEnded;
  const canStartRound = !roundStarted && !roundEnded;
  const canEndRound = roundStarted && !roundEnded;

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTime => prevTime - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
      addEvent("Czas minął!");
      
      // Play sound effect when timer reaches zero
      const audio = new Audio('/sounds/times_up.mp3');
      audio.play().catch(err => console.error("Error playing sound:", err));
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timer]);
  
  const startTimer = () => {
    setIsTimerRunning(true);
    addEvent("Timer uruchomiony");
  };
  
  const stopTimer = () => {
    setIsTimerRunning(false);
    addEvent("Timer zatrzymany");
  };
  
  const resetTimer = () => {
    setTimer(getDefaultTimeForRound(currentRound));
    setIsTimerRunning(false);
    addEvent("Timer zresetowany");
  };
  
  const getDefaultTimeForRound = (round: RoundType): number => {
    switch (round) {
      case 'speed': return 10;
      case 'wheel': return 20;
      case 'knowledge':
      default: return 30;
    }
  };

  const addEvent = (event: string) => {
    setEvents(prev => [event, ...prev].slice(0, 10)); // Keep last 10 events
    // Log to console for reference
    console.log(`[Event]: ${event}`);
  };

  const handleSelectPlayer = (player: Player) => {
    dispatch({ type: 'SET_ACTIVE_PLAYER', playerId: player.id });
    setActivePlayerId(player.id);
    addEvent(`Wybrano gracza: ${player.name}`);
  };
  
  const handleStartRound = (roundType: RoundType) => {
    // Reset all players' active state before starting a new round
    players.forEach(player => {
      if (player.isActive) {
        dispatch({ type: 'SET_ACTIVE_PLAYER', playerId: '' });
      }
    });
    
    // Reset timer for this round
    setTimer(getDefaultTimeForRound(roundType));
    
    dispatch({ type: 'START_ROUND', roundType });
    addEvent(`Rozpoczęto rundę: ${ROUND_NAMES[roundType]}`);
    toast.success(`Rozpoczęto rundę: ${ROUND_NAMES[roundType]}`);
  };
  
  const handleEndRound = () => {
    dispatch({ type: 'END_ROUND' });
    setShowResults(true);
    setResultType('round');
    setIsTimerRunning(false);
    
    // Auto advance top 5 players to next round logic would be here
    // For now, just display results
    addEvent("Runda zakończona. Wyświetlanie wyników...");
    toast.info('Runda zakończona. Wyświetlanie wyników...');
  };

  const handleEndGame = () => {
    setShowResults(true);
    setResultType('final');
    setIsTimerRunning(false);
    addEvent("Gra zakończona! Wyświetlanie końcowych wyników...");
    toast.success('Gra zakończona! Wyświetlanie końcowych wyników...');
  };
  
  const handleSkipQuestion = () => {
    addEvent("Pytanie pominięte");
    toast.info("Pytanie pominięte");
    
    // Mark current question as used if we have one
    if (currentQuestion) {
      dispatch({ type: 'MARK_QUESTION_USED', questionId: currentQuestion.id });
    }
  };
  
  const handlePause = () => {
    setIsTimerRunning(false);
    addEvent("Gra wstrzymana");
    toast.info("Gra wstrzymana");
  };
  
  const handleResetGame = () => {
    if (confirm('Czy na pewno chcesz zresetować grę? Wszystkie postępy zostaną utracone.')) {
      dispatch({ type: 'RESTART_GAME' });
      setShowResults(false);
      setIsTimerRunning(false);
      setTimer(30);
      addEvent("Gra została zresetowana");
      toast.info('Gra została zresetowana');
    }
  };
  
  const handleUseCard = (playerId: string, cardType: CardType) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;
    
    dispatch({ type: 'USE_CARD', playerId, cardType });
    addEvent(`${player.name} użył karty ${cardType}`);
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
    addEvent(`Dodano gracza: ${newPlayer.name}`);
    toast.success(`Dodano gracza: ${newPlayer.name}`);
  };
  
  const handleAddTestCards = (playerId: string) => {
    // Add one of each card type for testing
    const cardTypes: CardType[] = [
      'dejavu', 'kontra', 'reanimacja', 'skip', 
      'turbo', 'refleks2', 'refleks3', 'lustro', 'oswiecenie'
    ];
    
    cardTypes.forEach(cardType => {
      dispatch({ type: 'AWARD_CARD', playerId, cardType });
    });
    
    addEvent(`Dodano testowe karty dla gracza`);
  };

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
    <div className="bg-gameshow-background min-h-screen flex flex-col">
      <TopBar 
        currentRound={currentRound}
        timer={timer}
        isTimerRunning={isTimerRunning}
        canStartRound={canStartRound}
        onStartRound={handleStartRound}
        onStartTimer={startTimer}
        onStopTimer={stopTimer}
        onResetTimer={resetTimer}
      />
      
      <div className="flex flex-1 p-2 gap-2">
        <div className="flex flex-col gap-2 flex-1">
          <PlayerGrid
            players={players}
            onSelectPlayer={handleSelectPlayer}
            onAddTestCards={handleAddTestCards}
            onUseCard={handleUseCard}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <QuestionControls 
              currentRound={currentRound}
              isTimerRunning={isTimerRunning}
              onStartTimer={startTimer}
              onStopTimer={stopTimer}
              onResetTimer={resetTimer}
              onSkipQuestion={handleSkipQuestion}
            />
            
            <CardManagement playerId={activePlayerId} />
          </div>
        </div>
        
        <RightColumn 
          onEndRound={handleEndRound}
          onResetRound={handleResetGame}
          onPause={handlePause}
          onSkipQuestion={handleSkipQuestion}
          onEndGame={handleEndGame}
          canEndRound={canEndRound}
        />
      </div>
      
      <BottomBar events={events} />
    </div>
  );
}

export default GameHostPanel;
