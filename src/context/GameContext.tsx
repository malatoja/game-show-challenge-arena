
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GameState, Player, Question, RoundType, PlayerId, CardType } from '../types/gameTypes';
import { gameReducer, GameAction, initialStateWithSavedQuestions } from '../reducers/gameReducer';
import { toast } from 'sonner';

// Context
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialStateWithSavedQuestions());
  
  // Wrap dispatch with error handling
  const safeDispatch = (action: GameAction) => {
    try {
      dispatch(action);
    } catch (error) {
      console.error('Error in game reducer:', error);
      toast.error(`An error occurred: ${(error as Error).message || 'Unknown error'}`);
    }
  };
  
  return (
    <GameContext.Provider value={{ state, dispatch: safeDispatch }}>
      {children}
    </GameContext.Provider>
  );
}

// Hook to use the context
export function useGame() {
  const context = useContext(GameContext);
  
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  
  return context;
}
