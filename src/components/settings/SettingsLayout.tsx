
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SettingsLayoutProps {
  children?: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const SettingsLayout = ({ 
  children, 
  activeTab, 
  setActiveTab 
}: SettingsLayoutProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gameshow-background p-4 md:p-6"
    >
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </motion.div>
  );
};

export const SettingsTabs = ({ 
  activeTab, 
  setActiveTab 
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) => {
  return (
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
          {/* Moved to SettingsPage.tsx */}
        </TabsContent>
        
        <TabsContent value="questions">
          {/* Moved to SettingsPage.tsx */}
        </TabsContent>
        
        <TabsContent value="cards">
          {/* Moved to SettingsPage.tsx */}
        </TabsContent>
        
        <TabsContent value="themes">
          {/* Moved to SettingsPage.tsx */}
        </TabsContent>
        
        <TabsContent value="sounds">
          {/* Moved to SettingsPage.tsx */}
        </TabsContent>
        
        <TabsContent value="roles">
          {/* Moved to SettingsPage.tsx */}
        </TabsContent>
        
        <TabsContent value="ranking">
          {/* Moved to SettingsPage.tsx */}
        </TabsContent>
        
        <TabsContent value="automation">
          {/* Moved to SettingsPage.tsx */}
        </TabsContent>
      </div>
    </Tabs>
  );
};
