
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GameState, Player, Question, RoundType, PlayerId, CardType } from '../types/gameTypes';
import { gameReducer, GameAction, initialStateWithSavedQuestions } from '../reducers/gameReducer';

// Context
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialStateWithSavedQuestions());
  
  return (
    <GameContext.Provider value={{ state, dispatch }}>
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
