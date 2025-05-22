
import { useEvents } from '../../EventsContext';
import { toast } from 'sonner';
import { useGame } from '@/context/GameContext';

export function useUtilHandlers() {
  const { addEvent } = useEvents();
  const { dispatch } = useGame();

  const handlePause = () => {
    addEvent("Gra wstrzymana");
    toast.info("Gra wstrzymana");
  };

  const handleEndGame = () => {
    addEvent("Gra zakończona");
    toast.info("Gra zakończona");
    dispatch({ type: 'RESTART_GAME' });
  };

  const handleResetGame = () => {
    if (confirm("Czy na pewno chcesz zresetować grę? Wszystkie postępy zostaną utracone.")) {
      addEvent("Gra zresetowana");
      toast.info("Gra zresetowana");
      dispatch({ type: 'RESTART_GAME' });
    }
  };

  return {
    handlePause,
    handleEndGame,
    handleResetGame
  };
}
