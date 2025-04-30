
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  RefreshCw,
  Upload
} from 'lucide-react';
import { playSound, soundService, SoundType } from '@/lib/soundService';

type SoundItem = {
  id: SoundType;
  name: string;
  description: string;
};

export function SoundsTab() {
  const [volume, setVolume] = useState(soundService.getVolume());
  const [isMuted, setIsMuted] = useState(soundService.isMuted());
  
  const soundItems: SoundItem[] = [
    { id: 'countdown', name: 'Timer', description: 'Dźwięk odliczania czasu' },
    { id: 'correct', name: 'Poprawna odpowiedź', description: 'Dźwięk dla poprawnej odpowiedzi' },
    { id: 'incorrect', name: 'Błędna odpowiedź', description: 'Dźwięk dla błędnej odpowiedzi' },
    { id: 'round-start', name: 'Początek rundy', description: 'Dźwięk rozpoczęcia rundy' },
    { id: 'round-end', name: 'Koniec rundy', description: 'Dźwięk zakończenia rundy' },
    { id: 'card-use', name: 'Użycie karty', description: 'Dźwięk użycia karty specjalnej' },
    { id: 'wheel-spin', name: 'Koło fortuny', description: 'Dźwięk obracającego się koła fortuny' },
    { id: 'hint', name: 'Buzzer', description: 'Dźwięk buzzera' },
    { id: 'game-over', name: 'Zwycięzca', description: 'Dźwięk ogłoszenia zwycięzcy' },
    { id: 'hint-sound', name: 'Pytanie', description: 'Dźwięk wyświetlenia nowego pytania' },
  ];

  const handleVolumeChange = (newVolume: number[]) => {
    const value = newVolume[0];
    setVolume(value);
    soundService.setVolume(value);
  };

  const handleToggleMute = () => {
    soundService.toggleMute();
    setIsMuted(soundService.isMuted());
  };

  const handlePlaySound = (type: SoundType) => {
    soundService.play(type);
  };

  const handleUploadSound = (type: SoundType, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      toast.error('Please upload an audio file');
      return;
    }

    soundService.setCustomSound(type, file)
      .then(() => {
        toast.success(`Dźwięk "${type}" został zaktualizowany`);
      })
      .catch(error => {
        console.error('Error uploading sound:', error);
        toast.error('Wystąpił błąd podczas zapisywania dźwięku');
      });
      
    // Clear the input value so the same file can be selected again
    event.target.value = '';
  };

  const handleResetSound = (type: SoundType) => {
    soundService.resetSound(type);
    toast.success(`Dźwięk "${type}" został zresetowany do domyślnego`);
  };

  const handleResetAllSounds = () => {
    if (confirm('Czy na pewno chcesz zresetować wszystkie dźwięki do ustawień domyślnych?')) {
      soundService.resetAllSounds();
      toast.success('Wszystkie dźwięki zostały zresetowane do ustawień domyślnych');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gameshow-text">
        Zarządzanie dźwiękami
      </h2>
      
      <div className="space-y-8">
        {/* Global sound controls */}
        <div className="bg-gameshow-background/40 p-5 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-gameshow-text">
            Ustawienia globalne
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleToggleMute}
                  className="h-8 w-8"
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </Button>
                <span className="text-gameshow-text">
                  {isMuted ? 'Dźwięki wyciszone' : 'Dźwięki włączone'}
                </span>
              </div>
              
              <Switch
                checked={!isMuted}
                onCheckedChange={() => handleToggleMute()}
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gameshow-text">Głośność:</span>
              <div className="flex-1">
                <Slider
                  value={[volume]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={handleVolumeChange}
                />
              </div>
              <span className="text-gameshow-text w-8 text-right">
                {Math.round(volume * 100)}%
              </span>
            </div>
            
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={handleResetAllSounds}
                className="flex items-center space-x-2"
              >
                <RefreshCw size={16} />
                <span>Resetuj wszystkie dźwięki</span>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Individual sound settings */}
        <div className="bg-gameshow-background/40 p-5 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-gameshow-text">
            Dźwięki gry
          </h3>
          
          <div className="space-y-4">
            {soundItems.map((sound) => (
              <div 
                key={sound.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-md bg-gameshow-card"
              >
                <div className="mb-3 sm:mb-0">
                  <h4 className="font-medium text-gameshow-text">{sound.name}</h4>
                  <p className="text-sm text-gameshow-muted">{sound.description}</p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePlaySound(sound.id)}
                    className="flex items-center space-x-1"
                  >
                    <Play size={14} />
                    <span>Test</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleResetSound(sound.id)}
                    className="flex items-center space-x-1"
                  >
                    <RefreshCw size={14} />
                    <span>Reset</span>
                  </Button>
                  
                  <div className="relative">
                    <Input
                      id={`upload-${sound.id}`}
                      type="file"
                      accept="audio/*"
                      onChange={(e) => handleUploadSound(sound.id, e)}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById(`upload-${sound.id}`)?.click()}
                      className="flex items-center space-x-1"
                    >
                      <Upload size={14} />
                      <span>Zmień</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Upload custom sounds */}
        <div className="bg-gameshow-background/40 p-5 rounded-lg">
          <h3 className="text-xl font-semibold mb-4 text-gameshow-text">
            Wskazówki
          </h3>
          
          <div className="space-y-2 text-gameshow-muted">
            <p>• Wszystkie dźwięki są zapisywane lokalnie w przeglądarce.</p>
            <p>• Zalecane formaty plików: MP3, WAV, OGG.</p>
            <p>• Maksymalny rozmiar pliku: 2MB.</p>
            <p>• Dla najlepszej kompatybilności, używaj krótkich dźwięków (poniżej 5 sekund).</p>
          </div>
        </div>
      </div>
    </div>
  );
}
