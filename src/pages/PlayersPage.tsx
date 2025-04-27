
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, UserPlus, Trash2, Edit, RefreshCw } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { Player } from '@/types/gameTypes';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const PlayersPage = () => {
  const { state, dispatch } = useGame();
  const { players } = state;
  const [loading, setLoading] = useState(false);
  
  const handleRemovePlayer = (playerId: string) => {
    if (confirm('Czy na pewno chcesz usunąć tego gracza?')) {
      dispatch({ type: 'REMOVE_PLAYER', playerId });
      toast.success('Gracz został usunięty');
    }
  };
  
  const handleAddPlayer = () => {
    const playerNumber = players.length + 1;
    const newPlayer: Player = {
      id: `player-${Date.now()}`,
      name: `Gracz ${playerNumber}`,
      lives: 3,
      points: 0,
      cards: [],
      isActive: false,
      eliminated: false
    };
    
    dispatch({ type: 'ADD_PLAYER', player: newPlayer });
    toast.success(`Dodano gracza: ${newPlayer.name}`);
  };
  
  const refreshPlayers = () => {
    setLoading(true);
    // Simulate refresh - in a real app, this might fetch from an API
    setTimeout(() => {
      setLoading(false);
      toast.success('Lista graczy została odświeżona');
    }, 500);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gameshow-background p-4 md:p-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-between items-center mb-6">
          <div>
            <Link to="/" className="flex items-center text-gameshow-primary hover:underline">
              <ArrowLeft size={16} className="mr-1" />
              Powrót do strony głównej
            </Link>
            <h1 className="text-3xl font-bold text-gameshow-text mt-2">Lista Graczy</h1>
          </div>
          
          <div className="flex space-x-2 mt-2 md:mt-0">
            <Button
              variant="default"
              size="sm"
              onClick={refreshPlayers}
              className="flex items-center gap-1"
              disabled={loading}
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              {loading ? 'Odświeżanie...' : 'Odśwież'}
            </Button>
            
            <Button
              variant="default"
              size="sm"
              onClick={handleAddPlayer}
              className="flex items-center gap-1"
            >
              <UserPlus size={16} />
              Dodaj gracza
            </Button>
          </div>
        </div>
        
        {players.length === 0 ? (
          <div className="bg-gameshow-card rounded-lg p-8 text-center">
            <h2 className="text-xl mb-4">Brak graczy</h2>
            <p className="text-gameshow-muted mb-6">
              Nie ma jeszcze żadnych graczy w grze. Dodaj nowych graczy, aby rozpocząć.
            </p>
            <Button onClick={handleAddPlayer}>
              <UserPlus size={16} className="mr-2" />
              Dodaj pierwszego gracza
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {players.map((player) => (
              <Card key={player.id} className="bg-gameshow-card border-gameshow-primary/30">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle 
                      className={`text-xl flex items-center ${player.isActive ? 'text-gameshow-primary animate-neon-pulse' : ''}`}
                    >
                      <span 
                        className="w-3 h-3 rounded-full mr-2" 
                        style={{ backgroundColor: player.color || '#39FF14' }}
                      />
                      {player.name}
                      {player.eliminated && <span className="text-xs ml-2 text-gameshow-secondary">(Wyeliminowany)</span>}
                    </CardTitle>
                    
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => console.log('Edit', player.id)}>
                        <Edit size={14} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 hover:bg-red-500/20 hover:text-red-500"
                        onClick={() => handleRemovePlayer(player.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Życia</span>
                        <span>{player.lives}/3</span>
                      </div>
                      <Progress value={player.lives * 33.33} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Punkty</span>
                        <span>{player.points}</span>
                      </div>
                      <div className="bg-gameshow-primary/20 text-gameshow-primary text-center py-1 rounded-md font-bold">
                        {player.points} pkt
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm mb-1">Karty</div>
                      <div className="flex flex-wrap gap-1">
                        {player.cards.length > 0 ? (
                          player.cards.map((card, idx) => (
                            <div 
                              key={idx}
                              className="w-6 h-6 rounded-full bg-gameshow-secondary/30 flex items-center justify-center text-xs"
                              title={`${card.type}${card.isUsed ? ' (użyta)' : ''}`}
                            >
                              {card.type.substring(0, 1).toUpperCase()}
                            </div>
                          ))
                        ) : (
                          <span className="text-xs text-gameshow-muted">Brak kart</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PlayersPage;
