import React from 'react';
import { Player } from '@/types/gameTypes';
import { ROUND_NAMES } from '@/constants/gameConstants';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Trophy } from 'lucide-react';
import PlayerCamera from '../players/PlayerCamera';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface GameResultsProps {
  players: Player[];
  currentRound: string;
  resultType: 'round' | 'final';
  onResetGame: () => void;
  onCloseResults: () => void;
}

export function GameResults({ 
  players, 
  currentRound, 
  resultType, 
  onResetGame, 
  onCloseResults 
}: GameResultsProps) {
  const sortedPlayers = [...players].sort((a, b) => b.points - a.points);
  const winner = sortedPlayers[0];
  const luckyLoser = players.filter(player => player.eliminated).length > 0 ? players.filter(player => player.eliminated)
    .reduce((prev, current) => (prev.points > current.points) ? prev : current) : null;

  return (
    <div className="container mx-auto p-4 bg-gameshow-background min-h-screen">
      <Card className="w-full bg-gameshow-card">
        <CardHeader className="text-center bg-gradient-to-r from-gameshow-primary/40 to-gameshow-secondary/40">
          <CardTitle className="text-3xl font-bold text-gameshow-text flex items-center justify-center gap-2">
            {resultType === 'final' ? (
              <>
                <Star className="h-8 w-8 text-yellow-400 animate-bounce" />
                Zwycięzca gry: {winner?.name}!
                <Trophy className="h-8 w-8 text-yellow-400 animate-bounce" />
              </>
            ) : (
              `Wyniki rundy: ${ROUND_NAMES[currentRound]}`
            )}
          </CardTitle>
          <CardDescription className="text-gameshow-muted text-lg">
            {resultType === 'final' 
              ? 'Gratulacje dla zwycięzcy i wszystkich uczestników!'
              : 'Top 5 graczy awansuje do następnej rundy'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-6">
            {sortedPlayers.map((player, index) => (
              <div 
                key={player.id} 
                className={`flex items-center p-4 rounded-lg transition-all ${
                  index === 0 && resultType === 'final' 
                    ? 'bg-gradient-to-r from-yellow-400/30 to-amber-500/30 shadow-lg scale-105' 
                    : index < 5 ? 'bg-gameshow-primary/20' : 'bg-gameshow-card'
                }`}
              >
                <div className="w-8 text-xl font-bold">{index + 1}.</div>
                <PlayerCamera player={player} size="sm" showDetails={false} />
                <div className="ml-4 flex-grow">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">{player.name}</h3>
                    <div className="text-xl font-bold">{player.points} pkt</div>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm text-gameshow-muted">Życia:</span>
                    <div className="flex space-x-1">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} 
                          className={`w-3 h-3 rounded-full ${
                            i < player.lives ? "bg-red-500" : "bg-gray-400"
                          }`}
                        />
                      ))}
                    </div>
                    {player.eliminated && (
                      <span className="text-xs bg-red-500/20 text-red-500 px-2 py-0.5 rounded-full">
                        Wyeliminowany
                      </span>
                    )}
                    {luckyLoser && player.id === luckyLoser.id && (
                      <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded-full ml-2 animate-pulse">
                        Lucky Loser
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center gap-4 pt-4">
          {resultType === 'final' ? (
            <Button variant="default" onClick={onResetGame}>
              Nowa gra
            </Button>
          ) : (
            <>
              <Button variant="default" onClick={onCloseResults}>
                Powrót do panelu
              </Button>
              <Button 
                variant="outline" 
                onClick={onCloseResults}
              >
                Rozpocznij następną rundę
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default GameResults;
