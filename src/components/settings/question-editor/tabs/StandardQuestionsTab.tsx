
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export function StandardQuestionsTab() {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3">Standardowe pytania</h3>
      <p className="text-sm text-gameshow-muted mb-4">
        Pytania standardowe mogą być używane w dowolnej rundzie. Te pytania 
        nie mają specjalnych zasad czy ograniczeń, związanych z konkretnymi rundami.
      </p>
      
      <Alert className="bg-gameshow-primary/10 border-gameshow-primary/30">
        <AlertCircle className="h-4 w-4 text-gameshow-primary" />
        <AlertTitle>Wskazówka</AlertTitle>
        <AlertDescription className="text-sm">
          Możesz dodać nowe pytanie używając przycisku "Dodaj pytanie" poniżej, lub zaimportować pytania
          z pliku CSV/JSON.
        </AlertDescription>
      </Alert>
    </div>
  );
}
