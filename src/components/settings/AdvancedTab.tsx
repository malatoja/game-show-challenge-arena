
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const AdvancedTab = () => {
  const [activeSubTab, setActiveSubTab] = useState<string>('connection');
  const [webSocketUrl, setWebSocketUrl] = useState<string>('ws://localhost:3001');
  const [reconnectAttempts, setReconnectAttempts] = useState<string>('5');
  const [reconnectDelay, setReconnectDelay] = useState<string>('1000');
  const [debugMode, setDebugMode] = useState<boolean>(false);
  const [consoleEnabled, setConsoleEnabled] = useState<boolean>(true);
  const [overlayConsoleEnabled, setOverlayConsoleEnabled] = useState<boolean>(false);
  const [enableDevTools, setEnableDevTools] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected'>('disconnected');
  
  // Cache settings
  const [cacheEnabled, setCacheEnabled] = useState<boolean>(true);
  const [cacheTimeout, setCacheTimeout] = useState<string>('3600');
  
  // Simulation settings
  const [simulateLatency, setSimulateLatency] = useState<boolean>(false);
  const [latencyAmount, setLatencyAmount] = useState<string>('200');
  
  useEffect(() => {
    // Symuluj połączenie WebSocket
    setTimeout(() => {
      setConnectionStatus('connected');
    }, 1000);
    
    // Załaduj ustawienia z localStorage (symulacja)
    try {
      const advancedSettings = localStorage.getItem('advancedSettings');
      if (advancedSettings) {
        const settings = JSON.parse(advancedSettings);
        setWebSocketUrl(settings.webSocketUrl || 'ws://localhost:3001');
        setReconnectAttempts(settings.reconnectAttempts || '5');
        setReconnectDelay(settings.reconnectDelay || '1000');
        setDebugMode(settings.debugMode || false);
        setConsoleEnabled(settings.consoleEnabled !== undefined ? settings.consoleEnabled : true);
      }
    } catch (error) {
      console.error('Error loading advanced settings:', error);
    }
  }, []);
  
  const handleSaveSettings = () => {
    try {
      const settings = {
        webSocketUrl,
        reconnectAttempts,
        reconnectDelay,
        debugMode,
        consoleEnabled,
        overlayConsoleEnabled,
        enableDevTools,
        cacheEnabled,
        cacheTimeout,
        simulateLatency,
        latencyAmount
      };
      
      localStorage.setItem('advancedSettings', JSON.stringify(settings));
      toast.success('Ustawienia zaawansowane zostały zapisane');
      
      // Tutaj moglibyśmy faktycznie zastosować te ustawienia do połączenia WebSocket
      // w rzeczywistej implementacji
    } catch (error) {
      console.error('Error saving advanced settings:', error);
      toast.error('Wystąpił błąd podczas zapisywania ustawień');
    }
  };
  
  const handleClearCache = () => {
    if (confirm('Czy na pewno chcesz wyczyścić całą pamięć podręczną aplikacji? Może to spowodować utratę niektórych ustawień.')) {
      // Symulacja czyszczenia cache
      toast.success('Pamięć podręczna została wyczyszczona');
    }
  };
  
  const handleTestConnection = () => {
    toast.info('Testowanie połączenia WebSocket...');
    
    // Symulacja testu połączenia
    setTimeout(() => {
      if (Math.random() > 0.3) {
        toast.success('Połączenie WebSocket działa poprawnie');
      } else {
        toast.error('Nie można nawiązać połączenia WebSocket');
      }
    }, 1500);
  };
  
  const handleResetSettings = () => {
    if (confirm('Czy na pewno chcesz przywrócić domyślne ustawienia zaawansowane? Ta akcja nie może być cofnięta.')) {
      setWebSocketUrl('ws://localhost:3001');
      setReconnectAttempts('5');
      setReconnectDelay('1000');
      setDebugMode(false);
      setConsoleEnabled(true);
      setOverlayConsoleEnabled(false);
      setEnableDevTools(false);
      setCacheEnabled(true);
      setCacheTimeout('3600');
      setSimulateLatency(false);
      setLatencyAmount('200');
      
      toast.success('Przywrócono domyślne ustawienia zaawansowane');
    }
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Ustawienia zaawansowane</h2>
      <p className="text-gray-600 mb-6">
        Te ustawienia są przeznaczone dla zaawansowanych użytkowników. Zmiana ich może wpłynąć na działanie aplikacji.
      </p>
      
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="connection">Połączenie</TabsTrigger>
          <TabsTrigger value="debug">Debugowanie</TabsTrigger>
          <TabsTrigger value="cache">Pamięć podręczna</TabsTrigger>
          <TabsTrigger value="testing">Testowanie</TabsTrigger>
        </TabsList>
        
        {/* Ustawienia połączenia */}
        <TabsContent value="connection" className="space-y-6">
          <div className="bg-gameshow-background/30 p-4 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Status połączenia WebSocket</h3>
                <p className="text-sm text-gameshow-muted">Aktualny stan połączenia z serwerem</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span>{connectionStatus === 'connected' ? 'Połączony' : 'Rozłączony'}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gameshow-background/30 p-4 rounded-lg space-y-4">
            <h3 className="font-medium mb-2">Ustawienia WebSocket</h3>
            
            <div>
              <label className="text-sm mb-1 block">Adres WebSocket</label>
              <Input
                value={webSocketUrl}
                onChange={(e) => setWebSocketUrl(e.target.value)}
                placeholder="ws://localhost:3001"
              />
              <p className="text-xs text-gameshow-muted mt-1">
                Format: ws://hostname:port lub wss://hostname:port dla połączeń szyfrowanych
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm mb-1 block">Próby ponownego połączenia</label>
                <Input
                  type="number"
                  value={reconnectAttempts}
                  onChange={(e) => setReconnectAttempts(e.target.value)}
                  min="1"
                  max="20"
                />
              </div>
              
              <div>
                <label className="text-sm mb-1 block">Opóźnienie ponownego połączenia (ms)</label>
                <Input
                  type="number"
                  value={reconnectDelay}
                  onChange={(e) => setReconnectDelay(e.target.value)}
                  min="100"
                  max="10000"
                  step="100"
                />
              </div>
            </div>
            
            <div className="pt-2">
              <Button onClick={handleTestConnection}>
                Testuj połączenie
              </Button>
            </div>
          </div>
        </TabsContent>
        
        {/* Ustawienia debugowania */}
        <TabsContent value="debug" className="space-y-6">
          <div className="bg-gameshow-background/30 p-4 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Tryb debugowania</h3>
                <p className="text-sm text-gameshow-muted">Włącz dodatkowe logi i narzędzia deweloperskie</p>
              </div>
              <Switch 
                checked={debugMode} 
                onCheckedChange={setDebugMode} 
              />
            </div>
            
            <div className="flex items-center justify-between border-t border-gameshow-background pt-3">
              <div>
                <h3 className="font-medium">Logi konsoli</h3>
                <p className="text-sm text-gameshow-muted">Włącz logi w konsoli przeglądarki</p>
              </div>
              <Switch 
                checked={consoleEnabled} 
                onCheckedChange={setConsoleEnabled} 
              />
            </div>
            
            <div className="flex items-center justify-between border-t border-gameshow-background pt-3">
              <div>
                <h3 className="font-medium">Logi w overlayu</h3>
                <p className="text-sm text-gameshow-muted">Wyświetlaj logi bezpośrednio na overlayu gry</p>
              </div>
              <Switch 
                checked={overlayConsoleEnabled} 
                onCheckedChange={setOverlayConsoleEnabled} 
              />
            </div>
            
            <div className="flex items-center justify-between border-t border-gameshow-background pt-3">
              <div>
                <h3 className="font-medium">Narzędzia deweloperskie</h3>
                <p className="text-sm text-gameshow-muted">Włącz dodatkowe narzędzia w interfejsie</p>
              </div>
              <Switch 
                checked={enableDevTools} 
                onCheckedChange={setEnableDevTools} 
              />
            </div>
          </div>
        </TabsContent>
        
        {/* Ustawienia pamięci podręcznej */}
        <TabsContent value="cache" className="space-y-6">
          <div className="bg-gameshow-background/30 p-4 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Pamięć podręczna</h3>
                <p className="text-sm text-gameshow-muted">Włącz zapisywanie danych w pamięci podręcznej</p>
              </div>
              <Switch 
                checked={cacheEnabled} 
                onCheckedChange={setCacheEnabled} 
              />
            </div>
            
            <div>
              <label className="text-sm mb-1 block">Czas ważności cache (sekundy)</label>
              <Input
                type="number"
                value={cacheTimeout}
                onChange={(e) => setCacheTimeout(e.target.value)}
                min="60"
                max="86400" // 24 godziny
                disabled={!cacheEnabled}
              />
            </div>
            
            <div className="pt-2">
              <Button onClick={handleClearCache} disabled={!cacheEnabled}>
                Wyczyść pamięć podręczną
              </Button>
            </div>
          </div>
        </TabsContent>
        
        {/* Ustawienia testowania */}
        <TabsContent value="testing" className="space-y-6">
          <div className="bg-gameshow-background/30 p-4 rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Symulacja opóźnienia</h3>
                <p className="text-sm text-gameshow-muted">Symuluj opóźnienie połączenia dla testów</p>
              </div>
              <Switch 
                checked={simulateLatency} 
                onCheckedChange={setSimulateLatency} 
              />
            </div>
            
            <div>
              <label className="text-sm mb-1 block">Opóźnienie (ms)</label>
              <Input
                type="number"
                value={latencyAmount}
                onChange={(e) => setLatencyAmount(e.target.value)}
                min="0"
                max="5000"
                disabled={!simulateLatency}
              />
            </div>
          </div>
          
          <div className="bg-gameshow-background/30 p-4 rounded-lg space-y-4">
            <h3 className="font-medium mb-2">Diagnostyka</h3>
            
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => toast.info('Uruchomiono test połączenia. Zobacz wyniki w konsoli.')}
              >
                Test połączenia WebSocket
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => toast.info('Uruchomiono test wydajności. Zobacz wyniki w konsoli.')}
              >
                Test wydajności
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => toast.info('Uruchomiono test pamięci. Zobacz wyniki w konsoli.')}
              >
                Test użycia pamięci
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => toast.info('Uruchomiono test zgodności. Zobacz wyniki w konsoli.')}
              >
                Test zgodności przeglądarki
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex justify-between">
        <Button variant="outline" onClick={handleResetSettings}>
          Przywróć domyślne
        </Button>
        <Button onClick={handleSaveSettings}>
          Zapisz ustawienia
        </Button>
      </div>
    </div>
  );
};
