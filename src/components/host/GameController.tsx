
import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { Player, CardType, RoundType } from '@/types/gameTypes';
import { toast } from 'sonner';
import { ROUND_NAMES } from '@/constants/gameConstants';
import { useEvents } from './EventsContext';
import { useTimer } from './TimerContext';
import GameResults from './GameResults';

interface GameControllerProps {
  children: React.ReactNode;
}

export function GameController({ children }: GameControllerProps) {
  const { state, dispatch } = useGame();
  const { 
    currentRound,
    players,
    roundStarted,
    roundEnded 
  } = state;
  
  const { addEvent } = useEvents();
  const { resetTimer, setTimerForRound } = useTimer();
  
  const [showResults, setShowResults] = useState<boolean>(false);
  const [resultType, setResultType] = useState<'round' | 'final'>('round');
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null);
  
  // Calculate round state for UI
  const isRoundActive = roundStarted && !roundEnded;
  const canStartRound = !roundStarted && !roundEnded;
  const canEndRound = roundStarted && !roundEnded;

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
    setTimerForRound(roundType);
    
    dispatch({ type: 'START_ROUND', roundType });
    addEvent(`Rozpoczęto rundę: ${ROUND_NAMES[roundType]}`);
    toast.success(`Rozpoczęto rundę: ${ROUND_NAMES[roundType]}`);
  };
  
  const handleEndRound = () => {
    dispatch({ type: 'END_ROUND' });
    setShowResults(true);
    setResultType('round');
    
    // Auto advance top 5 players to next round logic would be here
    // For now, just display results
    addEvent("Runda zakończona. Wyświetlanie wyników...");
    toast.info('Runda zakończona. Wyświetlanie wyników...');
  };

  const handleEndGame = () => {
    setShowResults(true);
    setResultType('final');
    addEvent("Gra zakończona! Wyświetlanie końcowych wyników...");
    toast.success('Gra zakończona! Wyświetlanie końcowych wyników...');
  };
  
  const handleSkipQuestion = () => {
    addEvent("Pytanie pominięte");
    toast.info("Pytanie pominięte");
    
    // Mark current question as used if we have one
    if (state.currentQuestion) {
      dispatch({ type: 'MARK_QUESTION_USED', questionId: state.currentQuestion.id });
    }
  };
  
  const handlePause = () => {
    addEvent("Gra wstrzymana");
    toast.info("Gra wstrzymana");
  };
  
  const handleResetGame = () => {
    if (confirm('Czy na pewno chcesz zresetować grę? Wszystkie postępy zostaną utracone.')) {
      dispatch({ type: 'RESTART_GAME' });
      setShowResults(false);
      resetTimer();
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
  
  // Context object with all the handler functions
  const gameControlContext = {
    activePlayerId,
    canStartRound,
    canEndRound,
    isRoundActive,
    handleSelectPlayer,
    handleStartRound,
    handleEndRound,
    handleEndGame,
    handleSkipQuestion,
    handlePause,
    handleResetGame,
    handleUseCard,
    handleAddPlayer,
    handleAddTestCards
  };

  // Clone children with context prop
  if (React.isValidElement(children)) {
    return React.cloneElement(children, { gameControl: gameControlContext });
  }
  
  return <>{children}</>;
}

export default GameController;
