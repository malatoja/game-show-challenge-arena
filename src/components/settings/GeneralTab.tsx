
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

export function GeneralTab() {
  // Game settings state
  const [gameSettings, setGameSettings] = useState({
    name: 'Quiz Show',
    description: 'Interaktywny teleturniej z pytaniami i nagrodami',
    hostName: 'Prowadzący',
    maxPlayers: 10,
    minPlayers: 2,
    initialLives: 3,
    maxPoints: 1000,
    roundTimeout: 60,
    streamDelay: 4,
    enableChat: true,
    enableSound: true,
    enableAnimation: true,
    debugMode: false,
    language: 'pl'
  });
  
  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('gameSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setGameSettings(prev => ({ ...prev, ...parsedSettings }));
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
      }
    }
  }, []);
  
  // Update a single setting
  const updateSetting = <K extends keyof typeof gameSettings>(key: K, value: typeof gameSettings[K]) => {
    setGameSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  // Save settings to localStorage
  const handleSaveSettings = () => {
    try {
      localStorage.setItem('gameSettings', JSON.stringify(gameSettings));
      toast.success('Ustawienia zostały zapisane');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Nie udało się zapisać ustawień');
    }
  };
  
  // Reset settings to defaults
  const handleResetSettings = () => {
    if (confirm('Czy na pewno chcesz przywrócić domyślne ustawienia? Wprowadzone zmiany zostaną utracone.')) {
      setGameSettings({
        name: 'Quiz Show',
        description: 'Interaktywny teleturniej z pytaniami i nagrodami',
        hostName: 'Prowadzący',
        maxPlayers: 10,
        minPlayers: 2,
        initialLives: 3,
        maxPoints: 1000,
        roundTimeout: 60,
        streamDelay: 4,
        enableChat: true,
        enableSound: true,
        enableAnimation: true,
        debugMode: false,
        language: 'pl'
      });
      toast.info('Przywrócono domyślne ustawienia');
    }
  };
  
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Ustawienia Ogólne</h2>
      
      <Card className="bg-gameshow-card">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Podstawowe informacje</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nazwa teleturnieju</label>
                  <Input 
                    value={gameSettings.name} 
                    onChange={(e) => updateSetting('name', e.target.value)} 
                    maxLength={50}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Opis</label>
                  <Textarea 
                    value={gameSettings.description} 
                    onChange={(e) => updateSetting('description', e.target.value)} 
                    maxLength={200}
                    className="h-24"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Nazwa prowadzącego</label>
                  <Input 
                    value={gameSettings.hostName} 
                    onChange={(e) => updateSetting('hostName', e.target.value)} 
                    maxLength={30}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Język</label>
                  <Select 
                    value={gameSettings.language}
                    onValueChange={(value) => updateSetting('language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Wybierz język" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pl">Polski</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Parametry gry</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Minimalna liczba graczy</label>
                    <Input 
                      type="number"
                      value={gameSettings.minPlayers} 
                      onChange={(e) => updateSetting('minPlayers', parseInt(e.target.value))} 
                      min={1}
                      max={gameSettings.maxPlayers}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Maksymalna liczba graczy</label>
                    <Input 
                      type="number"
                      value={gameSettings.maxPlayers} 
                      onChange={(e) => updateSetting('maxPlayers', parseInt(e.target.value))} 
                      min={gameSettings.minPlayers}
                      max={20}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Początkowa liczba żyć</label>
                    <Input 
                      type="number"
                      value={gameSettings.initialLives} 
                      onChange={(e) => updateSetting('initialLives', parseInt(e.target.value))} 
                      min={1}
                      max={10}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Maksymalna liczba punktów</label>
                    <Input 
                      type="number"
                      value={gameSettings.maxPoints} 
                      onChange={(e) => updateSetting('maxPoints', parseInt(e.target.value))} 
                      min={100}
                      max={10000}
                      step={100}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Domyślny czas rundy (s)</label>
                    <Input 
                      type="number"
                      value={gameSettings.roundTimeout} 
                      onChange={(e) => updateSetting('roundTimeout', parseInt(e.target.value))} 
                      min={10}
                      max={300}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Opóźnienie streamu (s)</label>
                    <Input 
                      type="number"
                      value={gameSettings.streamDelay} 
                      onChange={(e) => updateSetting('streamDelay', parseInt(e.target.value))} 
                      min={0}
                      max={30}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <h3 className="text-xl font-semibold mb-4">Dodatkowe opcje</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Switch 
                id="enableChat" 
                checked={gameSettings.enableChat}
                onCheckedChange={(checked) => updateSetting('enableChat', checked)}
              />
              <label htmlFor="enableChat" className="cursor-pointer">Włącz czat</label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="enableSound" 
                checked={gameSettings.enableSound}
                onCheckedChange={(checked) => updateSetting('enableSound', checked)}
              />
              <label htmlFor="enableSound" className="cursor-pointer">Włącz dźwięki</label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="enableAnimation" 
                checked={gameSettings.enableAnimation}
                onCheckedChange={(checked) => updateSetting('enableAnimation', checked)}
              />
              <label htmlFor="enableAnimation" className="cursor-pointer">Włącz animacje</label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="debugMode" 
                checked={gameSettings.debugMode}
                onCheckedChange={(checked) => updateSetting('debugMode', checked)}
              />
              <label htmlFor="debugMode" className="cursor-pointer">Tryb debugowania</label>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={handleResetSettings}>
          Przywróć domyślne
        </Button>
        <Button onClick={handleSaveSettings}>
          Zapisz ustawienia
        </Button>
      </div>
    </div>
  );
}
