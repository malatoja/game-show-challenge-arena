import React, { useState, useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import { Player, CardType, RoundType, Question } from '@/types/gameTypes';
import { toast } from 'sonner';
import { ROUND_NAMES } from '@/constants/gameConstants';
import { useEvents } from './EventsContext';
import { useTimer } from './TimerContext';
import GameResults from './GameResults';
import GameLayout, { GameControlContext } from './GameLayout';
import { playCardSound } from '@/lib/soundService';
import { useSocket } from '@/context/SocketContext';

interface GameControllerProps {
  children?: React.ReactNode;
}

export function GameController({ children }: GameControllerProps) {
  const { state, dispatch } = useGame();
  const { 
    currentRound,
    players,
    roundStarted,
    roundEnded,
    currentQuestion
  } = state;
  
  const { addEvent } = useEvents();
  const { resetTimer, setTimerForRound, currentTime } = useTimer();
  const { emit } = useSocket();
  
  const [showResults, setShowResults] = useState<boolean>(false);
  const [resultType, setResultType] = useState<'round' | 'final'>('round');
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null);
  const [lastAnswerWasIncorrect, setLastAnswerWasIncorrect] = useState<boolean>(false);
  const [questionTransferTarget, setQuestionTransferTarget] = useState<string | null>(null);
  
  // Calculate round state for UI
  const isRoundActive = roundStarted && !roundEnded;
  const canStartRound = !roundStarted && !roundEnded;
  const canEndRound = roundStarted && !roundEnded;

  const handleSelectPlayer = (player: Player) => {
    dispatch({ type: 'SET_ACTIVE_PLAYER', playerId: player.id });
    setActivePlayerId(player.id);
    addEvent(`Wybrano gracza: ${player.name}`);
    
    // Emit the player:active event
    emit('player:active', { playerId: player.id });
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
    
    // Emit the round:start event
    emit('round:start', { 
      roundType, 
      roundName: ROUND_NAMES[roundType]
    });

    // Auto-award cards based on points or position if starting a new round
    if (roundType === 'speed') {
      // Auto-award cards to top players after Round 1
      const sortedPlayers = [...players].sort((a, b) => b.points - a.points);
      
      // Top player gets a card
      if (sortedPlayers.length > 0) {
        dispatch({ type: 'AWARD_CARD', playerId: sortedPlayers[0].id, cardType: 'turbo' });
        addEvent(`${sortedPlayers[0].name} otrzymuje kartę Turbo za najlepszy wynik w Rundzie 1`);
      }
      
      // Player with lowest points gets a "Na Ratunek" card
      if (sortedPlayers.length > 1) {
        dispatch({ type: 'AWARD_CARD', playerId: sortedPlayers[sortedPlayers.length - 1].id, cardType: 'reanimacja' });
        addEvent(`${sortedPlayers[sortedPlayers.length - 1].name} otrzymuje kartę Reanimacja (Na Ratunek)`);
      }
    }
    
    if (roundType === 'wheel') {
      // Award cards to players who advanced from Round 2
      players.filter(p => !p.eliminated).forEach(player => {
        dispatch({ type: 'AWARD_CARD', playerId: player.id, cardType: 'dejavu' });
        addEvent(`${player.name} otrzymuje kartę Dejavu za awans do Rundy 3`);
      });
    }
  };
  
  const handleEndRound = () => {
    dispatch({ type: 'END_ROUND' });
    setShowResults(true);
    setResultType('round');
    
    // Emit the round:end event
    emit('round:end', { roundType: currentRound });
    
    // Auto advance top 5 players to next round logic would be here
    // For now, just display results
    addEvent("Runda zakończona. Wyświetlanie wyników...");
    toast.info('Runda zakończona. Wyświetlanie wyników...');
  };

  const handleEndGame = () => {
    setShowResults(true);
    setResultType('final');
    
    // Find the winner
    const winner = [...players].sort((a, b) => b.points - a.points)[0];
    if (winner) {
      // Emit the confetti animation for the winner
      emit('overlay:confetti', { playerId: winner.id });
    }
    
    addEvent("Gra zakończona! Wyświetlanie końcowych wyników...");
    toast.success('Gra zakończona! Wyświetlanie końcowych wyników...');
  };
  
  const handleSelectQuestion = (question: Question) => {
    dispatch({ type: 'SET_CURRENT_QUESTION', question });
    
    // Emit the question:show event
    emit('question:show', { question });
    
    addEvent(`Wybrano pytanie: ${question.text.substring(0, 30)}...`);
  };
  
  const handleAnswerQuestion = (isCorrect: boolean, answerIndex: number) => {
    if (activePlayerId) {
      const activePlayer = state.players.find(p => p.id === activePlayerId);
      if (activePlayer) {
        dispatch({ type: 'ANSWER_QUESTION', playerId: activePlayer.id, isCorrect });
        
        // Update the last answer state
        setLastAnswerWasIncorrect(!isCorrect);
        
        // If the answer was incorrect and this is round 2 or 3, player may lose a life
        if (!isCorrect && (currentRound === 'speed' || currentRound === 'wheel')) {
          // Check if player is eliminated
          const updatedPlayer = state.players.find(p => p.id === activePlayerId);
          if (updatedPlayer && updatedPlayer.lives <= 0) {
            // Emit player elimination event
            emit('player:eliminate', { playerId: activePlayerId });
          }
        }
        
        // Emit the player update event
        const updatedPlayer = state.players.find(p => p.id === activePlayerId);
        if (updatedPlayer) {
          emit('player:update', { player: updatedPlayer });
        }
        
        // Emit the answer event
        emit('question:answer', {
          playerId: activePlayerId,
          correct: isCorrect,
          answerIndex
        });
        
        addEvent(`${activePlayer.name} odpowiedział ${isCorrect ? 'poprawnie' : 'niepoprawnie'}`);
      }
    }
  };
  
  const handleSpinWheel = () => {
    dispatch({ type: 'SPIN_WHEEL', spinning: true });
    toast('Koło fortuny się kręci...');
    addEvent("Koło fortuny się kręci...");
  };
  
  const handleWheelSpinEnd = () => {
    dispatch({ type: 'SPIN_WHEEL', spinning: false });
  };
  
  const handleSelectCategory = (category: string) => {
    dispatch({ type: 'SET_CATEGORY', category });
    
    // Emit the category selection
    emit('overlay:update', { 
      category,
      difficulty: 10 // Default difficulty
    });
    
    toast.success(`Wylosowano kategorię: ${category}`);
    addEvent(`Wylosowano kategorię: ${category}`);
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
      
      // Emit player reset event
      emit('player:reset', {});
      
      addEvent("Gra została zresetowana");
      toast.info('Gra została zresetowana');
    }
  };
  
  const handleUseCard = (playerId: string, cardType: CardType) => {
    const player = players.find(p => p.id === playerId);
    if (!player) return;
    
    // Process card effects based on card type
    dispatch({ type: 'USE_CARD', playerId, cardType });
    
    // Emit the card:use event
    emit('card:use', {
      playerId,
      cardType
    });
    
    // Play card activation sound
    playCardSound(cardType);
    
    // Special card effects handling
    switch (cardType) {
      case 'dejavu':
        // Allow player to repeat the current question
        addEvent(`${player.name} użył karty Dejavu - powtarza pytanie`);
        toast.success(`${player.name} użył karty Dejavu - powtarza pytanie`);
        
        // Reset last answer state to allow another attempt
        setLastAnswerWasIncorrect(false);
        break;
        
      case 'kontra':
        // Pass the question to another player
        addEvent(`${player.name} użył karty Kontra - możliwość przekazania pytania`);
        toast.success(`${player.name} użył karty Kontra - wybierz gracza do przejęcia pytania`);
        
        // Set up the UI to select a target player
        setQuestionTransferTarget('pending');
        break;
        
      case 'reanimacja':
        // Prevent life loss in Round 2
        // Logic is already in the reducer when answering question
        addEvent(`${player.name} użył karty Reanimacja - zapobiega utracie życia`);
        toast.success(`${player.name} użył karty Reanimacja - zapobiega utracie życia`);
        break;
        
      case 'turbo':
        // Double points for correct answer
        // Logic already in the reducer
        addEvent(`${player.name} użył karty Turbo - podwójne punkty za poprawną odpowiedź`);
        toast.success(`${player.name} użył karty Turbo - podwójne punkty za poprawną odpowiedź`);
        break;
        
      case 'refleks2':
        // Double answer time
        addEvent(`${player.name} użył karty Refleks x2 - podwójny czas na odpowiedź`);
        toast.success(`${player.name} użył karty Refleks x2 - podwójny czas na odpowiedź`);
        break;
        
      case 'refleks3':
        // Triple answer time
        addEvent(`${player.name} użył karty Refleks x3 - potrójny czas na odpowiedź`);
        toast.success(`${player.name} użył karty Refleks x3 - potrójny czas na odpowiedź`);
        break;
        
      default:
        addEvent(`${player.name} użył karty ${cardType}`);
        toast(`${player.name} użył karty ${cardType}`);
    }
    
    // Emit card:resolve after a delay to simulate server confirmation
    setTimeout(() => {
      emit('card:resolve', {
        playerId,
        cardType,
        success: true
      });
    }, 500);
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
    
    // Emit player update event
    emit('player:update', { player: newPlayer });
    
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
    
    // Update the player
    const updatedPlayer = players.find(p => p.id === playerId);
    if (updatedPlayer) {
      emit('player:update', { player: updatedPlayer });
    }
    
    addEvent(`Dodano testowe karty dla gracza`);
  };

  // Update timer on all clients
  useEffect(() => {
    if (currentTime !== undefined) {
      emit('overlay:update', {
        timeRemaining: currentTime
      });
    }
  }, [currentTime, emit]);

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
  const gameControlContext: GameControlContext = {
    activePlayerId,
    canStartRound,
    canEndRound,
    isRoundActive,
    handleSelectPlayer,
    handleStartRound,
    handleEndRound,
    handleEndGame,
    handleSelectQuestion,
    handleAnswerQuestion,
    handleSpinWheel,
    handleWheelSpinEnd,
    handleSelectCategory,
    handleSkipQuestion,
    handlePause,
    handleResetGame,
    handleUseCard,
    handleAddPlayer,
    handleAddTestCards
  };

  // Return GameLayout with gameControl prop
  return <GameLayout gameControl={gameControlContext} />;
}

export default GameController;
