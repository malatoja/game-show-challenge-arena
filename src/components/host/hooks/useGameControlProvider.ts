
import { useState, useCallback } from 'react';
import { useGame } from '@/context/GameContext';
import { useEvents } from '../EventsContext';
import { useSocket } from '@/context/SocketContext';
import { useTimer } from '../TimerContext';
import { Player, CardType, Question, RoundType } from '@/types/gameTypes';
import { toast } from 'sonner';
import { ROUND_NAMES } from '@/constants/gameConstants';
import { GameControlContextType } from '../context/GameControlContext';

export function useGameControlProvider(): GameControlContextType {
  const { state, dispatch } = useGame();
  const { addEvent } = useEvents();
  const { emit } = useSocket();
  const { resetTimer } = useTimer();

  // States
  const [showResults, setShowResults] = useState<boolean>(false);
  const [resultType, setResultType] = useState<'round' | 'final'>('round');
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null);
  const [extensionFactor, setExtensionFactor] = useState(1);
  
  // Calculate round state for UI
  const isRoundActive = state.roundStarted && !state.roundEnded;
  const canStartRound = !state.roundStarted && !state.roundEnded;
  const canEndRound = state.roundStarted && !state.roundEnded;

  // Player handlers
  const handleSelectPlayer = useCallback((player: Player) => {
    dispatch({ type: 'SET_ACTIVE_PLAYER', playerId: player.id });
    setActivePlayerId(player.id);
    addEvent(`Wybrano gracza: ${player.name}`);
  }, [dispatch, addEvent]);
  
  const handleAddPlayer = useCallback(() => {
    const playerNumber = state.players.length + 1;
    const newPlayer: Player = {
      id: `player-${Date.now()}`,
      name: `Gracz ${playerNumber}`,
      lives: 3,
      points: 0,
      cards: [],
      isActive: state.players.length === 0,
      eliminated: false
    };
    
    dispatch({ type: 'ADD_PLAYER', player: newPlayer });
    toast.success(`Dodano gracza: ${newPlayer.name}`);
    addEvent(`Dodano gracza: ${newPlayer.name}`);
  }, [state.players.length, dispatch, addEvent]);

  // Round handlers
  const handleStartRound = useCallback((roundType: RoundType) => {
    // Reset all players' active state before starting a new round
    state.players.forEach(player => {
      if (player.isActive) {
        dispatch({ type: 'SET_ACTIVE_PLAYER', playerId: '' });
      }
    });
    
    dispatch({ type: 'START_ROUND', roundType });
    resetTimer();
    toast.success(`Rozpoczęto rundę: ${ROUND_NAMES[roundType]}`);
    addEvent(`Rozpoczęto rundę: ${ROUND_NAMES[roundType]}`);
  }, [state.players, dispatch, resetTimer, addEvent]);
  
  const handleEndRound = useCallback(() => {
    dispatch({ type: 'END_ROUND' });
    setShowResults(true);
    setResultType('round');
    toast.info('Runda zakończona. Wyświetlanie wyników...');
    addEvent('Runda zakończona');
  }, [dispatch, addEvent]);

  const handleEndGame = useCallback(() => {
    setShowResults(true);
    setResultType('final');
    toast.success('Gra zakończona! Wyświetlanie końcowych wyników...');
    addEvent('Gra zakończona');
  }, [addEvent]);
  
  const handleResetGame = useCallback(() => {
    if (confirm('Czy na pewno chcesz zresetować grę? Wszystkie postępy zostaną utracone.')) {
      dispatch({ type: 'RESTART_GAME' });
      setShowResults(false);
      toast.info('Gra została zresetowana');
      addEvent('Gra została zresetowana');
    }
  }, [dispatch, addEvent]);

  // Question handlers
  const handleSelectQuestion = useCallback((question: Question) => {
    dispatch({ type: 'SET_CURRENT_QUESTION', question });
    toast(`Wybrano pytanie: ${question.text.substring(0, 30)}...`);
    addEvent(`Wybrano pytanie: ${question.text.substring(0, 30)}...`);
  }, [dispatch, addEvent]);
  
  const handleAnswerQuestion = useCallback((isCorrect: boolean, answerIndex: number) => {
    if (!activePlayerId) return;
    
    const activePlayer = state.players.find(p => p.id === activePlayerId);
    if (activePlayer) {
      dispatch({ type: 'ANSWER_QUESTION', playerId: activePlayer.id, isCorrect });
      // Reset extension factor after question is answered
      setExtensionFactor(1);
      
      addEvent(`${activePlayer.name} odpowiedział ${isCorrect ? 'poprawnie' : 'niepoprawnie'}`);
    }
  }, [activePlayerId, state.players, dispatch, addEvent]);

  const handleSkipQuestion = useCallback(() => {
    addEvent("Pytanie pominięte");
    toast.info("Pytanie pominięte");
    
    // Mark current question as used if we have one
    if (state.currentQuestion) {
      dispatch({ type: 'MARK_QUESTION_USED', questionId: state.currentQuestion.id });
    }
  }, [state.currentQuestion, dispatch, addEvent]);

  // Wheel handlers
  const handleSpinWheel = useCallback(() => {
    dispatch({ type: 'SPIN_WHEEL', spinning: true });
    toast('Koło fortuny się kręci...');
    addEvent("Koło fortuny się kręci...");
  }, [dispatch, addEvent]);
  
  const handleWheelSpinEnd = useCallback(() => {
    dispatch({ type: 'SPIN_WHEEL', spinning: false });
  }, [dispatch]);
  
  const handleSelectCategory = useCallback((category: string) => {
    dispatch({ type: 'SET_CATEGORY', category });
    toast.success(`Wylosowano kategorię: ${category}`);
    addEvent(`Wylosowano kategorię: ${category}`);
  }, [dispatch, addEvent]);

  // Card handlers
  const handleUseCard = useCallback((playerId: string, cardType: CardType) => {
    dispatch({ type: 'USE_CARD', playerId, cardType });
    
    // Handle special card effects
    if (cardType === 'refleks2') {
      setExtensionFactor(2);
    } else if (cardType === 'refleks3') {
      setExtensionFactor(3);
    }
    
    addEvent(`Użyto karty: ${cardType}`);
  }, [dispatch, addEvent]);
  
  const handleAddTestCards = useCallback((playerId: string) => {
    // Add one of each card type for testing
    const cardTypes: CardType[] = [
      'dejavu', 'kontra', 'reanimacja', 'skip', 
      'turbo', 'refleks2', 'refleks3', 'lustro', 'oswiecenie'
    ];
    
    cardTypes.forEach(cardType => {
      dispatch({ type: 'AWARD_CARD', playerId, cardType });
    });
    
    addEvent(`Dodano testowe karty dla gracza`);
  }, [dispatch, addEvent]);

  // Utility handlers
  const handlePause = useCallback(() => {
    addEvent("Pauza");
    toast.info("Pauza");
  }, [addEvent]);

  return {
    // States
    activePlayerId,
    canStartRound,
    canEndRound,
    isRoundActive,
    showResults,
    resultType,
    setShowResults,

    // Handlers
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
    handleAddTestCards,
  };
}
