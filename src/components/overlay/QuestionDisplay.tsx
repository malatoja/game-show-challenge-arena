
import React from 'react';

interface QuestionDisplayProps {
  question: string;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ question }) => {
  return (
    <div className="w-4/5 max-w-[1000px] p-7 bg-black/70 border-2 border-neon-blue rounded-lg animate-fade-in">
      <div className="text-2xl font-bold text-white text-center leading-relaxed text-shadow-neon">
        {question}
      </div>
    </div>
  );
};
