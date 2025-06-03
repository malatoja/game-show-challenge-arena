
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Label } from '@/components/ui/label';

interface ImportFormatSelectorProps {
  importFormat: "json" | "csv";
  setImportFormat: (format: "json" | "csv") => void;
}

export function ImportFormatSelector({ importFormat, setImportFormat }: ImportFormatSelectorProps) {
  return (
    <div className="mb-4">
      <Label className="block mb-2">Format importu</Label>
      <ToggleGroup 
        type="single" 
        value={importFormat} 
        onValueChange={(value) => {
          if (value) setImportFormat(value as "json" | "csv");
        }}
      >
        <ToggleGroupItem value="json" className="text-sm">
          JSON
        </ToggleGroupItem>
        <ToggleGroupItem value="csv" className="text-sm">
          CSV
        </ToggleGroupItem>
      </ToggleGroup>
      
      <div className="mt-2 text-sm text-gameshow-muted">
        {importFormat === "json" ? (
          <div>
            <p>Format JSON: Array z obiektami pytań</p>
            <pre className="p-2 mt-1 bg-gameshow-background/50 rounded text-xs overflow-x-auto">
              {`[
  {
    "text": "Treść pytania",
    "category": "Kategoria",
    "answers": [{"text": "Odp1"}, {"text": "Odp2"}...],
    "correctAnswerIndex": 0,
    "round": "speed"
  }
]`}
            </pre>
          </div>
        ) : (
          <div>
            <p>Format CSV: jeden wiersz na pytanie</p>
            <pre className="p-2 mt-1 bg-gameshow-background/50 rounded text-xs overflow-x-auto">
              {"text,category,answer1,answer2,answer3,answer4,correctIndex,difficulty,round"}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
