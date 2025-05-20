
import React, { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SettingsHeader } from './SettingsHeader';
import { QuestionsTab } from './QuestionsTab';
import { RolesTab } from './RolesTab';
import { PlayersTab } from './PlayersTab';
import { RankingTab } from './RankingTab';
import { ThemesTab } from './ThemesTab';
import { SoundsTab } from './SoundsTab';
import { CardsTab } from './CardsTab';
import { AutomationTab } from './AutomationTab';
import { PasswordSettings } from './PasswordSettings';
import { CameraConfigTab } from './CameraConfigTab';
import { LuckyLoserTab } from './LuckyLoserTab';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function SettingsLayout() {
  const [activeTab, setActiveTab] = useState('questions');

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="min-h-screen bg-gameshow-background text-gameshow-text p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Button asChild variant="outline" className="mb-6">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Powrót do strony głównej
          </Link>
        </Button>

        <SettingsHeader />
        <Separator className="my-6" />

        <Tabs defaultValue="questions" onValueChange={handleTabChange} value={activeTab}>
          <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            <TabsTrigger value="questions">Pytania</TabsTrigger>
            <TabsTrigger value="cards">Karty</TabsTrigger>
            <TabsTrigger value="players">Gracze</TabsTrigger>
            <TabsTrigger value="ranking">Ranking</TabsTrigger>
            <TabsTrigger value="lucky-loser">Lucky Loser</TabsTrigger>
            <TabsTrigger value="cameras">Kamery</TabsTrigger>
            <TabsTrigger value="themes">Motywy</TabsTrigger>
            <TabsTrigger value="sounds">Dźwięki</TabsTrigger>
            <TabsTrigger value="automation">Automatyzacja</TabsTrigger>
            <TabsTrigger value="roles">Role</TabsTrigger>
            <TabsTrigger value="password">Hasło</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            {activeTab === 'questions' && <QuestionsTab />}
            {activeTab === 'cards' && <CardsTab />}
            {activeTab === 'players' && <PlayersTab />}
            {activeTab === 'ranking' && <RankingTab />}
            {activeTab === 'lucky-loser' && <LuckyLoserTab />}
            {activeTab === 'cameras' && <CameraConfigTab />}
            {activeTab === 'themes' && <ThemesTab />}
            {activeTab === 'sounds' && <SoundsTab />}
            {activeTab === 'automation' && <AutomationTab />}
            {activeTab === 'roles' && <RolesTab />}
            {activeTab === 'password' && <PasswordSettings />}
          </div>
        </Tabs>
      </div>
    </div>
  );
}
