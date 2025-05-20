
import React, { createContext, useContext, ReactNode } from 'react';
import { useGameHistoryImplementation } from '@/hooks/useGameHistory';
import { GameAction, ActionType } from '@/types/historyTypes';

interface GameHistoryContextValue {
  actions: GameAction[];
  addAction: (
    type: ActionType, 
    description: string, 
    playerIds?: string[], 
    data?: any,
    previousState?: any
  ) => void;
  undoLastAction: () => void;
  clearHistory: () => void;
  hasActions: boolean;
}

const GameHistoryContext = createContext<GameHistoryContextValue | undefined>(undefined);

export function GameHistoryProvider({ children }: { children: ReactNode }) {
  const gameHistory = useGameHistoryImplementation();
  
  return (
    <GameHistoryContext.Provider value={gameHistory}>
      {children}
    </GameHistoryContext.Provider>
  );
}

export function useGameHistory() {
  const context = useContext(GameHistoryContext);
  if (context === undefined) {
    throw new Error('useGameHistory must be used within a GameHistoryProvider');
  }
  return context;
}
