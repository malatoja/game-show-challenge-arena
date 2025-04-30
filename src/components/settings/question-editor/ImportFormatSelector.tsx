
import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface ImportFormatSelectorProps {
  importFormat: "json" | "csv";
  setImportFormat: (format: "json" | "csv") => void;
}

export function ImportFormatSelector({ importFormat, setImportFormat }: ImportFormatSelectorProps) {
  return (
    <div className="space-y-3">
      <Label>Format importu</Label>
      <RadioGroup
        defaultValue={importFormat}
        onValueChange={(value) => setImportFormat(value as "json" | "csv")}
        className="flex space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="json" id="json" />
          <Label htmlFor="json">JSON</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="csv" id="csv" />
          <Label htmlFor="csv">CSV</Label>
        </div>
      </RadioGroup>
      
      <div className="text-sm text-gameshow-muted">
        {importFormat === "json" ? (
          <p>Format JSON pozwala na import złożonych pytań z pełnymi metadanymi.</p>
        ) : (
          <p>Format CSV jest prosty do tworzenia w Excelu: pytanie,kategoria,odp1,odp2,odp3,odp4,poprawny_index,trudność,runda</p>
        )}
      </div>
    </div>
  );
}
