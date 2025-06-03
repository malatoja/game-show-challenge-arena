
import React from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ConnectionStatus from './ConnectionStatus';
import { 
  Clock, 
  Users, 
  Trophy, 
  Gamepad2,
  Home,
  Settings,
  ArrowLeft
} from 'lucide-react';

const HostHeader = () => {
  const { state } = useGame();
  
  const activePlayers = state.players.filter(p => !p.eliminated).length;
  const totalPlayers = state.players.length;
  
  const getRoundName = (round: string) => {
    const rounds = {
      'knowledge': 'Runda 1: Eliminacje',
      'speed': 'Runda 2: Szybka odpowiedź', 
      'wheel': 'Runda 3: Koło fortuny'
    };
    return rounds[round as keyof typeof rounds] || 'Nieznana runda';
  };

  const getRoundColor = (round: string) => {
    const colors = {
      'knowledge': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'speed': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      'wheel': 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    };
    return colors[round as keyof typeof colors] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  return (
    <header className="bg-gameshow-card border-b border-gameshow-accent/20 sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Left side - Logo and game info */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-gameshow-primary to-gameshow-secondary rounded-lg shadow-neon-primary">
                <Gamepad2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gameshow-primary to-gameshow-secondary bg-clip-text text-transparent">
                  Panel Hosta
                </h1>
                <p className="text-gameshow-muted text-sm">Quiz Show Arena</p>
              </div>
            </div>
            
            {/* Game Status Badges */}
            <div className="flex items-center gap-3">
              <Badge className={getRoundColor(state.currentRound)}>
                <Trophy className="h-4 w-4 mr-1" />
                {getRoundName(state.currentRound)}
              </Badge>
              
              <Badge variant="secondary" className="bg-gameshow-secondary/20 text-gameshow-secondary border-gameshow-secondary/30">
                <Users className="h-4 w-4 mr-1" />
                {activePlayers}/{totalPlayers} graczy
              </Badge>
              
              {state.roundStarted && !state.roundEnded && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 animate-pulse">
                  <Clock className="h-4 w-4 mr-1" />
                  Runda aktywna
                </Badge>
              )}

              {state.gameStarted && (
                <Badge className="bg-gameshow-primary/20 text-gameshow-primary border-gameshow-primary/30">
                  GRA TRWA
                </Badge>
              )}
            </div>
          </div>
          
          {/* Right side - Navigation and connection */}
          <div className="flex items-center gap-3">
            <ConnectionStatus />
            
            <Button asChild variant="outline" size="sm" className="border-gameshow-accent/30">
              <Link to="/" className="flex items-center gap-2">
                <Home size={16} />
                Strona główna
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="sm" className="border-gameshow-primary/30">
              <Link to="/settings" className="flex items-center gap-2">
                <Settings size={16} />
                Ustawienia
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HostHeader;
