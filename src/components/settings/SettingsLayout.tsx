
import React, { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface SettingsLayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children?: React.ReactNode;
}

export function SettingsLayout({ activeTab, setActiveTab, children }: SettingsLayoutProps) {
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
        
        <Separator className="my-6" />

        <Tabs defaultValue={activeTab} onValueChange={handleTabChange} value={activeTab}>
          <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mb-4">
            <TabsTrigger value="players">Gracze</TabsTrigger>
            <TabsTrigger value="questions">Pytania</TabsTrigger>
            <TabsTrigger value="cards">Karty</TabsTrigger>
            <TabsTrigger value="themes">Motywy</TabsTrigger>
            <TabsTrigger value="sounds">Dźwięki</TabsTrigger>
          </TabsList>
          
          <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            <TabsTrigger value="lucky-loser">Lucky Loser</TabsTrigger>
            <TabsTrigger value="info-bar">Pasek info</TabsTrigger>
            <TabsTrigger value="cameras">Kamery</TabsTrigger>
            <TabsTrigger value="backup">Kopia zapasowa</TabsTrigger>
            <TabsTrigger value="automation">Automatyzacja</TabsTrigger>
          </TabsList>

          <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mt-2">
            <TabsTrigger value="roles">Role</TabsTrigger>
            <TabsTrigger value="ranking">Ranking</TabsTrigger>
            <TabsTrigger value="advanced">Zaawansowane</TabsTrigger>
            <TabsTrigger value="tests">Testy</TabsTrigger>
            <TabsTrigger value="password">Hasło</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            {children}
          </div>
        </Tabs>
      </div>
    </div>
  );
}

export const SettingsTabs = ({ children, activeTab, setActiveTab }: {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) => {
  return (
    <Tabs defaultValue={activeTab} onValueChange={setActiveTab} value={activeTab}>
      <TabsList className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        <TabsTrigger value="players">Gracze</TabsTrigger>
        <TabsTrigger value="questions">Pytania</TabsTrigger>
        <TabsTrigger value="cards">Karty</TabsTrigger>
        <TabsTrigger value="themes">Motywy</TabsTrigger>
        <TabsTrigger value="sounds">Dźwięki</TabsTrigger>
        <TabsTrigger value="roles">Role</TabsTrigger>
        <TabsTrigger value="ranking">Ranking</TabsTrigger>
        <TabsTrigger value="automation">Automatyzacja</TabsTrigger>
      </TabsList>
      <div className="mt-6">
        {children}
      </div>
    </Tabs>
  );
};
