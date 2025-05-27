
import { useState, useEffect } from 'react';
import { GameService } from '@/lib/supabase/gameService';
import { useGame } from '@/context/GameContext';
import { toast } from 'sonner';

export function useSupabaseGame() {
  const { state, dispatch } = useGame();
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}`);

  // Load initial data from Supabase
  useEffect(() => {
    loadGameData();
  }, []);

  const loadGameData = async () => {
    setLoading(true);
    try {
      // Load players
      const players = await GameService.getPlayers();
      players.forEach(player => {
        dispatch({ type: 'ADD_PLAYER', player });
      });

      // Load questions
      const questions = await GameService.getQuestions();
      questions.forEach(question => {
        dispatch({ type: 'ADD_QUESTION', question });
      });

      // Load game state
      const gameState = await GameService.loadGameState();
      if (gameState) {
        if (gameState.currentQuestion) {
          dispatch({ type: 'SET_CURRENT_QUESTION', question: gameState.currentQuestion });
        }
        if (gameState.activePlayerId) {
          dispatch({ type: 'SET_ACTIVE_PLAYER', playerId: gameState.activePlayerId });
        }
        if (gameState.selectedCategory) {
          dispatch({ type: 'SET_CATEGORY', category: gameState.selectedCategory });
        }
      }

      toast.success('Załadowano dane gry z bazy danych');
    } catch (error) {
      console.error('Error loading game data:', error);
      toast.error('Błąd podczas ładowania danych gry');
    } finally {
      setLoading(false);
    }
  };

  const savePlayer = async (player: any) => {
    try {
      if (player.id && player.id.startsWith('player-')) {
        // Create new player in Supabase
        const newPlayer = await GameService.createPlayer(player);
        dispatch({ type: 'UPDATE_PLAYER', player: newPlayer });
        toast.success(`Gracz ${newPlayer.name} został zapisany w bazie danych`);
      } else {
        // Update existing player
        await GameService.updatePlayer(player.id, player);
        toast.success(`Zaktualizowano gracza ${player.name}`);
      }
    } catch (error) {
      console.error('Error saving player:', error);
      toast.error('Błąd podczas zapisywania gracza');
    }
  };

  const markQuestionUsed = async (questionId: string) => {
    try {
      await GameService.markQuestionAsUsed(questionId, sessionId);
      dispatch({ type: 'MARK_QUESTION_USED', questionId });
    } catch (error) {
      console.error('Error marking question as used:', error);
      toast.error('Błąd podczas oznaczania pytania jako użyte');
    }
  };

  const saveGameState = async () => {
    try {
      await GameService.saveGameState(state);
      toast.success('Stan gry został zapisany');
    } catch (error) {
      console.error('Error saving game state:', error);
      toast.error('Błąd podczas zapisywania stanu gry');
    }
  };

  return {
    loading,
    sessionId,
    loadGameData,
    savePlayer,
    markQuestionUsed,
    saveGameState
  };
}
