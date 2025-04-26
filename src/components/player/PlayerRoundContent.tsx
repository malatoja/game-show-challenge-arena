
import React from 'react';
import { Player, RoundType, Question } from '@/types/gameTypes';
import QuestionDisplay from '../questions/QuestionDisplay';
import FortuneWheel from '../wheel/FortuneWheel';
import { ROUND_NAMES } from '@/constants/gameConstants';
import { Card } from '@/components/ui/card';
import PlayerCamera from '../players/PlayerCamera';

interface PlayerRoundContentProps {
  player: Player;
  currentRound: RoundType;
  currentQuestion?: Question;
  wheelSpinning: boolean;
}

const PlayerRoundContent: React.FC<PlayerRoundContentProps> = ({
  player,
  currentRound,
  currentQuestion,
  wheelSpinning
}) => {
  return (
    <main className="flex-grow container mx-auto p-4 flex flex-col">
      {/* Round indicator */}
      <div className="mb-4 inline-block px-3 py-1 bg-gameshow-primary/30 rounded-full">
        <span className="text-sm text-gameshow-muted">
          {ROUND_NAMES[currentRound]}
        </span>
      </div>
      
      <div className="flex-grow flex flex-col justify-center">
        <Card className="bg-gameshow-card p-6 shadow-lg border-gameshow-primary/30">
          {currentRound === 'wheel' && wheelSpinning ? (
            <div className="flex flex-col items-center justify-center p-4">
              <h2 className="text-xl font-semibold text-gameshow-text mb-6">Koło Fortuny</h2>
              <div className="relative flex justify-center">
                <FortuneWheel isSpinning={wheelSpinning} />
              </div>
              <p className="mt-6 text-gameshow-muted text-center">
                Koło się kręci...
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Different layouts based on round */}
              {currentRound === 'knowledge' && (
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="lg:w-1/3">
                    <h2 className="text-xl font-semibold text-gameshow-text mb-3">Runda Wiedzy</h2>
                    <div className="text-gameshow-muted mb-4">
                      Odpowiedz na pytanie, aby zdobyć punkty.
                    </div>
                    <div className="mb-4">
                      <PlayerCamera player={player} size="md" />
                    </div>
                  </div>
                  <div className="lg:w-2/3">
                    <QuestionDisplay 
                      question={currentQuestion} 
                      timeLimit={30}
                    />
                  </div>
                </div>
              )}

              {currentRound === 'speed' && (
                <div className="flex flex-col items-center">
                  <h2 className="text-xl font-semibold text-gameshow-text mb-3">Runda Szybkości</h2>
                  <div className="text-gameshow-muted mb-4">
                    Szybko odpowiadaj na pytania! Za błędne odpowiedzi tracisz życia.
                  </div>
                  <QuestionDisplay 
                    question={currentQuestion} 
                    timeLimit={5}
                  />
                </div>
              )}

              {currentRound === 'wheel' && !wheelSpinning && (
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="lg:w-1/3">
                    <h2 className="text-xl font-semibold text-gameshow-text mb-3">Runda Koła Fortuny</h2>
                    <div className="text-gameshow-muted mb-4">
                      Kategoria została wybrana. Odpowiedz na pytanie.
                    </div>
                    <div className="mb-4">
                      <PlayerCamera player={player} size="md" />
                    </div>
                  </div>
                  <div className="lg:w-2/3">
                    <QuestionDisplay 
                      question={currentQuestion} 
                      timeLimit={20}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </main>
  );
};

export default PlayerRoundContent;
