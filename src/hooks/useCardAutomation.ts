
import { useCallback, useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import { CardType } from '@/types/gameTypes';
import { getRandomCardForAction } from '@/utils/gameUtils';
import { toast } from 'sonner';

interface CardAutomationRules {
  correctAnswerReward: boolean;
  wrongAnswerPenalty: boolean;
  roundAdvancementReward: boolean;
  eliminationProtection: boolean;
  topPlayerBonus: boolean;
  lastPlaceHelp: boolean;
}

export function useCardAutomation() {
  const { state, dispatch } = useGame();
  
  const defaultRules: CardAutomationRules = {
    correctAnswerReward: true,
    wrongAnswerPenalty: false,
    roundAdvancementReward: true,
    eliminationProtection: true,
    topPlayerBonus: true,
    lastPlaceHelp: true
  };

  const awardCard = useCallback((playerId: string, cardType: CardType, reason: string) => {
    dispatch({ type: 'AWARD_CARD', playerId, cardType });
    
    const player = state.players.find(p => p.id === playerId);
    if (player) {
      toast.success(`${player.name} otrzymał kartę ${cardType} - ${reason}`);
    }
  }, [dispatch, state.players]);

  // Auto-award cards based on correct answers
  const handleCorrectAnswer = useCallback((playerId: string) => {
    if (!defaultRules.correctAnswerReward) return;
    
    const player = state.players.find(p => p.id === playerId);
    if (!player) return;

    // Award card every 3 correct answers in knowledge round
    if (state.currentRound === 'knowledge' && (player.consecutiveCorrect || 0) % 3 === 2) {
      const cardType = getRandomCardForAction('correctAnswer');
      awardCard(playerId, cardType, 'za 3 poprawne odpowiedzi z rzędu');
    }
    
    // Award cards in speed round for fast answers
    if (state.currentRound === 'speed') {
      const cardType = getRandomCardForAction('speedBonus');
      awardCard(playerId, cardType, 'za szybką odpowiedź');
    }
  }, [state.currentRound, state.players, defaultRules.correctAnswerReward, awardCard]);

  // Auto-award cards for round advancement
  const handleRoundAdvancement = useCallback((roundType: string) => {
    if (!defaultRules.roundAdvancementReward) return;
    
    const activePlayers = state.players.filter(p => !p.eliminated);
    
    if (roundType === 'speed') {
      // Top 5 players advance and get cards
      const sortedPlayers = [...activePlayers].sort((a, b) => b.points - a.points);
      const topFive = sortedPlayers.slice(0, 5);
      
      topFive.forEach(player => {
        const cardType = getRandomCardForAction('roundComplete');
        awardCard(player.id, cardType, 'za awans do Rundy 2');
      });
    }
    
    if (roundType === 'wheel') {
      // All remaining players get cards for final round
      activePlayers.forEach(player => {
        const cardType = getRandomCardForAction('finalRound');
        awardCard(player.id, cardType, 'za awans do Rundy 3');
      });
    }
  }, [state.players, defaultRules.roundAdvancementReward, awardCard]);

  // Auto-award protection cards for low-performing players
  const handlePlayerProtection = useCallback(() => {
    if (!defaultRules.lastPlaceHelp) return;
    
    const activePlayers = state.players.filter(p => !p.eliminated);
    if (activePlayers.length < 3) return;
    
    const sortedPlayers = [...activePlayers].sort((a, b) => a.points - b.points);
    const lastPlace = sortedPlayers[0];
    
    // Give help card to last place player if they have significantly fewer points
    const averagePoints = activePlayers.reduce((sum, p) => sum + p.points, 0) / activePlayers.length;
    
    if (lastPlace.points < averagePoints * 0.5) {
      const helpCard = getRandomCardForAction('wrongAnswer');
      awardCard(lastPlace.id, helpCard, 'pomoc dla ostatniego miejsca');
    }
  }, [state.players, defaultRules.lastPlaceHelp, awardCard]);

  // Monitor game state for automation triggers
  useEffect(() => {
    if (state.roundActive) {
      const intervalId = setInterval(handlePlayerProtection, 60000); // Check every minute
      return () => clearInterval(intervalId);
    }
  }, [state.roundActive, handlePlayerProtection]);

  return {
    handleCorrectAnswer,
    handleRoundAdvancement,
    handlePlayerProtection,
    awardCard
  };
}
