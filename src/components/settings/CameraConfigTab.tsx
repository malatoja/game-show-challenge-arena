
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useGame } from '@/context/GameContext';
import { 
  Camera,
  CameraOff,
  Trash,
  LayoutGrid,
  Copy,
  Maximize,
  Minimize
} from 'lucide-react';

type CameraConfig = {
  id: string;
  label: string;
  url: string;
  enabled: boolean;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  scale: number;
};

type HostCameraConfig = {
  enabled: boolean;
  url: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  scale: number;
};

export const CameraConfigTab = () => {
  const { state } = useGame();
  const [playerCameras, setPlayerCameras] = useState<CameraConfig[]>([]);
  const [hostCamera, setHostCamera] = useState<HostCameraConfig>({
    enabled: false,
    url: '',
    position: 'bottom-right',
    scale: 0.3
  });
  const [showCameraGuides, setShowCameraGuides] = useState<boolean>(true);
  const [automaticLayout, setAutomaticLayout] = useState<boolean>(true);
  const [vodNinjaRoom, setVodNinjaRoom] = useState<string>('quiz-show-room');
  
  // Load player cameras on component mount (would use actual player data in a real implementation)
  useEffect(() => {
    // Create camera configs for each player
    const cameras = state.players.map((player) => ({
      id: player.id,
      label: player.name,
      url: player.streamUrl || '',
      enabled: !!player.streamUrl,
      position: 'bottom-left' as const,
      scale: 0.25
    }));
    
    setPlayerCameras(cameras);
    
    // Load stored camera settings
    try {
      const storedHostCamera = localStorage.getItem('hostCameraConfig');
      if (storedHostCamera) {
        setHostCamera(JSON.parse(storedHostCamera));
      }
      
      const storedVodRoom = localStorage.getItem('vodNinjaRoom');
      if (storedVodRoom) {
        setVodNinjaRoom(storedVodRoom);
      }
    } catch (error) {
      console.error('Error loading camera settings:', error);
    }
  }, [state.players]);
  
  const handleUpdatePlayerCamera = (id: string, field: keyof CameraConfig, value: any) => {
    setPlayerCameras((prev) =>
      prev.map((camera) =>
        camera.id === id ? { ...camera, [field]: value } : camera
      )
    );
  };
  
  const handleUpdateHostCamera = (field: keyof HostCameraConfig, value: any) => {
    setHostCamera((prev) => ({ ...prev, [field]: value }));
  };
  
  const generateVodNinjaLinks = () => {
    if (!vodNinjaRoom) {
      toast.error('Podaj nazwę pokoju VOD.ninja');
      return;
    }
    
    // Create VOD.ninja links
    const hostLink = `https://vdo.ninja/?room=${vodNinjaRoom}&push=host`;
    const playerLinks = state.players.map(player => ({
      player: player.name,
      link: `https://vdo.ninja/?room=${vodNinjaRoom}&push=${player.id}`
    }));
    
    // Update camera URLs
    const updatedHostCamera = { ...hostCamera, url: hostLink };
    setHostCamera(updatedHostCamera);
    
    const updatedPlayerCameras = playerCameras.map((camera, index) => {
      const playerLink = playerLinks.find(link => link.player === camera.label)?.link || '';
      return { ...camera, url: playerLink };
    });
    
    setPlayerCameras(updatedPlayerCameras);
    toast.success('Wygenerowano linki VOD.ninja');
  };
  
  const copyToClipboard = (text: string, description: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Skopiowano ${description} do schowka`);
  };
  
  const handleSaveConfig = () => {
    try {
      localStorage.setItem('hostCameraConfig', JSON.stringify(hostCamera));
      localStorage.setItem('playerCameraConfig', JSON.stringify(playerCameras));
      localStorage.setItem('vodNinjaRoom', vodNinjaRoom);
      
      // W rzeczywistej implementacji tutaj emitowalibyśmy dane do servera/websocket
      // aby zaktualizować konfigurację kamer w overlayach
      // socket.emit('overlay:update', { 
      //   hostCamera,
      //   playerCameras: playerCameras.filter(c => c.enabled)
      // });
      
      toast.success('Konfiguracja kamer została zapisana');
    } catch (error) {
      console.error('Error saving camera configuration:', error);
      toast.error('Wystąpił błąd podczas zapisywania konfiguracji');
    }
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Konfiguracja kamer</h2>
      <p className="text-gray-600 mb-6">
        Skonfiguruj kamery hosta i graczy do wyświetlania w overlayu.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Konfiguracja VOD.ninja */}
        <div className="bg-gameshow-background/30 p-4 rounded-lg">
          <h3 className="font-medium mb-4">Integracja z VOD.ninja</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Nazwa pokoju VOD.ninja</label>
              <div className="flex gap-2">
                <Input
                  value={vodNinjaRoom}
                  onChange={(e) => setVodNinjaRoom(e.target.value)}
                  placeholder="np. quiz-show-room"
                />
                <Button 
                  onClick={generateVodNinjaLinks}
                  variant="outline"
                >
                  Generuj linki
                </Button>
              </div>
              <p className="text-xs text-gameshow-muted mt-1">
                Unikalny identyfikator pokoju dla hostowania kamer graczy
              </p>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Link dla hosta</h4>
                {hostCamera.url && (
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => copyToClipboard(hostCamera.url, 'link dla hosta')}
                  >
                    <Copy size={14} />
                  </Button>
                )}
              </div>
              <div className="text-xs bg-black/20 p-2 rounded break-all">
                {hostCamera.url || 'Kliknij "Generuj linki" aby utworzyć link VOD.ninja'}
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Linki dla graczy</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {playerCameras.map((camera) => (
                <div key={camera.id} className="flex justify-between items-center bg-black/20 p-2 rounded">
                  <div className="text-sm">{camera.label}</div>
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => copyToClipboard(camera.url, `link dla ${camera.label}`)}
                    disabled={!camera.url}
                  >
                    <Copy size={14} />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-gameshow-background/20 rounded text-sm">
              <h4 className="font-medium mb-1">Jak korzystać z VOD.ninja?</h4>
              <ol className="list-decimal list-inside space-y-1 text-gameshow-muted">
                <li>Wygeneruj linki dla wszystkich uczestników</li>
                <li>Wyślij każdemu uczestnikowi jego unikalny link</li>
                <li>Poproś wszystkich o otwarcie linku i udzielenie dostępu do kamery</li>
                <li>Gotowe! Kamery będą automatycznie widoczne w overlayu</li>
              </ol>
            </div>
          </div>
        </div>
        
        {/* Konfiguracja kamery hosta */}
        <div className="bg-gameshow-background/30 p-4 rounded-lg">
          <div className="flex justify-between">
            <h3 className="font-medium">Kamera hosta</h3>
            <Switch 
              checked={hostCamera.enabled}
              onCheckedChange={(checked) => handleUpdateHostCamera('enabled', checked)}
            />
          </div>
          
          <div className="mt-4 space-y-4" hidden={!hostCamera.enabled}>
            <div>
              <label className="block text-sm mb-1">URL kamery (jeśli nie używasz VOD.ninja)</label>
              <Input
                value={hostCamera.url}
                onChange={(e) => handleUpdateHostCamera('url', e.target.value)}
                placeholder="np. https://source-url-kamery"
              />
              <p className="text-xs text-gameshow-muted mt-1">
                Pozostaw pole z linkiem VOD.ninja lub podaj inny URL źródła kamery
              </p>
            </div>
            
            <div>
              <label className="block text-sm mb-2">Pozycja na ekranie</label>
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  variant={hostCamera.position === 'top-left' ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleUpdateHostCamera('position', 'top-left')}
                >
                  Góra-lewo
                </Button>
                <Button 
                  variant={hostCamera.position === 'top-right' ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleUpdateHostCamera('position', 'top-right')}
                >
                  Góra-prawo
                </Button>
                <Button 
                  variant={hostCamera.position === 'center' ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleUpdateHostCamera('position', 'center')}
                >
                  Środek
                </Button>
                <Button 
                  variant={hostCamera.position === 'bottom-left' ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleUpdateHostCamera('position', 'bottom-left')}
                >
                  Dół-lewo
                </Button>
                <Button 
                  variant={hostCamera.position === 'bottom-right' ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleUpdateHostCamera('position', 'bottom-right')}
                >
                  Dół-prawo
                </Button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm mb-1">Rozmiar kamery: {(hostCamera.scale * 100).toFixed(0)}%</label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                value={hostCamera.scale}
                onChange={(e) => handleUpdateHostCamera('scale', parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div className="pt-2">
              <Button 
                onClick={() => {
                  if (!hostCamera.url) {
                    toast.error('Najpierw wygeneruj lub wprowadź URL kamery');
                    return;
                  }
                  
                  window.open(hostCamera.url, '_blank');
                }}
                variant="outline"
                className="w-full flex items-center gap-2"
              >
                <Camera size={16} />
                Otwórz kamere hosta w nowym oknie
              </Button>
            </div>
          </div>
          
          {!hostCamera.enabled && (
            <div className="flex flex-col items-center justify-center p-6 mt-4 bg-gameshow-background/20 rounded-lg text-gameshow-muted">
              <CameraOff size={40} className="mb-2 opacity-50" />
              <p className="text-center">Kamera hosta jest wyłączona</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Kamery graczy */}
      <div className="mt-6 bg-gameshow-background/30 p-4 rounded-lg">
        <h3 className="font-medium mb-4">Kamery graczy</h3>
        
        <div className="flex justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <Switch 
                checked={showCameraGuides}
                onCheckedChange={setShowCameraGuides}
              />
              <label className="text-sm">Pokaż podgląd kamer w overlayu</label>
            </div>
            <p className="text-xs text-gameshow-muted">
              Wyświetla obramowanie i nazwy graczy przy kamerach
            </p>
          </div>
          
          <div>
            <div className="flex items-center gap-2">
              <Switch 
                checked={automaticLayout}
                onCheckedChange={setAutomaticLayout}
              />
              <label className="text-sm">Automatyczny układ</label>
            </div>
            <p className="text-xs text-gameshow-muted">
              Automatycznie układa kamery graczy
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          {playerCameras.map((camera) => (
            <div 
              key={camera.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gameshow-background/20 rounded gap-3"
            >
              <div className="flex items-center gap-2">
                <Switch 
                  checked={camera.enabled}
                  onCheckedChange={(checked) => handleUpdatePlayerCamera(camera.id, 'enabled', checked)}
                />
                <span>{camera.label}</span>
              </div>
              
              <div className="flex flex-wrap sm:flex-nowrap gap-2">
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (!camera.url) {
                      toast.error('Najpierw wygeneruj lub wprowadź URL kamery');
                      return;
                    }
                    window.open(camera.url, '_blank');
                  }}
                  disabled={!camera.enabled || !camera.url}
                  title="Otwórz kamerę w nowym oknie"
                >
                  <Camera size={16} />
                </Button>
                
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (!camera.enabled) return;
                    const newScale = camera.scale < 0.5 ? camera.scale + 0.1 : camera.scale;
                    handleUpdatePlayerCamera(camera.id, 'scale', Math.min(newScale, 1));
                  }}
                  disabled={!camera.enabled}
                  title="Powiększ"
                >
                  <Maximize size={16} />
                </Button>
                
                <Button 
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (!camera.enabled) return;
                    const newScale = camera.scale > 0.1 ? camera.scale - 0.1 : camera.scale;
                    handleUpdatePlayerCamera(camera.id, 'scale', Math.max(newScale, 0.1));
                  }}
                  disabled={!camera.enabled}
                  title="Pomniejsz"
                >
                  <Minimize size={16} />
                </Button>
                
                <select
                  value={camera.position}
                  onChange={(e) => handleUpdatePlayerCamera(
                    camera.id, 
                    'position', 
                    e.target.value as CameraConfig['position']
                  )}
                  className="px-2 py-1 text-sm rounded bg-gameshow-background"
                  disabled={!camera.enabled || automaticLayout}
                >
                  <option value="top-left">Góra-lewo</option>
                  <option value="top-right">Góra-prawo</option>
                  <option value="bottom-left">Dół-lewo</option>
                  <option value="bottom-right">Dół-prawo</option>
                  <option value="center">Środek</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-gameshow-background/20 rounded-lg flex gap-4 items-center">
        <div className="flex-1">
          <h3 className="font-medium">Podgląd układu kamer</h3>
          <p className="text-sm text-gameshow-muted">
            Zmiany będą widoczne po zapisaniu konfiguracji
          </p>
        </div>
        <div>
          <Button variant="outline" onClick={() => toast.info('Funkcja podglądu układu kamer będzie dostępna wkrótce')}>
            <LayoutGrid size={16} className="mr-2" />
            Pokaż podgląd
          </Button>
        </div>
      </div>
      
      <div className="mt-6 flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => toast.info('Funkcja resetowania konfiguracji kamer będzie dostępna wkrótce')}
        >
          <Trash size={16} className="mr-2" />
          Resetuj konfigurację
        </Button>
        
        <Button onClick={handleSaveConfig}>
          Zapisz konfigurację
        </Button>
      </div>
    </div>
  );
};
