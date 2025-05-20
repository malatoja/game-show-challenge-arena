
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Camera, Video, CameraOff, VideoOff, RefreshCw, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface CameraConfig {
  id: string;
  name: string;
  url: string;
  isActive: boolean;
  position?: 'top' | 'bottom' | 'center';
}

export function CameraConfigTab() {
  const [hostCamera, setHostCamera] = useState({
    url: localStorage.getItem('hostCameraUrl') || '',
    isActive: localStorage.getItem('hostCameraActive') === 'true'
  });
  
  const [playerCameras, setPlayerCameras] = useState<CameraConfig[]>(() => {
    const storedCameras = localStorage.getItem('playerCameras');
    return storedCameras ? JSON.parse(storedCameras) : [];
  });
  
  const [newCameraUrl, setNewCameraUrl] = useState('');
  const [newCameraName, setNewCameraName] = useState('');
  
  // Save cameras to localStorage when they change
  useEffect(() => {
    localStorage.setItem('playerCameras', JSON.stringify(playerCameras));
  }, [playerCameras]);
  
  // Save host camera settings when they change
  useEffect(() => {
    localStorage.setItem('hostCameraUrl', hostCamera.url);
    localStorage.setItem('hostCameraActive', hostCamera.isActive.toString());
  }, [hostCamera]);
  
  // Handler for adding a new camera
  const handleAddCamera = () => {
    if (!newCameraUrl.trim()) {
      toast.error('Podaj prawidłowy adres URL kamery.');
      return;
    }
    
    const newCamera: CameraConfig = {
      id: `camera-${Date.now()}`,
      name: newCameraName.trim() || `Gracz ${playerCameras.length + 1}`,
      url: newCameraUrl.trim(),
      isActive: true,
      position: playerCameras.length < 5 ? 'top' : 'bottom'
    };
    
    setPlayerCameras(prev => [...prev, newCamera]);
    setNewCameraUrl('');
    setNewCameraName('');
    toast.success('Dodano nową kamerę!');
  };
  
  // Handler for removing a camera
  const handleRemoveCamera = (id: string) => {
    setPlayerCameras(prev => prev.filter(camera => camera.id !== id));
    toast.info('Kamera została usunięta.');
  };
  
  // Handler for toggling a camera
  const handleToggleCamera = (id: string) => {
    setPlayerCameras(prev => 
      prev.map(camera => 
        camera.id === id 
          ? { ...camera, isActive: !camera.isActive } 
          : camera
      )
    );
  };
  
  // Handler for toggling host camera
  const handleToggleHostCamera = () => {
    setHostCamera(prev => ({ ...prev, isActive: !prev.isActive }));
    toast.info(hostCamera.isActive 
      ? 'Kamera hosta wyłączona.' 
      : 'Kamera hosta włączona.');
  };
  
  // Handler for updating host camera URL
  const handleUpdateHostCamera = () => {
    toast.success('Zaktualizowano kamerę hosta!');
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6 text-gameshow-text">Konfiguracja Kamer</h2>
      
      {/* Host Camera Section */}
      <Card className="border-2 border-gameshow-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera size={20} />
            Kamera Hosta
          </CardTitle>
          <CardDescription>
            Skonfiguruj swoją kamerę jako hosta teleturnieju. Zalecane połączenie VOD.ninja.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>URL Kamery (VOD.ninja lub podobny)</Label>
              <div className="flex gap-2 mt-1">
                <Input 
                  value={hostCamera.url} 
                  onChange={e => setHostCamera(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://vdo.ninja/?view=XXXX&password=YYYY"
                />
                <Button onClick={handleUpdateHostCamera} size="sm">
                  <RefreshCw size={16} />
                </Button>
              </div>
              <p className="text-xs text-gameshow-muted mt-1">
                Wklej link do swojej kamery z VOD.ninja lub innego serwisu streamingowego.
              </p>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-medium">
                Status: {hostCamera.isActive ? 'Aktywna' : 'Nieaktywna'}
              </span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleToggleHostCamera}
                className={hostCamera.isActive ? "text-green-500 border-green-300" : "text-red-500 border-red-300"}
              >
                {hostCamera.isActive ? (
                  <><CameraOff size={16} className="mr-2" /> Wyłącz</>
                ) : (
                  <><Camera size={16} className="mr-2" /> Włącz</>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Player Cameras Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video size={20} />
            Kamery Graczy
          </CardTitle>
          <CardDescription>
            Dodaj i zarządzaj kamerami poszczególnych graczy. Możesz dodać do 10 kamer.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Add New Camera Form */}
            <div className="space-y-4">
              <h3 className="font-medium">Dodaj nową kamerę</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nazwa gracza</Label>
                  <Input 
                    value={newCameraName} 
                    onChange={e => setNewCameraName(e.target.value)}
                    placeholder="Nazwa gracza"
                  />
                </div>
                <div>
                  <Label>URL Kamery</Label>
                  <Input 
                    value={newCameraUrl} 
                    onChange={e => setNewCameraUrl(e.target.value)}
                    placeholder="https://vdo.ninja/?view=XXXX"
                  />
                </div>
              </div>
              <Button onClick={handleAddCamera} disabled={playerCameras.length >= 10}>
                Dodaj kamerę
              </Button>
            </div>
            
            <Separator />
            
            {/* Camera List */}
            {playerCameras.length > 0 ? (
              <div className="space-y-3">
                {playerCameras.map(camera => (
                  <div 
                    key={camera.id} 
                    className="flex items-center justify-between p-3 rounded-md bg-gameshow-background/50 border border-gameshow-primary/10"
                  >
                    <div>
                      <div className="font-medium">{camera.name}</div>
                      <div className="text-sm text-gameshow-muted truncate max-w-[200px]">
                        {camera.url}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleToggleCamera(camera.id)}
                        className={camera.isActive ? "text-green-500" : "text-red-500"}
                      >
                        {camera.isActive ? (
                          <VideoOff size={16} />
                        ) : (
                          <Video size={16} />
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleRemoveCamera(camera.id)}
                        className="text-red-500"
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gameshow-muted">
                Nie dodano jeszcze żadnych kamer graczy
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
