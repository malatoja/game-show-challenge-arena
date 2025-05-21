
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
}

const defaultSocketContext: SocketContextType = {
  connected: false,
  lastError: null,
  emit: () => {},
  on: () => () => {},
  reconnect: () => {},
  useMockMode: () => {}
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

  // Initialize the socket with the URL
  useEffect(() => {
    if (mockMode) {
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
  }, [url, mockMode]);

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
      toast.success('Mock mode enabled - using simulated WebSocket');
    } else {
      socketCore.mockMode = false;
      socketCore.reconnect();
      toast.info('Mock mode disabled - connecting to real WebSocket');
    }
  }, []);

  const contextValue: SocketContextType = {
    connected,
    lastError,
    emit,
    on,
    reconnect,
    useMockMode
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
