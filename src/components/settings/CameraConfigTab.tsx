
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Camera, CameraOff, User, RefreshCw } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface CameraConfig {
  hostCameraUrl: string;
  showHostCamera: boolean;
  hostCameraPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  playerCameraUrls: Record<string, string>;
  activeCameras: string[];
}

export function CameraConfigTab() {
  const [activeTab, setActiveTab] = useState('host');
  const [cameraConfig, setCameraConfig] = useState<CameraConfig>({
    hostCameraUrl: '',
    showHostCamera: false,
    hostCameraPosition: 'bottom-right',
    playerCameraUrls: {},
    activeCameras: []
  });
  const [playerIdInput, setPlayerIdInput] = useState('');
  const [cameraUrlInput, setCameraUrlInput] = useState('');
  
  // Load camera config from localStorage on component mount
  useEffect(() => {
    const storedConfig = localStorage.getItem('cameraConfig');
    if (storedConfig) {
      try {
        setCameraConfig(JSON.parse(storedConfig));
      } catch (error) {
        console.error('Error parsing camera config:', error);
      }
    }
  }, []);
  
  // Save camera config to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('cameraConfig', JSON.stringify(cameraConfig));
    } catch (error) {
      console.error('Error saving camera config:', error);
    }
  }, [cameraConfig]);
  
  const handleHostCameraUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCameraConfig(prev => ({
      ...prev,
      hostCameraUrl: event.target.value
    }));
  };
  
  const handleShowHostCameraChange = (checked: boolean) => {
    setCameraConfig(prev => ({
      ...prev,
      showHostCamera: checked
    }));
  };
  
  const handlePositionChange = (position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center') => {
    setCameraConfig(prev => ({
      ...prev,
      hostCameraPosition: position
    }));
  };
  
  const handleAddPlayerCamera = () => {
    if (!playerIdInput || !cameraUrlInput) {
      toast.error('Wprowadź ID gracza i URL kamery');
      return;
    }
    
    setCameraConfig(prev => ({
      ...prev,
      playerCameraUrls: {
        ...prev.playerCameraUrls,
        [playerIdInput]: cameraUrlInput
      }
    }));
    
    toast.success(`Dodano kamerę dla gracza ${playerIdInput}`);
    setPlayerIdInput('');
    setCameraUrlInput('');
  };
  
  const handleRemovePlayerCamera = (playerId: string) => {
    setCameraConfig(prev => {
      const newUrls = { ...prev.playerCameraUrls };
      delete newUrls[playerId];
      
      // Also remove from active cameras if it exists
      const newActive = prev.activeCameras.filter(id => id !== playerId);
      
      return {
        ...prev,
        playerCameraUrls: newUrls,
        activeCameras: newActive
      };
    });
    
    toast.success(`Usunięto kamerę dla gracza ${playerId}`);
  };
  
  const handleToggleActiveCamera = (playerId: string, isActive: boolean) => {
    setCameraConfig(prev => {
      if (isActive) {
        // Add to active cameras
        return {
          ...prev,
          activeCameras: [...prev.activeCameras, playerId]
        };
      } else {
        // Remove from active cameras
        return {
          ...prev,
          activeCameras: prev.activeCameras.filter(id => id !== playerId)
        };
      }
    });
  };
  
  const handleGenerateVODNinjaLink = () => {
    const baseUrl = 'https://vdo.ninja/?view=';
    const roomId = Math.random().toString(36).substring(2, 8);
    
    setCameraUrlInput(`${baseUrl}${roomId}`);
    toast.info(`Wygenerowano link VOD.ninja z ID pokoju: ${roomId}`);
  };
  
  const handleGenerateHostLink = () => {
    const baseUrl = 'https://vdo.ninja/?room=';
    const roomId = Math.random().toString(36).substring(2, 8);
    
    setCameraConfig(prev => ({
      ...prev,
      hostCameraUrl: `${baseUrl}${roomId}`
    }));
    
    toast.info(`Wygenerowano link dla hosta z ID pokoju: ${roomId}`);
  };
  
  const handleResetConfig = () => {
    if (window.confirm('Czy na pewno chcesz zresetować konfigurację kamer?')) {
      setCameraConfig({
        hostCameraUrl: '',
        showHostCamera: false,
        hostCameraPosition: 'bottom-right',
        playerCameraUrls: {},
        activeCameras: []
      });
      toast.success('Zresetowano konfigurację kamer');
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Konfiguracja Kamer</h2>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="host">Kamera Hosta</TabsTrigger>
          <TabsTrigger value="players">Kamery Graczy</TabsTrigger>
        </TabsList>
        
        <TabsContent value="host" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Konfiguracja Kamery Hosta</CardTitle>
              <CardDescription>
                Ustaw parametry kamery hosta, która będzie widoczna w overlayu
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="showHostCamera">Pokaż kamerę hosta</Label>
                <Switch 
                  id="showHostCamera" 
                  checked={cameraConfig.showHostCamera}
                  onCheckedChange={handleShowHostCameraChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hostCameraUrl">URL kamery hosta (VOD.ninja)</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="hostCameraUrl"
                    placeholder="np. https://vdo.ninja/?room=abcdef" 
                    value={cameraConfig.hostCameraUrl}
                    onChange={handleHostCameraUrlChange}
                  />
                  <Button onClick={handleGenerateHostLink} type="button" variant="outline">
                    Generuj
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Pozycja na ekranie</Label>
                <Select 
                  value={cameraConfig.hostCameraPosition} 
                  onValueChange={(val) => handlePositionChange(val as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Wybierz pozycję" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top-left">Góra - Lewo</SelectItem>
                    <SelectItem value="top-right">Góra - Prawo</SelectItem>
                    <SelectItem value="bottom-left">Dół - Lewo</SelectItem>
                    <SelectItem value="bottom-right">Dół - Prawo</SelectItem>
                    <SelectItem value="center">Środek</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {cameraConfig.hostCameraUrl && (
                <div className="border rounded-md p-4 mt-4">
                  <h4 className="font-medium mb-2">Podgląd ustawień</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium">URL:</div>
                    <div className="truncate">{cameraConfig.hostCameraUrl}</div>
                    <div className="font-medium">Widoczność:</div>
                    <div>{cameraConfig.showHostCamera ? 'Widoczna' : 'Ukryta'}</div>
                    <div className="font-medium">Pozycja:</div>
                    <div>{cameraConfig.hostCameraPosition}</div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleResetConfig}>
                Resetuj
              </Button>
              <Button onClick={() => toast.success('Ustawienia kamery hosta zaktualizowane')}>
                Zapisz ustawienia
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="players" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dodaj Kamerę Gracza</CardTitle>
              <CardDescription>
                Skonfiguruj kamery graczy do wyświetlania w trakcie gry
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="playerId">ID Gracza</Label>
                <Input 
                  id="playerId" 
                  placeholder="np. player1" 
                  value={playerIdInput}
                  onChange={(e) => setPlayerIdInput(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cameraUrl">URL Kamery (VOD.ninja)</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="cameraUrl" 
                    placeholder="np. https://vdo.ninja/?view=abcdef" 
                    value={cameraUrlInput}
                    onChange={(e) => setCameraUrlInput(e.target.value)}
                  />
                  <Button onClick={handleGenerateVODNinjaLink} type="button" variant="outline">
                    Generuj
                  </Button>
                </div>
              </div>
              
              <Button onClick={handleAddPlayerCamera} className="w-full">
                Dodaj Kamerę
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Zarządzanie Kamerami Graczy</CardTitle>
              <CardDescription>
                Lista skonfigurowanych kamer graczy
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(cameraConfig.playerCameraUrls).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(cameraConfig.playerCameraUrls).map(([playerId, url]) => (
                    <div key={playerId} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id={`active-${playerId}`}
                          checked={cameraConfig.activeCameras.includes(playerId)}
                          onCheckedChange={(checked) => handleToggleActiveCamera(playerId, checked === true)}
                        />
                        <div>
                          <p className="font-medium">{playerId}</p>
                          <p className="text-sm text-gray-500 truncate max-w-[200px]">{url}</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleRemovePlayerCamera(playerId)}
                      >
                        <X size={18} />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Camera className="mx-auto h-12 w-12 opacity-20" />
                  <p className="mt-2">Brak skonfigurowanych kamer graczy</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                disabled={Object.keys(cameraConfig.playerCameraUrls).length === 0}
                onClick={() => toast.success('Kamery graczy zaktualizowane')}
              >
                Zapisz ustawienia
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Separator />
      
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
        <h3 className="font-medium text-amber-800 flex items-center mb-2">
          <RefreshCw className="mr-2 h-4 w-4" />
          Integracja z VOD.ninja
        </h3>
        <p className="text-sm text-amber-700">
          VOD.ninja to darmowe narzędzie do dodawania strumieni wideo na stronie internetowej.
          Aby skonfigurować kamerę, wygeneruj link i udostępnij go graczowi. Gracz powinien
          otworzyć link w przeglądarce i zezwolić na dostęp do kamery.
        </p>
        <Button 
          variant="link" 
          className="text-amber-800 p-0 h-auto mt-2 text-sm"
          onClick={() => window.open('https://vdo.ninja/', '_blank')}
        >
          Dowiedz się więcej o VOD.ninja
        </Button>
      </div>
    </div>
  );
}

export default CameraConfigTab;
