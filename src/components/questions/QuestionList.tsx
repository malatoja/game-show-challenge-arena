
import React from 'react';
import { Question } from '@/types/gameTypes';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface QuestionListProps {
  questions: Question[];
  onSelectQuestion?: (question: Question) => void;
  currentCategory?: string;
}

export function QuestionList({ questions, onSelectQuestion, currentCategory }: QuestionListProps) {
  // Filter questions by category if one is selected
  const filteredQuestions = currentCategory
    ? questions.filter(q => q.category === currentCategory)
    : questions;

  return (
    <div className="bg-gameshow-card rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gameshow-text mb-3">
        Pytania {currentCategory ? `(${currentCategory})` : ''}
      </h3>
      
      <ScrollArea className="h-[300px]">
        {filteredQuestions.length > 0 ? (
          <div className="space-y-2">
            {filteredQuestions.map((question) => (
              <div 
                key={question.id} 
                className="border border-gameshow-primary/30 rounded-md p-3 hover:bg-gameshow-background/30 transition-colors"
              >
                <p className="text-sm text-gameshow-text mb-2 line-clamp-2">{question.text}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gameshow-muted">{question.category}</span>
                  <Button 
                    size="sm" 
                    variant="secondary"
                    onClick={() => onSelectQuestion && onSelectQuestion(question)}
                  >
                    Wybierz
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-4 text-gameshow-muted">
            {currentCategory 
              ? `Brak pytań w kategorii ${currentCategory}` 
              : 'Brak dostępnych pytań'}
          </p>
        )}
      </ScrollArea>
    </div>
  );
}

export default QuestionList;
