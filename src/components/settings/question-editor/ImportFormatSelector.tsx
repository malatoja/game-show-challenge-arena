
import React from 'react';
import { Button } from '@/components/ui/button';

interface ImportFormatSelectorProps {
  importFormat: "json" | "csv";
  setImportFormat: (format: "json" | "csv") => void;
}

export function ImportFormatSelector({ importFormat, setImportFormat }: ImportFormatSelectorProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-4 bg-gameshow-background/20 p-4 rounded-lg">
      <div>
        <label className="text-sm font-medium mb-2 block">Format importu</label>
        <div className="flex gap-2">
          <Button 
            type="button" 
            variant={importFormat === "json" ? "default" : "outline"}
            onClick={() => setImportFormat("json")}
            size="sm"
          >
            JSON
          </Button>
          <Button 
            type="button" 
            variant={importFormat === "csv" ? "default" : "outline"}
            onClick={() => setImportFormat("csv")}
            size="sm"
          >
            CSV
          </Button>
        </div>
      </div>
      
      <div className="flex-1">
        {importFormat === "csv" && (
          <div className="text-xs text-gameshow-muted">
            <p>Format CSV: pytanie,kategoria,odp1,odp2,odp3,odp4,indeksPoprawnej,trudność,runda</p>
            <p>Przykład: Co to jest React?,Programowanie,Framework,Library,Język,Platforma,1,10,speed</p>
          </div>
        )}
      </div>
    </div>
  );
}
