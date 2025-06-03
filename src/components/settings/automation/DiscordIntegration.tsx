
import React from 'react';
import { Button } from '@/components/ui/button';

interface DiscordIntegrationProps {
  connected: boolean;
  onConnect: () => void;
}

export const DiscordIntegration: React.FC<DiscordIntegrationProps> = ({
  connected,
  onConnect
}) => {
  return (
    <div className="bg-gameshow-background/20 p-4 rounded-lg">
      <h3 className="text-lg font-medium mb-3">Discord</h3>
      
      {connected ? (
        <>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Połączony</span>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Kanał powiadomień</label>
              <select className="w-full p-2 rounded bg-gameshow-background text-gameshow-text">
                <option value="general">#general</option>
                <option value="quiz-show">#quiz-show</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <input type="checkbox" id="notifyGameStart" defaultChecked />
              <label htmlFor="notifyGameStart">
                Powiadomienie o rozpoczęciu gry
              </label>
            </div>
            
            <div className="flex items-center gap-2">
              <input type="checkbox" id="notifyResults" defaultChecked />
              <label htmlFor="notifyResults">
                Publikuj wyniki na kanale
              </label>
            </div>
          </div>
          
          <div className="mt-4">
            <Button variant="outline" size="sm">
              Rozłącz
            </Button>
          </div>
        </>
      ) : (
        <>
          <p className="text-sm mb-3">
            Połącz z serwerem Discord, aby zintegrować powiadomienia i komendy.
          </p>
          <Button onClick={onConnect}>
            Połącz z Discord
          </Button>
        </>
      )}
    </div>
  );
};
