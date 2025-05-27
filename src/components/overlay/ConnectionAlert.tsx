
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ConnectionAlertProps {
  lastError: string | null;
  autoReconnectEnabled: boolean;
  onReconnect: () => void;
  onToggleAutoReconnect: () => void;
  onDismiss: () => void;
}

export function ConnectionAlert({
  lastError,
  autoReconnectEnabled,
  onReconnect,
  onToggleAutoReconnect,
  onDismiss
}: ConnectionAlertProps) {
  return (
    <div className="absolute top-0 left-0 right-0 z-50 p-4">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>
            Problem z połączeniem WebSocket: {lastError || 'Nie można połączyć się z serwerem'}
          </span>
          <div className="flex space-x-2">
            <Button 
              variant={autoReconnectEnabled ? "secondary" : "outline"}
              size="sm" 
              onClick={onToggleAutoReconnect}
            >
              {autoReconnectEnabled ? 'Auto-reconnect: Włączony' : 'Auto-reconnect: Wyłączony'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onReconnect}
              className="flex items-center gap-1"
            >
              <RefreshCw className="h-3 w-3" /> Połącz ponownie
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
            >
              Zamknij
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}

export default ConnectionAlert;
