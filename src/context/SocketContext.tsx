
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import socketService, { SocketEvent, SocketPayloads } from '@/lib/socketService';
import { toast } from 'sonner';

interface SocketContextType {
  connected: boolean;
  mockMode: boolean;
  setMockMode: (mockMode: boolean) => void;
  connect: (url?: string) => void;
  disconnect: () => void;
  on: <E extends SocketEvent>(event: E, callback: (data: SocketPayloads[E]) => void) => () => void;
  emit: <E extends SocketEvent>(event: E, data: SocketPayloads[E]) => void;
  reconnect: () => void;
  lastError: string | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{
  children: ReactNode;
  initialMockMode?: boolean;
  serverUrl?: string;
}> = ({ 
  children, 
  initialMockMode = import.meta.env.DEV,
  serverUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001'
}) => {
  const [connected, setConnected] = useState(socketService.connected);
  const [mockMode, setMockModeState] = useState(initialMockMode);
  const [reconnecting, setReconnecting] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const maxReconnectAttempts = 5;
  const [connectionTimeout, setConnectionTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  // Set initial mock mode
  useEffect(() => {
    socketService.mockMode = initialMockMode;
  }, [initialMockMode]);

  // Update connected status when socket connection changes
  useEffect(() => {
    const unsubscribe = socketService.on('connection:status', (data) => {
      setConnected(data.connected);
      
      if (data.connected) {
        setLastError(null);
        setReconnectAttempts(0);
        if (reconnecting) {
          toast.success('Ponownie połączono z serwerem!');
          setReconnecting(false);
        }
      }
    });
    
    return unsubscribe;
  }, [reconnecting]);

  // Handle connection errors
  useEffect(() => {
    const unsubscribe = socketService.on('connection:error', (data) => {
      console.error(`[Socket] Connection error: ${data.message}`);
      setLastError(data.message);
      
      // Auto-reconnect when not in mock mode
      if (!mockMode && reconnectAttempts < maxReconnectAttempts) {
        if (!reconnecting) {
          setReconnecting(true);
          toast.info('Próba ponownego połączenia...');
        }
        
        const nextAttempt = reconnectAttempts + 1;
        setReconnectAttempts(nextAttempt);
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000); // Exponential backoff
        
        console.log(`[Socket] Reconnecting in ${delay/1000}s (attempt ${nextAttempt}/${maxReconnectAttempts})`);
        
        // Clear any existing timeout
        if (connectionTimeout) {
          clearTimeout(connectionTimeout);
        }
        
        // Set new timeout for reconnection
        const timeout = setTimeout(() => connect(serverUrl), delay);
        setConnectionTimeout(timeout);
      } else if (reconnectAttempts >= maxReconnectAttempts) {
        toast.error(`Osiągnięto maksymalną liczbę prób połączenia (${maxReconnectAttempts}). Spróbuj ponownie później.`);
        setReconnecting(false);
      }
    });
    
    return () => {
      unsubscribe();
      
      // Clear any existing timeout on unmount
      if (connectionTimeout) {
        clearTimeout(connectionTimeout);
      }
    };
  }, [mockMode, serverUrl, reconnecting, reconnectAttempts, maxReconnectAttempts, connectionTimeout]);

  // Set mock mode function
  const setMockMode = (value: boolean) => {
    socketService.mockMode = value;
    setMockModeState(value);
    
    if (value) {
      // Disconnect when switching to mock mode
      disconnect();
      setConnected(false);
      console.log('[Socket] Switched to mock mode');
      toast.success('Przełączono na tryb offline (mock)');
    } else {
      // Connect when switching from mock mode
      toast.info('Przełączono na tryb online, nawiązywanie połączenia...');
      setTimeout(() => connect(serverUrl), 500);
    }
  };

  // Connect function with more robust error handling
  const connect = (url?: string) => {
    if (mockMode) {
      console.log('[Socket] Mock mode active, using mock connection');
      setConnected(true);
      socketService.emit('connection:status', { connected: true });
      return;
    }
    
    try {
      if (url) {
        console.log(`[Socket] Initializing with URL: ${url}`);
        socketService.initialize(url);
      } else if (serverUrl) {
        console.log(`[Socket] Connecting to previously set URL: ${serverUrl}`);
        socketService.connect();
      } else {
        console.error('[Socket] No URL provided for connection');
        toast.error('Błąd konfiguracji: Brak adresu URL serwera WebSocket');
        setLastError('Brak adresu URL serwera');
        return;
      }
    } catch (error) {
      console.error('[Socket] Connection error:', error);
      setLastError(error instanceof Error ? error.message : 'Unknown error');
      toast.error(`Błąd połączenia: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };
  
  // Disconnect function
  const disconnect = () => {
    if (connectionTimeout) {
      clearTimeout(connectionTimeout);
      setConnectionTimeout(null);
    }
    
    socketService.disconnect();
    setConnected(false);
  };
  
  // Reconnect function - hard reset of the connection
  const reconnect = () => {
    disconnect();
    setReconnectAttempts(0);
    setLastError(null);
    setReconnecting(true);
    toast.info('Próba ponownego ustanowienia połączenia...');
    
    // Short delay to ensure disconnect completes
    setTimeout(() => {
      connect(serverUrl);
    }, 500);
  };

  // Auto-connect when we're not in mock mode
  useEffect(() => {
    if (!mockMode) {
      connect(serverUrl);
    }
    
    // Cleanup on unmount
    return () => {
      if (connectionTimeout) {
        clearTimeout(connectionTimeout);
      }
      disconnect();
    };
  }, [mockMode, serverUrl]);

  // Connection health check timer
  useEffect(() => {
    // Set up a periodic check to ensure connection is working
    const healthCheckInterval = setInterval(() => {
      if (!mockMode && !connected && !reconnecting) {
        console.log('[Socket] Health check: connection down, attempting reconnect');
        reconnect();
      }
    }, 60000); // Check every minute
    
    return () => {
      clearInterval(healthCheckInterval);
    };
  }, [mockMode, connected, reconnecting]);

  const value: SocketContextType = {
    connected,
    mockMode,
    setMockMode,
    connect,
    disconnect,
    on: (event, callback) => socketService.on(event, callback),
    emit: (event, data) => socketService.emit(event, data),
    reconnect,
    lastError
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  
  return context;
};
