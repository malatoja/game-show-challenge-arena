
import React, { useState, useEffect } from 'react';
import { Question, RoundType } from '@/types/gameTypes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save } from 'lucide-react';
import { WHEEL_CATEGORIES } from '@/constants/gameConstants';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface QuestionEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingQuestion: Question | null;
  onSaveQuestion: (question: Question) => void;
}

export function QuestionEditorDialog({
  open,
  onOpenChange,
  editingQuestion,
  onSaveQuestion
}: QuestionEditorDialogProps) {
  // For editing question
  const [questionText, setQuestionText] = useState('');
  const [category, setCategory] = useState('');
  const [round, setRound] = useState<RoundType>('standard');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [answers, setAnswers] = useState<string[]>(['', '', '', '']);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);
  
  // Reset form when the dialog opens with a question
  useEffect(() => {
    if (open && editingQuestion) {
      setQuestionText(editingQuestion.text);
      setCategory(editingQuestion.category);
      setRound(editingQuestion.round || 'standard');
      setDifficulty(editingQuestion.difficulty || 'medium');
      setCorrectAnswerIndex(editingQuestion.correctAnswerIndex);
      
      // Extract answer texts
      const answerTexts = editingQuestion.answers.map(a => a.text);
      setAnswers(answerTexts.length === 4 ? answerTexts : [...answerTexts, ...Array(4 - answerTexts.length).fill('')]);
    } else if (open && !editingQuestion) {
      // Reset for new question
      setQuestionText('');
      setCategory(WHEEL_CATEGORIES[0]);
      setRound('standard');
      setDifficulty('medium');
      setCorrectAnswerIndex(0);
      setAnswers(['', '', '', '']);
    }
  }, [open, editingQuestion]);
  
  const handleSave = () => {
    if (!questionText || !category || answers.some(a => !a)) {
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
    
    onSaveQuestion(updatedQuestion);
    onOpenChange(false);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Anuluj
          </Button>
          <Button onClick={handleSave} className="bg-neon-green text-black">
            <Save className="h-4 w-4 mr-2" />
            {editingQuestion ? "Zapisz zmiany" : "Dodaj pytanie"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
