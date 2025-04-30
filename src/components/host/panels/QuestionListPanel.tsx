
import React from 'react';
import { Question } from '@/types/gameTypes';
import QuestionList from '@/components/questions/QuestionList';

interface QuestionListPanelProps {
  questions: Question[];
  selectedCategory: string | null;
  onSelectQuestion: (question: Question) => void;
}

export function QuestionListPanel({ 
  questions, 
  selectedCategory, 
  onSelectQuestion 
}: QuestionListPanelProps) {
  return (
    <div className="bg-gameshow-card p-4 rounded-lg">
      <h2 className="text-xl font-semibold text-gameshow-text mb-3">
        Lista Pytań {selectedCategory && `- ${selectedCategory}`}
      </h2>
      <QuestionList 
        questions={questions}
        onSelectQuestion={onSelectQuestion}
        currentCategory={selectedCategory}
      />
    </div>
  );
}

export default QuestionListPanel;
