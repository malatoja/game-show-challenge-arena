
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Gamepad2 } from 'lucide-react';

const PlayersPage = () => {
  return (
    <div className="min-h-screen bg-gameshow-background p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gameshow-primary to-gameshow-secondary bg-clip-text text-transparent mb-4">
            Dołącz do gry
          </h1>
          <p className="text-gameshow-muted">Wprowadź swoje dane aby dołączyć do teleturnieju</p>
        </div>

        <Card className="bg-gameshow-card border-gameshow-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Gamepad2 className="h-6 w-6 text-gameshow-primary" />
              Rejestracja gracza
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nazwa gracza</label>
              <Input placeholder="Wprowadź swoją nazwę..." className="bg-gameshow-background border-gameshow-accent/30" />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Kod pokoju (opcjonalnie)</label>
              <Input placeholder="Kod pokoju..." className="bg-gameshow-background border-gameshow-accent/30" />
            </div>

            <Button className="w-full bg-gradient-to-r from-gameshow-primary to-gameshow-secondary">
              <Users className="mr-2 h-4 w-4" />
              Dołącz do gry
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlayersPage;
