
import React, { useEffect, useState } from 'react';
import { useSocket } from '@/context/SocketContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, BellOff, Wifi, WifiOff } from 'lucide-react';
import { toast } from 'sonner';

interface SocketMessage {
  id: string;
  timestamp: Date;
  event: string;
  data: any;
  type: 'incoming' | 'outgoing';
}

export function WebSocketNotifications() {
  const { connected, mockMode } = useSocket();
  const [messages, setMessages] = useState<SocketMessage[]>([]);
  const [showNotifications, setShowNotifications] = useState(true);

  useEffect(() => {
    if (!connected && !mockMode) {
      toast.error('Połączenie WebSocket zostało utracone');
    } else if (connected && !mockMode) {
      toast.success('Połączenie WebSocket przywrócone');
    }
  }, [connected, mockMode]);

  const addMessage = (event: string, data: any, type: 'incoming' | 'outgoing') => {
    if (!showNotifications) return;
    
    const message: SocketMessage = {
      id: Date.now().toString(),
      timestamp: new Date(),
      event,
      data,
      type
    };
    
    setMessages(prev => [message, ...prev.slice(0, 49)]); // Keep last 50 messages
  };

  const clearMessages = () => {
    setMessages([]);
    toast.info('Wyczyszczono historię wiadomości WebSocket');
  };

  const getStatusColor = () => {
    if (mockMode) return 'yellow';
    return connected ? 'green' : 'red';
  };

  const getStatusText = () => {
    if (mockMode) return 'TRYB DEMO';
    return connected ? 'POŁĄCZONY' : 'ROZŁĄCZONY';
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {connected || mockMode ? (
            <Wifi className="h-5 w-5 text-green-500" />
          ) : (
            <WifiOff className="h-5 w-5 text-red-500" />
          )}
          <h3 className="text-lg font-semibold">Status WebSocket</h3>
          <Badge variant={getStatusColor() === 'green' ? 'default' : 'destructive'}>
            {getStatusText()}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            {showNotifications ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="sm" onClick={clearMessages}>
            Wyczyść
          </Button>
        </div>
      </div>

      {showNotifications && (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {messages.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              Brak wiadomości WebSocket
            </p>
          ) : (
            messages.map(message => (
              <div
                key={message.id}
                className={`p-2 rounded text-xs ${
                  message.type === 'incoming'
                    ? 'bg-blue-50 border-l-4 border-blue-400'
                    : 'bg-green-50 border-l-4 border-green-400'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-medium">{message.event}</span>
                  <span className="text-gray-500">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                {Object.keys(message.data).length > 0 && (
                  <pre className="mt-1 text-xs text-gray-600 overflow-hidden">
                    {JSON.stringify(message.data, null, 2).substring(0, 200)}
                    {JSON.stringify(message.data, null, 2).length > 200 && '...'}
                  </pre>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </Card>
  );
}

export default WebSocketNotifications;
