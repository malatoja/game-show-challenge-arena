
import { GameState, PlayerId } from '../../types/gameTypes';
import { toast } from 'sonner';
import { checkForReward } from '../../lib/cardRewardsManager';
import { createCard } from '../../constants/gameConstants';
import { playSound } from '../../lib/soundService';

export const handleAnswerQuestion = (
  state: GameState,
  playerId: PlayerId,
  isCorrect: boolean
): GameState => {
  const playerIndex = state.players.findIndex((p) => p.id === playerId);
  if (playerIndex === -1) return state;

  try {
    // Create a copy of the players array
    const updatedPlayers = [...state.players];
    const updatedPlayer = { ...updatedPlayers[playerIndex] };

    // Calculate points based on the current round
    let pointsToAdd = 0;
    let livesToDeduct = 0;

    // Check for card effects that might modify points or lives
    const hasReanimationCard = updatedPlayer.cards.some(
      (card) => card.type === 'reanimacja' && !card.isUsed
    );
    const hasTurboCard = updatedPlayer.cards.some(
      (card) => card.type === 'turbo' && !card.isUsed
    );

    if (isCorrect) {
      // For correct answers - add points
      switch (state.currentRound) {
        case 'knowledge':
          pointsToAdd = 10;
          break;
        case 'speed':
          pointsToAdd = 20;
          break;
        case 'wheel':
          pointsToAdd = 30;
          break;
        default:
          pointsToAdd = 10;
      }

      // Apply turbo card effect for double points
      if (hasTurboCard) {
        pointsToAdd *= 2;
      }

      // Update consecutive correct answers count
      updatedPlayer.consecutiveCorrect = (updatedPlayer.consecutiveCorrect || 0) + 1;

      // Check for reward eligibility
      const reward = checkForReward(updatedPlayer, 'consecutiveCorrect');
      if (reward) {
        const newCard = createCard(reward.cardType);
        updatedPlayer.cards = [...updatedPlayer.cards, newCard];
        toast.success(`${updatedPlayer.name} otrzymuje kartę ${newCard.name} ${reward.message}`);
        playSound('reward');
      }

      // Update player's points and state
      updatedPlayer.points += pointsToAdd;
      toast.success(`${updatedPlayer.name} odpowiedział poprawnie! +${pointsToAdd} punktów`);
    } else {
      // For incorrect answers - deduct lives in speed round
      if (state.currentRound === 'speed') {
        livesToDeduct = 1;

        // Check for reanimation card to prevent life loss
        if (hasReanimationCard) {
          // Find the reanimation card and mark it as used
          const reanimationCardIndex = updatedPlayer.cards.findIndex(
            (card) => card.type === 'reanimacja' && !card.isUsed
          );
          if (reanimationCardIndex >= 0) {
            updatedPlayer.cards = updatedPlayer.cards.map((card, index) => {
              if (index === reanimationCardIndex) {
                return { ...card, isUsed: true };
              }
              return card;
            });
            livesToDeduct = 0;
            toast.info(`${updatedPlayer.name} użył karty Reanimacja! Życie zostało zachowane.`);
          }
        }

        // Apply life deduction if needed
        if (livesToDeduct > 0) {
          updatedPlayer.lives = Math.max(0, updatedPlayer.lives - livesToDeduct);
          if (updatedPlayer.lives === 0) {
            updatedPlayer.eliminated = true;
            toast.error(`${updatedPlayer.name} został wyeliminowany!`);
          } else {
            toast.error(`${updatedPlayer.name} odpowiedział niepoprawnie! Utrata życia.`);
          }
        }
      } else {
        toast.error(`${updatedPlayer.name} odpowiedział niepoprawnie!`);
      }

      // Reset consecutive correct counter
      updatedPlayer.consecutiveCorrect = 0;
    }

    // Update the player in the players array
    updatedPlayers[playerIndex] = updatedPlayer;

    // Check if this was the last player for this round and all have answered
    const allAnswered = state.currentRound === 'knowledge' && 
                        updatedPlayers.every(p => p.eliminated || p.consecutiveCorrect !== undefined);
    
    if (allAnswered) {
      // Check for top scorer reward
      const maxPoints = Math.max(...updatedPlayers.map(p => p.points));
      const topScorers = updatedPlayers.filter(p => p.points === maxPoints && !p.eliminated);
      
      // Award a card to the top scorer(s)
      topScorers.forEach(scorer => {
        const reward = checkForReward(scorer, 'topScore', { 
          round: state.currentRound, 
          players: updatedPlayers 
        });
        
        if (reward) {
          const playerIndex = updatedPlayers.findIndex(p => p.id === scorer.id);
          if (playerIndex >= 0) {
            const newCard = createCard(reward.cardType);
            updatedPlayers[playerIndex].cards = [...updatedPlayers[playerIndex].cards, newCard];
            toast.success(`${scorer.name} otrzymuje kartę ${newCard.name} ${reward.message}`);
            playSound('reward');
          }
        }
      });
      
      // Check for last place player ("Na ratunek")
      const activePlayers = updatedPlayers.filter(p => !p.eliminated);
      if (activePlayers.length > 1) {
        const minPoints = Math.min(...activePlayers.map(p => p.points));
        const lastPlacePlayer = activePlayers.find(p => p.points === minPoints);
        
        if (lastPlacePlayer) {
          const reward = checkForReward(lastPlacePlayer, 'lastPlace', {
            round: state.currentRound,
            players: updatedPlayers
          });
          
          if (reward) {
            const playerIndex = updatedPlayers.findIndex(p => p.id === lastPlacePlayer.id);
            if (playerIndex >= 0) {
              const newCard = createCard(reward.cardType);
              updatedPlayers[playerIndex].cards = [...updatedPlayers[playerIndex].cards, newCard];
              toast.success(`${lastPlacePlayer.name} otrzymuje kartę ${newCard.name} ${reward.message}`);
              playSound('reward');
            }
          }
        }
      }
    }

    // Mark question as used
    const updatedCurrentQuestion = state.currentQuestion
      ? { ...state.currentQuestion, used: true }
      : undefined;

    return {
      ...state,
      players: updatedPlayers,
      currentQuestion: updatedCurrentQuestion,
    };
  } catch (error) {
    console.error('Error handling question answer:', error);
    toast.error('Failed to process answer');
    return state;
  }
};
