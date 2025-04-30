
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import socketService, { SocketEvent, SocketPayloads } from '@/lib/socketService';

interface SocketContextType {
  connected: boolean;
  mockMode: boolean;
  setMockMode: (mockMode: boolean) => void;
  connect: (url?: string) => void;
  disconnect: () => void;
  on: <E extends SocketEvent>(event: E, callback: (data: SocketPayloads[E]) => void) => () => void;
  emit: <E extends SocketEvent>(event: E, data: SocketPayloads[E]) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{
  children: ReactNode;
  initialMockMode?: boolean;
  serverUrl?: string;
}> = ({ 
  children, 
  initialMockMode = process.env.NODE_ENV === 'development',
  serverUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001'
}) => {
  const [connected, setConnected] = useState(socketService.connected);
  const [mockMode, setMockModeState] = useState(initialMockMode);

  // Set initial mock mode
  useEffect(() => {
    socketService.mockMode = initialMockMode;
  }, [initialMockMode]);

  // Update connected status when socket connection changes
  useEffect(() => {
    const unsubscribe = socketService.on('connection:status', (data) => {
      setConnected(data.connected);
    });
    return unsubscribe;
  }, []);

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
