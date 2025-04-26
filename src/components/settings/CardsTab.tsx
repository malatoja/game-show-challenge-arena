
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import SpecialCard from '@/components/cards/SpecialCard';
import { CARD_IMAGES } from '@/constants/cardImages';
import { CardType, Card as CardInterface } from '@/types/gameTypes';

export const CardsTab = () => {
  const [selectedCardType, setSelectedCardType] = useState<CardType>('dejavu');
  const [cardSettings, setCardSettings] = useState({
    name: 'Dejavu',
    description: 'Powtórz ostatnie pytanie',
    usageLimit: 1,
    cooldown: 0,
    visibility: 'visible'
  });
  
  const defaultCards: Record<CardType, CardInterface> = {
    dejavu: { id: '1', type: 'dejavu', description: 'Powtórz ostatnie pytanie', isUsed: false },
    kontra: { id: '2', type: 'kontra', description: 'Odpowiedz na pytanie przeciwnika', isUsed: false },
    reanimacja: { id: '3', type: 'reanimacja', description: 'Przywróć gracza do gry', isUsed: false },
    skip: { id: '4', type: 'skip', description: 'Pomiń pytanie', isUsed: false },
    turbo: { id: '5', type: 'turbo', description: 'Podwójne punkty', isUsed: false },
    refleks2: { id: '6', type: 'refleks2', description: 'Podwojony czas na odpowiedź', isUsed: false },
    refleks3: { id: '7', type: 'refleks3', description: 'Potrojony czas na odpowiedź', isUsed: false },
    lustro: { id: '8', type: 'lustro', description: 'Odbij efekt karty', isUsed: false },
    oswiecenie: { id: '9', type: 'oswiecenie', description: 'Podpowiedź do pytania', isUsed: false }
  };
  
  // Get all card types
  const allCardTypes = Object.keys(CARD_IMAGES) as CardType[];
  
  const handleSelectCard = (cardType: CardType) => {
    setSelectedCardType(cardType);
    
    // Update form with selected card's data
    setCardSettings({
      name: cardType.charAt(0).toUpperCase() + cardType.slice(1),
      description: defaultCards[cardType].description,
      usageLimit: 1,
      cooldown: 0,
      visibility: 'visible'
    });
  };
  
  const handleUpdateCardSettings = () => {
    // In a real implementation, this would update the card settings in the game state
    toast.success(`Zaktualizowano ustawienia karty: ${cardSettings.name}`);
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (file.type.startsWith('image/')) {
      // In a real implementation, this would upload and process the image
      toast.success(`Przesłano plik obrazu: ${file.name}`);
    } else {
      toast.error('Wybierz prawidłowy plik obrazu');
    }
  };
  
  const handleCreateDeck = () => {
    // In a real implementation, this would create a new deck
    toast.success('Utworzono nowy deck kart');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Karty Specjalne</h2>
      <p className="text-gray-600 mb-6">
        Twórz i zarządzaj systemem kart specjalnych.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium mb-3">Dostępne karty</h3>
          
          <div className="grid grid-cols-3 gap-3">
            {allCardTypes.map(cardType => (
              <div
                key={cardType}
                onClick={() => handleSelectCard(cardType)}
                className="cursor-pointer transition-transform hover:scale-105"
              >
                <SpecialCard
                  card={defaultCards[cardType]}
                  size="sm"
                  className={selectedCardType === cardType ? 'ring-2 ring-white' : ''}
                />
              </div>
            ))}
          </div>
          
          <div className="mt-4">
            <Button variant="outline" size="sm">
              Dodaj nową kartę
            </Button>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Symulator losowania kart</h3>
            <div className="p-4 bg-gameshow-background/20 rounded-lg">
              <p className="text-sm mb-3">
                Testuj prawdopodobieństwo wylosowania kart z różnych zestawów.
              </p>
              <select className="w-full p-2 rounded bg-gameshow-background text-gameshow-text mb-3">
                <option value="standard">Standardowy deck</option>
                <option value="chaos">Chaos deck</option>
                <option value="balanced">Zbalansowany deck</option>
              </select>
              <div className="flex justify-between">
                <span className="text-sm">Liczba losowań:</span>
                <input 
                  type="number" 
                  className="w-20 p-1 rounded bg-gameshow-background text-gameshow-text"
                  min="1" 
                  max="100" 
                  defaultValue="10" 
                />
              </div>
              <Button className="w-full mt-3">Symuluj losowanie</Button>
            </div>
          </div>
        </div>
        
        {/* Card editor */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium mb-3">Edytor karty</h3>
          
          <div className="flex justify-center mb-4">
            <SpecialCard
              card={defaultCards[selectedCardType]}
              size="lg"
            />
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Nazwa karty</label>
              <Input
                value={cardSettings.name}
                onChange={(e) => setCardSettings({...cardSettings, name: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm mb-1">Opis działania</label>
              <textarea
                className="w-full p-2 rounded bg-gameshow-background text-gameshow-text"
                rows={3}
                value={cardSettings.description}
                onChange={(e) => setCardSettings({...cardSettings, description: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm mb-1">Limit użycia</label>
              <Input
                type="number"
                min="1"
                max="10"
                value={cardSettings.usageLimit}
                onChange={(e) => setCardSettings({...cardSettings, usageLimit: parseInt(e.target.value)})}
              />
            </div>
            
            <div>
              <label className="block text-sm mb-1">Cooldown (rundy)</label>
              <Input
                type="number"
                min="0"
                max="5"
                value={cardSettings.cooldown}
                onChange={(e) => setCardSettings({...cardSettings, cooldown: parseInt(e.target.value)})}
              />
            </div>
            
            <div>
              <label className="block text-sm mb-1">Widoczność</label>
              <select
                className="w-full p-2 rounded bg-gameshow-background text-gameshow-text"
                value={cardSettings.visibility}
                onChange={(e) => setCardSettings({...cardSettings, visibility: e.target.value})}
              >
                <option value="visible">Widoczna dla wszystkich</option>
                <option value="hidden">Ukryta do użycia</option>
                <option value="owner">Widoczna tylko dla właściciela</option>
              </select>
            </div>
            
            <div className="pt-3">
              <Button onClick={handleUpdateCardSettings}>
                Zapisz ustawienia
              </Button>
            </div>
          </div>
        </div>
        
        {/* Deck builder */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium mb-3">Kreator zestawów</h3>
          
          <div className="p-4 bg-gameshow-background/20 rounded-lg space-y-4">
            <div>
              <label className="block text-sm mb-1">Nazwa zestawu</label>
              <Input placeholder="np. Standardowy deck" />
            </div>
            
            <div>
              <label className="block text-sm mb-2">Karty w zestawie</label>
              <div className="space-y-2">
                {allCardTypes.map(cardType => (
                  <div key={cardType} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span>{defaultCards[cardType].description}</span>
                    </div>
                    <select className="bg-gameshow-background text-gameshow-text p-1 rounded text-sm">
                      {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm mb-1">Zasady przydzielania</label>
              <textarea
                className="w-full p-2 rounded bg-gameshow-background text-gameshow-text"
                rows={2}
                placeholder="np. 3 poprawne odpowiedzi = 1 karta"
              />
            </div>
            
            <div className="pt-3">
              <Button onClick={handleCreateDeck}>Utwórz zestaw</Button>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Wygląd kart</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm mb-1">Własna ikona</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </div>
              
              <div>
                <label className="block text-sm mb-1">Animacja (GIF/Lottie)</label>
                <Input
                  type="file"
                  accept=".gif,.json"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Obsługiwane formaty: GIF, Lottie JSON
                </p>
              </div>
              
              <div>
                <label className="block text-sm mb-1">Dźwięk aktywacji</label>
                <Input
                  type="file"
                  accept="audio/*"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Obsługiwane formaty: MP3, WAV
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
