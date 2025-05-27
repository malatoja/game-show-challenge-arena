
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Volume2, VolumeX, Settings } from 'lucide-react';
import { SoundManager } from '@/lib/soundManager';

interface GameSettingsProps {
  onClose: () => void;
}

export function GameSettings({ onClose }: GameSettingsProps) {
  const [volume, setVolume] = useState(SoundManager.getVolume());
  const [muted, setMuted] = useState(SoundManager.isMuted());
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    SoundManager.setVolume(newVolume);
  };

  const handleMuteToggle = () => {
    const newMuted = !muted;
    setMuted(newMuted);
    SoundManager.setMuted(newMuted);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-96 bg-gameshow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Ustawienia Overlay
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sound Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold">Dźwięk</h3>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Wycisz dźwięki</span>
              <Switch
                checked={muted}
                onCheckedChange={handleMuteToggle}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Głośność</span>
                <div className="flex items-center gap-2">
                  {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  <span className="text-sm w-8">{Math.round(volume * 100)}%</span>
                </div>
              </div>
              <Slider
                value={[volume]}
                onValueChange={handleVolumeChange}
                disabled={muted}
                min={0}
                max={1}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>

          {/* Debug Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold">Debug</h3>
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Pokaż informacje debug</span>
              <Switch
                checked={showDebugInfo}
                onCheckedChange={setShowDebugInfo}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Zamknij
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default GameSettings;
