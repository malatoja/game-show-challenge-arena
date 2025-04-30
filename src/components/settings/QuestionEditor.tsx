
import React, { useState } from 'react';
import { useGame } from '@/context/GameContext';
import { Question, RoundType } from '@/types/gameTypes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { FileUp, FileDown, Plus, Save, Trash, Edit, Star, StarOff } from 'lucide-react';
import { WHEEL_CATEGORIES } from '@/constants/gameConstants';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface QuestionEditorProps {
  activeRoundFilter?: RoundType | 'all';
}

export function QuestionEditor({ activeRoundFilter = 'all' }: QuestionEditorProps) {
  const { state, dispatch } = useGame();
  const [filteredRound, setFilteredRound] = useState<RoundType | 'all'>(activeRoundFilter);
  const [filteredCategory, setFilteredCategory] = useState<string | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // For editing question
  const [questionText, setQuestionText] = useState('');
  const [category, setCategory] = useState('');
  const [round, setRound] = useState<RoundType>('standard');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [answers, setAnswers] = useState<string[]>(['', '', '', '']);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);
  
  // Update filtered round when activeRoundFilter changes
  React.useEffect(() => {
    setFilteredRound(activeRoundFilter);
  }, [activeRoundFilter]);
  
  const filteredQuestions = state.questions
    .filter(q => filteredRound === 'all' || q.round === filteredRound)
    .filter(q => filteredCategory === 'all' || q.category === filteredCategory)
    .filter(q => 
      searchTerm === '' || 
      q.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  
  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setQuestionText(question.text);
    setCategory(question.category);
    setRound(question.round || 'standard');
    setDifficulty(question.difficulty || 'medium');
    setCorrectAnswerIndex(question.correctAnswerIndex);
    
    // Extract answer texts
    const answerTexts = question.answers.map(a => a.text);
    setAnswers(answerTexts.length === 4 ? answerTexts : [...answerTexts, ...Array(4 - answerTexts.length).fill('')]);
    
    setIsDialogOpen(true);
  };
  
  const handleAddNewQuestion = () => {
    // Set default round from active filter if it's not 'all'
    const defaultRound = filteredRound !== 'all' ? filteredRound : 'standard';
    
    setEditingQuestion(null);
    setQuestionText('');
    setCategory(WHEEL_CATEGORIES[0]);
    setRound(defaultRound);
    setDifficulty('medium');
    setCorrectAnswerIndex(0);
    setAnswers(['', '', '', '']);
    setIsDialogOpen(true);
  };
  
  const handleSaveQuestion = () => {
    if (!questionText || !category || answers.some(a => !a)) {
      toast.error("Wszystkie pola muszą być wypełnione!");
      return;
    }
    
    const questionAnswers = answers.map((text, i) => ({
      text,
      isCorrect: i === correctAnswerIndex
    }));
    
    // Calculate points based on difficulty
    let points = 10;
    switch (difficulty) {
      case 'easy': points = 5; break;
      case 'medium': points = 10; break;
      case 'hard': points = 15; break;
    }
    
    // Allow for custom point values for special cases (like 20)
    if (round === 'knowledge') {
      // Check if we have settings for Round 1
      const roundSettings = localStorage.getItem('gameShowRoundSettings');
      if (roundSettings) {
        try {
          const settings = JSON.parse(roundSettings);
          if (settings.round1Difficulty) {
            points = parseInt(settings.round1Difficulty);
          }
        } catch (e) {
          console.error("Error parsing round settings", e);
        }
      }
    }
    
    const updatedQuestion: Question = {
      id: editingQuestion?.id || `q-${Date.now()}`,
      text: questionText,
      category,
      answers: questionAnswers,
      correctAnswerIndex,
      round,
      difficulty,
      used: editingQuestion?.used || false,
      favorite: editingQuestion?.favorite || false,
      points
    };
    
    if (editingQuestion) {
      dispatch({ type: 'UPDATE_QUESTION', question: updatedQuestion });
      toast.success("Pytanie zaktualizowane!");
    } else {
      dispatch({ type: 'ADD_QUESTION', question: updatedQuestion });
      toast.success("Dodano nowe pytanie!");
    }
    
    setIsDialogOpen(false);
  };
  
  const handleDeleteQuestion = (questionId: string) => {
    if (confirm('Czy na pewno chcesz usunąć to pytanie?')) {
      dispatch({ type: 'REMOVE_QUESTION', questionId });
      toast.info("Pytanie usunięte");
    }
  };
  
  const handleToggleFavorite = (question: Question) => {
    dispatch({ 
      type: 'UPDATE_QUESTION', 
      question: { 
        ...question, 
        favorite: !question.favorite 
      } 
    });
    
    toast.info(question.favorite 
      ? "Usunięto z ulubionych" 
      : "Dodano do ulubionych"
    );
  };
  
  // Load appropriate category list based on the round
  const getCategoriesForRound = (selectedRound: RoundType | 'all'): string[] => {
    // If we have settings for specific rounds, use them
    const roundSettings = localStorage.getItem('gameShowRoundSettings');
    if (roundSettings) {
      try {
        const settings = JSON.parse(roundSettings);
        if (selectedRound === 'knowledge' && settings.round1Category) {
          return [settings.round1Category, ...WHEEL_CATEGORIES.filter(cat => cat !== settings.round1Category)];
        } else if (selectedRound === 'wheel' && settings.round3Category) {
          return [settings.round3Category, ...WHEEL_CATEGORIES.filter(cat => cat !== settings.round3Category)];
        }
      } catch (e) {
        console.error("Error parsing round settings", e);
      }
    }
    return WHEEL_CATEGORIES;
  };

  // Get difficulty options based on the selected round
  const getDifficultyOptions = (selectedRound: RoundType) => {
    const standardOptions = [
      { label: "Łatwe (5 pkt)", value: "easy" },
      { label: "Średnie (10 pkt)", value: "medium" },
      { label: "Trudne (15 pkt)", value: "hard" }
    ];
    
    // For round 1, check if we have a custom difficulty setting
    if (selectedRound === 'knowledge') {
      const roundSettings = localStorage.getItem('gameShowRoundSettings');
      if (roundSettings) {
        try {
          const settings = JSON.parse(roundSettings);
          if (settings.round1Difficulty) {
            const points = parseInt(settings.round1Difficulty);
            const difficultyLevel = points <= 5 ? "easy" : points <= 10 ? "medium" : "hard";
            const difficultyLabel = `Runda 1: ${points} pkt`;
            
            // Add the custom difficulty at the top
            return [
              { label: difficultyLabel, value: difficultyLevel },
              ...standardOptions
            ];
          }
        } catch (e) {
          console.error("Error parsing round settings", e);
        }
      }
    }
    
    return standardOptions;
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Szukaj pytań..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gameshow-card border-gameshow-primary/30"
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select
            value={filteredRound}
            onValueChange={(value) => setFilteredRound(value as RoundType | 'all')}
          >
            <SelectTrigger className="w-[180px] bg-gameshow-card border-gameshow-primary/30">
              <SelectValue placeholder="Filtruj rundy" />
            </SelectTrigger>
            <SelectContent className="bg-gameshow-card border-gameshow-primary/30">
              <SelectItem value="all">Wszystkie rundy</SelectItem>
              <SelectItem value="knowledge">Runda 1: Wiedza</SelectItem>
              <SelectItem value="speed">Runda 2: Szybka</SelectItem>
              <SelectItem value="wheel">Runda 3: Koło fortuny</SelectItem>
              <SelectItem value="standard">Standardowa</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={filteredCategory}
            onValueChange={(value) => setFilteredCategory(value)}
          >
            <SelectTrigger className="w-[180px] bg-gameshow-card border-gameshow-primary/30">
              <SelectValue placeholder="Filtruj kategorie" />
            </SelectTrigger>
            <SelectContent className="bg-gameshow-card border-gameshow-primary/30">
              <SelectItem value="all">Wszystkie kategorie</SelectItem>
              {WHEEL_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-between mb-4">
        <Button 
          onClick={handleAddNewQuestion}
          className="bg-neon-green/20 hover:bg-neon-green/30 border border-neon-green text-neon-green"
        >
          <Plus className="h-4 w-4 mr-2" />
          Dodaj pytanie
        </Button>
      </div>
      
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((question) => (
            <div 
              key={question.id}
              className={`bg-gameshow-background/60 border ${
                question.used ? 'border-gray-600/30' : 'border-gameshow-primary/30'
              } rounded-lg p-3 ${
                question.used ? 'opacity-70' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      question.difficulty === 'easy' ? 'bg-green-600/30 text-green-400' :
                      question.difficulty === 'medium' ? 'bg-yellow-600/30 text-yellow-400' :
                      'bg-red-600/30 text-red-400'
                    }`}>
                      {question.difficulty === 'easy' ? 'Łatwe' : 
                       question.difficulty === 'medium' ? 'Średnie' : 'Trudne'} ({question.points} pkt)
                    </div>
                    
                    <div className="text-xs px-2 py-1 rounded-full bg-purple-600/30 text-purple-400">
                      {question.category}
                    </div>
                    
                    <div className="text-xs px-2 py-1 rounded-full bg-blue-600/30 text-blue-400">
                      {question.round === 'knowledge' ? 'Runda 1' : 
                       question.round === 'speed' ? 'Runda 2' : 
                       question.round === 'wheel' ? 'Runda 3' : 'Standard'}
                    </div>
                    
                    {question.used && (
                      <div className="text-xs px-2 py-1 rounded-full bg-gray-600/30 text-gray-400">
                        Użyte
                      </div>
                    )}
                  </div>
                  
                  <h4 className="text-sm font-medium mt-2">{question.text}</h4>
                  
                  <div className="grid grid-cols-2 gap-1 mt-2">
                    {question.answers.map((answer, index) => (
                      <div 
                        key={index}
                        className={`text-xs p-1 rounded ${
                          index === question.correctAnswerIndex 
                            ? 'bg-green-600/20 text-green-400' 
                            : 'bg-gameshow-card/50'
                        }`}
                      >
                        {answer.text}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Button 
                    size="icon"
                    variant="ghost"
                    onClick={() => handleToggleFavorite(question)}
                    className={question.favorite ? 'text-yellow-400' : 'text-gray-400'}
                  >
                    {question.favorite ? <Star className="h-4 w-4" /> : <StarOff className="h-4 w-4" />}
                  </Button>
                  
                  <Button 
                    size="icon"
                    variant="ghost"
                    onClick={() => handleEditQuestion(question)}
                    className="text-blue-400"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDeleteQuestion(question.id)}
                    className="text-red-400"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gameshow-muted">
            Nie znaleziono pytań spełniających kryteria
          </div>
        )}
      </div>
      
      {/* Question Editor Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gameshow-card max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {editingQuestion ? "Edytuj pytanie" : "Dodaj nowe pytanie"}
            </DialogTitle>
            <DialogDescription>
              Wypełnij wszystkie pola, aby {editingQuestion ? "zaktualizować" : "dodać"} pytanie
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Treść pytania</label>
              <Textarea 
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder="Wpisz treść pytania..."
                className="bg-gameshow-background border-gameshow-primary/30"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Kategoria</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-gameshow-background border-gameshow-primary/30">
                    <SelectValue placeholder="Wybierz kategorię" />
                  </SelectTrigger>
                  <SelectContent className="bg-gameshow-background border-gameshow-primary/30">
                    {getCategoriesForRound(round).map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Runda</label>
                <Select 
                  value={round} 
                  onValueChange={(value: string) => {
                    const newRound = value as RoundType;
                    setRound(newRound);
                    
                    // Update category to match round settings if available
                    const categories = getCategoriesForRound(newRound);
                    if (categories.length > 0) {
                      setCategory(categories[0]);
                    }
                  }}
                >
                  <SelectTrigger className="bg-gameshow-background border-gameshow-primary/30">
                    <SelectValue placeholder="Wybierz rundę" />
                  </SelectTrigger>
                  <SelectContent className="bg-gameshow-background border-gameshow-primary/30">
                    <SelectItem value="knowledge">Runda 1: Wiedza</SelectItem>
                    <SelectItem value="speed">Runda 2: Szybka</SelectItem>
                    <SelectItem value="wheel">Runda 3: Koło fortuny</SelectItem>
                    <SelectItem value="standard">Standardowa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Trudność</label>
                <Select 
                  value={difficulty} 
                  onValueChange={(value) => setDifficulty(value as 'easy' | 'medium' | 'hard')}
                >
                  <SelectTrigger className="bg-gameshow-background border-gameshow-primary/30">
                    <SelectValue placeholder="Wybierz trudność" />
                  </SelectTrigger>
                  <SelectContent className="bg-gameshow-background border-gameshow-primary/30">
                    {getDifficultyOptions(round).map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Odpowiedzi</label>
              <div className="space-y-2">
                {answers.map((answer, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={answer}
                      onChange={(e) => {
                        const newAnswers = [...answers];
                        newAnswers[index] = e.target.value;
                        setAnswers(newAnswers);
                      }}
                      placeholder={`Odpowiedź ${index + 1}`}
                      className="bg-gameshow-background border-gameshow-primary/30"
                    />
                    <Button
                      type="button"
                      variant={correctAnswerIndex === index ? "default" : "outline"}
                      className={correctAnswerIndex === index ? "bg-green-600" : ""}
                      onClick={() => setCorrectAnswerIndex(index)}
                    >
                      Poprawna
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Anuluj
            </Button>
            <Button onClick={handleSaveQuestion} className="bg-neon-green text-black">
              <Save className="h-4 w-4 mr-2" />
              {editingQuestion ? "Zapisz zmiany" : "Dodaj pytanie"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default QuestionEditor;
