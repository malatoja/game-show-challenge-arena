
import React from 'react';
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

  // Group tabs by category for better organization
  const generalTabs = [
    { id: "general", label: "Ogólne" },
    { id: "rounds", label: "Rundy" },
  ];
  
  const gameTabs = [
    { id: "players", label: "Gracze" },
    { id: "questions", label: "Pytania" },
    { id: "cards", label: "Karty" }
  ];
  
  const displayTabs = [
    { id: "themes", label: "Motywy" },
    { id: "sounds", label: "Dźwięki" },
    { id: "info-bar", label: "Pasek info" }
  ];
  
  const technicalTabs = [
    { id: "lucky-loser", label: "Lucky Loser" },
    { id: "cameras", label: "Kamery" },
    { id: "backup", label: "Kopia zapasowa" },
    { id: "automation", label: "Automatyzacja" }
  ];
  
  const advancedTabs = [
    { id: "roles", label: "Role" },
    { id: "ranking", label: "Ranking" },
    { id: "advanced", label: "Zaawansowane" },
    { id: "tests", label: "Testy" },
    { id: "password", label: "Hasło" }
  ];

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
          {/* General Settings */}
          <h3 className="text-sm font-medium text-gameshow-muted mb-2">Ogólne ustawienia</h3>
          <TabsList className="grid grid-cols-2 sm:grid-cols-2 gap-2 mb-4">
            {generalTabs.map(tab => (
              <TabsTrigger key={tab.id} value={tab.id}>{tab.label}</TabsTrigger>
            ))}
          </TabsList>
          
          {/* Game Settings */}
          <h3 className="text-sm font-medium text-gameshow-muted mb-2 mt-4">Ustawienia gry</h3>
          <TabsList className="grid grid-cols-3 sm:grid-cols-3 gap-2 mb-4">
            {gameTabs.map(tab => (
              <TabsTrigger key={tab.id} value={tab.id}>{tab.label}</TabsTrigger>
            ))}
          </TabsList>
          
          {/* Display Settings */}
          <h3 className="text-sm font-medium text-gameshow-muted mb-2 mt-4">Wygląd i multimedia</h3>
          <TabsList className="grid grid-cols-3 sm:grid-cols-3 gap-2">
            {displayTabs.map(tab => (
              <TabsTrigger key={tab.id} value={tab.id}>{tab.label}</TabsTrigger>
            ))}
          </TabsList>
          
          {/* Technical Settings */}
          <h3 className="text-sm font-medium text-gameshow-muted mb-2 mt-4">Ustawienia techniczne</h3>
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {technicalTabs.map(tab => (
              <TabsTrigger key={tab.id} value={tab.id}>{tab.label}</TabsTrigger>
            ))}
          </TabsList>

          {/* Advanced Settings */}
          <h3 className="text-sm font-medium text-gameshow-muted mb-2 mt-4">Ustawienia zaawansowane</h3>
          <TabsList className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {advancedTabs.map(tab => (
              <TabsTrigger key={tab.id} value={tab.id}>{tab.label}</TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-6">
            {children}
          </div>
        </Tabs>
      </div>
    </div>
  );
}

export default SettingsLayout;
