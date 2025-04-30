
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Question, RoundType } from '@/types/gameTypes';
import { QuestionActions } from './QuestionActions';

interface QuestionImportExportProps {
  activeTab: string;
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
  importFormat: "json" | "csv";
  setImportFormat: (format: "json" | "csv") => void;
}

export function QuestionImportExport({ 
  activeTab,
  questions,
  setQuestions,
  importFormat,
  setImportFormat
}: QuestionImportExportProps) {
  const [isImporting, setIsImporting] = useState(false);

  // Check if there are questions for the current round
  const hasQuestionsForRound = activeTab !== "all" 
    ? questions.some(q => q.round === activeTab)
    : true;

  // Check if there are any questions
  const hasQuestions = questions.length > 0;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        
        let importedQuestions: Question[];
        
        // Handle different import formats
        if (importFormat === "json") {
          importedQuestions = JSON.parse(content) as Question[];
        } else if (importFormat === "csv") {
          // Simple CSV parser for format: text,category,answer1,answer2,answer3,answer4,correctIndex,difficulty,round
          importedQuestions = content
            .split('\n')
            .filter(line => line.trim().length > 0)
            .map((line, idx) => {
              const [text, category, a1, a2, a3, a4, correctIdx, difficulty, round] = line.split(',').map(item => item.trim());
              const correctIndex = parseInt(correctIdx);
              
              return {
                id: `imported-${idx}-${Date.now()}`,
                text,
                category,
                answers: [
                  { text: a1, isCorrect: correctIndex === 0 },
                  { text: a2, isCorrect: correctIndex === 1 },
                  { text: a3, isCorrect: correctIndex === 2 },
                  { text: a4, isCorrect: correctIndex === 3 }
                ],
                correctAnswerIndex: correctIndex,
                round: round as RoundType || "standard",
                difficulty: (difficulty === "5" ? "easy" : difficulty === "10" ? "medium" : "hard"),
                used: false,
                favorite: false,
                points: parseInt(difficulty) || 10
              };
            });
        } else {
          throw new Error("Nieobsługiwany format pliku");
        }
        
        if (Array.isArray(importedQuestions)) {
          // Filter based on round if needed
          if (activeTab !== "all") {
            importedQuestions = importedQuestions.filter(q => q.round === activeTab);
          }
          
          // Save to localStorage
          localStorage.setItem('gameShowQuestions', JSON.stringify([...questions, ...importedQuestions]));
          setQuestions([...questions, ...importedQuestions]);
          toast.success(`Zaimportowano ${importedQuestions.length} pytań`);
        } else {
          toast.error('Nieprawidłowy format pliku');
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
    // Filter questions based on selected round tab
    const exportQuestions = activeTab !== "all" 
      ? questions.filter(q => q.round === activeTab)
      : questions;
      
    const questionsJson = JSON.stringify(exportQuestions, null, 2);
    const blob = new Blob([questionsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `game_show_questions_${activeTab !== "all" ? activeTab : "all"}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast.success(`Wyeksportowano ${exportQuestions.length} pytań`);
  };

  const handleClearQuestions = () => {
    if (confirm(`Czy na pewno chcesz usunąć ${activeTab === "all" ? "wszystkie pytania" : `pytania w rundzie ${activeTab}`}? Ta operacja jest nieodwracalna.`)) {
      if (activeTab === "all") {
        localStorage.removeItem('gameShowQuestions');
        setQuestions([]);
      } else {
        // Remove only questions for the selected round
        const filteredQuestions = questions.filter(q => q.round !== activeTab);
        localStorage.setItem('gameShowQuestions', JSON.stringify(filteredQuestions));
        setQuestions(filteredQuestions);
      }
      toast.success(`Pytania ${activeTab === "all" ? "" : `dla rundy ${activeTab} `}zostały usunięte`);
    }
  };

  return (
    <QuestionActions
      activeTab={activeTab}
      isImporting={isImporting}
      setIsImporting={setIsImporting}
      handleExportQuestions={handleExportQuestions}
      handleClearQuestions={handleClearQuestions}
      handleFileUpload={handleFileUpload}
      importFormat={importFormat}
      hasQuestions={hasQuestions}
      hasQuestionsForRound={hasQuestionsForRound}
    />
  );
}
