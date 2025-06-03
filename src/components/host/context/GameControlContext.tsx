
import React, { createContext, useContext } from 'react';
import { CardType, Player, Question, RoundType } from '@/types/gameTypes';

// Define the context type
export interface GameControlContextType {
  activePlayerId: string | null;
  canStartRound: boolean;
  canEndRound: boolean;
  isRoundActive: boolean;
  showResults: boolean;
  resultType: 'round' | 'final';
  handleSelectPlayer: (player: Player) => void;
  handleStartRound: (roundType: RoundType) => void;
  handleEndRound: () => void;
  handleEndGame: () => void;
  handleSkipQuestion: () => void;
  handleSelectQuestion: (question: Question) => void;
  handleAnswerQuestion: (isCorrect: boolean, answerIndex: number) => void;
  handleSpinWheel: () => void;
  handleWheelSpinEnd: () => void;
  handleSelectCategory: (category: string) => void;
  handlePause: () => void;
  handleResetGame: () => void;
  handleResetRound: () => void;
  handleUseCard: (playerId: string, cardType: CardType) => void;
  handleAddPlayer: () => void;
  handleAddTestCards: (playerId: string) => void;
  setShowResults: React.Dispatch<React.SetStateAction<boolean>>;
  setResultType: React.Dispatch<React.SetStateAction<'round' | 'final'>>;
}

// Create the context
const GameControlContext = createContext<GameControlContextType | undefined>(undefined);

// Create the provider component
export const GameControlProvider: React.FC<{
  children: React.ReactNode;
  value: GameControlContextType;
}> = ({ children, value }) => {
  return (
    <GameControlContext.Provider value={value}>
      {children}
    </GameControlContext.Provider>
  );
};

// Create a hook for consuming the context
export const useGameControl = () => {
  const context = useContext(GameControlContext);
  if (!context) {
    throw new Error('useGameControl must be used within a GameControlProvider');
  }
  return context;
};
