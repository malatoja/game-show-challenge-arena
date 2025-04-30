
import React from 'react';
import { useSocket } from '@/context/SocketContext';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Zap, ZapOff } from 'lucide-react';

const ConnectionStatus: React.FC = () => {
  const { connected, mockMode } = useSocket();
  
  return (
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
            : 'Not connected to real-time server'
        }
      </TooltipContent>
    </Tooltip>
  );
};

export default ConnectionStatus;
