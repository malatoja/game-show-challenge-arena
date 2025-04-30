
import { Player, CardType, RoundType, Question } from '@/types/gameTypes';

// Define the context type for game controls
export interface GameControlContext {
  activePlayerId: string | null;
  canStartRound: boolean;
  canEndRound: boolean;
  isRoundActive: boolean;
  handleSelectPlayer: (player: Player) => void;
  handleStartRound: (roundType: RoundType) => void;
  handleEndRound: () => void;
  handleEndGame: () => void;
  handleSelectQuestion?: (question: Question) => void; // Added as optional for compatibility
  handleAnswerQuestion: (isCorrect: boolean, answerIndex: number) => void;
  handleSpinWheel: () => void;
  handleWheelSpinEnd: () => void;
  handleSelectCategory: (category: string) => void;
  handleSkipQuestion: () => void;
  handlePause: () => void;
  handleResetGame: () => void;
  handleUseCard: (playerId: string, cardType: CardType) => void;
  handleAddPlayer: () => void;
  handleAddTestCards: (playerId: string) => void;
}
