
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TimerSettingsProps {
  settings: {
    defaultTime: number;
    autoStart: boolean;
    soundEnabled: boolean;
  };
  onSettingsChange: (settings: { defaultTime: number; autoStart: boolean; soundEnabled: boolean }) => void;
  onSaveSettings: () => void;
}

export const TimerSettings: React.FC<TimerSettingsProps> = ({
  settings,
  onSettingsChange,
  onSaveSettings
}) => {
  return (
    <div className="bg-gameshow-background/20 p-4 rounded-lg">
      <h3 className="text-lg font-medium mb-3">Timer</h3>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Domyślny czas (sekundy)</label>
          <Input
            type="number"
            min="5"
            max="300"
            value={settings.defaultTime}
            onChange={(e) => onSettingsChange({
              ...settings,
              defaultTime: parseInt(e.target.value)
            })}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.autoStart}
            onChange={() => onSettingsChange({
              ...settings,
              autoStart: !settings.autoStart
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
            checked={settings.soundEnabled}
            onChange={() => onSettingsChange({
              ...settings,
              soundEnabled: !settings.soundEnabled
            })}
            id="timerSound"
          />
          <label htmlFor="timerSound">
            Dźwięk końca czasu
          </label>
        </div>
        
        <div className="pt-3">
          <Button onClick={onSaveSettings}>
            Zapisz ustawienia
          </Button>
          <Button variant="outline" className="ml-2">
            Testuj timer
          </Button>
        </div>
      </div>
    </div>
  );
};
