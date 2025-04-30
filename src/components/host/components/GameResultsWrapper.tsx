
import React from 'react';
import { Player, RoundType } from '@/types/gameTypes';
import GameResults from '../GameLayout/GameResults';

interface GameResultsWrapperProps {
  players: Player[];
  currentRound: RoundType;
  resultType: 'round' | 'final';
  onResetGame: () => void;
  onCloseResults: () => void;
}

const GameResultsWrapper: React.FC<GameResultsWrapperProps> = ({
  players,
  currentRound,
  resultType,
  onResetGame,
  onCloseResults
}) => {
  return (
    <GameResults
      players={players}
      currentRound={currentRound}
      resultType={resultType}
      onResetGame={onResetGame}
      onCloseResults={onCloseResults}
    />
  );
};

export default GameResultsWrapper;
