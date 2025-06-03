
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { QuestionEditor } from './QuestionEditor';
import { Question, RoundType } from '@/types/gameTypes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Import refactored components
import { roundSettingsSchema, RoundSettingsFormValues } from './question-editor/RoundSettingsForm';
import { QuestionStats } from './question-editor/QuestionStats';
import { CategoryManager } from './question-editor/CategoryManager';
import { RoundSettingsPanel } from './question-editor/tabs/RoundSettingsPanel';
import { QuestionImportExport } from './question-editor/QuestionImportExport';
import { getAllCategories } from '@/utils/gameUtils';

export function QuestionsTab() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [importFormat, setImportFormat] = useState<"json" | "csv">("json");
  const [categories, setCategories] = useState<string[]>([]);

  // Define form for round settings
  const form = useForm<RoundSettingsFormValues>({
    resolver: zodResolver(roundSettingsSchema),
    defaultValues: {
      round1Difficulty: "10",
      round1Category: "",
      round3Category: "",
    },
  });

  // Load settings, questions and categories from localStorage on component mount
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
    
    // Load categories
    setCategories(getAllCategories());
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

  // Handle categories update
  const handleCategoriesChange = (updatedCategories: string[]) => {
    setCategories(updatedCategories);
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

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gameshow-text">Zarządzanie Pytaniami</h2>
      
      <div className="space-y-6">
        <p className="text-gameshow-muted mb-4">
          Tutaj możesz dodawać, edytować, importować i eksportować pytania do teleturnieju.
        </p>
        
        {/* Category Manager */}
        <div className="bg-gameshow-background/30 p-4 rounded-md border border-gameshow-primary/20">
          <CategoryManager categories={categories} onCategoriesChange={handleCategoriesChange} />
        </div>

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
          
          <RoundSettingsPanel 
            activeTab={activeTab}
            form={form}
            onSubmit={onSubmit}
            importFormat={importFormat}
            setImportFormat={setImportFormat}
          />
        </Tabs>

        <QuestionImportExport 
          activeTab={activeTab}
          questions={questions}
          setQuestions={setQuestions}
          importFormat={importFormat}
          setImportFormat={setImportFormat}
        />
        
        <QuestionStats stats={roundStats} />
        
        <QuestionEditor activeRoundFilter={activeTab as RoundType | 'all'} />
      </div>
    </div>
  );
}

