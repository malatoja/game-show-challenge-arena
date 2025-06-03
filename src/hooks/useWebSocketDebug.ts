
import { useState, useEffect } from 'react';
import { useSocket } from '@/context/SocketContext';

interface WebSocketDebugInfo {
  connectionStatus: 'connected' | 'disconnected' | 'connecting' | 'error';
  lastMessageReceived: string | null;
  lastMessageSent: string | null;
  messageCount: number;
  reconnectAttempts: number;
  latency: number;
}

export function useWebSocketDebug() {
  const { connected, mockMode } = useSocket();
  const [debugInfo, setDebugInfo] = useState<WebSocketDebugInfo>({
    connectionStatus: 'disconnected',
    lastMessageReceived: null,
    lastMessageSent: null,
    messageCount: 0,
    reconnectAttempts: 0,
    latency: 0
  });

  useEffect(() => {
    if (mockMode) {
      setDebugInfo(prev => ({
        ...prev,
        connectionStatus: 'connected',
        latency: 0
      }));
      return;
    }

    setDebugInfo(prev => ({
      ...prev,
      connectionStatus: connected ? 'connected' : 'disconnected'
    }));
  }, [connected, mockMode]);

  const logMessage = (type: 'sent' | 'received', message: string) => {
    setDebugInfo(prev => ({
      ...prev,
      messageCount: prev.messageCount + 1,
      [type === 'sent' ? 'lastMessageSent' : 'lastMessageReceived']: message
    }));
  };

  const updateLatency = (latency: number) => {
    setDebugInfo(prev => ({ ...prev, latency }));
  };

  const incrementReconnectAttempts = () => {
    setDebugInfo(prev => ({
      ...prev,
      reconnectAttempts: prev.reconnectAttempts + 1
    }));
  };

  return {
    debugInfo,
    logMessage,
    updateLatency,
    incrementReconnectAttempts
  };
}
