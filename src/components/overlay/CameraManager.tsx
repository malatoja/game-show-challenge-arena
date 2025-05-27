
import React, { useState, useEffect } from 'react';
import { Player } from '@/types/gameTypes';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, CameraOff, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface CameraManagerProps {
  players: Player[];
  onUpdatePlayerCamera: (playerId: string, cameraUrl: string) => void;
  hostCameraUrl?: string;
  onUpdateHostCamera: (url: string) => void;
}

export function CameraManager({
  players,
  onUpdatePlayerCamera,
  hostCameraUrl = '',
  onUpdateHostCamera
}: CameraManagerProps) {
  const [localHostCamera, setLocalHostCamera] = useState(hostCameraUrl);
  const [playerCameras, setPlayerCameras] = useState<Record<string, string>>({});

  useEffect(() => {
    const cameras: Record<string, string> = {};
    players.forEach(player => {
      cameras[player.id] = player.cameraUrl || '';
    });
    setPlayerCameras(cameras);
  }, [players]);

  const handlePlayerCameraUpdate = (playerId: string, url: string) => {
    setPlayerCameras(prev => ({ ...prev, [playerId]: url }));
    onUpdatePlayerCamera(playerId, url);
    toast.success('Zaktualizowano kamerę gracza');
  };

  const handleHostCameraUpdate = () => {
    onUpdateHostCamera(localHostCamera);
    toast.success('Zaktualizowano kamerę hosta');
  };

  const testCamera = (url: string, type: 'host' | 'player', playerName?: string) => {
    if (!url) {
      toast.error('Brak URL kamery do przetestowania');
      return;
    }

    // Create a test video element to verify the stream
    const video = document.createElement('video');
    video.src = url;
    video.muted = true;
    
    video.onloadstart = () => {
      toast.info(`Testowanie kamery ${type === 'host' ? 'hosta' : playerName}...`);
    };
    
    video.oncanplay = () => {
      toast.success(`Kamera ${type === 'host' ? 'hosta' : playerName} działa poprawnie`);
      video.remove();
    };
    
    video.onerror = () => {
      toast.error(`Błąd kamery ${type === 'host' ? 'hosta' : playerName}. Sprawdź URL.`);
      video.remove();
    };
  };

  return (
    <div className="space-y-6">
      {/* Host Camera */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Camera className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Kamera hosta</h3>
        </div>
        
        <div className="space-y-3">
          <div>
            <Label htmlFor="host-camera">URL strumienia kamery</Label>
            <Input
              id="host-camera"
              value={localHostCamera}
              onChange={(e) => setLocalHostCamera(e.target.value)}
              placeholder="http://localhost:4747/video"
              className="mt-1"
            />
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleHostCameraUpdate} size="sm">
              Zaktualizuj
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => testCamera(localHostCamera, 'host')}
            >
              Test kamery
            </Button>
          </div>
        </div>
      </Card>

      {/* Player Cameras */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Kamery graczy</h3>
        </div>
        
        <div className="space-y-4">
          {players.map(player => (
            <div key={player.id} className="border rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                {player.cameraUrl ? (
                  <Camera className="h-4 w-4 text-green-500" />
                ) : (
                  <CameraOff className="h-4 w-4 text-gray-400" />
                )}
                <span className="font-medium">{player.name}</span>
              </div>
              
              <div className="space-y-2">
                <Input
                  value={playerCameras[player.id] || ''}
                  onChange={(e) => setPlayerCameras(prev => ({
                    ...prev,
                    [player.id]: e.target.value
                  }))}
                  placeholder="URL strumienia kamery gracza"
                  size="sm"
                />
                
                <div className="flex gap-2">
                  <Button 
                    size="sm"
                    onClick={() => handlePlayerCameraUpdate(player.id, playerCameras[player.id] || '')}
                  >
                    Zaktualizuj
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => testCamera(playerCameras[player.id] || '', 'player', player.name)}
                  >
                    Test
                  </Button>
                </div>
              </div>
            </div>
          ))}
          
          {players.length === 0 && (
            <p className="text-gray-500 text-center py-4">
              Brak graczy w grze
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}

export default CameraManager;
