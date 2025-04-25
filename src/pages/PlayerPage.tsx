
import React, { useState } from 'react';
import { GameProvider } from '@/context/GameContext';
import PlayerView from '@/components/player/PlayerView';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

const PlayerPage = () => {
  const [playerId, setPlayerId] = useState('');
  const [joinedId, setJoinedId] = useState<string | null>(null);
  
  const handleJoin = () => {
    if (playerId.trim()) {
      setJoinedId(playerId);
    }
  };
  
  return (
    <GameProvider>
      {!joinedId ? (
        <div className="min-h-screen flex items-center justify-center bg-gameshow-background p-4">
          <div className="max-w-md w-full bg-gameshow-card rounded-lg p-8 shadow-lg">
            <h1 className="text-2xl font-bold text-gameshow-text mb-6 text-center">
              Dołącz do gry
            </h1>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="playerId" className="block text-sm font-medium text-gameshow-muted mb-1">
                  ID Gracza
                </label>
                <Input
                  id="playerId"
                  placeholder="Wpisz swoje ID"
                  value={playerId}
                  onChange={(e) => setPlayerId(e.target.value)}
                  className="bg-gameshow-background border-gameshow-primary/30"
                />
              </div>
              
              <Button 
                onClick={handleJoin}
                className="game-btn w-full"
                disabled={!playerId.trim()}
              >
                Dołącz
              </Button>
              
              <div className="text-center mt-4">
                <Link to="/" className="text-gameshow-primary hover:underline text-sm">
                  Wróć do strony głównej
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <PlayerView playerId={joinedId} />
      )}
    </GameProvider>
  );
};

export default PlayerPage;
