
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGame } from '@/context/GameContext';
import { ArrowUp, UserPlus } from 'lucide-react';
import { Player } from '@/types/gameTypes';

export function LuckyLoserTab() {
  const { state, dispatch } = useGame();
  const [luckyLoser, setLuckyLoser] = useState<Player | null>(null);
  const [wasActivated, setWasActivated] = useState(false);

  // Find the player with the highest points among eliminated players after round 1
  useEffect(() => {
    // Only consider finding lucky loser after round 1 is finished
    if (state.currentRound !== 'knowledge' || !state.roundEnded) {
      return;
    }

    const eliminatedPlayers = state.players.filter(p => p.eliminated);
    if (eliminatedPlayers.length === 0) return;

    const sorted = [...eliminatedPlayers].sort((a, b) => b.points - a.points);
    setLuckyLoser(sorted[0] || null);
  }, [state.currentRound, state.roundEnded, state.players]);

  const handleActivateLuckyLoser = () => {
    if (!luckyLoser) return;

    // Restore the player
    dispatch({ 
      type: 'UPDATE_PLAYER', 
      player: { 
        ...luckyLoser, 
        eliminated: false,
        lives: 3 // Reset lives for the next round
      } 
    });

    toast.success(`${luckyLoser.name} został przywrócony jako Lucky Loser!`);
    setWasActivated(true);
  };

  if (!luckyLoser) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lucky Loser</CardTitle>
          <CardDescription>
            Brak kandydatów na Lucky Losera. Aktywny po zakończeniu pierwszej rundy.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-amber-500/30">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Lucky Loser</span>
          <Badge variant="outline" className="bg-amber-100 text-amber-800">
            {state.currentRound === 'knowledge' && state.roundEnded ? 'Dostępny!' : 'Nieaktywny'}
          </Badge>
        </CardTitle>
        <CardDescription>
          Przywróć do gry gracza z najwyższą liczbą punktów spośród wyeliminowanych
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg bg-gameshow-background/30 p-4 mb-4">
          <div className="font-semibold">{luckyLoser.name}</div>
          <div className="text-sm text-gameshow-muted">Punkty: {luckyLoser.points}</div>
        </div>
        
        <Button 
          onClick={handleActivateLuckyLoser}
          disabled={wasActivated || !(state.currentRound === 'knowledge' && state.roundEnded)}
          className="w-full gap-2"
          variant="outline"
        >
          {wasActivated ? (
            <span>Lucky Loser aktywowany</span>
          ) : (
            <>
              <UserPlus size={16} /> 
              <span>Aktywuj Lucky Loser</span>
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
