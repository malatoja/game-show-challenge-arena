
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

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
    
    // In a real implementation, this would connect to Streamer.bot
    setStreamerBotConnected(true);
    toast.success('Połączono z Streamer.bot');
  };
  
  const handleDisconnectStreamerBot = () => {
    setStreamerBotConnected(false);
    toast.info('Rozłączono z Streamer.bot');
  };
  
  const handleConnectTwitch = () => {
    // In a real implementation, this would connect to Twitch
    setTwitchConnected(true);
    toast.success('Połączono z Twitch');
  };
  
  const handleConnectDiscord = () => {
    // In a real implementation, this would connect to Discord
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
        {/* Streamer.bot integration */}
        <div className="space-y-4">
          <div className="bg-gameshow-background/20 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Streamer.bot</h3>
            
            <div className="space-y-3">
              {streamerBotConnected ? (
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
                      <Button variant="outline" onClick={handleDisconnectStreamerBot}>
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
                        value={streamerBotSettings.ip}
                        onChange={(e) => setStreamerBotSettings({...streamerBotSettings, ip: e.target.value})}
                        placeholder="np. 127.0.0.1"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm mb-1">Port</label>
                      <Input
                        value={streamerBotSettings.port}
                        onChange={(e) => setStreamerBotSettings({...streamerBotSettings, port: e.target.value})}
                        placeholder="np. 8080"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm mb-1">Hasło (opcjonalnie)</label>
                      <Input
                        type="password"
                        value={streamerBotSettings.password}
                        onChange={(e) => setStreamerBotSettings({...streamerBotSettings, password: e.target.value})}
                      />
                    </div>
                    
                    <div className="pt-3">
                      <Button onClick={handleConnectStreamerBot}>
                        Połącz
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="bg-gameshow-background/20 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Timer</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Domyślny czas (sekundy)</label>
                <Input
                  type="number"
                  min="5"
                  max="300"
                  value={timerSettings.defaultTime}
                  onChange={(e) => setTimerSettings({
                    ...timerSettings,
                    defaultTime: parseInt(e.target.value)
                  })}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={timerSettings.autoStart}
                  onChange={() => setTimerSettings({
                    ...timerSettings,
                    autoStart: !timerSettings.autoStart
                  })}
                  id="autoStartTimer"
                />
                <label htmlFor="autoStartTimer">
                  Automatycznie uruchamiaj timer po wybraniu pytania
                </label>
              </div>
              
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={timerSettings.soundEnabled}
                  onChange={() => setTimerSettings({
                    ...timerSettings,
                    soundEnabled: !timerSettings.soundEnabled
                  })}
                  id="timerSound"
                />
                <label htmlFor="timerSound">
                  Dźwięk końca czasu
                </label>
              </div>
              
              <div className="pt-3">
                <Button onClick={handleSaveTimerSettings}>
                  Zapisz ustawienia
                </Button>
                <Button variant="outline" className="ml-2">
                  Testuj timer
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Platform integrations */}
        <div className="space-y-4">
          <div className="bg-gameshow-background/20 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Twitch</h3>
            
            {twitchConnected ? (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Połączony</span>
                </div>
                
                <h4 className="font-medium mb-2">Komendy czatu</h4>
                
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {twitchCommands.map((command, index) => (
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
                          onClick={() => handleToggleCommand(index)}
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
                <Button onClick={handleConnectTwitch}>
                  Połącz z Twitch
                </Button>
              </>
            )}
          </div>
          
          <div className="bg-gameshow-background/20 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Discord</h3>
            
            {discordConnected ? (
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
                <Button onClick={handleConnectDiscord}>
                  Połącz z Discord
                </Button>
              </>
            )}
          </div>
          
          <div className="bg-gameshow-background/20 p-4 rounded-lg">
            <h3 className="text-lg font-medium mb-3">Automatyczne wiadomości</h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Start rundy</label>
                <Input
                  placeholder="np. Rozpoczynamy rundę {round}!"
                  defaultValue="Rozpoczynamy rundę {round}! Powodzenia wszystkim graczom."
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1">Poprawna odpowiedź</label>
                <Input
                  placeholder="np. {player} odpowiada poprawnie!"
                  defaultValue="{player} odpowiada poprawnie i zdobywa {points} punktów!"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1">Użycie karty</label>
                <Input
                  placeholder="np. {player} używa karty {card}!"
                  defaultValue="{player} używa karty {card}! {effect}"
                />
              </div>
              
              <div className="pt-3">
                <Button size="sm">
                  Zapisz wiadomości
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
