
import React from 'react';
import { Button } from '@/components/ui/button';

interface TwitchCommand {
  command: string;
  action: string;
  enabled: boolean;
}

interface TwitchIntegrationProps {
  connected: boolean;
  commands: TwitchCommand[];
  onConnect: () => void;
  onToggleCommand: (index: number) => void;
}

export const TwitchIntegration: React.FC<TwitchIntegrationProps> = ({
  connected,
  commands,
  onConnect,
  onToggleCommand
}) => {
  return (
    <div className="bg-gameshow-background/20 p-4 rounded-lg">
      <h3 className="text-lg font-medium mb-3">Twitch</h3>
      
      {connected ? (
        <>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Połączony</span>
          </div>
          
          <h4 className="font-medium mb-2">Komendy czatu</h4>
          
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {commands.map((command, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-2 bg-gameshow-background/20 rounded"
              >
                <div>
                  <div className="font-mono">{command.command}</div>
                  <div className="text-xs text-gray-500">{command.action}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${command.enabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onToggleCommand(index)}
                  >
                    {command.enabled ? 'Wyłącz' : 'Włącz'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <Button variant="outline" size="sm">
              Dodaj komendę
            </Button>
            <Button variant="outline" size="sm" className="ml-2">
              Rozłącz
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm mb-3">
            Połącz z kontem Twitch, aby zintegrować czat i powiadomienia.
          </p>
          <Button onClick={onConnect}>
            Połącz z Twitch
          </Button>
        </>
      )}
    </div>
  );
};
