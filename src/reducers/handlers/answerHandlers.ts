
import { GameState, PlayerId, CardType } from '../../types/gameTypes';
import { toast } from 'sonner';
import { loadCardRules, shouldAwardBonusCard } from '../../utils/gameUtils';
import { createCard } from '../../constants/gameConstants';

// This function handles the answer question logic separately
export const handleAnswerQuestion = (state: GameState, playerId: PlayerId, isCorrect: boolean): GameState => {
  const activePlayer = state.players.find(p => p.id === playerId);
  if (!activePlayer) return state;
  
  try {
    let pointsToAdd = isCorrect ? 10 : 0;
    let newLives = activePlayer.lives;
    let awardCard = false;
    let cardType: CardType = 'dejavu';
    
    // Load card rules
    const cardRules = loadCardRules();
    
    // Check if player has used turbo card
    const turboCardUsed = activePlayer.cards.some(card => 
      card.type === 'turbo' && !card.isUsed);
    
    if (turboCardUsed && isCorrect) {
      pointsToAdd *= 2;
    }
    
    // Handle lives based on round
    if (state.currentRound === 'speed' && !isCorrect) {
      // Check if player has used reanimacja card
      const reanimationCardUsed = activePlayer.cards.some(card => 
        card.type === 'reanimacja' && !card.isUsed);
      
      if (!reanimationCardUsed) {
        newLives -= 1;
      }
    }
    
    // Track consecutive correct answers
    let consecutiveCorrect = activePlayer.consecutiveCorrect || 0;
    
    if (isCorrect) {
      consecutiveCorrect++;
      
      // Check if player should be awarded a card based on rules
      const { award, cardType: awardedCardType } = shouldAwardBonusCard(
        consecutiveCorrect,
        50, // points threshold
        activePlayer.points + pointsToAdd,
        state.currentRound,
        cardRules
      );
      
      if (award) {
        awardCard = true;
        cardType = awardedCardType;
        consecutiveCorrect = 0; // Reset counter
      }
      
      // Award turbo card if player reaches 50+ points in Round 1 if rule is enabled
      if (cardRules.pointsThreshold !== false && 
          state.currentRound === 'knowledge' && 
          activePlayer.points + pointsToAdd >= 50 && 
          !activePlayer.cards.some(c => c.type === 'turbo')) {
        awardCard = true;
        cardType = 'turbo';
      }
    } else {
      consecutiveCorrect = 0; // Reset on wrong answer
    }
    
    // Toast notification
    if (isCorrect) {
      toast.success(`${activePlayer.name} odpowiedział poprawnie! +${pointsToAdd} punktów`);
    } else {
      if (newLives < activePlayer.lives) {
        toast.error(`${activePlayer.name} odpowiedział błędnie! -1 życie`);
      } else {
        toast.error(`${activePlayer.name} odpowiedział błędnie!`);
      }
    }
    
    // Prepare updated player state
    let updatedPlayers = state.players.map(player => {
      if (player.id === playerId) {
        return {
          ...player,
          points: player.points + pointsToAdd,
          lives: newLives,
          eliminated: newLives <= 0,
          consecutiveCorrect: consecutiveCorrect,
          cards: player.cards.map(card => {
            if ((card.type === 'turbo' || card.type === 'reanimacja') && !card.isUsed) {
              return { ...card, isUsed: true };
            }
            return card;
          })
        };
      }
      return player;
    });
    
    // Award card if conditions met and player doesn't have max cards
    if (awardCard) {
      const playerToAwardIndex = updatedPlayers.findIndex(p => p.id === playerId);
      if (playerToAwardIndex !== -1) {
        const player = updatedPlayers[playerToAwardIndex];
        const unusedCards = player.cards.filter(c => !c.isUsed).length;
        
        // Only add if player doesn't have max cards (3)
        if (unusedCards < 3) {
          const newCard = createCard(cardType);
          updatedPlayers[playerToAwardIndex] = {
            ...updatedPlayers[playerToAwardIndex],
            cards: [...player.cards, newCard]
          };
          
          toast.success(`${activePlayer.name} otrzymuje kartę ${newCard.name}!`);
        }
      }
    }
    
    return {
      ...state,
      players: updatedPlayers
    };
  } catch (error) {
    console.error('Error handling question answer:', error);
    toast.error('Failed to process answer');
    return state;
  }
};
