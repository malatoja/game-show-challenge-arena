
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGame } from '@/context/GameContext';
import { Player } from '@/types/gameTypes';
import { toast } from 'sonner';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export const PlayersTab = () => {
  const { state, dispatch } = useGame();
  const [newPlayer, setNewPlayer] = useState<Partial<Player>>({
    name: '',
    avatarUrl: '',
    color: '#ff5722'
  });
  const [generatedLink, setGeneratedLink] = useState<string>('');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  
  // Available player colors
  const playerColors = [
    '#ff5722', '#e91e63', '#9c27b0', '#673ab7', 
    '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', 
    '#009688', '#4caf50', '#8bc34a', '#cddc39'
  ];

  const handleAddPlayer = () => {
    if (!newPlayer.name) {
      toast.error('Nick gracza jest wymagany');
      return;
    }

    const playerExists = state.players.some(p => p.name === newPlayer.name);
    if (playerExists) {
      toast.error('Gracz o takim nicku już istnieje');
      return;
    }

    const newPlayerObj: Player = {
      id: `player-${Date.now()}`,
      name: newPlayer.name || 'Nowy Gracz',
      avatarUrl: newPlayer.avatarUrl,
      color: newPlayer.color || '#ff5722',
      lives: 3,
      points: 0,
      cards: [],
      isActive: false,
      eliminated: false
    };

    dispatch({ type: 'ADD_PLAYER', player: newPlayerObj });
    toast.success(`Dodano gracza: ${newPlayerObj.name}`);
    setNewPlayer({ name: '', avatarUrl: '', color: '#ff5722' });
  };

  const handleEditPlayer = (player: Player) => {
    setSelectedPlayer(player);
    setNewPlayer({
      name: player.name,
      avatarUrl: player.avatarUrl,
      color: player.color || '#ff5722'
    });
  };

  const handleUpdatePlayer = () => {
    if (!selectedPlayer || !newPlayer.name) return;
    
    const updatedPlayer: Player = {
      ...selectedPlayer,
      name: newPlayer.name,
      avatarUrl: newPlayer.avatarUrl,
      color: newPlayer.color || '#ff5722'
    };

    dispatch({ type: 'UPDATE_PLAYER', player: updatedPlayer });
    toast.success(`Zaktualizowano gracza: ${updatedPlayer.name}`);
    setSelectedPlayer(null);
    setNewPlayer({ name: '', avatarUrl: '', color: '#ff5722' });
  };

  const handleRemovePlayer = (playerId: string) => {
    if (confirm('Czy na pewno chcesz usunąć tego gracza?')) {
      dispatch({ type: 'REMOVE_PLAYER', playerId });
      toast.success('Gracz został usunięty');
    }
  };

  const generateLink = (playerId?: string) => {
    const baseUrl = window.location.origin;
    const token = Math.random().toString(36).substring(2, 15);
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 24);
    
    const link = playerId 
      ? `${baseUrl}/player?id=${playerId}&token=${token}` 
      : `${baseUrl}/player?token=${token}`;
      
    setGeneratedLink(link);
    toast.success('Wygenerowano link ważny 24h');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Ustawienia graczy</h2>
      <p className="text-gray-600 mb-6">
        Tutaj zarządzasz uczestnikami show – nazwami, dostępem i kamerami.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Form for adding/editing players */}
        <div className="bg-gameshow-background/30 p-4 rounded-lg">
          <h3 className="font-semibold mb-4">
            {selectedPlayer ? 'Edytuj gracza' : 'Dodaj nowego gracza'}
          </h3>
          
          <div className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <label htmlFor="playerName">Nick gracza *</label>
              <Input
                id="playerName"
                value={newPlayer.name}
                onChange={(e) => setNewPlayer({...newPlayer, name: e.target.value})}
                placeholder="Wprowadź nick gracza"
                required
              />
            </div>
            
            <div className="grid w-full items-center gap-1.5">
              <label htmlFor="avatarUrl">URL awatara</label>
              <Input
                id="avatarUrl"
                value={newPlayer.avatarUrl}
                onChange={(e) => setNewPlayer({...newPlayer, avatarUrl: e.target.value})}
                placeholder="https://example.com/avatar.png"
              />
              {/* TODO: Add upload option */}
            </div>
            
            <div className="grid w-full items-center gap-1.5">
              <label>Kolor gracza</label>
              <div className="flex flex-wrap gap-2">
                {playerColors.map((color) => (
                  <div 
                    key={color}
                    className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                      newPlayer.color === color ? 'border-white' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setNewPlayer({...newPlayer, color})}
                  />
                ))}
              </div>
            </div>
            
            <div className="grid w-full items-center gap-1.5">
              <label>Kamera</label>
              <p className="text-sm text-gray-500">
                Możliwość integracji z OBS/Discord będzie dostępna wkrótce
              </p>
            </div>
            
            <div className="flex gap-2 justify-end">
              {selectedPlayer && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedPlayer(null);
                    setNewPlayer({ name: '', avatarUrl: '', color: '#ff5722' });
                  }}
                >
                  Anuluj
                </Button>
              )}
              <Button onClick={selectedPlayer ? handleUpdatePlayer : handleAddPlayer}>
                {selectedPlayer ? 'Zapisz zmiany' : 'Dodaj gracza'}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Player list and link generation */}
        <div>
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Generowanie linków uczestnictwa</h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Button onClick={() => generateLink()} variant="outline">
                  Generuj globalny link
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Instrukcja</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Informacje o linkach uczestnictwa</DialogTitle>
                      <DialogDescription>
                        <p className="mb-2">Linki są ważne przez 24 godziny od wygenerowania.</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>Link globalny pozwala dowolnej osobie dołączyć do gry</li>
                          <li>Link dla konkretnego gracza jest przypisany do jego konta</li>
                          <li>Tryb "widok tylko" umożliwia obserwowanie bez udziału w grze</li>
                        </ul>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </div>
              
              {generatedLink && (
                <div className="p-3 bg-black/20 rounded break-all">
                  <p className="mb-2 text-sm">Wygenerowany link (ważny 24h):</p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs">{generatedLink}</code>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedLink);
                        toast.success('Link skopiowany do schowka');
                      }}
                    >
                      Kopiuj
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <h3 className="font-semibold mb-3">Lista graczy</h3>
          {state.players.length === 0 ? (
            <p className="text-center p-4 bg-gameshow-background/30 rounded-lg text-gray-500">
              Nie dodano jeszcze żadnych graczy
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {state.players.map(player => (
                <div 
                  key={player.id}
                  className="flex items-center justify-between p-3 bg-gameshow-background/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-full" 
                      style={{ 
                        backgroundColor: player.color || '#ff5722',
                        backgroundImage: player.avatarUrl ? `url(${player.avatarUrl})` : 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                    <span>{player.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => generateLink(player.id)}
                    >
                      Link
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleEditPlayer(player)}
                    >
                      Edytuj
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleRemovePlayer(player.id)}
                    >
                      Usuń
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
