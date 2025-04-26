
import React from 'react';
import { QuestionEditor } from './QuestionEditor';

export function QuestionsTab() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gameshow-text">Zarządzanie Pytaniami</h2>
      
      <div className="space-y-6">
        <p className="text-gameshow-muted mb-4">
          Tutaj możesz dodawać, edytować, importować i eksportować pytania do teleturnieju.
        </p>
        
        <QuestionEditor />
      </div>
    </div>
  );
}
