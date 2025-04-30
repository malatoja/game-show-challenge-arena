
import { useEvents } from '../../EventsContext';
import { toast } from 'sonner';

export function useUtilHandlers() {
  const { addEvent } = useEvents();

  const handlePause = () => {
    addEvent("Gra wstrzymana");
    toast.info("Gra wstrzymana");
  };

  return {
    handlePause
  };
}
