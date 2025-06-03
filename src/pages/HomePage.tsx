
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Monitor, Gamepad2, Tv } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gameshow-background flex items-center justify-center p-4">
      <div className="container max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-neon-pulse">
            Discord Game Show
          </h1>
          <p className="text-xl text-gameshow-muted">
            Interaktywny teleturniej z kartami specjalnymi
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gameshow-card border-gameshow-primary/30 hover:border-gameshow-primary/60 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gameshow-text">
                <Monitor className="h-6 w-6 text-neon-blue" />
                Panel Hosta
              </CardTitle>
              <CardDescription className="text-gameshow-muted">
                Zarządzaj grą, graczy i zadawaj pytania
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/host">
                <Button className="w-full bg-neon-blue/20 hover:bg-neon-blue/30 border border-neon-blue text-neon-blue">
                  Otwórz Panel Hosta
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gameshow-card border-gameshow-primary/30 hover:border-gameshow-primary/60 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gameshow-text">
                <Gamepad2 className="h-6 w-6 text-neon-green" />
                Panel Gracza
              </CardTitle>
              <CardDescription className="text-gameshow-muted">
                Dołącz do gry jako uczestnik
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/player">
                <Button className="w-full bg-neon-green/20 hover:bg-neon-green/30 border border-neon-green text-neon-green">
                  Dołącz jako Gracz
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gameshow-card border-gameshow-primary/30 hover:border-gameshow-primary/60 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gameshow-text">
                <Tv className="h-6 w-6 text-neon-purple" />
                Nakładka OBS
              </CardTitle>
              <CardDescription className="text-gameshow-muted">
                Nakładka do streamingu dla OBS Studio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/overlay">
                <Button className="w-full bg-neon-purple/20 hover:bg-neon-purple/30 border border-neon-purple text-neon-purple">
                  Otwórz Nakładkę
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="bg-gameshow-card border-gameshow-primary/30 hover:border-gameshow-primary/60 transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gameshow-text">
                <Users className="h-6 w-6 text-neon-orange" />
                Informacje
              </CardTitle>
              <CardDescription className="text-gameshow-muted">
                Jak grać i zasady gry
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gameshow-muted">
                <p>• 3 rundy: Wiedza, Szybka Odpowiedź, Koło Fortuny</p>
                <p>• Karty specjalne z unikalnymi efektami</p>
                <p>• System punktów i eliminacji</p>
                <p>• Integracja z Discord i OBS</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
