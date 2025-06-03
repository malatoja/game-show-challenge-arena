
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Sliders, Copy, Clock, Award, User, ScrollText, 
  Settings, Dice1, Zap, Undo, Flame
} from 'lucide-react';
import { toast } from 'sonner';
import { RoundType } from '@/types/gameTypes';
import { ROUND_NAMES } from '@/constants/gameConstants';

export function RoundsTab() {
  const [activeTab, setActiveTab] = useState<string>('general');
  const [roundOrder, setRoundOrder] = useState<RoundType[]>(['knowledge', 'speed', 'wheel']);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [draggedRound, setDraggedRound] = useState<RoundType | null>(null);
  
  // Round settings with defaults
  const [roundSettings, setRoundSettings] = useState({
    knowledge: {
      enabled: true,
      timeLimit: 60,
      pointsPerQuestion: 100,
      lifeLoss: true,
      maxQuestions: 20,
      allowCards: true
    },
    speed: {
      enabled: true,
      timeLimit: 30,
      pointsPerQuestion: 200,
      bonusForSpeed: true,
      maxQuestions: 15,
      allowCards: true
    },
    wheel: {
      enabled: true,
      timeLimit: 45,
      pointsPerQuestion: 300,
      categoriesEnabled: true,
      maxSpins: 10,
      allowCards: true
    }
  });

  // Handle drag and drop functionality for round reordering
  const handleDragStart = (round: RoundType) => {
    setIsDragging(true);
    setDraggedRound(round);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (!draggedRound) return;
    
    const newOrder = [...roundOrder];
    const draggedIndex = newOrder.indexOf(draggedRound);
    if (draggedIndex === index) return;
    
    newOrder.splice(draggedIndex, 1);
    newOrder.splice(index, 0, draggedRound);
    setRoundOrder(newOrder);
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedRound(null);
    
    toast.success('Kolejność rund została zaktualizowana');
  };
  
  // Handle update of round settings
  const updateRoundSetting = <T extends keyof typeof roundSettings>(
    round: T, 
    setting: keyof typeof roundSettings[T], 
    value: any
  ) => {
    setRoundSettings({
      ...roundSettings,
      [round]: {
        ...roundSettings[round],
        [setting]: value
      }
    });
  };
  
  // Save all round settings
  const handleSaveSettings = () => {
    localStorage.setItem('roundOrder', JSON.stringify(roundOrder));
    localStorage.setItem('roundSettings', JSON.stringify(roundSettings));
    
    toast.success('Ustawienia rund zostały zapisane');
  };
  
  // Reset settings to defaults
  const handleResetSettings = () => {
    if (window.confirm('Czy na pewno chcesz przywrócić domyślne ustawienia rund?')) {
      setRoundOrder(['knowledge', 'speed', 'wheel']);
      setRoundSettings({
        knowledge: {
          enabled: true,
          timeLimit: 60,
          pointsPerQuestion: 100,
          lifeLoss: true,
          maxQuestions: 20,
          allowCards: true
        },
        speed: {
          enabled: true,
          timeLimit: 30,
          pointsPerQuestion: 200,
          bonusForSpeed: true,
          maxQuestions: 15,
          allowCards: true
        },
        wheel: {
          enabled: true,
          timeLimit: 45,
          pointsPerQuestion: 300,
          categoriesEnabled: true,
          maxSpins: 10,
          allowCards: true
        }
      });
      
      toast.info('Przywrócono domyślne ustawienia rund');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Ustawienia Rund</h2>
      <p className="text-gray-600 mb-6">
        Skonfiguruj rundy teleturnieju, ich kolejność, zasady i parametry.
      </p>
      
      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 max-w-lg">
          <TabsTrigger value="general">Ogólne</TabsTrigger>
          <TabsTrigger value="knowledge">Runda Wiedzy</TabsTrigger>
          <TabsTrigger value="speed">Szybka Odpowiedź</TabsTrigger>
          <TabsTrigger value="wheel">Koło Fortuny</TabsTrigger>
        </TabsList>
        
        {/* General Settings Tab */}
        <TabsContent value="general" className="space-y-6">
          <div className="bg-gameshow-card p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Settings className="mr-2" /> Kolejność Rund
            </h3>
            <p className="text-sm text-gameshow-muted mb-4">
              Przeciągnij i upuść, aby zmienić kolejność rund w teleturnieju.
            </p>
            
            <div className="space-y-2 mb-6">
              {roundOrder.map((round, index) => (
                <div
                  key={round}
                  draggable
                  onDragStart={() => handleDragStart(round)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center p-3 bg-gameshow-background rounded border ${
                    isDragging && draggedRound === round
                      ? 'border-gameshow-primary opacity-50'
                      : 'border-gameshow-border'
                  } cursor-move`}
                >
                  <div className="flex-1 flex items-center">
                    <span className="w-8 h-8 flex items-center justify-center bg-gameshow-primary/20 text-gameshow-primary rounded-full mr-3">
                      {index + 1}
                    </span>
                    <span>{ROUND_NAMES[round]}</span>
                  </div>
                  <Switch
                    checked={roundSettings[round as keyof typeof roundSettings].enabled}
                    onCheckedChange={(checked) => updateRoundSetting(round as keyof typeof roundSettings, 'enabled', checked)}
                  />
                </div>
              ))}
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={handleResetSettings}>
                Resetuj
              </Button>
              <Button onClick={handleSaveSettings}>
                Zapisz ustawienia
              </Button>
            </div>
          </div>
          
          <div className="bg-gameshow-card p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Sliders className="mr-2" /> Globalne ustawienia rund
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Minimalna liczba graczy
                  </label>
                  <Input 
                    type="number" 
                    min="2" 
                    max="16" 
                    defaultValue="2" 
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Maksymalna liczba graczy
                  </label>
                  <Input 
                    type="number" 
                    min="2" 
                    max="16" 
                    defaultValue="12" 
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Minuty oczekiwania przed startem
                  </label>
                  <Input 
                    type="number" 
                    min="0" 
                    max="10" 
                    defaultValue="2" 
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Automatyczne przejście między rundami
                  </label>
                  <div className="flex items-center">
                    <Switch id="auto-next" />
                    <label htmlFor="auto-next" className="ml-2">
                      Włącz
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Knowledge Round Tab */}
        <TabsContent value="knowledge" className="space-y-6">
          <div className="bg-gameshow-card p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                  <Dice1 className="text-white h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Runda Wiedzy</h3>
                  <p className="text-sm text-gameshow-muted">Pierwsza runda z pytaniami wiedzy ogólnej i eliminacjami.</p>
                </div>
              </div>
              <Switch
                checked={roundSettings.knowledge.enabled}
                onCheckedChange={(checked) => updateRoundSetting('knowledge', 'enabled', checked)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4" /> Limit czasu na odpowiedź (sekundy)
                  </label>
                  <Input 
                    type="number" 
                    min="10" 
                    max="120" 
                    value={roundSettings.knowledge.timeLimit}
                    onChange={(e) => updateRoundSetting('knowledge', 'timeLimit', parseInt(e.target.value))} 
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Award className="h-4 w-4" /> Punkty za poprawną odpowiedź
                  </label>
                  <Input 
                    type="number" 
                    min="10" 
                    max="1000" 
                    step="10"
                    value={roundSettings.knowledge.pointsPerQuestion}
                    onChange={(e) => updateRoundSetting('knowledge', 'pointsPerQuestion', parseInt(e.target.value))} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Flame className="h-4 w-4" /> Utrata życia za błędną odpowiedź
                  </label>
                  <Switch
                    checked={roundSettings.knowledge.lifeLoss}
                    onCheckedChange={(checked) => updateRoundSetting('knowledge', 'lifeLoss', checked)}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <ScrollText className="h-4 w-4" /> Maksymalna liczba pytań
                  </label>
                  <Input 
                    type="number" 
                    min="5" 
                    max="50" 
                    value={roundSettings.knowledge.maxQuestions}
                    onChange={(e) => updateRoundSetting('knowledge', 'maxQuestions', parseInt(e.target.value))} 
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Kategorie pytań
                  </label>
                  <Textarea 
                    placeholder="Nauka, Historia, Geografia, Film i TV, Muzyka, Sport..."
                    className="min-h-[80px]"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Zap className="h-4 w-4" /> Zezwalaj na użycie kart
                  </label>
                  <Switch
                    checked={roundSettings.knowledge.allowCards}
                    onCheckedChange={(checked) => updateRoundSetting('knowledge', 'allowCards', checked)}
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Speed Round Tab */}
        <TabsContent value="speed" className="space-y-6">
          <div className="bg-gameshow-card p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-amber-600 flex items-center justify-center">
                  <Zap className="text-white h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Szybka Odpowiedź</h3>
                  <p className="text-sm text-gameshow-muted">Druga runda z naciskiem na szybkość odpowiedzi.</p>
                </div>
              </div>
              <Switch
                checked={roundSettings.speed.enabled}
                onCheckedChange={(checked) => updateRoundSetting('speed', 'enabled', checked)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4" /> Limit czasu na odpowiedź (sekundy)
                  </label>
                  <Input 
                    type="number" 
                    min="5" 
                    max="60" 
                    value={roundSettings.speed.timeLimit}
                    onChange={(e) => updateRoundSetting('speed', 'timeLimit', parseInt(e.target.value))} 
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Award className="h-4 w-4" /> Punkty za poprawną odpowiedź
                  </label>
                  <Input 
                    type="number" 
                    min="10" 
                    max="1000" 
                    step="10"
                    value={roundSettings.speed.pointsPerQuestion}
                    onChange={(e) => updateRoundSetting('speed', 'pointsPerQuestion', parseInt(e.target.value))} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Award className="h-4 w-4" /> Bonus za szybkość odpowiedzi
                  </label>
                  <Switch
                    checked={roundSettings.speed.bonusForSpeed}
                    onCheckedChange={(checked) => updateRoundSetting('speed', 'bonusForSpeed', checked)}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <ScrollText className="h-4 w-4" /> Maksymalna liczba pytań
                  </label>
                  <Input 
                    type="number" 
                    min="5" 
                    max="30" 
                    value={roundSettings.speed.maxQuestions}
                    onChange={(e) => updateRoundSetting('speed', 'maxQuestions', parseInt(e.target.value))} 
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Kategorie pytań (opcjonalnie)
                  </label>
                  <Textarea 
                    placeholder="Pozostaw puste, aby użyć wszystkich kategorii"
                    className="min-h-[80px]"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Zap className="h-4 w-4" /> Zezwalaj na użycie kart
                  </label>
                  <Switch
                    checked={roundSettings.speed.allowCards}
                    onCheckedChange={(checked) => updateRoundSetting('speed', 'allowCards', checked)}
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Wheel Round Tab */}
        <TabsContent value="wheel" className="space-y-6">
          <div className="bg-gameshow-card p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center">
                  <Copy className="text-white h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Koło Fortuny</h3>
                  <p className="text-sm text-gameshow-muted">Trzecia runda z losowaniem kategorii pytań.</p>
                </div>
              </div>
              <Switch
                checked={roundSettings.wheel.enabled}
                onCheckedChange={(checked) => updateRoundSetting('wheel', 'enabled', checked)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4" /> Limit czasu na odpowiedź (sekundy)
                  </label>
                  <Input 
                    type="number" 
                    min="10" 
                    max="120" 
                    value={roundSettings.wheel.timeLimit}
                    onChange={(e) => updateRoundSetting('wheel', 'timeLimit', parseInt(e.target.value))} 
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Award className="h-4 w-4" /> Punkty za poprawną odpowiedź
                  </label>
                  <Input 
                    type="number" 
                    min="10" 
                    max="1000" 
                    step="10"
                    value={roundSettings.wheel.pointsPerQuestion}
                    onChange={(e) => updateRoundSetting('wheel', 'pointsPerQuestion', parseInt(e.target.value))} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Copy className="h-4 w-4" /> Włącz kategorie na kole
                  </label>
                  <Switch
                    checked={roundSettings.wheel.categoriesEnabled}
                    onCheckedChange={(checked) => updateRoundSetting('wheel', 'categoriesEnabled', checked)}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Copy className="h-4 w-4" /> Maksymalna liczba obrotów koła
                  </label>
                  <Input 
                    type="number" 
                    min="3" 
                    max="20" 
                    value={roundSettings.wheel.maxSpins}
                    onChange={(e) => updateRoundSetting('wheel', 'maxSpins', parseInt(e.target.value))} 
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Kategorie do umieszczenia na kole
                  </label>
                  <Textarea 
                    placeholder="Nauka, Historia, Geografia, Film i TV, Muzyka, Sport..."
                    className="min-h-[80px]"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Zap className="h-4 w-4" /> Zezwalaj na użycie kart
                  </label>
                  <Switch
                    checked={roundSettings.wheel.allowCards}
                    onCheckedChange={(checked) => updateRoundSetting('wheel', 'allowCards', checked)}
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 flex justify-between items-center">
        <Button variant="outline" onClick={handleResetSettings}>
          <Undo className="w-4 h-4 mr-2" />
          Przywróć domyślne
        </Button>
        <Button onClick={handleSaveSettings}>
          Zapisz wszystkie ustawienia
        </Button>
      </div>
    </div>
  );
}
