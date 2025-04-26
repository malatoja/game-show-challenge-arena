
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export const ThemesTab = () => {
  const [selectedTheme, setSelectedTheme] = useState('default');
  const [customTheme, setCustomTheme] = useState({
    name: 'Custom Theme',
    primary: '#9b87f5',
    background: '#1A1F2C',
    card: '#2D3748',
    text: '#FFFFFF',
    font: 'sans-serif'
  });
  
  // Predefined themes
  const themes = [
    { id: 'default', name: 'Default', primary: '#9b87f5', background: '#1A1F2C', card: '#2D3748', text: '#FFFFFF', font: 'sans-serif' },
    { id: 'cyberpunk', name: 'Cyberpunk', primary: '#00FFFF', background: '#120458', card: '#281C6C', text: '#00FFFF', font: 'monospace' },
    { id: 'retrowave', name: 'RetroWave', primary: '#ff00ff', background: '#000055', card: '#220033', text: '#ff69b4', font: 'VT323, monospace' },
    { id: 'classic', name: 'Classic TV', primary: '#FFD700', background: '#222222', card: '#333333', text: '#FFFFFF', font: 'serif' },
    { id: 'neon', name: 'Neon', primary: '#39FF14', background: '#0D0221', card: '#1B1B3A', text: '#FF10F0', font: 'sans-serif' }
  ];

  // Handle theme change
  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
    const theme = themes.find(t => t.id === themeId);
    
    // Apply theme to customTheme form for potential customization
    if (theme) {
      setCustomTheme({ ...theme });
      
      // TODO: In a real implementation, this would update global theme settings
      toast.success(`Wybrano motyw: ${theme.name}`);
    }
  };

  // Handle custom theme update
  const handleCustomThemeChange = (field: string, value: string) => {
    setCustomTheme(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Apply custom theme
  const handleApplyTheme = () => {
    // TODO: In a real implementation, this would update global theme settings
    toast.success('Zastosowano niestandardowy motyw');
  };

  // Export theme to JSON
  const handleExportTheme = () => {
    const themeJson = JSON.stringify(customTheme, null, 2);
    const blob = new Blob([themeJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${customTheme.name.replace(/\s+/g, '_').toLowerCase()}_theme.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success('Motyw wyeksportowany do pliku JSON');
  };

  // Import theme from JSON
  const handleImportTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedTheme = JSON.parse(e.target?.result as string);
        if (importedTheme.name && importedTheme.primary && importedTheme.background) {
          setCustomTheme(importedTheme);
          toast.success(`Zaimportowano motyw: ${importedTheme.name}`);
        } else {
          toast.error('Nieprawidłowy format pliku motywu');
        }
      } catch (error) {
        console.error('Theme import error:', error);
        toast.error('Wystąpił błąd podczas importu motywu');
      }
    };
    
    reader.readAsText(file);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Motywy i Style</h2>
      <p className="text-gray-600 mb-6">
        Tu zmienisz wygląd sceny, motywy i efekty.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Predefined themes */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Gotowe motywy</h3>
          
          <div className="grid grid-cols-2 gap-3">
            {themes.map(theme => (
              <div
                key={theme.id}
                className={`p-4 rounded-lg cursor-pointer border-2 ${
                  selectedTheme === theme.id ? 'border-white' : 'border-transparent'
                }`}
                style={{ backgroundColor: theme.background }}
                onClick={() => handleThemeChange(theme.id)}
              >
                <div className="flex justify-between mb-3">
                  <h4 
                    className="font-medium" 
                    style={{ color: theme.text }}
                  >
                    {theme.name}
                  </h4>
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: theme.primary }}
                  />
                </div>
                
                <div 
                  className="p-2 rounded text-sm" 
                  style={{ backgroundColor: theme.card, color: theme.text, fontFamily: theme.font }}
                >
                  Przykładowy tekst
                </div>
                
                <div 
                  className="mt-2 text-xs rounded p-1 text-center" 
                  style={{ backgroundColor: theme.primary, color: theme.background }}
                >
                  Przycisk
                </div>
              </div>
            ))}
          </div>
          
          {/* Theme preview */}
          <div>
            <h3 className="text-lg font-medium mb-3">Podgląd na żywo</h3>
            <div 
              className="aspect-video rounded-lg overflow-hidden p-4 flex flex-col"
              style={{ 
                backgroundColor: customTheme.background,
                color: customTheme.text,
                fontFamily: customTheme.font
              }}
            >
              <div className="text-center mb-4">
                <h3 
                  className="text-xl font-bold" 
                  style={{ color: customTheme.primary }}
                >
                  QUIZ SHOW
                </h3>
              </div>
              
              <div 
                className="flex-1 rounded-lg p-3" 
                style={{ backgroundColor: customTheme.card }}
              >
                <div className="text-center mb-3">
                  <h4>Przykładowe pytanie</h4>
                  <p className="text-sm opacity-80">W którym roku miała miejsce bitwa pod Grunwaldem?</p>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {['1410', '1492', '1385', '1505'].map((answer, index) => (
                    <div 
                      key={index}
                      className="p-2 text-center text-sm rounded"
                      style={{ 
                        backgroundColor: index === 0 ? customTheme.primary : 'rgba(255,255,255,0.1)',
                        color: index === 0 ? customTheme.background : customTheme.text
                      }}
                    >
                      {answer}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-3 flex justify-between">
                <div className="flex gap-1">
                  {['Gracz 1', 'Gracz 2'].map((player, index) => (
                    <div 
                      key={index}
                      className="px-2 py-1 text-xs rounded"
                      style={{ backgroundColor: customTheme.card }}
                    >
                      {player}
                    </div>
                  ))}
                </div>
                
                <div 
                  className="px-2 py-1 text-xs rounded"
                  style={{ backgroundColor: customTheme.primary, color: customTheme.background }}
                >
                  Następne pytanie
                </div>
              </div>
            </div>
          </div>
          
          {/* Import/Export */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={handleExportTheme}>
                Eksportuj motyw
              </Button>
              
              <div>
                <Input
                  id="import-theme"
                  type="file"
                  accept=".json"
                  onChange={handleImportTheme}
                  className="hidden"
                />
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => document.getElementById('import-theme')?.click()}
                >
                  Importuj motyw
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Custom theme settings */}
        <div className="space-y-4 bg-gameshow-background/20 p-4 rounded-lg">
          <h3 className="text-lg font-medium">Dostosuj motyw</h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Nazwa motywu</label>
              <Input
                value={customTheme.name}
                onChange={(e) => handleCustomThemeChange('name', e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm mb-1">Kolor główny (przyciski, akcenty)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customTheme.primary}
                  onChange={(e) => handleCustomThemeChange('primary', e.target.value)}
                  className="w-10 h-10"
                />
                <Input
                  value={customTheme.primary}
                  onChange={(e) => handleCustomThemeChange('primary', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm mb-1">Kolor tła</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customTheme.background}
                  onChange={(e) => handleCustomThemeChange('background', e.target.value)}
                  className="w-10 h-10"
                />
                <Input
                  value={customTheme.background}
                  onChange={(e) => handleCustomThemeChange('background', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm mb-1">Kolor kart</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customTheme.card}
                  onChange={(e) => handleCustomThemeChange('card', e.target.value)}
                  className="w-10 h-10"
                />
                <Input
                  value={customTheme.card}
                  onChange={(e) => handleCustomThemeChange('card', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm mb-1">Kolor tekstu</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customTheme.text}
                  onChange={(e) => handleCustomThemeChange('text', e.target.value)}
                  className="w-10 h-10"
                />
                <Input
                  value={customTheme.text}
                  onChange={(e) => handleCustomThemeChange('text', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm mb-1">Czcionka</label>
              <select
                className="w-full p-2 rounded bg-gameshow-background"
                value={customTheme.font}
                onChange={(e) => handleCustomThemeChange('font', e.target.value)}
              >
                <option value="sans-serif">Sans Serif</option>
                <option value="serif">Serif</option>
                <option value="monospace">Monospace</option>
                <option value="'Press Start 2P', cursive">Retro Gaming</option>
                <option value="'VT323', monospace">Terminal</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm mb-1">Logo</label>
              <Input type="file" accept="image/*" disabled />
              <p className="text-xs text-gray-500 mt-1">
                Funkcja przesyłania własnego logo będzie dostępna wkrótce
              </p>
            </div>
            
            <div className="pt-4">
              <Button onClick={handleApplyTheme}>
                Zastosuj motyw
              </Button>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">Przypisz motywy do rund</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Standardowa runda</span>
                <select className="p-2 bg-gameshow-background rounded">
                  {themes.map(theme => (
                    <option key={theme.id} value={theme.id}>{theme.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Szybkie pytania</span>
                <select className="p-2 bg-gameshow-background rounded">
                  {themes.map(theme => (
                    <option key={theme.id} value={theme.id}>{theme.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Koło Chaosu</span>
                <select className="p-2 bg-gameshow-background rounded">
                  {themes.map(theme => (
                    <option key={theme.id} value={theme.id}>{theme.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
