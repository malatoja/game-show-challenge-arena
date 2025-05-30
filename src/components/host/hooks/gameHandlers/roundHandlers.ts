
import { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { RoundType } from '@/types/gameTypes';
import { useEvents } from '../../EventsContext';
import { useTimer } from '../../TimerContext';
import { useSocket } from '@/context/SocketContext';
import { toast } from 'sonner';
import { ROUND_NAMES } from '@/constants/gameConstants';
import { getRandomCardForAction, loadCardRules } from '@/utils/gameUtils';

export function useRoundHandlers() {
  const { state, dispatch } = useGame();
  const { addEvent } = useEvents();
  const { resetTimer, setTimerForRound } = useTimer();
  const { emit } = useSocket();
  
  const [showResults, setShowResults] = useState<boolean>(false);
  const [resultType, setResultType] = useState<'round' | 'final'>('round');

  // Calculate round state for UI - use roundActive instead of roundStarted/roundEnded
  const isRoundActive = state.roundActive;
  const canStartRound = !state.roundActive;
  const canEndRound = state.roundActive;
  
  const handleStartRound = (roundType: RoundType) => {
    // Load card rules
    const cardRules = loadCardRules();
    
    // Reset all players' active state before starting a new round
    state.players.forEach(player => {
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
      // Find the rule for top points
      const topPointsRule = cardRules.find(rule => 
        rule.name.toLowerCase().includes('top') || 
        rule.condition === 'top_player' || 
        rule.id === 'topPoints'
      );
      
      // Auto-award cards to top players after Round 1
      if (topPointsRule && topPointsRule.isEnabled) {
        const sortedPlayers = [...state.players].sort((a, b) => b.points - a.points);
        
        // Top player gets a card if the rule is enabled
        if (sortedPlayers.length > 0) {
          const randomCard = getRandomCardForAction('correctAnswer');
          dispatch({ type: 'AWARD_CARD', playerId: sortedPlayers[0].id, cardType: randomCard });
          addEvent(`${sortedPlayers[0].name} otrzymuje kartę za najlepszy wynik w Rundzie 1`);
        }
        
        // Find the rule for lowest points
        const lowestPointsRule = cardRules.find(rule => 
          rule.name.toLowerCase().includes('lowest') || 
          rule.condition === 'lowest_points' || 
          rule.id === 'lowestPoints'
        );
        
        // Player with lowest points gets a "Na Ratunek" card if the rule is enabled
        if (sortedPlayers.length > 1 && lowestPointsRule && lowestPointsRule.isEnabled) {
          const rescueCard = getRandomCardForAction('wrongAnswer');
          dispatch({ type: 'AWARD_CARD', playerId: sortedPlayers[sortedPlayers.length - 1].id, cardType: rescueCard });
          addEvent(`${sortedPlayers[sortedPlayers.length - 1].name} otrzymuje kartę pomocy`);
        }
      }
    }
    
    if (roundType === 'wheel') {
      // Find the rule for advancing rounds
      const advanceRoundRule = cardRules.find(rule => 
        rule.name.toLowerCase().includes('advance') || 
        rule.condition === 'advance_round' || 
        rule.id === 'advanceRound'
      );
      
      // Award cards to players who advanced from Round 2
      if (advanceRoundRule && advanceRoundRule.isEnabled) {
        state.players.filter(p => !p.eliminated).forEach(player => {
          const randomCard = getRandomCardForAction('roundComplete');
          dispatch({ type: 'AWARD_CARD', playerId: player.id, cardType: randomCard });
          addEvent(`${player.name} otrzymuje kartę za awans do Rundy 3`);
        });
      }
    }
  };
  
  const handleEndRound = () => {
    dispatch({ type: 'END_ROUND' });
    setShowResults(true);
    setResultType('round');
    
    // Emit the round:end event
    emit('round:end', { roundType: state.currentRound });
    
    // Auto advance top 5 players to next round logic would be here
    // For now, just display results
    addEvent("Runda zakończona. Wyświetlanie wyników...");
    toast.info('Runda zakończona. Wyświetlanie wyników...');
  };

  const handleEndGame = () => {
    setShowResults(true);
    setResultType('final');
    
    // Find the winner
    const winner = [...state.players].sort((a, b) => b.points - a.points)[0];
    if (winner) {
      // Emit the confetti animation for the winner
      emit('overlay:confetti', { playerId: winner.id });
    }
    
    addEvent("Gra zakończona! Wyświetlanie końcowych wyników...");
    toast.success('Gra zakończona! Wyświetlanie końcowych wyników...');
  };
  
  // Add the reset round function
  const handleResetRound = () => {
    // First confirm with the user
    if (confirm('Czy na pewno chcesz zresetować obecną rundę? To przywróci stan rundy bez zmiany punktacji graczy.')) {
      // Keep the current round type
      const currentRoundType = state.currentRound;
      
      // Reset the timer for this round
      setTimerForRound(currentRoundType);
      
      // Dispatch actions to reset the round state
      dispatch({ type: 'RESET_ROUND' });
      
      // Reset the active player
      dispatch({ type: 'SET_ACTIVE_PLAYER', playerId: '' });
      
      // Emit the round:reset event - we'll use a string literal here since it seems "round:reset" is not in the SocketEvent type
      // You might want to add this to your socket event types later
      emit('round:reset' as any, { roundType: currentRoundType });
      
      addEvent(`Zresetowano rundę ${ROUND_NAMES[currentRoundType]}`);
      toast.info(`Runda ${ROUND_NAMES[currentRoundType]} została zresetowana`);
    }
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

  return {
    showResults,
    resultType,
    canStartRound,
    canEndRound,
    isRoundActive,
    handleStartRound,
    handleEndRound,
    handleEndGame,
    handleResetGame,
    handleResetRound,
    setShowResults
  };
}

