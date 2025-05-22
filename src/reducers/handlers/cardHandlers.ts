
import { GameState, PlayerId, CardType } from '../../types/gameTypes';
import { toast } from 'sonner';
import { createCard } from '../../constants/gameConstants';

// Card management
export const handleUseCard = (state: GameState, playerId: PlayerId, cardType: CardType): GameState => {
  const playerIndex = state.players.findIndex(p => p.id === playerId);
  if (playerIndex === -1) return state;
  
  const cardIndex = state.players[playerIndex].cards.findIndex(
    card => card.type === cardType && !card.isUsed
  );
  
  if (cardIndex === -1) return state;
  
  try {
    // Create a deep copy of the players array
    const updatedPlayers = [...state.players];
    const updatedCards = [...updatedPlayers[playerIndex].cards];
    
    // Mark the card as used
    updatedCards[cardIndex] = {
      ...updatedCards[cardIndex],
      isUsed: true
    };
    
    // Update the player's cards
    updatedPlayers[playerIndex] = {
      ...updatedPlayers[playerIndex],
      cards: updatedCards
    };
    
    toast(`${updatedPlayers[playerIndex].name} użył karty ${cardType}!`);
    
    return {
      ...state,
      players: updatedPlayers
    };
  } catch (error) {
    console.error('Error using card:', error);
    toast.error('Failed to use card');
    return state;
  }
};

export const handleAwardCard = (state: GameState, playerId: PlayerId, cardType: CardType): GameState => {
  const player = state.players.find(p => p.id === playerId);
  if (!player) return state;
  
  try {
    const newCard = createCard(cardType, `Karta ${cardType}`);
    
    toast.success(`${player.name} otrzymuje kartę ${cardType}!`);
    
    return {
      ...state,
      players: state.players.map(p => {
        if (p.id === playerId) {
          return {
            ...p,
            cards: [...p.cards, newCard]
          };
        }
        return p;
      })
    };
  } catch (error) {
    console.error('Error awarding card:', error);
    toast.error('Failed to award card');
    return state;
  }
};
