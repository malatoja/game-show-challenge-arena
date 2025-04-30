
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Download, RefreshCw, Upload } from 'lucide-react';

interface QuestionActionsProps {
  activeTab: string;
  isImporting: boolean;
  setIsImporting: (importing: boolean) => void;
  handleExportQuestions: () => void;
  handleClearQuestions: () => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  importFormat: "json" | "csv";
  hasQuestions: boolean;
  hasQuestionsForRound: boolean;
}

export function QuestionActions({ 
  activeTab,
  isImporting,
  setIsImporting,
  handleExportQuestions,
  handleClearQuestions,
  handleFileUpload,
  importFormat,
  hasQuestions,
  hasQuestionsForRound
}: QuestionActionsProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <Button 
        onClick={() => setIsImporting(true)}
        className="flex items-center gap-2 bg-gameshow-primary hover:bg-gameshow-secondary"
      >
        <Upload size={16} />
        Importuj pytania {activeTab !== "all" ? `(${activeTab})` : ""}
      </Button>
      
      <Button 
        onClick={handleExportQuestions}
        className="flex items-center gap-2 bg-neon-blue hover:opacity-80"
        disabled={!hasQuestions || (activeTab !== "all" && !hasQuestionsForRound)}
      >
        <Download size={16} />
        Eksportuj {activeTab !== "all" ? `(${activeTab})` : ""}
      </Button>
      
      <Button 
        onClick={handleClearQuestions}
        variant="destructive"
        className="flex items-center gap-2"
        disabled={!hasQuestions || (activeTab !== "all" && !hasQuestionsForRound)}
      >
        <RefreshCw size={16} />
        {activeTab === "all" ? "Wyczyść wszystkie" : `Wyczyść (${activeTab})`}
      </Button>
      
      {/* Hidden file input for import */}
      {isImporting && (
        <Input
          id="import-questions"
          type="file"
          accept={importFormat === "json" ? ".json" : ".csv"}
          onChange={(e) => {
            handleFileUpload(e);
            setIsImporting(false);
            e.target.value = '';
          }}
          className="hidden"
        />
      )}
    </div>
  );
}
