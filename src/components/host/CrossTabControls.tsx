
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGame } from '@/context/GameContext';
import { useGameControl } from './context/GameControlContext';
import { Player } from '@/types/gameTypes';
import { 
  SkipForward, 
  Pause, 
  RefreshCw, 
  Camera, 
  CameraOff 
} from 'lucide-react';
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function CrossTabControls() {
  const { state } = useGame();
  const { 
    activePlayerId,
    handleSelectPlayer,
    handleSkipQuestion,
    handlePause,
    handleResetGame
  } = useGameControl();
  
  const [hostCameraVisible, setHostCameraVisible] = React.useState(
    localStorage.getItem('hostCameraActive') === 'true'
  );
  
  const [manualPoints, setManualPoints] = React.useState(0);
  const [manualLives, setManualLives] = React.useState(3);
  
  const activePlayer = state.players.find(p => p.id === activePlayerId);
  
  const handlePlayerChange = (playerId: string) => {
    const player = state.players.find(p => p.id === playerId);
    if (player) {
      handleSelectPlayer(player);
      
      // Update manual values with current player stats
      setManualPoints(player.points);
      setManualLives(player.lives);
    }
  };
  
  const updatePlayerStats = () => {
    if (!activePlayerId) {
      toast.error("Wybierz gracza, aby zmienić jego statystyki");
      return;
    }
    
    const player = state.players.find(p => p.id === activePlayerId);
    if (player) {
      // Logic to update player stats would go here
      // This would be connected to the game state management
      toast.success(`Zaktualizowano statystyki gracza ${player.name}`);
    }
  };
  
  const toggleHostCamera = () => {
    const newState = !hostCameraVisible;
    setHostCameraVisible(newState);
    localStorage.setItem('hostCameraActive', newState.toString());
    
    // Send to overlay via socket if needed
    // socket.emit('overlay:update', { hostCamera: { active: newState } });
    
    toast.info(newState ? "Kamera hosta włączona" : "Kamera hosta wyłączona");
  };

  return (
    <Card className="mb-6 bg-gameshow-card shadow-md">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Active Player Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Aktywny gracz</label>
            <Select
              value={activePlayerId || ''}
              onValueChange={handlePlayerChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Wybierz gracza" />
              </SelectTrigger>
              <SelectContent>
                {state.players.map((player) => (
                  <SelectItem key={player.id} value={player.id}>
                    {player.name} ({player.points} pkt, {player.lives} życia)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {activePlayer && (
              <div className="text-xs text-gameshow-muted">
                Status: {activePlayer.eliminated ? 'Wyeliminowany' : 'Aktywny'}
              </div>
            )}
          </div>

          {/* Manual Score Controls */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Punkty</label>
              <div className="flex">
                <Input 
                  type="number" 
                  value={manualPoints}
                  onChange={(e) => setManualPoints(parseInt(e.target.value) || 0)}
                  disabled={!activePlayerId}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Życia</label>
              <div className="flex">
                <Input 
                  type="number" 
                  min="0"
                  max="3"
                  value={manualLives}
                  onChange={(e) => setManualLives(parseInt(e.target.value) || 0)}
                  disabled={!activePlayerId}
                />
              </div>
            </div>
            <Button 
              onClick={updatePlayerStats} 
              className="col-span-2"
              disabled={!activePlayerId}
            >
              Zastosuj zmiany
            </Button>
          </div>

          {/* Control Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handleSkipQuestion}
              className="flex gap-2 items-center"
            >
              <SkipForward size={16} />
              Pomiń pytanie
            </Button>
            
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handlePause}
              className="flex gap-2 items-center"
            >
              <Pause size={16} />
              Pauza
            </Button>
            
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={handleResetGame}
              className="flex gap-2 items-center"
            >
              <RefreshCw size={16} />
              Reset rundy
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleHostCamera}
              className="flex gap-2 items-center col-span-2 md:col-span-3"
            >
              {hostCameraVisible ? (
                <>
                  <CameraOff size={16} />
                  Ukryj kamerę hosta
                </>
              ) : (
                <>
                  <Camera size={16} />
                  Pokaż kamerę hosta
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
