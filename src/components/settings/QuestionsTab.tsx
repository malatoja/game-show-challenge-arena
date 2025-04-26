
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGame } from '@/context/GameContext';
import { Question, RoundType } from '@/types/gameTypes';
import { toast } from 'sonner';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export const QuestionsTab = () => {
  const { state, dispatch } = useGame();
  const [activeRound, setActiveRound] = useState<RoundType>('standard');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [filter, setFilter] = useState({
    used: false,
    unused: true,
    favorite: false,
  });
  
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    category: '',
    round: 'standard',
    difficulty: 'medium',
    text: '',
    answers: ['', '', '', ''],
    correctAnswerIndex: 0,
  });

  // Get unique categories from questions
  const allCategories = Array.from(
    new Set(state.questions.map(q => q.category))
  );

  // Filter questions based on selected criteria
  const filteredQuestions = state.questions.filter(q => {
    // Filter by round
    if (activeRound !== 'all' && q.round !== activeRound) return false;
    
    // Filter by category
    if (activeCategory !== 'all' && q.category !== activeCategory) return false;
    
    // Filter by used/unused status
    if (filter.used && !q.used) return false;
    if (filter.unused && q.used) return false;
    
    // Filter by favorite status
    if (filter.favorite && !q.favorite) return false;
    
    return true;
  });

  const handleAddQuestion = () => {
    if (!newQuestion.text || !newQuestion.category) {
      toast.error('Treść pytania i kategoria są wymagane');
      return;
    }

    if (!newQuestion.answers || newQuestion.answers.some(a => !a)) {
      toast.error('Wszystkie odpowiedzi muszą być wypełnione');
      return;
    }

    const question: Question = {
      id: `question-${Date.now()}`,
      text: newQuestion.text || '',
      answers: newQuestion.answers || ['', '', '', ''],
      correctAnswerIndex: newQuestion.correctAnswerIndex || 0,
      category: newQuestion.category || 'Ogólne',
      difficulty: newQuestion.difficulty || 'medium',
      round: newQuestion.round || 'standard',
      points: 10,
      used: false,
      favorite: false,
    };

    dispatch({ type: 'ADD_QUESTION', question });
    toast.success('Dodano nowe pytanie');
    
    // Reset form
    setNewQuestion({
      category: '',
      round: 'standard',
      difficulty: 'medium',
      text: '',
      answers: ['', '', '', ''],
      correctAnswerIndex: 0,
    });
  };

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...(newQuestion.answers || ['', '', '', ''])];
    newAnswers[index] = value;
    setNewQuestion({
      ...newQuestion,
      answers: newAnswers
    });
  };

  const handleToggleFavorite = (questionId: string) => {
    const question = state.questions.find(q => q.id === questionId);
    if (!question) return;
    
    const updatedQuestion = {
      ...question,
      favorite: !question.favorite
    };
    
    dispatch({ type: 'UPDATE_QUESTION', question: updatedQuestion });
    toast.success(
      updatedQuestion.favorite 
        ? 'Pytanie dodane do ulubionych' 
        : 'Pytanie usunięte z ulubionych'
    );
  };

  const handleRemoveQuestion = (questionId: string) => {
    if (confirm('Czy na pewno chcesz usunąć to pytanie?')) {
      dispatch({ type: 'REMOVE_QUESTION', questionId });
      toast.success('Pytanie zostało usunięte');
    }
  };

  const handleBulkImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        if (file.name.endsWith('.json')) {
          const questions = JSON.parse(e.target?.result as string);
          if (Array.isArray(questions)) {
            questions.forEach(q => {
              const question: Question = {
                id: `question-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                text: q.text || q.question || '',
                answers: q.answers || ['', '', '', ''],
                correctAnswerIndex: q.correctAnswerIndex || 0,
                category: q.category || 'Importowane',
                difficulty: q.difficulty || 'medium',
                round: q.round || 'standard',
                points: q.points || 10,
                used: false,
                favorite: false,
              };
              dispatch({ type: 'ADD_QUESTION', question });
            });
            toast.success(`Zaimportowano ${questions.length} pytań z pliku JSON`);
          } else {
            toast.error('Nieprawidłowy format pliku JSON');
          }
        } else if (file.name.endsWith('.csv')) {
          // Simple CSV parsing - assumes first row is header
          const lines = (e.target?.result as string).split('\n');
          const headers = lines[0].split(',');
          
          const questionIndex = headers.findIndex(h => 
            h.toLowerCase().includes('question') || h.toLowerCase().includes('pytanie')
          );
          
          const correctAnswerIndex = headers.findIndex(h => 
            h.toLowerCase().includes('correct') || h.toLowerCase().includes('prawidłowa')
          );
          
          const categoryIndex = headers.findIndex(h => 
            h.toLowerCase().includes('category') || h.toLowerCase().includes('kategoria')
          );
          
          if (questionIndex === -1) {
            toast.error('Nie znaleziono kolumny z pytaniami w pliku CSV');
            return;
          }
          
          let importedCount = 0;
          
          for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            
            const values = lines[i].split(',');
            
            // Find answers - assume they are columns containing 'answer' or 'odpowiedz'
            const answers: string[] = [];
            let correctIndex = 0;
            
            headers.forEach((header, index) => {
              if (header.toLowerCase().includes('answer') || header.toLowerCase().includes('odpowiedz')) {
                answers.push(values[index] || '');
              }
            });
            
            // If no answer columns found, create default answers
            if (answers.length === 0) {
              answers.push('Tak', 'Nie', '', '');
            }
            
            // If we have a correct answer column, find which answer matches
            if (correctAnswerIndex !== -1) {
              const correctAnswer = values[correctAnswerIndex];
              correctIndex = answers.findIndex(a => a === correctAnswer) || 0;
            }
            
            const question: Question = {
              id: `question-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              text: values[questionIndex] || '',
              answers: answers.length >= 4 ? answers : [...answers, ...Array(4-answers.length).fill('')],
              correctAnswerIndex: correctIndex,
              category: categoryIndex !== -1 ? values[categoryIndex] : 'Importowane',
              difficulty: 'medium',
              round: 'standard',
              points: 10,
              used: false,
              favorite: false,
            };
            
            if (question.text) {
              dispatch({ type: 'ADD_QUESTION', question });
              importedCount++;
            }
          }
          
          toast.success(`Zaimportowano ${importedCount} pytań z pliku CSV`);
        } else {
          toast.error('Nieobsługiwany format pliku. Używaj .json lub .csv');
        }
      } catch (error) {
        console.error('Import error:', error);
        toast.error('Wystąpił błąd podczas importu pliku');
      }
    };

    if (file.name.endsWith('.json') || file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      toast.error('Nieobsługiwany format pliku. Używaj .json lub .csv');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Baza pytań</h2>
      <p className="text-gray-600 mb-6">
        Zarządzaj rundami, kategoriami i bazą pytań.
      </p>

      <Tabs defaultValue="browse">
        <TabsList className="mb-6">
          <TabsTrigger value="browse">Przeglądaj pytania</TabsTrigger>
          <TabsTrigger value="add">Dodaj pytanie</TabsTrigger>
          <TabsTrigger value="import">Import pytań</TabsTrigger>
        </TabsList>
        
        <TabsContent value="browse">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-3 items-center">
              <div>
                <span className="text-sm font-medium mr-2">Runda:</span>
                <select
                  className="bg-gameshow-background text-gameshow-text p-2 rounded"
                  value={activeRound}
                  onChange={(e) => setActiveRound(e.target.value as RoundType)}
                >
                  <option value="all">Wszystkie</option>
                  <option value="standard">Standardowa</option>
                  <option value="speed">Szybkie pytania</option>
                  <option value="wheel">Koło Chaosu</option>
                </select>
              </div>
              
              <div>
                <span className="text-sm font-medium mr-2">Kategoria:</span>
                <select
                  className="bg-gameshow-background text-gameshow-text p-2 rounded"
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                >
                  <option value="all">Wszystkie</option>
                  {allCategories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="ml-auto flex items-center gap-3">
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={filter.used}
                    onChange={() => setFilter({...filter, used: !filter.used})}
                  />
                  <span className="text-sm">Użyte</span>
                </label>
                
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={filter.unused}
                    onChange={() => setFilter({...filter, unused: !filter.unused})}
                  />
                  <span className="text-sm">Nieużyte</span>
                </label>
                
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={filter.favorite}
                    onChange={() => setFilter({...filter, favorite: !filter.favorite})}
                  />
                  <span className="text-sm">Ulubione</span>
                </label>
              </div>
            </div>
            
            <div className="space-y-3 max-h-[500px] overflow-y-auto p-2">
              {filteredQuestions.length === 0 ? (
                <p className="text-center p-4 bg-gameshow-background/30 rounded-lg text-gray-500">
                  Nie znaleziono pytań pasujących do wybranych kryteriów
                </p>
              ) : (
                filteredQuestions.map(question => (
                  <div 
                    key={question.id}
                    className={`p-4 rounded-lg ${
                      question.used 
                        ? 'bg-gameshow-background/20 text-gray-400' 
                        : 'bg-gameshow-background/40'
                    }`}
                  >
                    <div className="flex justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            question.difficulty === 'easy' 
                              ? 'bg-green-100 text-green-800' 
                              : question.difficulty === 'hard'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                          }`}>
                            {question.difficulty === 'easy' 
                              ? 'Łatwe' 
                              : question.difficulty === 'hard'
                                ? 'Trudne'
                                : 'Średnie'
                            }
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                            {question.category}
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                            {question.round === 'standard' 
                              ? 'Standardowa' 
                              : question.round === 'speed'
                                ? 'Szybka'
                                : 'Koło Chaosu'
                            }
                          </span>
                          {question.favorite && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
                              Ulubione
                            </span>
                          )}
                        </div>
                        <p className="font-medium">{question.text}</p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleFavorite(question.id)}
                        >
                          {question.favorite ? '★' : '☆'}
                        </Button>
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button size="sm" variant="ghost">
                              Podgląd
                            </Button>
                          </SheetTrigger>
                          <SheetContent>
                            <SheetHeader>
                              <SheetTitle>Podgląd pytania</SheetTitle>
                            </SheetHeader>
                            <div className="mt-6">
                              <h3 className="text-xl font-medium mb-4">{question.text}</h3>
                              <div className="space-y-2">
                                {question.answers.map((answer, idx) => (
                                  <div 
                                    key={idx}
                                    className={`p-3 rounded-lg ${
                                      idx === question.correctAnswerIndex
                                        ? 'bg-green-100 border-green-500 border'
                                        : 'bg-gray-100'
                                    }`}
                                  >
                                    {answer}
                                    {idx === question.correctAnswerIndex && (
                                      <span className="ml-2 text-green-600 text-xs">
                                        (Prawidłowa)
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                              <div className="mt-4">
                                <p><strong>Kategoria:</strong> {question.category}</p>
                                <p><strong>Trudność:</strong> {
                                  question.difficulty === 'easy' 
                                    ? 'Łatwe' 
                                    : question.difficulty === 'hard'
                                      ? 'Trudne'
                                      : 'Średnie'
                                }</p>
                                <p><strong>Punkty:</strong> {question.points}</p>
                                <p><strong>Status:</strong> {question.used ? 'Użyte' : 'Nieużyte'}</p>
                              </div>
                            </div>
                          </SheetContent>
                        </Sheet>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => handleRemoveQuestion(question.id)}
                        >
                          Usuń
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="add">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Treść pytania *</label>
                <textarea
                  className="w-full p-2 rounded bg-gameshow-background text-gameshow-text"
                  rows={3}
                  value={newQuestion.text}
                  onChange={(e) => setNewQuestion({...newQuestion, text: e.target.value})}
                  placeholder="Wprowadź treść pytania..."
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Kategoria *</label>
                  <Input
                    value={newQuestion.category}
                    onChange={(e) => setNewQuestion({...newQuestion, category: e.target.value})}
                    placeholder="np. Historia, Sport, Muzyka"
                    list="categories"
                  />
                  <datalist id="categories">
                    {allCategories.map(category => (
                      <option key={category} value={category} />
                    ))}
                  </datalist>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Runda</label>
                    <select
                      className="w-full p-2 rounded bg-gameshow-background text-gameshow-text"
                      value={newQuestion.round}
                      onChange={(e) => setNewQuestion({
                        ...newQuestion, 
                        round: e.target.value as RoundType
                      })}
                    >
                      <option value="standard">Standardowa</option>
                      <option value="speed">Szybkie pytania</option>
                      <option value="wheel">Koło Chaosu</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Trudność</label>
                    <select
                      className="w-full p-2 rounded bg-gameshow-background text-gameshow-text"
                      value={newQuestion.difficulty}
                      onChange={(e) => setNewQuestion({
                        ...newQuestion,
                        difficulty: e.target.value as 'easy' | 'medium' | 'hard'
                      })}
                    >
                      <option value="easy">Łatwe</option>
                      <option value="medium">Średnie</option>
                      <option value="hard">Trudne</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="block text-sm font-medium">Odpowiedzi (prawidłowa zaznaczona)</label>
              
              {(newQuestion.answers || ['', '', '', '']).map((answer, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={newQuestion.correctAnswerIndex === idx}
                    onChange={() => setNewQuestion({...newQuestion, correctAnswerIndex: idx})}
                  />
                  <Input
                    value={answer}
                    onChange={(e) => handleAnswerChange(idx, e.target.value)}
                    placeholder={`Odpowiedź ${idx + 1}`}
                    className={newQuestion.correctAnswerIndex === idx ? "border-green-500" : ""}
                  />
                </div>
              ))}
            </div>
            
            <div className="flex justify-end">
              <Button onClick={handleAddQuestion}>
                Dodaj pytanie
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="import">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Import pytań z pliku</h3>
              <p className="text-sm text-gray-600 mb-4">
                Możesz zaimportować pytania z plików JSON lub CSV. 
                Upewnij się, że plik ma odpowiedni format.
              </p>
              
              <div className="flex items-center space-x-4">
                <Input 
                  id="importFile"
                  type="file" 
                  accept=".json,.csv"
                  onChange={handleBulkImport}
                  className="max-w-xs"
                />
              </div>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-2">Przykładowy format JSON</h3>
              <pre className="bg-black/20 p-3 rounded text-xs overflow-x-auto">
{`[
  {
    "text": "Jaka jest stolica Polski?",
    "answers": ["Warszawa", "Kraków", "Poznań", "Wrocław"],
    "correctAnswerIndex": 0,
    "category": "Geografia",
    "difficulty": "easy",
    "round": "standard"
  },
  {
    "text": "Drugie pytanie...",
    "answers": ["Odp 1", "Odp 2", "Odp 3", "Odp 4"],
    "correctAnswerIndex": 2,
    "category": "Historia",
    "difficulty": "medium",
    "round": "speed"
  }
]`}
              </pre>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-2">Przykładowy format CSV</h3>
              <p className="text-sm text-gray-600 mb-2">
                Plik CSV powinien zawierać nagłówek oraz kolumny z pytaniem, odpowiedziami i poprawną odpowiedzią.
              </p>
              <pre className="bg-black/20 p-3 rounded text-xs overflow-x-auto">
{`question,answer1,answer2,answer3,answer4,correct,category
"Jaka jest stolica Polski?","Warszawa","Kraków","Poznań","Wrocław","Warszawa","Geografia"
"Drugie pytanie?","Odp 1","Odp 2","Odp 3","Odp 4","Odp 3","Historia"`}
              </pre>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
