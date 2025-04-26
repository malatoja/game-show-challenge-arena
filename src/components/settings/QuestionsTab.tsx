
import React, { useState, useEffect } from 'react';
import { QuestionEditor } from './QuestionEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Upload, Download, FileInput, RefreshCw } from 'lucide-react';
import { Question } from '@/types/gameTypes';

export function QuestionsTab() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isImporting, setIsImporting] = useState(false);

  // Load questions from localStorage on component mount
  useEffect(() => {
    const storedQuestions = localStorage.getItem('gameShowQuestions');
    if (storedQuestions) {
      try {
        setQuestions(JSON.parse(storedQuestions));
      } catch (error) {
        console.error('Error parsing questions from localStorage:', error);
      }
    }
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedQuestions = JSON.parse(content) as Question[];
        
        if (Array.isArray(importedQuestions)) {
          // Save to localStorage
          localStorage.setItem('gameShowQuestions', JSON.stringify(importedQuestions));
          setQuestions(importedQuestions);
          toast.success(`Zaimportowano ${importedQuestions.length} pytań`);
        } else {
          toast.error('Nieprawidłowy format pliku JSON');
        }
      } catch (error) {
        console.error('Error importing questions:', error);
        toast.error('Wystąpił błąd podczas importowania pliku');
      }
    };
    
    reader.onerror = () => {
      toast.error('Wystąpił błąd podczas odczytu pliku');
    };
    
    reader.readAsText(file);
  };

  const handleExportQuestions = () => {
    const questionsJson = JSON.stringify(questions, null, 2);
    const blob = new Blob([questionsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'game_show_questions.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success('Pytania zostały wyeksportowane');
  };

  const handleClearQuestions = () => {
    if (confirm('Czy na pewno chcesz usunąć wszystkie pytania? Ta operacja jest nieodwracalna.')) {
      localStorage.removeItem('gameShowQuestions');
      setQuestions([]);
      toast.success('Wszystkie pytania zostały usunięte');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gameshow-text">Zarządzanie Pytaniami</h2>
      
      <div className="space-y-6">
        <p className="text-gameshow-muted mb-4">
          Tutaj możesz dodawać, edytować, importować i eksportować pytania do teleturnieju.
        </p>

        <div className="flex flex-wrap gap-4 mb-6">
          <Button 
            onClick={() => setIsImporting(true)}
            className="flex items-center gap-2 bg-gameshow-primary hover:bg-gameshow-secondary"
          >
            <Upload size={16} />
            Importuj pytania
          </Button>
          
          <Button 
            onClick={handleExportQuestions}
            className="flex items-center gap-2 bg-neon-blue hover:opacity-80"
            disabled={questions.length === 0}
          >
            <Download size={16} />
            Eksportuj pytania
          </Button>
          
          <Button 
            onClick={handleClearQuestions}
            variant="destructive"
            className="flex items-center gap-2"
            disabled={questions.length === 0}
          >
            <RefreshCw size={16} />
            Wyczyść wszystkie
          </Button>
          
          {/* Hidden file input for import */}
          {isImporting && (
            <Input
              id="import-questions"
              type="file"
              accept=".json"
              onChange={(e) => {
                handleFileUpload(e);
                setIsImporting(false);
                e.target.value = '';
              }}
              className="hidden"
            />
          )}
        </div>
        
        <div className="bg-gameshow-card rounded-lg p-4 shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gameshow-text">
            Statystyki pytań
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gameshow-background/50 p-3 rounded-md">
              <p className="text-sm text-gameshow-muted">Wszystkie pytania</p>
              <p className="text-2xl font-bold text-gameshow-text">{questions.length}</p>
            </div>
            
            <div className="bg-gameshow-background/50 p-3 rounded-md">
              <p className="text-sm text-gameshow-muted">Użyte pytania</p>
              <p className="text-2xl font-bold text-gameshow-text">
                {questions.filter(q => q.used).length}
              </p>
            </div>
            
            <div className="bg-gameshow-background/50 p-3 rounded-md">
              <p className="text-sm text-gameshow-muted">Ulubione</p>
              <p className="text-2xl font-bold text-gameshow-text">
                {questions.filter(q => q.favorite).length}
              </p>
            </div>
            
            <div className="bg-gameshow-background/50 p-3 rounded-md">
              <p className="text-sm text-gameshow-muted">Kategorie</p>
              <p className="text-2xl font-bold text-gameshow-text">
                {new Set(questions.map(q => q.category)).size}
              </p>
            </div>
          </div>
        </div>
        
        <QuestionEditor />
      </div>
    </div>
  );
}
