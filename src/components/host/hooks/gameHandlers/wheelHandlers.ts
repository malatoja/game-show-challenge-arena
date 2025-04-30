
import { useGame } from '@/context/GameContext';
import { useEvents } from '../../EventsContext';
import { toast } from 'sonner';
import { useSocket } from '@/context/SocketContext';

export function useWheelHandlers() {
  const { dispatch } = useGame();
  const { addEvent } = useEvents();
  const { emit } = useSocket();

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

  return {
    handleSpinWheel,
    handleWheelSpinEnd,
    handleSelectCategory
  };
}
