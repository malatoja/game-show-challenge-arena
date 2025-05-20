
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';

export const InfoBarTab = () => {
  const [activeSubTab, setActiveSubTab] = useState<string>('general');
  const [infoBarText, setInfoBarText] = useState<string>('');
  const [infoBarEnabled, setInfoBarEnabled] = useState<boolean>(true);
  const [animation, setAnimation] = useState<string>('slide');
  const [scrollSpeed, setScrollSpeed] = useState<number[]>([5]);
  const [position, setPosition] = useState<string>('bottom');
  const [backgroundColor, setBackgroundColor] = useState<string>('#000000');
  const [textColor, setTextColor] = useState<string>('#ffffff');
  
  const handleSaveSettings = () => {
    try {
      const settings = {
        enabled: infoBarEnabled,
        text: infoBarText,
        animation,
        scrollSpeed: scrollSpeed[0],
        position,
        backgroundColor,
        textColor
      };
      
      localStorage.setItem('infoBarSettings', JSON.stringify(settings));
      toast.success('Ustawienia paska informacyjnego zostały zapisane');
      
      // Emituj zdarzenie, aby zaktualizować pasek informacyjny w overlayach
      // W rzeczywistej aplikacji użylibyśmy tutaj socketów lub innego mechanizmu
    } catch (error) {
      console.error('Error saving info bar settings:', error);
      toast.error('Wystąpił błąd podczas zapisywania ustawień');
    }
  };
  
  const handleLoadDefaults = () => {
    setInfoBarEnabled(true);
    setInfoBarText('Witamy w Quiz Show!');
    setAnimation('slide');
    setScrollSpeed([5]);
    setPosition('bottom');
    setBackgroundColor('#000000');
    setTextColor('#ffffff');
    
    toast.success('Załadowano domyślne ustawienia');
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Pasek Informacyjny</h2>
      <p className="text-gray-600 mb-6">
        Zarządzanie paskiem informacyjnym wyświetlanym w overlayach gry.
      </p>
      
      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="general">Ogólne</TabsTrigger>
          <TabsTrigger value="appearance">Wygląd</TabsTrigger>
          <TabsTrigger value="animation">Animacje</TabsTrigger>
          <TabsTrigger value="templates">Szablony</TabsTrigger>
        </TabsList>
        
        {/* Ogólne ustawienia */}
        <TabsContent value="general" className="space-y-6">
          <div className="flex items-center justify-between bg-gameshow-background/30 p-4 rounded-lg">
            <div>
              <h3 className="font-medium mb-1">Włącz pasek informacyjny</h3>
              <p className="text-sm text-gameshow-muted">Pokazuj pasek z informacjami na overlayach</p>
            </div>
            <Switch 
              checked={infoBarEnabled} 
              onCheckedChange={setInfoBarEnabled} 
            />
          </div>
          
          <div className="bg-gameshow-background/30 p-4 rounded-lg space-y-4">
            <h3 className="font-medium mb-1">Treść paska informacyjnego</h3>
            
            <Textarea
              value={infoBarText}
              onChange={(e) => setInfoBarText(e.target.value)}
              placeholder="Wpisz tekst, który ma się pojawiać w pasku informacyjnym..."
              className="min-h-[100px]"
            />
            
            <div className="text-sm text-gameshow-muted">
              <p>Wskazówki:</p>
              <ul className="list-disc list-inside">
                <li>Użyj zmiennej {"{name}"} aby wyświetlić nazwę teleturnieju</li>
                <li>Użyj {"{round}"} aby wyświetlić aktualną rundę</li>
                <li>Użyj {"{leader}"} aby wyświetlić lidera punktacji</li>
                <li>Użyj {"{points}"} aby wyświetlić najwyższy wynik</li>
              </ul>
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setInfoBarText('Trwa Quiz Show! Najlepszy wynik: {points} - {leader}')}
              >
                Użyj domyślnego
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setInfoBarText('')}
              >
                Wyczyść
              </Button>
            </div>
          </div>
          
          <div className="bg-gameshow-background/30 p-4 rounded-lg space-y-4">
            <h3 className="font-medium mb-1">Pozycja na ekranie</h3>
            
            <Select value={position} onValueChange={setPosition}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Wybierz pozycję" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top">Góra ekranu</SelectItem>
                <SelectItem value="bottom">Dół ekranu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
        
        {/* Wygląd */}
        <TabsContent value="appearance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gameshow-background/30 p-4 rounded-lg space-y-4">
              <h3 className="font-medium mb-1">Kolor tła paska</h3>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-10 h-10"
                />
                <Input
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                />
              </div>
            </div>
            
            <div className="bg-gameshow-background/30 p-4 rounded-lg space-y-4">
              <h3 className="font-medium mb-1">Kolor tekstu</h3>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-10 h-10"
                />
                <Input
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="bg-gameshow-background/30 p-4 rounded-lg space-y-4">
            <h3 className="font-medium mb-1">Podgląd</h3>
            <div 
              className="h-12 rounded-md flex items-center px-4 overflow-hidden"
              style={{ 
                backgroundColor: backgroundColor,
                color: textColor
              }}
            >
              {infoBarText || 'Przykładowy tekst paska informacyjnego'}
            </div>
          </div>
        </TabsContent>
        
        {/* Animacje */}
        <TabsContent value="animation" className="space-y-6">
          <div className="bg-gameshow-background/30 p-4 rounded-lg space-y-4">
            <h3 className="font-medium mb-1">Typ animacji</h3>
            
            <Select value={animation} onValueChange={setAnimation}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Wybierz animację" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="slide">Przesuwanie</SelectItem>
                <SelectItem value="fade">Zanikanie</SelectItem>
                <SelectItem value="static">Statyczny (bez animacji)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {animation === 'slide' && (
            <div className="bg-gameshow-background/30 p-4 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Prędkość przesuwania</h3>
                <span>{scrollSpeed[0]}</span>
              </div>
              
              <Slider
                value={scrollSpeed}
                min={1}
                max={10}
                step={1}
                onValueChange={setScrollSpeed}
              />
              <div className="flex justify-between text-xs">
                <span>Wolno</span>
                <span>Szybko</span>
              </div>
            </div>
          )}
        </TabsContent>
        
        {/* Szablony */}
        <TabsContent value="templates" className="space-y-6">
          <div className="bg-gameshow-background/30 p-4 rounded-lg space-y-4">
            <h3 className="font-medium mb-3">Zapisane szablony</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div 
                className="p-3 border border-gameshow-primary/30 rounded-md cursor-pointer hover:bg-gameshow-primary/10"
                onClick={() => {
                  setInfoBarText('Trwa Quiz Show! Najlepszy wynik: {points} - {leader}');
                  setBackgroundColor('#000000');
                  setTextColor('#ffffff');
                  toast.success('Załadowano szablon');
                }}
              >
                <h4 className="font-medium mb-1">Domyślny</h4>
                <p className="text-sm">Podstawowy szablon z informacją o liderze</p>
              </div>
              
              <div 
                className="p-3 border border-gameshow-primary/30 rounded-md cursor-pointer hover:bg-gameshow-primary/10"
                onClick={() => {
                  setInfoBarText('Runda {round}: Pozostało {time} sekund!');
                  setBackgroundColor('#ff5722');
                  setTextColor('#ffffff');
                  toast.success('Załadowano szablon');
                }}
              >
                <h4 className="font-medium mb-1">Alert czasowy</h4>
                <p className="text-sm">Informacja o pozostałym czasie rundy</p>
              </div>
              
              <div 
                className="p-3 border border-gameshow-primary/30 rounded-md cursor-pointer hover:bg-gameshow-primary/10"
                onClick={() => {
                  setInfoBarText('Śledź nas na @QuizShowOfficial');
                  setBackgroundColor('#1DA1F2');
                  setTextColor('#ffffff');
                  toast.success('Załadowano szablon');
                }}
              >
                <h4 className="font-medium mb-1">Social media</h4>
                <p className="text-sm">Promocja kanałów społecznościowych</p>
              </div>
              
              <div 
                className="p-3 border border-gameshow-primary/30 rounded-md cursor-pointer hover:bg-gameshow-primary/10"
                onClick={() => {
                  setInfoBarText('Dziękujemy wszystkim za udział!');
                  setBackgroundColor('#4CAF50');
                  setTextColor('#ffffff');
                  toast.success('Załadowano szablon');
                }}
              >
                <h4 className="font-medium mb-1">Podziękowanie</h4>
                <p className="text-sm">Podsumowanie po zakończeniu gry</p>
              </div>
            </div>
            
            <div className="pt-3 space-x-2">
              <Button 
                variant="outline"
                onClick={() => toast.info('Funkcja zapisywania szablonów będzie dostępna wkrótce')}
              >
                Zapisz obecny jako szablon
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex justify-between">
        <Button variant="outline" onClick={handleLoadDefaults}>
          Przywróć domyślne
        </Button>
        <Button onClick={handleSaveSettings}>
          Zapisz ustawienia
        </Button>
      </div>
    </div>
  );
};
