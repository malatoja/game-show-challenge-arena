
import React, { useState, useEffect } from 'react';
import { 
  isSettingsAuthenticated, 
  logoutSettings,
  getAuthSettings
} from '@/lib/authService';

import { SettingsLayout } from '@/components/settings/SettingsLayout';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { SettingsAuth } from '@/components/settings/SettingsAuth';

// Import tab components
import { GeneralTab } from '@/components/settings/GeneralTab';
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
import { InfoBarTab } from '@/components/settings/InfoBarTab';
import { BackupTab } from '@/components/settings/BackupTab';
import { AdvancedTab } from '@/components/settings/AdvancedTab';
import { TestsTab } from '@/components/settings/TestsTab';
import { PasswordTab } from '@/components/settings/PasswordTab';
import { RoundsTab } from '@/components/settings/RoundsTab';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const authStatus = isSettingsAuthenticated();
    setIsAuthenticated(authStatus);
  }, []);
  
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
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
        handleLogout={handleLogout}
      />
      
      <div className="mt-6">
        {activeTab === 'general' && <GeneralTab />}
        {activeTab === 'rounds' && <RoundsTab />}
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
        {activeTab === 'info-bar' && <InfoBarTab />}
        {activeTab === 'backup' && <BackupTab />}
        {activeTab === 'advanced' && <AdvancedTab />}
        {activeTab === 'tests' && <TestsTab />}
        {activeTab === 'password' && <PasswordTab />}
      </div>
    </SettingsLayout>
  );
};

export default SettingsPage;
