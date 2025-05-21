import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useGame } from '@/context/GameContext';
import { useSocket } from '@/context/SocketContext';
import { toast } from 'sonner';
import { 
  Camera, 
  CameraOff, 
  Monitor, 
  Eye, 
  EyeOff,
  RefreshCw,
  Tv,
  Settings
} from 'lucide-react';
import { SoundType } from '@/lib/soundService';
import { Question } from '@/types/gameTypes';

interface CameraConfig {
  url: string;
  active: boolean;
  playerName?: string;
  playerId?: string;
}

interface OverlayData {
  question?: Question;
  activePlayerId?: string;
  category?: string;
  difficulty?: number;
  timeRemaining?: number;
  showHint?: boolean;
  hostCamera?: CameraConfig;
  playerCameras?: CameraConfig[];
  animateTimer?: boolean;
}

export default function CameraOverlayTab() {
  const { state } = useGame();
  const { connected, emit, mockMode } = useSocket();
  
  // Camera configurations
  const [hostCamera, setHostCamera] = useState<CameraConfig>({
    url: localStorage.getItem('hostCameraUrl') || '',
    active: localStorage.getItem('hostCameraActive') === 'true'
  });
  
  const [playerCameras, setPlayerCameras] = useState<CameraConfig[]>([]);
  const [previewMode, setPreviewMode] = useState<'host' | 'player' | 'all'>('all');
  
  // OBS integration status
  const [obsConnected, setObsConnected] = useState(false);
  const [obsAddress, setObsAddress] = useState(localStorage.getItem('obsWebsocketUrl') || 'localhost:4444');
  const [obsPassword, setObsPassword] = useState(localStorage.getItem('obsWebsocketPassword') || '');
  
  // Initialize player cameras from state and localStorage
  useEffect(() => {
    const storedCameras = localStorage.getItem('playerCameras');
    let cameras: CameraConfig[] = [];
    
    if (storedCameras) {
      try {
        cameras = JSON.parse(storedCameras);
      } catch (e) {
        console.error('Error parsing stored cameras:', e);
      }
    }
    
    // Merge with current players to ensure we have all players
    const mergedCameras = state.players.map(player => {
      const existingCamera = cameras.find(cam => cam.playerId === player.id);
      return existingCamera || {
        playerId: player.id,
        playerName: player.name,
        url: player.streamUrl || '',
        active: false
      };
    });
    
    setPlayerCameras(mergedCameras);
  }, [state.players]);
  
  // Update host camera
  const updateHostCamera = () => {
    localStorage.setItem('hostCameraUrl', hostCamera.url);
    localStorage.setItem('hostCameraActive', hostCamera.active.toString());
    
    // Send to overlay via socket
    emit('overlay:update', { hostCamera } as OverlayData);
    
    toast.success("Zaktualizowano kamerę hosta");
  };
  
  // Update player camera
  const updatePlayerCamera = (index: number, updates: Partial<CameraConfig>) => {
    const newCameras = [...playerCameras];
    newCameras[index] = { ...newCameras[index], ...updates };
    setPlayerCameras(newCameras);
    
    localStorage.setItem('playerCameras', JSON.stringify(newCameras));
    
    // Send to overlay via socket
    emit('overlay:update', { playerCameras: newCameras } as OverlayData);
  };
  
  // Connect to OBS
  const connectToObs = () => {
    localStorage.setItem('obsWebsocketUrl', obsAddress);
    localStorage.setItem('obsWebsocketPassword', obsPassword);
    
    // Mock connection for now
    setObsConnected(true);
    toast.success("Połączono z OBS WebSocket");
    
    // In a real implementation, this would establish a WebSocket connection to OBS
  };
  
  // Disconnect from OBS
  const disconnectFromObs = () => {
    setObsConnected(false);
    toast.info("Rozłączono z OBS WebSocket");
    
    // In a real implementation, this would close the WebSocket connection to OBS
  };

  // Fix confetti emit call
  const handleTestConfetti = () => {
    emit('overlay:confetti', { playerId: 'test' });  // Add required playerId
  };

  // Fix timer animation emit call
  const handleTestTimerAnimation = () => {
    emit('overlay:update', { animateTimer: true } as OverlayData);
  };

  // Fix sound emit call
  const handleTestSound = () => {
    emit('overlay:sound', { type: 'correct' as SoundType });
  };

  return (
    <div className="space-y-6">
      {/* WebSocket Status */}
      <Card className="bg-gameshow-card shadow-md">
        <CardContent className="p-4">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Monitor size={18} />
            Status połączenia
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">WebSocket</h4>
                  <p className="text-sm text-gameshow-muted">
                    {mockMode ? "Tryb lokalny (bez WebSocket)" : "Połączenie z nakładką"}
                  </p>
                </div>
                <div className={`w-3 h-3 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`} />
              </div>
              {!mockMode && !connected && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw size={14} className="mr-2" />
                  Odśwież połączenie
                </Button>
              )}
            </div>
            
            <div className="p-4 border rounded">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">OBS WebSocket</h4>
                  <p className="text-sm text-gameshow-muted">
                    Integracja z OBS Studio
                  </p>
                </div>
                <div className={`w-3 h-3 rounded-full ${obsConnected ? "bg-green-500" : "bg-red-500"}`} />
              </div>
              {!obsConnected ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={connectToObs}
                >
                  Połącz
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={disconnectFromObs}
                >
                  Rozłącz
                </Button>
              )}
            </div>
          </div>
          
          {/* OBS Integration Settings */}
          <div className="mt-4 p-4 border rounded">
            <h4 className="font-medium mb-3">Ustawienia OBS WebSocket</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="obs-address">Adres WebSocket</Label>
                <Input
                  id="obs-address"
                  placeholder="localhost:4444"
                  value={obsAddress}
                  onChange={(e) => setObsAddress(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="obs-password">Hasło (opcjonalnie)</Label>
                <Input
                  id="obs-password"
                  type="password"
                  placeholder="••••••••"
                  value={obsPassword}
                  onChange={(e) => setObsPassword(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Host Camera */}
      <Card className="bg-gameshow-card shadow-md">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Camera size={18} />
              Kamera hosta
            </h3>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="host-camera-active">Aktywna</Label>
                <Switch
                  id="host-camera-active"
                  checked={hostCamera.active}
                  onCheckedChange={(checked) => {
                    setHostCamera(prev => ({ ...prev, active: checked }));
                  }}
                />
              </div>
              <Button 
                size="sm"
                onClick={updateHostCamera}
              >
                Zapisz
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="host-camera-url">URL kamery (VOD.ninja)</Label>
              <Input
                id="host-camera-url"
                placeholder="https://vdo.ninja/?view=..."
                value={hostCamera.url}
                onChange={(e) => setHostCamera(prev => ({ ...prev, url: e.target.value }))}
              />
              <p className="text-xs text-gameshow-muted">
                Wklej tutaj link do VOD.ninja lub innej platformy streamingowej.
              </p>
            </div>
            
            {hostCamera.active && hostCamera.url && (
              <div className="border rounded p-2 aspect-video">
                <iframe
                  src={hostCamera.url}
                  title="Host Camera"
                  className="w-full h-full"
                  allow="camera; microphone; fullscreen; display-capture; autoplay"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Player Cameras */}
      <Card className="bg-gameshow-card shadow-md">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Tv size={18} />
              Kamery graczy
            </h3>
            
            <div className="flex items-center space-x-2">
              <Label htmlFor="preview-mode">Podgląd:</Label>
              <div className="flex border rounded-md">
                <Button
                  variant={previewMode === 'host' ? "secondary" : "ghost"}
                  size="sm"
                  className="rounded-r-none"
                  onClick={() => setPreviewMode('host')}
                >
                  Host
                </Button>
                <Button
                  variant={previewMode === 'player' ? "secondary" : "ghost"}
                  size="sm"
                  className="rounded-none border-x"
                  onClick={() => setPreviewMode('player')}
                >
                  Gracze
                </Button>
                <Button
                  variant={previewMode === 'all' ? "secondary" : "ghost"}
                  size="sm"
                  className="rounded-l-none"
                  onClick={() => setPreviewMode('all')}
                >
                  Wszystko
                </Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            {playerCameras.map((camera, index) => (
              <div 
                key={camera.playerId} 
                className={`border rounded-lg p-4 ${
                  camera.active ? 'border-green-500' : 'border-gray-300'
                }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ 
                        backgroundColor: state.players.find(p => p.id === camera.playerId)?.color || '#ff5722' 
                      }}
                    />
                    <h4 className="font-medium">{camera.playerName}</h4>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={`camera-${index}-active`}>Aktywna</Label>
                      <Switch
                        id={`camera-${index}-active`}
                        checked={camera.active}
                        onCheckedChange={(checked) => {
                          updatePlayerCamera(index, { active: checked });
                        }}
                      />
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        const newActive = !camera.active;
                        updatePlayerCamera(index, { active: newActive });
                        toast.info(
                          newActive 
                            ? `Kamera gracza ${camera.playerName} włączona` 
                            : `Kamera gracza ${camera.playerName} wyłączona`
                        );
                      }}
                    >
                      {camera.active ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor={`camera-${index}-url`}>URL kamery</Label>
                    <Input
                      id={`camera-${index}-url`}
                      placeholder="https://vdo.ninja/?view=..."
                      value={camera.url}
                      onChange={(e) => updatePlayerCamera(index, { url: e.target.value })}
                    />
                  </div>
                  
                  {(previewMode === 'player' || previewMode === 'all') && camera.active && camera.url && (
                    <div className="border rounded p-1 aspect-video">
                      <iframe
                        src={camera.url}
                        title={`Player ${camera.playerName} Camera`}
                        className="w-full h-full"
                        allow="camera; microphone; fullscreen; display-capture; autoplay"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Overlay Preview */}
      <Card className="bg-gameshow-card shadow-md">
        <CardContent className="p-4">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Settings size={18} />
            Testowanie nakładki
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button onClick={handleTestConfetti}>
                Test konfetti
              </Button>
              <Button onClick={handleTestTimerAnimation}>
                Test animacji timera
              </Button>
              <Button onClick={handleTestSound}>
                Test dźwięku poprawnej odpowiedzi
              </Button>
            </div>
            
            <p className="text-sm text-gameshow-muted mt-2">
              Możesz przetestować funkcje nakładki używając powyższych przycisków.
              Upewnij się, że nakładka jest otwarta i połączona przez WebSocket.
            </p>
            
            <div className="mt-4 p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Link do nakładki</h4>
              <div className="flex space-x-2">
                <Input 
                  readOnly
                  value={window.location.origin + "/overlay"}
                />
                <Button
                  onClick={() => {
                    const url = window.location.origin + "/overlay";
                    navigator.clipboard.writeText(url);
                    toast.success("Link skopiowany do schowka");
                  }}
                >
                  Kopiuj
                </Button>
              </div>
              <p className="text-xs text-gameshow-muted mt-2">
                Dodaj ten link jako źródło przeglądarki w OBS Studio.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
