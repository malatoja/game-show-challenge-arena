
import React, { useState, useEffect } from 'react';
import { 
  isSettingsAuthenticated, 
  logoutSettings,
  getAuthSettings
} from '@/lib/authService';

import { SettingsLayout } from '@/components/settings/SettingsLayout';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { PasswordSettings } from '@/components/settings/PasswordSettings';
import { SettingsAuth } from '@/components/settings/SettingsAuth';

import { PlayersTab } from '@/components/settings/PlayersTab';
import { QuestionsTab } from '@/components/settings/QuestionsTab';
import { ThemesTab } from '@/components/settings/ThemesTab';
import { CardsTab } from '@/components/settings/CardsTab';
import { SoundsTab } from '@/components/settings/SoundsTab';
import { RolesTab } from '@/components/settings/RolesTab';
import { RankingTab } from '@/components/settings/RankingTab';
import { AutomationTab } from '@/components/settings/AutomationTab';
import { LuckyLoserTab } from '@/components/settings/LuckyLoserTab';
import { CameraConfigTab } from '@/components/settings/CameraConfigTab';

import { TabsContent } from '@/components/ui/tabs';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('players');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
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
  
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    const settings = getAuthSettings();
    setHostPassword(settings.hostPassword || '');
    setSettingsPassword(settings.settingsPassword || '');
  };
  
  const handleLogout = () => {
    logoutSettings();
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <SettingsAuth onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <SettingsLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <SettingsHeader 
        showPasswordSettings={showPasswordSettings}
        setShowPasswordSettings={setShowPasswordSettings}
        handleLogout={handleLogout}
      />
      
      {showPasswordSettings && (
        <PasswordSettings
          hostPassword={hostPassword}
          settingsPassword={settingsPassword}
          setHostPassword={setHostPassword}
          setSettingsPassword={setSettingsPassword}
        />
      )}

      <div className="mt-6">
        {activeTab === 'players' && <PlayersTab />}
        {activeTab === 'questions' && <QuestionsTab />}
        {activeTab === 'cards' && <CardsTab />}
        {activeTab === 'themes' && <ThemesTab />}
        {activeTab === 'sounds' && <SoundsTab />}
        {activeTab === 'roles' && <RolesTab />}
        {activeTab === 'ranking' && <RankingTab />}
        {activeTab === 'automation' && <AutomationTab />}
        {activeTab === 'lucky-loser' && <LuckyLoserTab />}
        {activeTab === 'cameras' && <CameraConfigTab />}
        {activeTab === 'password' && (
          <PasswordSettings
            hostPassword={hostPassword}
            settingsPassword={settingsPassword}
            setHostPassword={setHostPassword}
            setSettingsPassword={setSettingsPassword}
          />
        )}
      </div>
    </SettingsLayout>
  );
};

export default SettingsPage;
