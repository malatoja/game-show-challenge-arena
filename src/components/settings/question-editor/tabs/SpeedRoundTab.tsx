
import React from 'react';
import { ImportFormatSelector } from '../ImportFormatSelector';

interface SpeedRoundTabProps {
  importFormat: "json" | "csv";
  setImportFormat: (format: "json" | "csv") => void;
}

export function SpeedRoundTab({ importFormat, setImportFormat }: SpeedRoundTabProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3">Ustawienia Rundy 2: Szybka</h3>
      <p className="text-sm text-gameshow-muted mb-4">
        W tej rundzie możesz zaimportować specjalne zestawy pytań z plików CSV lub JSON.
      </p>
      
      <ImportFormatSelector 
        importFormat={importFormat} 
        setImportFormat={setImportFormat} 
      />
    </div>
  );
}
