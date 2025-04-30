
import React from 'react';
import { useSocket } from '@/context/SocketContext';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Zap, ZapOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ConnectionStatus: React.FC = () => {
  const { connected, mockMode, lastError, reconnect } = useSocket();
  
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
                {mockMode ? 'Mock Mode' : 'Connected'}
              </>
            ) : (
              <>
                <ZapOff className="h-3 w-3" />
                Disconnected
              </>
            )}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          {mockMode 
            ? 'Running in mock mode - actions are simulated locally' 
            : connected 
              ? 'Connected to real-time server' 
              : lastError 
                ? `Connection error: ${lastError}` 
                : 'Not connected to real-time server'
          }
        </TooltipContent>
      </Tooltip>
      
      {!mockMode && !connected && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0" 
          onClick={reconnect}
          title="Reconnect"
        >
          <RefreshCw className="h-3 w-3" />
          <span className="sr-only">Reconnect</span>
        </Button>
      )}
    </div>
  );
};

export default ConnectionStatus;
