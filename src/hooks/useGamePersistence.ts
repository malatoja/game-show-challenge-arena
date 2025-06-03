
import { useEffect, useCallback } from 'react';
import { useGame } from '@/context/GameContext';
import { GameService } from '@/lib/supabase/gameService';
import { toast } from 'sonner';

export function useGamePersistence() {
  const { state } = useGame();

  // Auto-save game state every 30 seconds
  const saveGameState = useCallback(async () => {
    try {
      await GameService.saveGameState({
        currentRound: state.currentRound,
        roundActive: state.roundActive,
        players: state.players,
        currentQuestion: state.currentQuestion,
        selectedCategory: state.selectedCategory,
        wheelSpinning: state.wheelSpinning,
        timeRemaining: state.timeRemaining
      });
    } catch (error) {
      console.error('Failed to save game state:', error);
    }
  }, [state]);

  // Load game state on mount
  const loadGameState = useCallback(async () => {
    try {
      const savedState = await GameService.loadGameState();
      if (savedState && Object.keys(savedState).length > 0) {
        toast.info('Wczytano zapisany stan gry');
        return savedState;
      }
    } catch (error) {
      console.error('Failed to load game state:', error);
      toast.error('Nie można wczytać zapisanego stanu gry');
    }
    return null;
  }, []);

  // Auto-save effect
  useEffect(() => {
    const interval = setInterval(saveGameState, 30000); // Save every 30 seconds
    return () => clearInterval(interval);
  }, [saveGameState]);

  // Save on significant state changes
  useEffect(() => {
    if (state.roundActive || state.players.length > 0) {
      const timeoutId = setTimeout(saveGameState, 1000); // Debounce saves
      return () => clearTimeout(timeoutId);
    }
  }, [state.currentRound, state.players, state.currentQuestion, saveGameState]);

  return {
    saveGameState,
    loadGameState
  };
}
