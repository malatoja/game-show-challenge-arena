
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Volume2, VolumeX, Trash2, Upload, Play } from 'lucide-react';
import { toast } from 'sonner';
import { SoundType } from '@/types/soundTypes';
import * as soundService from '@/lib/soundService';

export function SoundsTab() {
  const [masterVolume, setMasterVolume] = useState<number>(70);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [selectedSound, setSelectedSound] = useState<SoundType | null>(null);
  const [customFile, setCustomFile] = useState<File | null>(null);
  
  // Sound effects available in the game
  const soundEffects: {label: string; value: SoundType}[] = [
    { label: 'Poprawna odpowiedź', value: 'correct' },
    { label: 'Niepoprawna odpowiedź', value: 'incorrect' },
    { label: 'Brzęczyk końca czasu', value: 'buzzer' },
    { label: 'Odliczanie', value: 'countdown' },
    { label: 'Eliminacja gracza', value: 'elimination' },
    { label: 'Koniec czasu', value: 'timer-end' },
    { label: 'Kręcenie kołem', value: 'wheel-spin' },
    { label: 'Aktywacja karty', value: 'card-activate' },
    { label: 'Rozpoczęcie rundy', value: 'round-start' },
    { label: 'Koniec gry', value: 'game-over' },
    { label: 'Zwycięzca', value: 'winner' },
    { label: 'Podpowiedź', value: 'hint' },
  ];
  
  useEffect(() => {
    // Load volume from local storage
    const savedVolume = localStorage.getItem('gameshow-volume');
    if (savedVolume) {
      const volume = parseInt(savedVolume, 10);
      setMasterVolume(volume);
      soundService.setVolume(volume / 100);
    }
    
    // Load mute state from local storage
    const savedMute = localStorage.getItem('gameshow-muted');
    if (savedMute) {
      const muted = savedMute === 'true';
      setIsMuted(muted);
      soundService.setEnabled(!muted);
    }
  }, []);
  
  const handleVolumeChange = (newVolume: number[]) => {
    const volume = newVolume[0];
    setMasterVolume(volume);
    soundService.setVolume(volume / 100);
    localStorage.setItem('gameshow-volume', volume.toString());
  };
  
  const handleToggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    soundService.setEnabled(!newMutedState);
    localStorage.setItem('gameshow-muted', newMutedState.toString());
    
    toast.info(newMutedState ? 'Dźwięki wyciszone' : 'Dźwięki włączone');
  };
  
  const handlePlaySound = (sound: SoundType) => {
    soundService.play(sound, masterVolume / 100);
    toast.info(`Odtwarzanie dźwięku: ${sound}`);
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setCustomFile(event.target.files[0]);
      toast.info(`Wybrano plik: ${event.target.files[0].name}`);
    }
  };
  
  const handleUploadSound = () => {
    if (!selectedSound || !customFile) {
      toast.error('Wybierz dźwięk i plik do przesłania');
      return;
    }
    
    soundService.setCustomSound(selectedSound, customFile)
      .then(() => {
        toast.success(`Ustawiono niestandardowy dźwięk dla: ${selectedSound}`);
        setCustomFile(null);
      })
      .catch((error) => {
        toast.error(`Błąd podczas ustawiania dźwięku: ${error.message}`);
      });
  };
  
  const handleResetSound = () => {
    if (!selectedSound) {
      toast.error('Wybierz dźwięk do zresetowania');
      return;
    }
    
    soundService.resetSound(selectedSound);
    toast.success(`Zresetowano dźwięk: ${selectedSound}`);
  };
  
  const handleResetAllSounds = () => {
    if (confirm('Czy na pewno chcesz przywrócić wszystkie domyślne dźwięki? Ta operacja nie może zostać cofnięta.')) {
      soundService.resetAllSounds();
      toast.success('Przywrócono wszystkie domyślne dźwięki');
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4 text-gameshow-text">Ustawienia dźwięków</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Volume Controls */}
        <div className="bg-gameshow-card p-4 rounded-lg shadow-lg space-y-4">
          <h3 className="text-xl font-semibold text-gameshow-text">Głośność</h3>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handleToggleMute}
              className={isMuted ? 'bg-red-500/20' : ''}
            >
              {isMuted ? <VolumeX /> : <Volume2 />}
            </Button>
            
            <div className="flex-1">
              <Slider
                defaultValue={[masterVolume]}
                max={100}
                step={1}
                disabled={isMuted}
                onValueChange={handleVolumeChange}
              />
            </div>
            
            <span className="w-12 text-center">{masterVolume}%</span>
          </div>
          
          <div className="flex items-center space-x-2 mt-4">
            <Switch
              id="mute-sounds"
              checked={isMuted}
              onCheckedChange={handleToggleMute}
            />
            <Label htmlFor="mute-sounds">Wycisz wszystkie dźwięki</Label>
          </div>
          
          <div className="mt-4">
            <Button variant="outline" onClick={handleResetAllSounds} className="w-full">
              Przywróć domyślne dźwięki
            </Button>
          </div>
        </div>
        
        {/* Sound Customization */}
        <div className="bg-gameshow-card p-4 rounded-lg shadow-lg space-y-4">
          <h3 className="text-xl font-semibold text-gameshow-text">Niestandardowe dźwięki</h3>
          
          <div className="space-y-2">
            <Label>Wybierz dźwięk do dostosowania</Label>
            <select
              className="w-full p-2 border rounded bg-gameshow-background text-gameshow-text"
              value={selectedSound || ''}
              onChange={(e) => setSelectedSound(e.target.value as SoundType)}
            >
              <option value="">-- Wybierz dźwięk --</option>
              {soundEffects.map((sound) => (
                <option key={sound.value} value={sound.value}>
                  {sound.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => selectedSound && handlePlaySound(selectedSound)}
              disabled={!selectedSound}
            >
              <Play className="h-4 w-4 mr-1" /> Test
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetSound}
              disabled={!selectedSound}
            >
              <Trash2 className="h-4 w-4 mr-1" /> Reset
            </Button>
          </div>
          
          <div className="space-y-2 mt-4">
            <Label>Prześlij własny dźwięk (MP3/WAV)</Label>
            <div className="flex space-x-2">
              <Input
                type="file"
                accept=".mp3,.wav"
                onChange={handleFileChange}
                className="flex-1"
              />
              <Button 
                onClick={handleUploadSound}
                disabled={!selectedSound || !customFile}
              >
                <Upload className="h-4 w-4 mr-1" /> Prześlij
              </Button>
            </div>
          </div>
          
          <p className="text-sm text-gameshow-muted mt-4">
            Dozwolone formaty: MP3, WAV. Maksymalny rozmiar pliku: 2MB.
          </p>
        </div>
      </div>
      
      {/* Sound Effects List */}
      <div className="bg-gameshow-card p-4 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold text-gameshow-text mb-4">Dostępne dźwięki</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {soundEffects.map((sound) => (
            <div 
              key={sound.value}
              className="p-3 bg-gameshow-background rounded-lg cursor-pointer hover:bg-gameshow-primary/20 transition-colors"
              onClick={() => handlePlaySound(sound.value)}
            >
              <div className="flex items-center">
                <Play className="h-4 w-4 mr-2 text-gameshow-primary" />
                <span>{sound.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
