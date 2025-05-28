
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gameshow-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-gameshow-card border-gameshow-accent/20 text-center">
        <CardHeader>
          <div className="mx-auto mb-4 p-3 bg-red-500/20 rounded-full w-fit">
            <AlertTriangle className="h-12 w-12 text-red-400" />
          </div>
          <CardTitle className="text-3xl font-bold">404</CardTitle>
          <p className="text-gameshow-muted">Strona nie została znaleziona</p>
        </CardHeader>
        <CardContent>
          <p className="text-gameshow-muted mb-6">
            Przepraszamy, ale strona której szukasz nie istnieje lub została przeniesiona.
          </p>
          <Button asChild className="w-full">
            <Link to="/" className="flex items-center gap-2 justify-center">
              <Home size={16} />
              Wróć do strony głównej
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
