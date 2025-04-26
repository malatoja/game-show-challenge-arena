
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Users, FileText, Palette, Award, 
  Music, Cards, Zap, Settings 
} from 'lucide-react';
import { PlayersTab } from '@/components/settings/PlayersTab';
import { QuestionsTab } from '@/components/settings/QuestionsTab';
import { ThemesTab } from '@/components/settings/ThemesTab';
import { RankingTab } from '@/components/settings/RankingTab';
import { SoundsTab } from '@/components/settings/SoundsTab';
import { CardsTab } from '@/components/settings/CardsTab';
import { AutomationTab } from '@/components/settings/AutomationTab';
import { RolesTab } from '@/components/settings/RolesTab';
import { motion } from 'framer-motion';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("players");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto p-4 bg-gameshow-background min-h-screen"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gameshow-text">Ustawienia</h1>
        <Button onClick={() => window.history.back()}>Powrót</Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 mb-6">
          <TabsTrigger value="players" className="flex items-center gap-2">
            <Users className="h-4 w-4" /> Gracze
          </TabsTrigger>
          <TabsTrigger value="questions" className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> Pytania
          </TabsTrigger>
          <TabsTrigger value="themes" className="flex items-center gap-2">
            <Palette className="h-4 w-4" /> Motywy
          </TabsTrigger>
          <TabsTrigger value="ranking" className="flex items-center gap-2">
            <Award className="h-4 w-4" /> Ranking
          </TabsTrigger>
          <TabsTrigger value="sounds" className="flex items-center gap-2">
            <Music className="h-4 w-4" /> Dźwięki
          </TabsTrigger>
          <TabsTrigger value="cards" className="flex items-center gap-2">
            <Cards className="h-4 w-4" /> Karty
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center gap-2">
            <Zap className="h-4 w-4" /> Automatyzacja
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Settings className="h-4 w-4" /> Role
          </TabsTrigger>
        </TabsList>

        <div className="bg-gameshow-card p-6 rounded-lg shadow-lg">
          <TabsContent value="players">
            <PlayersTab />
          </TabsContent>
          <TabsContent value="questions">
            <QuestionsTab />
          </TabsContent>
          <TabsContent value="themes">
            <ThemesTab />
          </TabsContent>
          <TabsContent value="ranking">
            <RankingTab />
          </TabsContent>
          <TabsContent value="sounds">
            <SoundsTab />
          </TabsContent>
          <TabsContent value="cards">
            <CardsTab />
          </TabsContent>
          <TabsContent value="automation">
            <AutomationTab />
          </TabsContent>
          <TabsContent value="roles">
            <RolesTab />
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  );
};

export default SettingsPage;
