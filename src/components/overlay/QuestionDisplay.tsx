
import React from 'react';

interface QuestionDisplayProps {
  question: string;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ question }) => {
  return (
    <div className="question-container">
      <div className="question-text">
        {question}
      </div>
      <style jsx>{`
        .question-container {
          width: 80%;
          max-width: 1000px;
          padding: 30px;
          background-color: rgba(0, 0, 0, 0.7);
          border: 2px solid #2E9CCA;
          border-radius: 10px;
          box-shadow: 0 0 15px #2E9CCA, 0 0 30px rgba(46, 156, 202, 0.5);
          animation: fade-in 0.5s;
        }
        
        .question-text {
          font-size: 28px;
          font-weight: bold;
          color: white;
          text-align: center;
          line-height: 1.4;
          text-shadow: 0 0 5px white, 0 0 10px rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
};
