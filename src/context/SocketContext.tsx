
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import socketCore from '@/lib/socket/socketCore';
import { SocketEvent, PayloadFor } from '@/lib/socket/socketTypes';
import { toast } from 'sonner';

interface SocketContextType {
  connected: boolean;
  lastError: string | null;
  emit: <E extends SocketEvent>(event: E, payload: PayloadFor<E>) => void;
  on: <E extends SocketEvent>(event: E, callback: (payload: PayloadFor<E>) => void) => () => void;
  reconnect: () => void;
  useMockMode: (enable: boolean) => void;
  mockMode: boolean;
  setMockMode: (enable: boolean) => void;
  connect: (url?: string) => void;
}

const defaultSocketContext: SocketContextType = {
  connected: false,
  lastError: null,
  emit: () => {},
  on: () => () => {},
  reconnect: () => {},
  useMockMode: () => {},
  mockMode: false,
  setMockMode: () => {},
  connect: () => {}
};

const SocketContext = createContext<SocketContextType>(defaultSocketContext);

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: React.ReactNode;
  url?: string;
  mockMode?: boolean;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ 
  children, 
  url = 'http://localhost:3001',
  mockMode = false
}) => {
  const [connected, setConnected] = useState<boolean>(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [isMockMode, setIsMockMode] = useState<boolean>(mockMode);

  // Initialize the socket with the URL
  useEffect(() => {
    if (isMockMode) {
      socketCore.mockMode = true;
      setConnected(true);
      return;
    }

    socketCore.init(url, {
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      autoConnect: true,
      transports: ['websocket', 'polling']
    });

    const unsubConnection = socketCore.on('connection:status' as SocketEvent, (data: any) => {
      if (data && 'connected' in data) {
        setConnected(data.connected);
      }
    });

    const unsubError = socketCore.on('connection:error' as SocketEvent, (data: any) => {
      if (data && 'message' in data) {
        setLastError(data.message);
        toast.error(`WebSocket error: ${data.message}`);
      }
    });

    return () => {
      unsubConnection();
      unsubError();
      socketCore.disconnect();
    };
  }, [url, isMockMode]);

  // Emit an event
  const emit = useCallback(<E extends SocketEvent>(event: E, payload: PayloadFor<E>) => {
    socketCore.emit(event, payload);
  }, []);

  // Subscribe to an event
  const on = useCallback(<E extends SocketEvent>(
    event: E, 
    callback: (payload: PayloadFor<E>) => void
  ): (() => void) => {
    return socketCore.on(event, callback);
  }, []);

  // Force a reconnection
  const reconnect = useCallback(() => {
    socketCore.reconnect();
  }, []);

  // Enable or disable mock mode
  const useMockMode = useCallback((enable: boolean) => {
    if (enable) {
      socketCore.mockMode = true;
      setConnected(true);
      setIsMockMode(true);
      toast.success('Mock mode enabled - using simulated WebSocket');
    } else {
      socketCore.mockMode = false;
      setIsMockMode(false);
      socketCore.reconnect();
      toast.info('Mock mode disabled - connecting to real WebSocket');
    }
  }, []);

  // Set mock mode directly
  const setMockMode = useCallback((enable: boolean) => {
    if (enable) {
      socketCore.mockMode = true;
      setConnected(true);
    } else {
      socketCore.mockMode = false;
    }
    setIsMockMode(enable);
  }, []);

  // Connect to a specific URL
  const connect = useCallback((newUrl?: string) => {
    if (isMockMode) {
      toast.info('Cannot connect in mock mode. Disable mock mode first.');
      return;
    }
    
    socketCore.init(newUrl || url, {
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
      autoConnect: true,
      transports: ['websocket', 'polling']
    });
    
    toast.info('Connecting to WebSocket server...');
  }, [isMockMode, url]);

  const contextValue: SocketContextType = {
    connected,
    lastError,
    emit,
    on,
    reconnect,
    useMockMode,
    mockMode: isMockMode,
    setMockMode,
    connect
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
