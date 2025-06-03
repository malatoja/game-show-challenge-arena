
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
  Target,
  Crown,
  Timer,
  Star
} from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gameshow-background via-gameshow-secondary/5 to-gameshow-background">
      {/* Header */}
      <header className="border-b border-gameshow-accent/20 bg-gameshow-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-br from-gameshow-primary to-gameshow-secondary rounded-xl shadow-neon-primary">
                <Crown className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gameshow-primary to-gameshow-secondary bg-clip-text text-transparent">
                  Quiz Show Arena
                </h1>
                <p className="text-gameshow-muted">Profesjonalny system teleturnieju dla streamerów</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button asChild variant="outline" className="border-gameshow-primary/30 hover:bg-gameshow-primary/10">
                <Link to="/rules" className="flex items-center gap-2">
                  <BookOpen size={16} />
                  Zasady gry
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-gameshow-secondary/30 hover:bg-gameshow-secondary/10">
                <Link to="/settings" className="flex items-center gap-2">
                  <Settings size={16} />
                  Ustawienia
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gameshow-primary via-gameshow-secondary to-gameshow-accent bg-clip-text text-transparent">
            Stwórz niezapomniane show!
          </h2>
          <p className="text-xl text-gameshow-muted max-w-3xl mx-auto">
            Kompleksowy system do prowadzenia teleturnieju z wieloma rundami, kartami specjalnymi, 
            nakładkami OBS i pełną integracją ze streamingiem.
          </p>
        </div>

        {/* Main Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          
          {/* Host Panel */}
          <Card className="bg-gradient-to-br from-gameshow-card to-gameshow-card/80 border-gameshow-primary/20 hover:shadow-neon-primary transition-all duration-300 cursor-pointer group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg group-hover:shadow-neon-secondary transition-all">
                    <Play className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gameshow-text">Panel Hosta</CardTitle>
                    <Badge variant="secondary" className="mt-1 bg-blue-500/20 text-blue-400">Główny</Badge>
                  </div>
                </div>
                <Star className="h-5 w-5 text-yellow-500" />
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4 text-gameshow-muted">
                Centrum sterowania grą z pełną kontrolą nad rundami, graczami i pytaniami.
              </CardDescription>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gameshow-muted">
                  <Target className="h-4 w-4 mr-2 text-blue-400" />
                  Zarządzanie 3 rundami gry
                </div>
                <div className="flex items-center text-sm text-gameshow-muted">
                  <Users className="h-4 w-4 mr-2 text-green-400" />
                  Kontrola graczy i punktów
                </div>
                <div className="flex items-center text-sm text-gameshow-muted">
                  <Zap className="h-4 w-4 mr-2 text-yellow-400" />
                  System kart specjalnych
                </div>
                <div className="flex items-center text-sm text-gameshow-muted">
                  <Timer className="h-4 w-4 mr-2 text-red-400" />
                  Timery i automatyzacja
                </div>
              </div>
              <Button asChild className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                <Link to="/host">
                  Uruchom panel hosta
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Players Panel */}
          <Card className="bg-gradient-to-br from-gameshow-card to-gameshow-card/80 border-gameshow-secondary/20 hover:shadow-neon-secondary transition-all duration-300 cursor-pointer group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg group-hover:shadow-neon-primary transition-all">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gameshow-text">Panel Graczy</CardTitle>
                    <Badge variant="secondary" className="mt-1 bg-green-500/20 text-green-400">Uczestnicy</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4 text-gameshow-muted">
                Responsywny interfejs dla graczy z szybkim odpowiadaniem i użyciem kart.
              </CardDescription>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gameshow-muted">
                  <Gamepad2 className="h-4 w-4 mr-2 text-green-400" />
                  Szybkie odpowiadanie
                </div>
                <div className="flex items-center text-sm text-gameshow-muted">
                  <Trophy className="h-4 w-4 mr-2 text-yellow-400" />
                  Podgląd wyników na żywo
                </div>
                <div className="flex items-center text-sm text-gameshow-muted">
                  <Zap className="h-4 w-4 mr-2 text-purple-400" />
                  Aktywacja kart specjalnych
                </div>
              </div>
              <Button asChild variant="outline" className="w-full border-green-500 text-green-400 hover:bg-green-500 hover:text-white">
                <Link to="/players">
                  Dołącz jako gracz
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Overlay Panel */}
          <Card className="bg-gradient-to-br from-gameshow-card to-gameshow-card/80 border-gameshow-accent/20 hover:shadow-neon-primary transition-all duration-300 cursor-pointer group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg group-hover:shadow-neon-secondary transition-all">
                    <Monitor className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-gameshow-text">Nakładka OBS</CardTitle>
                    <Badge variant="secondary" className="mt-1 bg-purple-500/20 text-purple-400">Streaming</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4 text-gameshow-muted">
                Profesjonalna nakładka do streamingu z kamerami i animacjami.
              </CardDescription>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gameshow-muted">
                  <Camera className="h-4 w-4 mr-2 text-purple-400" />
                  Siatka kamer graczy
                </div>
                <div className="flex items-center text-sm text-gameshow-muted">
                  <Monitor className="h-4 w-4 mr-2 text-blue-400" />
                  Animowane pytania
                </div>
                <div className="flex items-center text-sm text-gameshow-muted">
                  <Trophy className="h-4 w-4 mr-2 text-yellow-400" />
                  Tabela wyników na żywo
                </div>
              </div>
              <Button asChild variant="outline" className="w-full border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white">
                <Link to="/overlay">
                  Otwórz nakładkę
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Game Features */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-8 text-gameshow-text">
            Funkcje systemu
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gameshow-card/50 rounded-lg border border-gameshow-primary/20">
              <div className="p-3 bg-gameshow-primary/20 rounded-full w-fit mx-auto mb-4">
                <Target className="h-8 w-8 text-gameshow-primary" />
              </div>
              <h4 className="font-semibold mb-2 text-gameshow-text">3 Rundy Gry</h4>
              <p className="text-sm text-gameshow-muted">Eliminacje, szybka odpowiedź i koło fortuny</p>
            </div>
            
            <div className="text-center p-6 bg-gameshow-card/50 rounded-lg border border-gameshow-secondary/20">
              <div className="p-3 bg-gameshow-secondary/20 rounded-full w-fit mx-auto mb-4">
                <Zap className="h-8 w-8 text-gameshow-secondary" />
              </div>
              <h4 className="font-semibold mb-2 text-gameshow-text">Karty Specjalne</h4>
              <p className="text-sm text-gameshow-muted">9 rodzajów kart z unikalnymi efektami</p>
            </div>
            
            <div className="text-center p-6 bg-gameshow-card/50 rounded-lg border border-gameshow-accent/20">
              <div className="p-3 bg-gameshow-accent/20 rounded-full w-fit mx-auto mb-4">
                <Camera className="h-8 w-8 text-gameshow-accent" />
              </div>
              <h4 className="font-semibold mb-2 text-gameshow-text">Kamery Graczy</h4>
              <p className="text-sm text-gameshow-muted">Automatyczne zarządzanie widokami</p>
            </div>
            
            <div className="text-center p-6 bg-gameshow-card/50 rounded-lg border border-yellow-500/20">
              <div className="p-3 bg-yellow-500/20 rounded-full w-fit mx-auto mb-4">
                <Trophy className="h-8 w-8 text-yellow-500" />
              </div>
              <h4 className="font-semibold mb-2 text-gameshow-text">System Punktów</h4>
              <p className="text-sm text-gameshow-muted">Zaawansowane liczenie wyników</p>
            </div>
          </div>
        </div>

        {/* Game Rules Summary */}
        <Card className="bg-gradient-to-r from-gameshow-card/80 to-gameshow-card/60 border-gameshow-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <BookOpen className="h-6 w-6 text-gameshow-accent" />
              <span className="bg-gradient-to-r from-gameshow-primary to-gameshow-secondary bg-clip-text text-transparent">
                Zasady gry
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">RUNDA 1</Badge>
                  <h4 className="font-semibold text-gameshow-text">Eliminacje</h4>
                </div>
                <p className="text-sm text-gameshow-muted leading-relaxed">
                  Gracze odpowiadają na pytania wiedzy ogólnej. Za błędną odpowiedź tracą życie. 
                  Gracz bez żyć zostaje wyeliminowany z gry.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">RUNDA 2</Badge>
                  <h4 className="font-semibold text-gameshow-text">Szybka odpowiedź</h4>
                </div>
                <p className="text-sm text-gameshow-muted leading-relaxed">
                  Gracze mają 5 sekund na odpowiedź. Pierwszy poprawny dostaje punkty. 
                  Błędna odpowiedź skutkuje utratą życia.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">RUNDA 3</Badge>
                  <h4 className="font-semibold text-gameshow-text">Koło fortuny</h4>
                </div>
                <p className="text-sm text-gameshow-muted leading-relaxed">
                  Koło losuje kategorię pytania. Poprawna odpowiedź = punkty. 
                  Gracz z największą liczbą punktów wygrywa całą grę.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-16 text-center border-t border-gameshow-accent/20 pt-8">
          <p className="text-gameshow-muted mb-4">
            Quiz Show Arena - Profesjonalny system teleturnieju dla streamerów
          </p>
          <div className="flex justify-center items-center gap-6 text-sm text-gameshow-muted">
            <span>v2.0.0</span>
            <span>•</span>
            <span>Obsługa WebSocket</span>
            <span>•</span>
            <span>Integracja OBS</span>
            <span>•</span>
            <span>System kart specjalnych</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
