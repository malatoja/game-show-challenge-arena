
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';
import { updateHostPassword, updateSettingsPassword, getAuthSettings, authenticateSettings } from '@/lib/authService';
import { Save, Key, Lock, Shield, RefreshCw } from 'lucide-react';

export function PasswordTab() {
  const [hostPassword, setHostPassword] = useState('');
  const [settingsPassword, setSettingsPassword] = useState('');
  const [showCurrentPasswords, setShowCurrentPasswords] = useState(false);
  const [saved, setSaved] = useState({ host: false, settings: false });
  
  // Get current settings
  const authSettings = getAuthSettings();
  const currentHostPassword = authSettings.hostPassword || 'Brak hasła';
  const currentSettingsPassword = authSettings.settingsPassword || 'Brak hasła';
  
  const handleSaveHostPassword = () => {
    updateHostPassword(hostPassword || null);
    toast.success('Hasło hosta zostało zaktualizowane');
    setSaved({ ...saved, host: true });
    setTimeout(() => setSaved({ ...saved, host: false }), 2000);
  };
  
  const handleSaveSettingsPassword = () => {
    updateSettingsPassword(settingsPassword || null);
    toast.success('Hasło ustawień zostało zaktualizowane');
    setSaved({ ...saved, settings: true });
    setTimeout(() => setSaved({ ...saved, settings: false }), 2000);
    
    // Re-authenticate with new password if it was changed
    if (settingsPassword) {
      authenticateSettings(settingsPassword);
    }
  };

  const handleClearPasswords = () => {
    if (confirm('Czy na pewno chcesz usunąć wszystkie hasła? Ta operacja nie może zostać cofnięta.')) {
      updateHostPassword(null);
      updateSettingsPassword(null);
      setHostPassword('');
      setSettingsPassword('');
      toast.success('Wszystkie hasła zostały usunięte');
    }
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4 text-gameshow-text">Ustawienia haseł</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Host Password */}
        <Card className="bg-gameshow-card shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Hasło hosta</CardTitle>
              <CardDescription>Zabezpiecza dostęp do panelu hosta</CardDescription>
            </div>
            <Key className="h-4 w-4 text-gameshow-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            {showCurrentPasswords && (
              <div className="bg-gameshow-background/50 p-2 rounded mb-2 text-sm">
                <span className="opacity-80">Aktualne hasło: </span>
                <span className="font-mono">{currentHostPassword}</span>
              </div>
            )}
            <Input
              type="password"
              placeholder="Ustaw hasło hosta (zostaw puste, aby wyłączyć)"
              value={hostPassword}
              onChange={(e) => setHostPassword(e.target.value)}
              className="bg-gameshow-background"
            />
            <p className="text-sm text-gameshow-muted">
              To hasło chroni dostęp do panelu hosta teleturnieju.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleSaveHostPassword} 
              className={`w-full ${saved.host ? 'bg-green-500' : ''}`}
            >
              <Save className="h-4 w-4 mr-2" />
              {saved.host ? 'Zapisano!' : 'Zapisz hasło hosta'}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Settings Password */}
        <Card className="bg-gameshow-card shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle>Hasło ustawień</CardTitle>
              <CardDescription>Zabezpiecza dostęp do panelu ustawień</CardDescription>
            </div>
            <Lock className="h-4 w-4 text-gameshow-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-4">
            {showCurrentPasswords && (
              <div className="bg-gameshow-background/50 p-2 rounded mb-2 text-sm">
                <span className="opacity-80">Aktualne hasło: </span>
                <span className="font-mono">{currentSettingsPassword}</span>
              </div>
            )}
            <Input
              type="password"
              placeholder="Ustaw hasło ustawień (zostaw puste, aby wyłączyć)"
              value={settingsPassword}
              onChange={(e) => setSettingsPassword(e.target.value)}
              className="bg-gameshow-background"
            />
            <p className="text-sm text-gameshow-muted">
              To hasło chroni dostęp do panelu ustawień teleturnieju.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleSaveSettingsPassword} 
              className={`w-full ${saved.settings ? 'bg-green-500' : ''}`}
            >
              <Save className="h-4 w-4 mr-2" />
              {saved.settings ? 'Zapisano!' : 'Zapisz hasło ustawień'}
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {/* Additional Password Settings */}
      <Card className="bg-gameshow-card shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>Dodatkowe opcje haseł</CardTitle>
            <CardDescription>Zarządzaj opcjami bezpieczeństwa</CardDescription>
          </div>
          <Shield className="h-4 w-4 text-gameshow-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <Button 
              variant="outline" 
              onClick={() => setShowCurrentPasswords(!showCurrentPasswords)}
              className="mr-2"
            >
              {showCurrentPasswords ? 'Ukryj aktualne hasła' : 'Pokaż aktualne hasła'}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleClearPasswords}
              className="text-red-500 border-red-400 hover:bg-red-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Resetuj wszystkie hasła
            </Button>
          </div>
          <div className="text-sm bg-amber-100/20 border border-amber-200/30 rounded p-3 flex items-start">
            <div className="mr-2 mt-0.5 text-amber-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-amber-500"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <div>
              <p>Ważne wskazówki dotyczące haseł:</p>
              <ul className="list-disc list-inside mt-1">
                <li>Zapamiętaj lub zapisz hasła w bezpiecznym miejscu</li>
                <li>Jeśli zapomnisz hasła, możesz je zresetować tylko z dostępem do tego panelu</li>
                <li>Puste pole oznacza brak hasła (każdy może uzyskać dostęp)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
