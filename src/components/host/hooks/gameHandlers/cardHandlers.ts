
import { useGame } from '@/context/GameContext';
import { CardType } from '@/types/gameTypes';
import { useEvents } from '../../EventsContext';
import { useSocket } from '@/context/SocketContext';
import { toast } from 'sonner';
import { playCardSound } from '@/lib/soundService';

export function useCardHandlers() {
  const { state, dispatch } = useGame();
  const { addEvent } = useEvents();
  const { emit } = useSocket();

  // Helper function to get custom action animation if available
  const getCustomActionAnimation = (actionType: string, cardType?: CardType): string | undefined => {
    try {
      // In a real implementation, this would check localStorage or another source for custom animations
      const storedActions = localStorage.getItem('gameActionAnimations');
      if (storedActions) {
        const actions = JSON.parse(storedActions);
        const action = actions.find((a: any) => 
          a.triggerType === actionType && 
          (actionType !== 'card_use' || a.cardType === cardType)
        );
        
        return action?.animationUrl;
      }
    } catch (error) {
      console.error('Error getting custom action animation:', error);
    }
    return undefined;
  };

  const handleUseCard = (playerId: string, cardType: CardType) => {
    const player = state.players.find(p => p.id === playerId);
    if (!player) return;
    
    // Process card effects based on card type
    dispatch({ type: 'USE_CARD', playerId, cardType });
    
    // Check if there's a custom animation for this card
    const customAnimation = getCustomActionAnimation('card_use', cardType);
    
    // Emit the card:use event with animation data if available
    // Use type assertion to include animationUrl in the event data
    emit('card:use', {
      playerId,
      cardType,
      animationUrl: customAnimation
    } as { playerId: string; cardType: CardType; animationUrl?: string });
    
    // Play card activation sound
    playCardSound(cardType);
    
    // Special card effects handling
    switch (cardType) {
      case 'dejavu':
        // Allow player to repeat the current question
        addEvent(`${player.name} użył karty Dejavu - powtarza pytanie`);
        toast.success(`${player.name} użył karty Dejavu - powtarza pytanie`);
        break;
        
      case 'kontra':
        // Pass the question to another player
        addEvent(`${player.name} użył karty Kontra - możliwość przekazania pytania`);
        toast.success(`${player.name} użył karty Kontra - wybierz gracza do przejęcia pytania`);
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

  return {
    handleUseCard
  };
}
