
import React, { useState, useEffect } from 'react';
import { QuestionEditor } from './QuestionEditor';
import { toast } from 'sonner';
import { Question, RoundType } from '@/types/gameTypes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Import refactored components
import { roundSettingsSchema, RoundSettingsFormValues } from './question-editor/RoundSettingsForm';
import { QuestionStats } from './question-editor/QuestionStats';
import { QuestionActions } from './question-editor/QuestionActions';
import { AllQuestionsTab } from './question-editor/tabs/AllQuestionsTab';
import { KnowledgeRoundTab } from './question-editor/tabs/KnowledgeRoundTab';
import { SpeedRoundTab } from './question-editor/tabs/SpeedRoundTab';
import { WheelRoundTab } from './question-editor/tabs/WheelRoundTab';
import { StandardQuestionsTab } from './question-editor/tabs/StandardQuestionsTab';

export function QuestionsTab() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [importFormat, setImportFormat] = useState<"json" | "csv">("json");

  // Define form for round settings
  const form = useForm<RoundSettingsFormValues>({
    resolver: zodResolver(roundSettingsSchema),
    defaultValues: {
      round1Difficulty: "10",
      round1Category: "",
      round3Category: "",
    },
  });

  // Load settings and questions from localStorage on component mount
  useEffect(() => {
    // Load questions
    const storedQuestions = localStorage.getItem('gameShowQuestions');
    if (storedQuestions) {
      try {
        setQuestions(JSON.parse(storedQuestions));
      } catch (error) {
        console.error('Error parsing questions from localStorage:', error);
      }
    }

    // Load round settings
    const storedRoundSettings = localStorage.getItem('gameShowRoundSettings');
    if (storedRoundSettings) {
      try {
        const settings = JSON.parse(storedRoundSettings);
        form.reset(settings);
      } catch (error) {
        console.error('Error parsing round settings from localStorage:', error);
      }
    }
  }, []);

  // Save round settings when they change
  const onSubmit = (values: RoundSettingsFormValues) => {
    try {
      localStorage.setItem('gameShowRoundSettings', JSON.stringify(values));
      toast.success('Ustawienia rund zostały zapisane');
    } catch (error) {
      console.error('Error saving round settings:', error);
      toast.error('Wystąpił błąd podczas zapisywania ustawień');
    }
  };

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

  // Calculate questions statistics by round
  const roundStats = {
    all: questions.length,
    knowledge: questions.filter(q => q.round === "knowledge").length,
    speed: questions.filter(q => q.round === "speed").length,
    wheel: questions.filter(q => q.round === "wheel").length,
    standard: questions.filter(q => q.round === "standard").length,
    used: questions.filter(q => q.used).length,
    favorite: questions.filter(q => q.favorite).length
  };

  // Check if there are questions for the current round
  const hasQuestionsForRound = activeTab !== "all" 
    ? questions.some(q => q.round === activeTab)
    : true;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gameshow-text">Zarządzanie Pytaniami</h2>
      
      <div className="space-y-6">
        <p className="text-gameshow-muted mb-4">
          Tutaj możesz dodawać, edytować, importować i eksportować pytania do teleturnieju.
        </p>

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full mb-6"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="all">Wszystkie</TabsTrigger>
            <TabsTrigger value="knowledge">Runda 1: Wiedza</TabsTrigger>
            <TabsTrigger value="speed">Runda 2: Szybka</TabsTrigger>
            <TabsTrigger value="wheel">Runda 3: Koło</TabsTrigger>
            <TabsTrigger value="standard">Standardowe</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <AllQuestionsTab />
          </TabsContent>
          
          <TabsContent value="knowledge">
            <KnowledgeRoundTab form={form} onSubmit={onSubmit} />
          </TabsContent>
          
          <TabsContent value="speed">
            <SpeedRoundTab 
              importFormat={importFormat}
              setImportFormat={setImportFormat}
            />
          </TabsContent>
          
          <TabsContent value="wheel">
            <WheelRoundTab form={form} onSubmit={onSubmit} />
          </TabsContent>
          
          <TabsContent value="standard">
            <StandardQuestionsTab />
          </TabsContent>
        </Tabs>

        <QuestionActions
          activeTab={activeTab}
          isImporting={isImporting}
          setIsImporting={setIsImporting}
          handleExportQuestions={handleExportQuestions}
          handleClearQuestions={handleClearQuestions}
          handleFileUpload={handleFileUpload}
          importFormat={importFormat}
          hasQuestions={questions.length > 0}
          hasQuestionsForRound={hasQuestionsForRound}
        />
        
        <QuestionStats stats={roundStats} />
        
        <QuestionEditor activeRoundFilter={activeTab as RoundType | 'all'} />
      </div>
    </div>
  );
}
