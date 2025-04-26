
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

export const SoundsTab = () => {
  const [volumeLevels, setVolumeLevels] = useState({
    music: 80,
    effects: 100,
    presenter: 90,
    system: 70
  });
  
  // Mock data for audio tracks
  const audioTracks = [
    { id: 'track1', name: 'Oczekiwanie', duration: '2:34', type: 'built-in', src: '#' },
    { id: 'track2', name: 'Suspense', duration: '1:45', type: 'built-in', src: '#' },
    { id: 'track3', name: 'Victory', duration: '0:18', type: 'built-in', src: '#' },
    { id: 'track4', name: 'Countdown', duration: '0:30', type: 'built-in', src: '#' },
  ];
  
  // Mock data for sound effects
  const soundEffects = [
    { id: 'effect1', name: 'Poprawna odpowiedź', event: 'correctAnswer', src: '#' },
    { id: 'effect2', name: 'Błędna odpowiedź', event: 'wrongAnswer', src: '#' },
    { id: 'effect3', name: 'Koniec czasu', event: 'timeUp', src: '#' },
    { id: 'effect4', name: 'Karta użyta', event: 'cardUsed', src: '#' },
    { id: 'effect5', name: 'Zwycięstwo', event: 'victory', src: '#' },
  ];

  const handleVolumeChange = (type: string, value: number) => {
    setVolumeLevels(prev => ({
      ...prev,
      [type]: value
    }));
    
    toast.success(`Głośność ${type} ustawiona na ${value}%`);
  };
  
  const handlePlaySound = (soundId: string) => {
    // In a real implementation, this would play the sound
    toast.info(`Odtwarzanie dźwięku: ${soundId}`);
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (file.type.startsWith('audio/')) {
      // In a real implementation, this would upload and process the audio file
      toast.success(`Przesłano plik audio: ${file.name}`);
    } else {
      toast.error('Wybierz prawidłowy plik audio (mp3, wav)');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dźwięki</h2>
      <p className="text-gray-600 mb-6">
        Kontroluj efekty dźwiękowe i tło audio.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Volume controls */}
        <div className="space-y-6">
          <h3 className="text-xl font-medium mb-4">Kontrola głośności</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <label>Muzyka</label>
                <span>{volumeLevels.music}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={volumeLevels.music}
                onChange={(e) => handleVolumeChange('music', Number(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <label>Efekty dźwiękowe</label>
                <span>{volumeLevels.effects}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={volumeLevels.effects}
                onChange={(e) => handleVolumeChange('effects', Number(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <label>Prowadzący</label>
                <span>{volumeLevels.presenter}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={volumeLevels.presenter}
                onChange={(e) => handleVolumeChange('presenter', Number(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <label>Systemowe</label>
                <span>{volumeLevels.system}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={volumeLevels.system}
                onChange={(e) => handleVolumeChange('system', Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-xl font-medium mb-4">Efekty dźwiękowe</h3>
            <div className="space-y-3">
              {soundEffects.map(effect => (
                <div 
                  key={effect.id} 
                  className="flex justify-between items-center p-3 bg-gameshow-background/20 rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">{effect.name}</h4>
                    <p className="text-xs text-gray-500">Zdarzenie: {effect.event}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handlePlaySound(effect.id)}
                    >
                      ▶ Odsłuchaj
                    </Button>
                    <Button size="sm" variant="outline">
                      Zmień
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Music library */}
        <div>
          <h3 className="text-xl font-medium mb-4">Biblioteka muzyczna</h3>
          
          <div className="mb-4 flex gap-2">
            <Button variant="outline">Wszystkie</Button>
            <Button variant="outline">Wbudowane</Button>
            <Button variant="outline">Własne</Button>
          </div>
          
          <div className="space-y-3 max-h-[400px] overflow-y-auto p-1">
            {audioTracks.map(track => (
              <div 
                key={track.id} 
                className="flex justify-between items-center p-3 bg-gameshow-background/20 rounded-lg"
              >
                <div>
                  <h4 className="font-medium">{track.name}</h4>
                  <div className="flex gap-2 text-xs text-gray-500">
                    <span>{track.duration}</span>
                    <span>{track.type === 'built-in' ? 'Wbudowany' : 'Własny'}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handlePlaySound(track.id)}
                  >
                    ▶ Odtwórz
                  </Button>
                  <Button size="sm" variant="outline">
                    Użyj
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <h4 className="font-medium mb-2">Dodaj własną muzykę</h4>
            <div className="flex gap-2 items-center">
              <Input
                id="audio-upload"
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
              />
              <Button size="sm">Prześlij</Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Obsługiwane formaty: MP3, WAV (max 10MB)
            </p>
          </div>
          
          <div className="mt-6">
            <h4 className="font-medium mb-2">Playlisty</h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-gameshow-background/20 rounded">
                <span>Standardowa runda</span>
                <Button size="sm" variant="outline">Edytuj</Button>
              </div>
              <div className="flex justify-between items-center p-2 bg-gameshow-background/20 rounded">
                <span>Finałowa runda</span>
                <Button size="sm" variant="outline">Edytuj</Button>
              </div>
              <div className="mt-2">
                <Button size="sm">Nowa playlista</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
