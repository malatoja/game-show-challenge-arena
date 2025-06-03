
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Settings, Gamepad2, Monitor, Shield, Cog } from 'lucide-react';

interface SettingsLayoutProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  children?: React.ReactNode;
}

export function SettingsLayout({ activeTab, setActiveTab, children }: SettingsLayoutProps) {
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Group tabs by category for better organization
  const basicTabs = [
    { id: "general", label: "Ogólne", icon: Settings },
    { id: "rounds", label: "Rundy", icon: Gamepad2 },
    { id: "players", label: "Gracze", icon: "users" },
  ];
  
  const contentTabs = [
    { id: "questions", label: "Pytania", icon: "help-circle" },
    { id: "cards", label: "Karty", icon: "credit-card" },
    { id: "themes", label: "Motywy", icon: "palette" },
  ];
  
  const technicalTabs = [
    { id: "sounds", label: "Dźwięki", icon: "volume-2" },
    { id: "cameras", label: "Kamery", icon: "camera" },
    { id: "info-bar", label: "Pasek info", icon: "info" },
    { id: "automation", label: "Automatyzacja", icon: "zap" },
  ];
  
  const advancedTabs = [
    { id: "lucky-loser", label: "Lucky Loser", icon: "star" },
    { id: "ranking", label: "Ranking", icon: "trophy" },
    { id: "backup", label: "Kopia zapasowa", icon: "download" },
    { id: "roles", label: "Role", icon: "users" },
    { id: "advanced", label: "Zaawansowane", icon: "cog" },
    { id: "tests", label: "Testy", icon: "flask" },
    { id: "password", label: "Hasło", icon: "lock" }
  ];

  return (
    <div className="min-h-screen bg-gameshow-background text-gameshow-text p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button asChild variant="outline">
              <Link to="/" className="flex items-center gap-2">
                <ArrowLeft size={16} />
                Powrót do strony głównej
              </Link>
            </Button>
            
            <div>
              <h1 className="text-3xl font-bold">Panel Ustawień</h1>
              <p className="text-gameshow-muted">Konfiguruj wszystkie aspekty teleturnieju</p>
            </div>
          </div>
          
          <Badge variant="outline" className="px-3 py-1">
            Quiz Show Master
          </Badge>
        </div>
        
        <Separator className="my-6" />

        <Tabs defaultValue={activeTab} onValueChange={handleTabChange} value={activeTab}>
          {/* Basic Settings */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gameshow-muted mb-3 flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Podstawowe ustawienia
            </h3>
            <TabsList className="grid grid-cols-3 gap-2 mb-4 h-auto p-1">
              {basicTabs.map(tab => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="flex items-center gap-2 px-4 py-2"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {/* Content Settings */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gameshow-muted mb-3 flex items-center gap-2">
              <Gamepad2 className="h-4 w-4" />
              Zawartość gry
            </h3>
            <TabsList className="grid grid-cols-3 gap-2 mb-4 h-auto p-1">
              {contentTabs.map(tab => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="flex items-center gap-2 px-4 py-2"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {/* Technical Settings */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gameshow-muted mb-3 flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Ustawienia techniczne
            </h3>
            <TabsList className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4 h-auto p-1">
              {technicalTabs.map(tab => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="flex items-center gap-2 px-4 py-2"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Advanced Settings */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gameshow-muted mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Ustawienia zaawansowane
            </h3>
            <TabsList className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 h-auto p-1">
              {advancedTabs.map(tab => (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id}
                  className="flex items-center gap-2 px-3 py-2 text-xs"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Content Area */}
          <div className="bg-gameshow-card rounded-lg p-6 shadow-lg">
            {children}
          </div>
        </Tabs>
      </div>
    </div>
  );
}

export default SettingsLayout;
