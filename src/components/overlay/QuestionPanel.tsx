
import React from 'react';

interface QuestionPanelProps {
  question: string;
  hint: string;
  showHint: boolean;
}

export const QuestionPanel: React.FC<QuestionPanelProps> = ({ 
  question, 
  hint, 
  showHint 
}) => {
  return (
    <div className="bg-black/80 p-6 rounded-lg shadow-lg text-center">
      <h2 className="text-3xl font-bold text-white mb-4">{question}</h2>
      
      {showHint && hint && (
        <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500 rounded">
          <p className="text-yellow-400 text-xl font-semibold">Wskazówka: {hint}</p>
        </div>
      )}
    </div>
  );
};

export default QuestionPanel;
