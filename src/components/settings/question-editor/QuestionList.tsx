
import React from 'react';
import { Question } from '@/types/gameTypes';
import { QuestionItem } from './QuestionItem';

interface QuestionListProps {
  questions: Question[];
  onEditQuestion: (question: Question) => void;
  onDeleteQuestion: (questionId: string) => void;
  onToggleFavorite: (question: Question) => void;
}

export function QuestionList({
  questions,
  onEditQuestion,
  onDeleteQuestion,
  onToggleFavorite
}: QuestionListProps) {
  return (
    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
      {questions.length > 0 ? (
        questions.map((question) => (
          <QuestionItem
            key={question.id}
            question={question}
            onEdit={onEditQuestion}
            onDelete={onDeleteQuestion}
            onToggleFavorite={onToggleFavorite}
          />
        ))
      ) : (
        <div className="text-center py-8 text-gameshow-muted">
          Nie znaleziono pytań spełniających kryteria
        </div>
      )}
    </div>
  );
}
