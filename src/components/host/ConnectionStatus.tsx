
import React, { useState } from 'react';
import { useSocket } from '@/context/SocketContext';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Zap, ZapOff, RefreshCw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const ConnectionStatus: React.FC = () => {
  const { connected, mockMode, lastError, reconnect, setMockMode, connect } = useSocket();
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [serverUrl, setServerUrl] = useState(import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001');
  
  const handleToggleMockMode = () => {
    setMockMode(!mockMode);
  };
  
  const handleServerUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setServerUrl(e.target.value);
  };
  
  const handleConnect = () => {
    connect(serverUrl);
    setIsConfigOpen(false);
  };
  
  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant={connected ? "outline" : "destructive"}
            className={`flex items-center gap-1 ${connected ? 'bg-green-500/20' : 'bg-red-500/20'}`}
          >
            {connected ? (
              <>
                <Zap className="h-3 w-3" />
                {mockMode ? 'Tryb Offline' : 'Połączono'}
              </>
            ) : (
              <>
                <ZapOff className="h-3 w-3" />
                Rozłączono
              </>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          {mockMode 
            ? 'Tryb offline - działania są symulowane lokalnie' 
            : connected 
              ? 'Połączono z serwerem czasu rzeczywistego' 
              : lastError 
                ? `Błąd połączenia: ${lastError}` 
                : 'Nie połączono z serwerem czasu rzeczywistego'
          }
        </TooltipContent>
      </Tooltip>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            title="Opcje połączenia"
          >
            <Settings className="h-3 w-3" />
            <span className="sr-only">Opcje połączenia</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Opcje połączenia</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleToggleMockMode}>
            <div className="flex items-center justify-between w-full">
              <span>Tryb Offline</span>
              <Switch checked={mockMode} />
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsConfigOpen(true)}>
            Konfiguracja serwera
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={reconnect} disabled={mockMode}>
            Połącz ponownie
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      {!mockMode && !connected && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0" 
          onClick={reconnect}
          title="Połącz ponownie"
        >
          <RefreshCw className="h-3 w-3" />
          <span className="sr-only">Połącz ponownie</span>
        </Button>
      )}

      <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfiguracja Połączenia WebSocket</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="server-url">Adres serwera WebSocket</Label>
              <Input 
                id="server-url" 
                value={serverUrl} 
                onChange={handleServerUrlChange}
                placeholder="np. http://localhost:3001"
              />
              <p className="text-sm text-muted-foreground">
                Wpisz pełny adres URL serwera WebSocket
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                id="mock-mode"
                checked={mockMode}
                onCheckedChange={handleToggleMockMode}
              />
              <Label htmlFor="mock-mode">Tryb Offline (mockowane odpowiedzi)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfigOpen(false)}>
              Anuluj
            </Button>
            <Button onClick={handleConnect} disabled={mockMode}>
              Połącz
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ConnectionStatus;
