
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Users, 
  Monitor, 
  Settings, 
  BookOpen, 
  Trophy,
  Camera,
  Gamepad2,
  Zap,
  Target
} from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gameshow-background text-gameshow-text">
      {/* Header */}
      <header className="border-b border-gameshow-accent/20 bg-gameshow-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Trophy className="h-8 w-8 text-gameshow-primary" />
              <div>
                <h1 className="text-3xl font-bold">Quiz Show Master</h1>
                <p className="text-gameshow-muted">Profesjonalny system teleturnieju</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button asChild variant="outline">
                <Link to="/rules" className="flex items-center gap-2">
                  <BookOpen size={16} />
                  Zasady gry
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/settings" className="flex items-center gap-2">
                  <Settings size={16} />
                  Ustawienia
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Navigation */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Host Panel */}
          <Card className="bg-gameshow-card hover:shadow-neon-primary transition-all duration-300 cursor-pointer group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                    <Play className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Panel Hosta</CardTitle>
                    <Badge variant="secondary" className="mt-1">Główny</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Centrum sterowania grą z pełną kontrolą nad rundami, graczami i pytaniami.
              </CardDescription>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gameshow-muted">
                  <Target className="h-4 w-4 mr-2" />
                  Zarządzanie rundami
                </div>
                <div className="flex items-center text-sm text-gameshow-muted">
                  <Users className="h-4 w-4 mr-2" />
                  Kontrola graczy
                </div>
                <div className="flex items-center text-sm text-gameshow-muted">
                  <Zap className="h-4 w-4 mr-2" />
                  Karty specjalne
                </div>
              </div>
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link to="/host">
                  Uruchom panel hosta
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Players Panel */}
          <Card className="bg-gameshow-card hover:shadow-neon-secondary transition-all duration-300 cursor-pointer group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                    <Users className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Panel Graczy</CardTitle>
                    <Badge variant="secondary" className="mt-1">Uczestnicy</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Widok dla graczy z prostym interfejsem do odpowiadania na pytania.
              </CardDescription>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gameshow-muted">
                  <Gamepad2 className="h-4 w-4 mr-2" />
                  Odpowiadanie na pytania
                </div>
                <div className="flex items-center text-sm text-gameshow-muted">
                  <Trophy className="h-4 w-4 mr-2" />
                  Podgląd wyników
                </div>
                <div className="flex items-center text-sm text-gameshow-muted">
                  <Zap className="h-4 w-4 mr-2" />
                  Używanie kart
                </div>
              </div>
              <Button asChild variant="outline" className="w-full border-green-500 text-green-500 hover:bg-green-500 hover:text-white">
                <Link to="/players">
                  Dołącz jako gracz
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Overlay Panel */}
          <Card className="bg-gameshow-card hover:shadow-neon-primary transition-all duration-300 cursor-pointer group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                    <Monitor className="h-6 w-6 text-purple-500" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Nakładka OBS</CardTitle>
                    <Badge variant="secondary" className="mt-1">Streaming</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                Wizualna nakładka do streamingu z kamerami graczy i informacjami o grze.
              </CardDescription>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gameshow-muted">
                  <Camera className="h-4 w-4 mr-2" />
                  Kamery graczy
                </div>
                <div className="flex items-center text-sm text-gameshow-muted">
                  <Monitor className="h-4 w-4 mr-2" />
                  Wyświetlanie pytań
                </div>
                <div className="flex items-center text-sm text-gameshow-muted">
                  <Trophy className="h-4 w-4 mr-2" />
                  Tabela wyników
                </div>
              </div>
              <Button asChild variant="outline" className="w-full border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white">
                <Link to="/overlay">
                  Otwórz nakładkę
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Game Rules Summary */}
        <div className="mt-12">
          <Card className="bg-gameshow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Krótkie zasady gry
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className="font-semibold text-blue-500 mb-2">Runda 1: Eliminacje</h4>
                  <p className="text-sm text-gameshow-muted">
                    Gracze odpowiadają na pytania wiedzy ogólnej. Za błędną odpowiedź tracą życie. 
                    Gracz bez żyć zostaje wyeliminowany.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-500 mb-2">Runda 2: Szybka odpowiedź</h4>
                  <p className="text-sm text-gameshow-muted">
                    Gracze mają 5 sekund na odpowiedź. Pierwszy poprawny dostaje punkty. 
                    Błędna odpowiedź = utrata życia.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-purple-500 mb-2">Runda 3: Koło fortuny</h4>
                  <p className="text-sm text-gameshow-muted">
                    Koło losuje kategorię pytania. Poprawna odpowiedź = punkty. 
                    Gracz z największą liczbą punktów wygrywa.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gameshow-muted">
          <p>Quiz Show Master - System teleturnieju dla streamerów</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
