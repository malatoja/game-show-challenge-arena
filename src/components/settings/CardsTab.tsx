
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import SpecialCard from '@/components/cards/SpecialCard';
import { CARD_IMAGES } from '@/constants/cardImages';
import { CardType, Card as CardInterface } from '@/types/gameTypes';
import { CARD_DETAILS } from '@/constants/gameConstants';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const CardsTab = () => {
  const [activeTab, setActiveTab] = useState('settings');
  const [selectedCardType, setSelectedCardType] = useState<CardType>('dejavu');
  const [cardSettings, setCardSettings] = useState({
    name: 'Dejavu',
    description: 'Powtórz ostatnie pytanie',
    usageLimit: 1,
    cooldown: 0,
    visibility: 'visible',
    probability: 10 // 1-10 scale for frequency in deck
  });
  
  const [cardRules, setCardRules] = useState({
    consecutiveAnswers: true,
    pointThreshold: true,
    noLifeLost: true,
    topPlayer: true,
    advanceRound1: true,
    advanceRound2: true,
    rescueCard: true,
    maxCards: 3
  });
  
  const defaultCards: Record<CardType, CardInterface> = {
    dejavu: { type: 'dejavu', description: 'Powtórz ostatnie pytanie', isUsed: false },
    kontra: { type: 'kontra', description: 'Odpowiedz na pytanie przeciwnika', isUsed: false },
    reanimacja: { type: 'reanimacja', description: 'Przywróć gracza do gry', isUsed: false },
    skip: { type: 'skip', description: 'Pomiń pytanie', isUsed: false },
    turbo: { type: 'turbo', description: 'Podwójne punkty', isUsed: false },
    refleks2: { type: 'refleks2', description: 'Podwojony czas na odpowiedź', isUsed: false },
    refleks3: { type: 'refleks3', description: 'Potrojony czas na odpowiedź', isUsed: false },
    lustro: { type: 'lustro', description: 'Odbij efekt karty', isUsed: false },
    oswiecenie: { type: 'oswiecenie', description: 'Podpowiedź do pytania', isUsed: false }
  };
  
  // Get all card types
  const allCardTypes = Object.keys(CARD_IMAGES) as CardType[];
  
  const handleSelectCard = (cardType: CardType) => {
    setSelectedCardType(cardType);
    
    // Update form with selected card's data
    const details = CARD_DETAILS[cardType];
    setCardSettings({
      name: details?.name || cardType.charAt(0).toUpperCase() + cardType.slice(1),
      description: details?.description || defaultCards[cardType].description,
      usageLimit: 1,
      cooldown: 0,
      visibility: 'visible',
      probability: 10
    });
  };
  
  const handleUpdateCardSettings = () => {
    toast.success(`Zaktualizowano ustawienia karty: ${cardSettings.name}`);
  };
  
  const handleSaveRules = () => {
    toast.success('Zapisano zasady przyznawania kart');
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    if (file.type.startsWith('image/')) {
      toast.success(`Przesłano plik obrazu: ${file.name}`);
    } else {
      toast.error('Wybierz prawidłowy plik obrazu');
    }
  };
  
  const handleCreateDeck = () => {
    toast.success('Utworzono nowy deck kart');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Karty Specjalne</h2>
      <p className="text-gray-600 mb-6">
        Twórz i zarządzaj systemem kart specjalnych.
      </p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-3 w-full mb-6">
          <TabsTrigger value="settings">Ustawienia Kart</TabsTrigger>
          <TabsTrigger value="appearance">Wygląd Kart</TabsTrigger>
          <TabsTrigger value="rules">Zasady Przyznawania</TabsTrigger>
        </TabsList>
        
        <TabsContent value="settings">
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
                      className={selectedCardType === cardType ? 'ring-2 ring-neon-pink ring-offset-2 ring-offset-black' : ''}
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
                
                <div>
                  <label className="block text-sm mb-1">Częstotliwość w deckach (1-10)</label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={cardSettings.probability}
                    onChange={(e) => setCardSettings({...cardSettings, probability: parseInt(e.target.value)})}
                  />
                </div>
                
                <div className="pt-3">
                  <Button onClick={handleUpdateCardSettings} className="bg-neon-pink hover:bg-neon-pink/80">
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
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {allCardTypes.map(cardType => (
                      <div key={cardType} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">{CARD_DETAILS[cardType].name}</span>
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
                  <Button onClick={handleCreateDeck} className="bg-neon-purple hover:bg-neon-purple/80">
                    Utwórz zestaw
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="appearance">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium mb-3">Wygląd kart</h3>
              
              <div>
                <label className="block text-sm mb-1">Karta do edycji</label>
                <select className="w-full p-2 rounded bg-gameshow-background text-gameshow-text mb-4">
                  {allCardTypes.map(cardType => (
                    <option key={cardType} value={cardType}>
                      {CARD_DETAILS[cardType].name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-center mb-6">
                <SpecialCard
                  card={defaultCards[selectedCardType]}
                  size="lg"
                />
              </div>
              
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
                  <label className="block text-sm mb-1">Tło karty</label>
                  <Input
                    type="file"
                    accept="image/*"
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
                
                <div className="pt-3">
                  <Button className="bg-neon-pink hover:bg-neon-pink/80">
                    Zapisz zmiany
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium mb-3">Podgląd efektów</h3>
              
              <div className="bg-gameshow-background/20 p-4 rounded-lg space-y-4">
                <div>
                  <label className="block text-sm mb-2">Animacja aktywacji karty</label>
                  <div className="bg-gray-800 rounded-lg h-40 flex items-center justify-center">
                    <Button>Odtwórz animację</Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Kliknij, aby przetestować animację
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm mb-2">Dźwięk karty</label>
                  <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-center">
                    <Button>Odtwórz dźwięk</Button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm mb-2">Wygląd w interfejsie</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center">
                      <p className="text-xs mb-1">Panel hosta</p>
                      <div className="bg-gray-800 rounded-lg p-2 h-16 flex items-center justify-center">
                        <PlayerCardIndicator cards={[defaultCards[selectedCardType]]} />
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs mb-1">Panel gracza</p>
                      <div className="bg-gray-800 rounded-lg p-2 h-16 flex items-center justify-center">
                        <SpecialCard card={defaultCards[selectedCardType]} size="sm" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="rules">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Zasady przyznawania kart</h3>
              
              <div className="space-y-4 bg-gameshow-background/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">3 poprawne odpowiedzi z rzędu</p>
                    <p className="text-sm text-gray-500">Karta: Dejavu</p>
                  </div>
                  <Switch 
                    checked={cardRules.consecutiveAnswers}
                    onCheckedChange={(checked) => setCardRules({...cardRules, consecutiveAnswers: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">50+ punktów w Rundzie 1</p>
                    <p className="text-sm text-gray-500">Karta: Turbo</p>
                  </div>
                  <Switch 
                    checked={cardRules.pointThreshold}
                    onCheckedChange={(checked) => setCardRules({...cardRules, pointThreshold: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Runda bez utraty życia</p>
                    <p className="text-sm text-gray-500">Karta: Refleks 2x</p>
                  </div>
                  <Switch 
                    checked={cardRules.noLifeLost}
                    onCheckedChange={(checked) => setCardRules({...cardRules, noLifeLost: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Najwięcej punktów w Rundzie 1</p>
                    <p className="text-sm text-gray-500">Karta: Kontra</p>
                  </div>
                  <Switch 
                    checked={cardRules.topPlayer}
                    onCheckedChange={(checked) => setCardRules({...cardRules, topPlayer: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Awans z Rundy 1</p>
                    <p className="text-sm text-gray-500">Karta: Skip</p>
                  </div>
                  <Switch 
                    checked={cardRules.advanceRound1}
                    onCheckedChange={(checked) => setCardRules({...cardRules, advanceRound1: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Awans z Rundy 2</p>
                    <p className="text-sm text-gray-500">Karta: Dejavu</p>
                  </div>
                  <Switch 
                    checked={cardRules.advanceRound2}
                    onCheckedChange={(checked) => setCardRules({...cardRules, advanceRound2: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Karta "Na Ratunek" dla najsłabszego</p>
                    <p className="text-sm text-gray-500">Karta: Reanimacja</p>
                  </div>
                  <Switch 
                    checked={cardRules.rescueCard}
                    onCheckedChange={(checked) => setCardRules({...cardRules, rescueCard: checked})}
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="max-cards" className="text-base">Maksymalna liczba kart na gracza</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="max-cards"
                      type="number" 
                      min={1} 
                      max={5} 
                      value={cardRules.maxCards}
                      onChange={(e) => setCardRules({...cardRules, maxCards: parseInt(e.target.value)})}
                      className="w-16"
                    />
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={handleSaveRules} 
                className="mt-6 bg-neon-pink hover:bg-neon-pink/80"
              >
                Zapisz ustawienia zasad
              </Button>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Predefiniowane zestawy kart</h3>
              
              <div className="bg-gameshow-background/20 p-4 rounded-lg space-y-4">
                <div>
                  <p className="font-medium mb-1">Standardowy</p>
                  <div className="flex flex-wrap gap-1">
                    {['dejavu', 'kontra', 'reanimacja', 'skip', 'turbo'].map(cardType => (
                      <SpecialCard 
                        key={cardType} 
                        card={defaultCards[cardType as CardType]}
                        size="sm" 
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Zbalansowany zestaw podstawowych kart
                  </p>
                </div>
                
                <div>
                  <p className="font-medium mb-1">Zaawansowany</p>
                  <div className="flex flex-wrap gap-1">
                    {['dejavu', 'kontra', 'reanimacja', 'skip', 'turbo', 'refleks2', 'lustro'].map(cardType => (
                      <SpecialCard 
                        key={cardType} 
                        card={defaultCards[cardType as CardType]}
                        size="sm" 
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Zestaw z dodatkowymi kartami strategicznymi
                  </p>
                </div>
                
                <div>
                  <p className="font-medium mb-1">Pełny</p>
                  <div className="flex flex-wrap gap-1">
                    {allCardTypes.map(cardType => (
                      <SpecialCard 
                        key={cardType} 
                        card={defaultCards[cardType]}
                        size="sm" 
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Wszystkie dostępne karty w grze
                  </p>
                </div>
                
                <div className="pt-3">
                  <Button className="w-full">Utwórz niestandardowy zestaw</Button>
                </div>
              </div>
              
              <div className="bg-gameshow-background/20 p-4 rounded-lg mt-6">
                <h4 className="font-medium mb-2">Podsumowanie zasad</h4>
                <div className="text-sm space-y-1 text-gray-300">
                  <p>- Gracze mogą posiadać maksymalnie {cardRules.maxCards} karty</p>
                  <p>- Po użyciu karta jest usuwana z puli gracza</p>
                  <p>- Karty są resetowane między rundami</p>
                  <p>- Karty można przyznawać ręcznie lub automatycznie</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
