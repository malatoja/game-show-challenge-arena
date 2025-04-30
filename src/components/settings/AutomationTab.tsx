
import React, { useState } from 'react';
import { toast } from 'sonner';
import { StreamerBotIntegration } from './automation/StreamerBotIntegration';
import { TimerSettings } from './automation/TimerSettings';
import { TwitchIntegration } from './automation/TwitchIntegration';
import { DiscordIntegration } from './automation/DiscordIntegration';
import { AutomatedMessages } from './automation/AutomatedMessages';

export const AutomationTab = () => {
  const [streamerBotConnected, setStreamerBotConnected] = useState(false);
  const [twitchConnected, setTwitchConnected] = useState(false);
  const [discordConnected, setDiscordConnected] = useState(false);
  
  const [streamerBotSettings, setStreamerBotSettings] = useState({
    ip: '127.0.0.1',
    port: '8080',
    password: ''
  });
  
  const [timerSettings, setTimerSettings] = useState({
    defaultTime: 30,
    autoStart: false,
    soundEnabled: true
  });
  
  const [twitchCommands, setTwitchCommands] = useState([
    { command: '!pytanie', action: 'Pokaż aktualne pytanie', enabled: true },
    { command: '!typowanie', action: 'Rozpocznij głosowanie na odpowiedź', enabled: false },
    { command: '!ranking', action: 'Pokaż ranking', enabled: true },
    { command: '!karta', action: 'Użyj karty specjalnej', enabled: false },
  ]);

  const handleConnectStreamerBot = () => {
    if (!streamerBotSettings.ip || !streamerBotSettings.port) {
      toast.error('Wypełnij wszystkie wymagane pola');
      return;
    }
    
    setStreamerBotConnected(true);
    toast.success('Połączono z Streamer.bot');
  };
  
  const handleDisconnectStreamerBot = () => {
    setStreamerBotConnected(false);
    toast.info('Rozłączono z Streamer.bot');
  };
  
  const handleConnectTwitch = () => {
    setTwitchConnected(true);
    toast.success('Połączono z Twitch');
  };
  
  const handleConnectDiscord = () => {
    setDiscordConnected(true);
    toast.success('Połączono z Discord');
  };
  
  const handleSaveTimerSettings = () => {
    toast.success('Zapisano ustawienia timera');
  };
  
  const handleToggleCommand = (index: number) => {
    const updatedCommands = [...twitchCommands];
    updatedCommands[index].enabled = !updatedCommands[index].enabled;
    setTwitchCommands(updatedCommands);
    
    toast.success(
      updatedCommands[index].enabled
        ? `Włączono komendę ${updatedCommands[index].command}`
        : `Wyłączono komendę ${updatedCommands[index].command}`
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Automatyzacja i Integracja</h2>
      <p className="text-gray-600 mb-6">
        Łączenie z botami, OBS, Discordem i czatem Twitcha.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-4">
          <StreamerBotIntegration 
            connected={streamerBotConnected}
            settings={streamerBotSettings}
            onSettingsChange={setStreamerBotSettings}
            onConnect={handleConnectStreamerBot}
            onDisconnect={handleDisconnectStreamerBot}
          />
          
          <TimerSettings
            settings={timerSettings}
            onSettingsChange={setTimerSettings}
            onSaveSettings={handleSaveTimerSettings}
          />
        </div>
        
        {/* Right column */}
        <div className="space-y-4">
          <TwitchIntegration
            connected={twitchConnected}
            commands={twitchCommands}
            onConnect={handleConnectTwitch}
            onToggleCommand={handleToggleCommand}
          />
          
          <DiscordIntegration
            connected={discordConnected}
            onConnect={handleConnectDiscord}
          />
          
          <AutomatedMessages />
        </div>
      </div>
    </div>
  );
};
