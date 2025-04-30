
import React, { useState, useEffect } from 'react';
import { QuestionEditor } from './QuestionEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Upload, Download, FileInput, RefreshCw, Filter } from 'lucide-react';
import { Question, RoundType } from '@/types/gameTypes';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WHEEL_CATEGORIES } from '@/constants/gameConstants';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define form schema for round settings
const roundSettingsSchema = z.object({
  round1Difficulty: z.enum(["5", "10", "15", "20"]).default("10"),
  round1Category: z.string().min(1, {
    message: "Wybierz kategorię dla rundy 1",
  }),
  round3Category: z.string().min(1, {
    message: "Wybierz kategorię dla rundy 3",
  }),
});

export function QuestionsTab() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [importFormat, setImportFormat] = useState<"json" | "csv">("json");

  // Define form for round settings
  const form = useForm<z.infer<typeof roundSettingsSchema>>({
    resolver: zodResolver(roundSettingsSchema),
    defaultValues: {
      round1Difficulty: "10",
      round1Category: WHEEL_CATEGORIES[0],
      round3Category: WHEEL_CATEGORIES[0],
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
  const onSubmit = (values: z.infer<typeof roundSettingsSchema>) => {
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
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Zarządzanie wszystkimi pytaniami</h3>
              <p className="text-sm text-gameshow-muted mb-4">
                Tu możesz dodawać, importować i eksportować wszystkie pytania niezależnie od rundy.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="knowledge">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Ustawienia Rundy 1: Wiedza</h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 bg-gameshow-background/20 p-4 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="round1Difficulty"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Trudność pytań (punkty)</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-gameshow-background border-gameshow-primary/30">
                                <SelectValue placeholder="Wybierz trudność" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-gameshow-background border-gameshow-primary/30">
                              <SelectItem value="5">Łatwe (5 pkt)</SelectItem>
                              <SelectItem value="10">Średnie (10 pkt)</SelectItem>
                              <SelectItem value="15">Trudne (15 pkt)</SelectItem>
                              <SelectItem value="20">Bardzo trudne (20 pkt)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Określa wartość punktową odpowiedzi na pytanie
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="round1Category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Kategoria pytań</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-gameshow-background border-gameshow-primary/30">
                                <SelectValue placeholder="Wybierz kategorię" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-gameshow-background border-gameshow-primary/30">
                              {WHEEL_CATEGORIES.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Kategoria tematyczna dla pytań w Rundzie 1
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button type="submit" className="bg-gameshow-primary">
                    Zapisz ustawienia
                  </Button>
                </form>
              </Form>
            </div>
          </TabsContent>
          
          <TabsContent value="speed">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Ustawienia Rundy 2: Szybka</h3>
              <p className="text-sm text-gameshow-muted mb-4">
                W tej rundzie możesz zaimportować specjalne zestawy pytań z plików CSV lub JSON.
              </p>
              
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
              
            </div>
          </TabsContent>
          
          <TabsContent value="wheel">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Ustawienia Rundy 3: Koło Fortuny</h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 bg-gameshow-background/20 p-4 rounded-lg">
                  <FormField
                    control={form.control}
                    name="round3Category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Domyślna kategoria dla koła</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-gameshow-background border-gameshow-primary/30">
                              <SelectValue placeholder="Wybierz kategorię" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-gameshow-background border-gameshow-primary/30">
                            {WHEEL_CATEGORIES.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Kategoria tematyczna dla pytań w Rundzie 3 (Koło Fortuny)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="bg-gameshow-primary">
                    Zapisz ustawienia
                  </Button>
                </form>
              </Form>
            </div>
          </TabsContent>
          
          <TabsContent value="standard">
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Pytania standardowe</h3>
              <p className="text-sm text-gameshow-muted mb-4">
                Pytania, które mogą być używane w dowolnej rundzie.
              </p>
            </div>
          </TabsContent>
        </Tabs>

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
            disabled={questions.length === 0 || (activeTab !== "all" && !questions.some(q => q.round === activeTab))}
          >
            <Download size={16} />
            Eksportuj {activeTab !== "all" ? `(${activeTab})` : ""}
          </Button>
          
          <Button 
            onClick={handleClearQuestions}
            variant="destructive"
            className="flex items-center gap-2"
            disabled={questions.length === 0 || (activeTab !== "all" && !questions.some(q => q.round === activeTab))}
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
        
        <div className="bg-gameshow-card rounded-lg p-4 shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-gameshow-text">
            Statystyki pytań
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gameshow-background/50 p-3 rounded-md">
              <p className="text-sm text-gameshow-muted">Wszystkie pytania</p>
              <p className="text-2xl font-bold text-gameshow-text">{roundStats.all}</p>
            </div>
            
            <div className="bg-gameshow-background/50 p-3 rounded-md">
              <p className="text-sm text-gameshow-muted">Runda 1: Wiedza</p>
              <p className="text-2xl font-bold text-gameshow-text">{roundStats.knowledge}</p>
            </div>
            
            <div className="bg-gameshow-background/50 p-3 rounded-md">
              <p className="text-sm text-gameshow-muted">Runda 2: Szybka</p>
              <p className="text-2xl font-bold text-gameshow-text">{roundStats.speed}</p>
            </div>
            
            <div className="bg-gameshow-background/50 p-3 rounded-md">
              <p className="text-sm text-gameshow-muted">Runda 3: Koło</p>
              <p className="text-2xl font-bold text-gameshow-text">{roundStats.wheel}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-gameshow-background/50 p-3 rounded-md">
              <p className="text-sm text-gameshow-muted">Standardowe</p>
              <p className="text-2xl font-bold text-gameshow-text">{roundStats.standard}</p>
            </div>
            
            <div className="bg-gameshow-background/50 p-3 rounded-md">
              <p className="text-sm text-gameshow-muted">Użyte pytania</p>
              <p className="text-2xl font-bold text-gameshow-text">{roundStats.used}</p>
            </div>
            
            <div className="bg-gameshow-background/50 p-3 rounded-md">
              <p className="text-sm text-gameshow-muted">Ulubione</p>
              <p className="text-2xl font-bold text-gameshow-text">{roundStats.favorite}</p>
            </div>
          </div>
        </div>
        
        <QuestionEditor activeRoundFilter={activeTab as RoundType | 'all'} />
      </div>
    </div>
  );
}

