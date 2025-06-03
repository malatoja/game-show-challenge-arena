
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Users, HelpCircle, Palette } from 'lucide-react';

const SettingsPage = () => {
  return (
    <div className="min-h-screen bg-gameshow-background p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gameshow-primary to-gameshow-secondary bg-clip-text text-transparent">
            Ustawienia aplikacji
          </h1>
          <p className="text-gameshow-muted mt-2">Skonfiguruj parametry gry i aplikacji</p>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gameshow-card/50 border border-gameshow-accent/20">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Ogólne
            </TabsTrigger>
            <TabsTrigger value="players" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Gracze
            </TabsTrigger>
            <TabsTrigger value="questions" className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              Pytania
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Wygląd
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-6">
            <Card className="bg-gameshow-card border-gameshow-accent/20">
              <CardHeader>
                <CardTitle>Ustawienia ogólne</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gameshow-muted">Podstawowe ustawienia aplikacji</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="players" className="mt-6">
            <Card className="bg-gameshow-card border-gameshow-accent/20">
              <CardHeader>
                <CardTitle>Zarządzanie graczami</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gameshow-muted">Konfiguracja ustawień graczy</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questions" className="mt-6">
            <Card className="bg-gameshow-card border-gameshow-accent/20">
              <CardHeader>
                <CardTitle>Edytor pytań</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gameshow-muted">Dodawanie i edycja pytań do gry</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="mt-6">
            <Card className="bg-gameshow-card border-gameshow-accent/20">
              <CardHeader>
                <CardTitle>Personalizacja wyglądu</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gameshow-muted">Kolory, motywy i inne ustawienia wizualne</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SettingsPage;
