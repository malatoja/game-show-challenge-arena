
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlayersTab } from '@/components/settings/PlayersTab';
import { QuestionsTab } from '@/components/settings/QuestionsTab';
import { ThemesTab } from '@/components/settings/ThemesTab';
import { CardsTab } from '@/components/settings/CardsTab';
import { SoundsTab } from '@/components/settings/SoundsTab';
import { RolesTab } from '@/components/settings/RolesTab';
import { RankingTab } from '@/components/settings/RankingTab';
import { AutomationTab } from '@/components/settings/AutomationTab';
import { Link } from 'react-router-dom';
import { ArrowLeft, LogOut, Lock, Unlock } from 'lucide-react';
import { 
  isSettingsAuthenticated, 
  authenticateSettings, 
  logoutSettings,
  updateHostPassword,
  updateSettingsPassword,
  getAuthSettings
} from '@/lib/authService';
import { LoginForm } from '@/components/auth/LoginForm';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('players');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Password management
  const [showPasswordSettings, setShowPasswordSettings] = useState(false);
  const [hostPassword, setHostPassword] = useState('');
  const [settingsPassword, setSettingsPassword] = useState('');
  
  useEffect(() => {
    const authStatus = isSettingsAuthenticated();
    setIsAuthenticated(authStatus);
    
    if (authStatus) {
      const settings = getAuthSettings();
      setHostPassword(settings.hostPassword || '');
      setSettingsPassword(settings.settingsPassword || '');
    }
  }, []);
  
  const handleLogin = (password: string) => {
    setIsLoading(true);
    setLoginError('');
    
    setTimeout(() => {
      const success = authenticateSettings(password);
      
      if (success) {
        setIsAuthenticated(true);
        
        // Load password settings
        const settings = getAuthSettings();
        setHostPassword(settings.hostPassword || '');
        setSettingsPassword(settings.settingsPassword || '');
      } else {
        setLoginError('Nieprawidłowe hasło');
      }
      
      setIsLoading(false);
    }, 500); // Simulate a delay for better UX
  };
  
  const handleLogout = () => {
    logoutSettings();
    setIsAuthenticated(false);
  };
  
  const handleSaveHostPassword = () => {
    updateHostPassword(hostPassword || null);
    toast.success('Hasło hosta zostało zaktualizowane');
  };
  
  const handleSaveSettingsPassword = () => {
    updateSettingsPassword(settingsPassword || null);
    toast.success('Hasło ustawień zostało zaktualizowane');
    
    // Re-authenticate with new password if it was changed
    if (settingsPassword) {
      authenticateSettings(settingsPassword);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gameshow-background flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center text-gameshow-primary mb-8 hover:underline">
            <ArrowLeft size={16} className="mr-1" />
            Powrót do strony głównej
          </Link>
          
          <LoginForm
            title="Panel Ustawień"
            onSubmit={handleLogin}
            loading={isLoading}
            error={loginError}
          />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gameshow-background p-4 md:p-6"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-between items-center mb-6">
          <div>
            <Link to="/" className="flex items-center text-gameshow-primary hover:underline">
              <ArrowLeft size={16} className="mr-1" />
              Powrót do strony głównej
            </Link>
            <h1 className="text-3xl font-bold text-gameshow-text mt-2">Panel Ustawień</h1>
          </div>
          
          <div className="flex space-x-2 mt-2 md:mt-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPasswordSettings(!showPasswordSettings)}
              className="flex items-center gap-1"
            >
              {showPasswordSettings ? <Unlock size={16} /> : <Lock size={16} />}
              {showPasswordSettings ? 'Ukryj ustawienia haseł' : 'Pokaż ustawienia haseł'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-1"
            >
              <LogOut size={16} />
              Wyloguj
            </Button>
          </div>
        </div>
        
        {showPasswordSettings && (
          <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gameshow-card p-4 rounded-lg">
            <div>
              <h3 className="text-lg font-medium mb-3 text-gameshow-text">Hasło do panelu hosta</h3>
              <div className="space-y-3">
                <Input
                  type="password"
                  placeholder="Ustaw hasło hosta (pozostaw puste, aby wyłączyć)"
                  value={hostPassword}
                  onChange={(e) => setHostPassword(e.target.value)}
                  className="bg-gameshow-background"
                />
                <Button onClick={handleSaveHostPassword}>Zapisz hasło hosta</Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3 text-gameshow-text">Hasło do panelu ustawień</h3>
              <div className="space-y-3">
                <Input
                  type="password"
                  placeholder="Ustaw hasło ustawień (pozostaw puste, aby wyłączyć)"
                  value={settingsPassword}
                  onChange={(e) => setSettingsPassword(e.target.value)}
                  className="bg-gameshow-background"
                />
                <Button onClick={handleSaveSettingsPassword}>Zapisz hasło ustawień</Button>
              </div>
            </div>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 flex flex-wrap">
            <TabsTrigger value="players">Gracze</TabsTrigger>
            <TabsTrigger value="questions">Pytania</TabsTrigger>
            <TabsTrigger value="cards">Karty</TabsTrigger>
            <TabsTrigger value="themes">Motywy</TabsTrigger>
            <TabsTrigger value="sounds">Dźwięki</TabsTrigger>
            <TabsTrigger value="roles">Role</TabsTrigger>
            <TabsTrigger value="ranking">Ranking</TabsTrigger>
            <TabsTrigger value="automation">Automatyzacja</TabsTrigger>
          </TabsList>
          
          <div className="bg-gameshow-card rounded-lg p-6 shadow-lg">
            <TabsContent value="players">
              <PlayersTab />
            </TabsContent>
            
            <TabsContent value="questions">
              <QuestionsTab />
            </TabsContent>
            
            <TabsContent value="cards">
              <CardsTab />
            </TabsContent>
            
            <TabsContent value="themes">
              <ThemesTab />
            </TabsContent>
            
            <TabsContent value="sounds">
              <SoundsTab />
            </TabsContent>
            
            <TabsContent value="roles">
              <RolesTab />
            </TabsContent>
            
            <TabsContent value="ranking">
              <RankingTab />
            </TabsContent>
            
            <TabsContent value="automation">
              <AutomationTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default SettingsPage;
