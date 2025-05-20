
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useGame } from '@/context/GameContext';
import { Switch } from '@/components/ui/switch';

export const LuckyLoserTab = () => {
  const { state } = useGame();
  const [luckyLoserEnabled, setLuckyLoserEnabled] = useState<boolean>(true);
  const [eligibilityThreshold, setEligibilityThreshold] = useState<number>(20);
  const [automaticSelection, setAutomaticSelection] = useState<boolean>(false);
  const [automaticRestore, setAutomaticRestore] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<boolean>(true);
  
  // Pobierz wyeliminowanych graczy z rundy 1
  const eliminatedInRoundOne = state.players.filter(player => 
    player.eliminated && 
    player.points > 0
  ).sort((a, b) => b.points - a.points);

  const calculateLuckyLoser = () => {
    if (eliminatedInRoundOne.length === 0) {
      toast.error('Nie ma graczy kwalifikujących się jako Lucky Loser');
      return;
    }
    
    const luckyLoser = eliminatedInRoundOne[0];
    
    if (luckyLoser.points < eligibilityThreshold) {
      toast.warning(`${luckyLoser.name} ma ${luckyLoser.points} punktów, co jest poniżej progu ${eligibilityThreshold} punktów`);
    } else {
      toast.success(`${luckyLoser.name} kwalifikuje się jako Lucky Loser z ${luckyLoser.points} punktami`);
    }
  };
  
  const handleSaveSettings = () => {
    const settings = {
      luckyLoserEnabled,
      eligibilityThreshold,
      automaticSelection,
      automaticRestore,
      showNotification
    };
    
    localStorage.setItem('luckyLoserSettings', JSON.stringify(settings));
    toast.success('Ustawienia Lucky Loser zostały zapisane');
  };
  
  const handleRestorePlayer = (playerId: string) => {
    toast.success('Gracz został przywrócony do gry jako Lucky Loser');
    // W rzeczywistej implementacji użylibyśmy dispatch do przywrócenia gracza
    // dispatch({ type: 'RESTORE_PLAYER', playerId });
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Ustawienia Lucky Loser</h2>
      <p className="text-gray-600 mb-6">
        Konfiguracja funkcji Lucky Loser, która pozwala przywrócić najlepszego wyeliminowanego gracza do gry.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Ustawienia mechaniki Lucky Loser */}
        <div className="space-y-4">
          <div className="bg-gameshow-background/30 p-4 rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-medium">Włącz funkcję Lucky Loser</h3>
                <p className="text-sm text-gameshow-muted">Pozwala na przywrócenie najlepszego wyeliminowanego gracza</p>
              </div>
              <Switch checked={luckyLoserEnabled} onCheckedChange={setLuckyLoserEnabled} />
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Minimalny próg punktów</label>
                <Input
                  type="number"
                  value={eligibilityThreshold}
                  onChange={(e) => setEligibilityThreshold(parseInt(e.target.value))}
                  min={0}
                  max={100}
                  disabled={!luckyLoserEnabled}
                />
                <p className="text-xs text-gameshow-muted mt-1">
                  Gracz musi mieć co najmniej tyle punktów, aby kwalifikować się jako Lucky Loser
                </p>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <div>
                  <h4 className="text-sm font-medium">Automatyczny wybór</h4>
                  <p className="text-xs text-gameshow-muted">Automatycznie wyznacza Lucky Losera po zakończeniu rundy</p>
                </div>
                <Switch 
                  checked={automaticSelection} 
                  onCheckedChange={setAutomaticSelection}
                  disabled={!luckyLoserEnabled}
                />
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <div>
                  <h4 className="text-sm font-medium">Automatyczne przywracanie</h4>
                  <p className="text-xs text-gameshow-muted">Automatycznie przywraca Lucky Losera do gry</p>
                </div>
                <Switch 
                  checked={automaticRestore} 
                  onCheckedChange={setAutomaticRestore}
                  disabled={!luckyLoserEnabled || !automaticSelection}
                />
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <div>
                  <h4 className="text-sm font-medium">Powiadomienie na ekranie</h4>
                  <p className="text-xs text-gameshow-muted">Wyświetla powiadomienie o Lucky Loserze</p>
                </div>
                <Switch 
                  checked={showNotification} 
                  onCheckedChange={setShowNotification}
                  disabled={!luckyLoserEnabled}
                />
              </div>
            </div>
          </div>
          
          <div className="bg-gameshow-background/30 p-4 rounded-lg">
            <h3 className="font-medium mb-3">Akcje</h3>
            <div className="space-y-2">
              <Button 
                onClick={calculateLuckyLoser}
                className="w-full"
                disabled={!luckyLoserEnabled || eliminatedInRoundOne.length === 0}
              >
                Wyznacz Lucky Losera
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => {
                  setLuckyLoserEnabled(true);
                  setEligibilityThreshold(20);
                  setAutomaticSelection(false);
                  setAutomaticRestore(false);
                  setShowNotification(true);
                }}
                className="w-full"
              >
                Przywróć domyślne ustawienia
              </Button>
            </div>
          </div>
        </div>
        
        {/* Lista wyeliminowanych graczy */}
        <div className="bg-gameshow-background/30 p-4 rounded-lg">
          <h3 className="font-medium mb-4">Potencjalni Lucky Loserzy</h3>
          
          {eliminatedInRoundOne.length === 0 ? (
            <div className="text-center p-6 text-gameshow-muted">
              Brak wyeliminowanych graczy kwalifikujących się jako Lucky Loser
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {eliminatedInRoundOne.map((player) => (
                <div 
                  key={player.id}
                  className={`flex items-center justify-between p-3 rounded ${
                    player.points >= eligibilityThreshold 
                      ? 'bg-green-500/10 border border-green-500/30' 
                      : 'bg-gameshow-background/20'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: player.color || '#ff5722' }}
                    />
                    <span className="font-medium">{player.name}</span>
                    <span className="text-gameshow-muted text-sm">
                      {player.points} punktów
                    </span>
                  </div>
                  
                  <Button
                    size="sm"
                    variant={player.points >= eligibilityThreshold ? "default" : "outline"}
                    disabled={!luckyLoserEnabled || player.points < eligibilityThreshold}
                    onClick={() => handleRestorePlayer(player.id)}
                  >
                    Przywróć
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-4 p-3 bg-gameshow-background/20 rounded text-sm">
            <h4 className="font-medium mb-1">Informacje o funkcji Lucky Loser</h4>
            <ul className="list-disc list-inside space-y-1 text-gameshow-muted">
              <li>Lucky Loser to gracz z najwyższymi punktami spośród wyeliminowanych w pierwszej rundzie</li>
              <li>Gracz musi osiągnąć minimalny próg punktów, aby się kwalifikować</li>
              <li>Przywrócenie gracza odbywa się po zakończeniu pierwszej rundy</li>
              <li>Przywrócony gracz startuje w drugiej rundzie bez dodatkowych korzyści</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <Button onClick={handleSaveSettings}>
          Zapisz ustawienia
        </Button>
      </div>
    </div>
  );
};
