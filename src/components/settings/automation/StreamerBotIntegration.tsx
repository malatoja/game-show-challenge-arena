
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface StreamerBotIntegrationProps {
  connected: boolean;
  settings: {
    ip: string;
    port: string;
    password: string;
  };
  onSettingsChange: (settings: { ip: string; port: string; password: string }) => void;
  onConnect: () => void;
  onDisconnect: () => void;
}

export const StreamerBotIntegration: React.FC<StreamerBotIntegrationProps> = ({
  connected,
  settings,
  onSettingsChange,
  onConnect,
  onDisconnect
}) => {
  return (
    <div className="bg-gameshow-background/20 p-4 rounded-lg">
      <h3 className="text-lg font-medium mb-3">Streamer.bot</h3>
      
      <div className="space-y-3">
        {connected ? (
          <>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Połączony</span>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Akcja: Start rundy</label>
                <select className="w-full p-2 rounded bg-gameshow-background text-gameshow-text">
                  <option value="">Nie przypisano</option>
                  <option value="action1">Zmień scenę na Rundę 1</option>
                  <option value="action2">Włącz intro</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm mb-1">Akcja: Pytanie</label>
                <select className="w-full p-2 rounded bg-gameshow-background text-gameshow-text">
                  <option value="">Nie przypisano</option>
                  <option value="action1">Zmień scenę na pytanie</option>
                  <option value="action2">Pokaż pytanie na ekranie</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm mb-1">Akcja: Zakończenie rundy</label>
                <select className="w-full p-2 rounded bg-gameshow-background text-gameshow-text">
                  <option value="">Nie przypisano</option>
                  <option value="action1">Zmień scenę na wyniki</option>
                  <option value="action2">Pokaż ranking</option>
                </select>
              </div>
              
              <div className="pt-3">
                <Button variant="outline" onClick={onDisconnect}>
                  Rozłącz
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm mb-3">
              Połącz z aplikacją Streamer.bot, aby sterować scenami OBS i innymi akcjami.
            </p>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">IP Address</label>
                <Input
                  value={settings.ip}
                  onChange={(e) => onSettingsChange({...settings, ip: e.target.value})}
                  placeholder="np. 127.0.0.1"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1">Port</label>
                <Input
                  value={settings.port}
                  onChange={(e) => onSettingsChange({...settings, port: e.target.value})}
                  placeholder="np. 8080"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1">Hasło (opcjonalnie)</label>
                <Input
                  type="password"
                  value={settings.password}
                  onChange={(e) => onSettingsChange({...settings, password: e.target.value})}
                />
              </div>
              
              <div className="pt-3">
                <Button onClick={onConnect}>
                  Połącz
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
