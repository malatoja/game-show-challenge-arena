
import { useState, useEffect } from 'react';
import { useSocket } from '@/context/SocketContext';
import { toast } from 'sonner';

export function useConnectionManager(demoMode: boolean) {
  const { connected, mockMode, setMockMode, connect, reconnect, lastError } = useSocket();
  const [showConnectionAlert, setShowConnectionAlert] = useState(false);
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [autoReconnectEnabled, setAutoReconnectEnabled] = useState(true);
  const [autoReconnectInterval, setAutoReconnectInterval] = useState<NodeJS.Timeout | null>(null);
  
  // Initialize socket connection based on demo mode
  useEffect(() => {
    if (!demoMode) {
      setMockMode(false);
      connect();
      toast.success('Tryb Live: Łączenie z serwerem Socket.IO');
    } else {
      setMockMode(true);
      toast.info('Tryb Demo: Używanie symulowanych danych');
    }
  }, [demoMode, setMockMode, connect]);
  
  // Auto-reconnect system
  useEffect(() => {
    if (autoReconnectInterval) {
      clearInterval(autoReconnectInterval);
      setAutoReconnectInterval(null);
    }
    
    if (!connected && !mockMode && !demoMode && autoReconnectEnabled) {
      const interval = setInterval(() => {
        console.log('[Overlay] Attempting auto-reconnect...');
        reconnect();
        toast.info('Próba automatycznego ponownego połączenia...');
      }, 30000);
      
      setAutoReconnectInterval(interval);
    }
    
    return () => {
      if (autoReconnectInterval) {
        clearInterval(autoReconnectInterval);
      }
    };
  }, [connected, mockMode, demoMode, autoReconnectEnabled, reconnect]);
  
  // Show connection alert when not in demo mode, not connected, and alert not dismissed
  useEffect(() => {
    if (!demoMode && !connected && !alertDismissed) {
      setShowConnectionAlert(true);
    } else {
      setShowConnectionAlert(false);
    }
    
    if (connected) {
      setAlertDismissed(false);
    }
  }, [demoMode, connected, alertDismissed]);
  
  const handleReconnect = () => {
    toast.info('Próba ponownego połączenia...');
    reconnect();
  };
  
  const handleDismissAlert = () => {
    setAlertDismissed(true);
    setShowConnectionAlert(false);
  };
  
  const handleToggleAutoReconnect = () => {
    setAutoReconnectEnabled(prev => !prev);
    toast.info(autoReconnectEnabled 
      ? 'Auto-reconnect wyłączony' 
      : 'Auto-reconnect włączony - system będzie próbował połączyć się automatycznie co 30 sekund');
  };

  return {
    connected,
    showConnectionAlert,
    lastError,
    autoReconnectEnabled,
    handleReconnect,
    handleDismissAlert,
    handleToggleAutoReconnect,
    setAutoReconnectEnabled
  };
}
