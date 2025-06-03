
import { Player, Question, RoundType } from '@/types/gameTypes';

export interface PlayerRoundContentProps {
  player: Player;
  currentRound: RoundType;
  currentQuestion?: Question;
  wheelSpinning?: boolean;
  onAnswer: (isCorrect: boolean, answerIndex: number) => void;
}
