
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
  reconnect: () => void; // Added reconnect function
  lastError: string | null; // Track the last error
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

  // Set initial mock mode
  useEffect(() => {
    socketService.mockMode = initialMockMode;
  }, [initialMockMode]);

  // Update connected status when socket connection changes
  useEffect(() => {
    const unsubscribe = socketService.on('connection:status', (data) => {
      setConnected(data.connected);
      
      if (!data.connected && reconnecting) {
        toast.info('Próba ponownego połączenia...');
      } else if (data.connected && reconnecting) {
        toast.success('Ponownie połączono z serwerem!');
        setReconnecting(false);
        setReconnectAttempts(0);
        setLastError(null);
      }
    });
    
    return unsubscribe;
  }, [reconnecting]);

  // Handle connection errors
  useEffect(() => {
    const unsubscribe = socketService.on('connection:error', (data) => {
      toast.error(`Błąd połączenia: ${data.message}`);
      setLastError(data.message);
      
      // Auto-reconnect when not in mock mode
      if (!mockMode && !reconnecting && reconnectAttempts < maxReconnectAttempts) {
        setReconnecting(true);
        setReconnectAttempts(prev => prev + 1);
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000); // Exponential backoff
        
        console.log(`[Socket] Reconnecting in ${delay/1000}s (attempt ${reconnectAttempts + 1}/${maxReconnectAttempts})`);
        setTimeout(() => connect(serverUrl), delay);
      } else if (reconnectAttempts >= maxReconnectAttempts) {
        toast.error(`Osiągnięto maksymalną liczbę prób połączenia (${maxReconnectAttempts}). Spróbuj ponownie później.`);
        setReconnecting(false);
      }
    });
    
    return unsubscribe;
  }, [mockMode, serverUrl, reconnecting, reconnectAttempts, maxReconnectAttempts]);

  // Set mock mode function
  const setMockMode = (value: boolean) => {
    socketService.mockMode = value;
    setMockModeState(value);
  };

  // Connect function
  const connect = (url?: string) => {
    if (url) {
      socketService.initialize(url);
    } else {
      socketService.connect();
    }
  };
  
  // Reconnect function - resets the connection
  const reconnect = () => {
    socketService.disconnect();
    setReconnectAttempts(0);
    setLastError(null);
    setTimeout(() => connect(serverUrl), 500);
    toast.info('Próba ponownego ustanowienia połączenia...');
  };

  // Auto-connect when we're not in mock mode
  useEffect(() => {
    if (!mockMode) {
      connect(serverUrl);
    }
    
    return () => {
      socketService.disconnect();
    };
  }, [mockMode, serverUrl]);

  const value: SocketContextType = {
    connected,
    mockMode,
    setMockMode,
    connect,
    disconnect: () => socketService.disconnect(),
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
