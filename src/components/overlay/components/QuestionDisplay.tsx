
import React from 'react';
import { Question, RoundType } from '@/types/gameTypes';
import { motion, AnimatePresence } from 'framer-motion';

interface QuestionDisplayProps {
  question: Question | null;
  round: RoundType;
}

export function QuestionDisplay({ question, round }: QuestionDisplayProps) {
  if (!question) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gameshow-card/50 rounded-lg border border-gameshow-secondary">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gameshow-text mb-2">
            {round === 'knowledge' ? 'Runda Wiedzy' : 
             round === 'speed' ? 'Runda Szybka' : 
             'Koło Fortuny'}
          </h2>
          <p className="text-gameshow-muted">Oczekiwanie na pytanie...</p>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full h-full bg-gameshow-card rounded-lg border border-gameshow-secondary p-6 flex flex-col"
      >
        {/* Question header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-gameshow-primary/20 rounded-full text-gameshow-primary text-sm font-medium">
              {question.category}
            </span>
            <span className="px-3 py-1 bg-yellow-500/20 rounded-full text-yellow-400 text-sm font-medium">
              {question.points} pkt
            </span>
          </div>
          
          <div className="text-right">
            <span className="text-sm text-gameshow-muted">
              {round === 'knowledge' ? 'Runda 1' : 
               round === 'speed' ? 'Runda 2' : 
               'Runda 3'}
            </span>
          </div>
        </div>

        {/* Question text */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-full">
            <h1 className="text-3xl font-bold text-gameshow-text leading-tight mb-4">
              {question.text}
            </h1>
            
            {question.imageUrl && (
              <div className="mb-4">
                <img 
                  src={question.imageUrl} 
                  alt="Pytanie" 
                  className="max-w-full max-h-32 mx-auto rounded-lg"
                />
              </div>
            )}
          </div>
        </div>

        {/* Answer options (for questions with multiple choice) */}
        {question.answers && question.answers.length > 0 && (
          <div className="mt-4">
            <div className="grid grid-cols-2 gap-3">
              {question.answers.map((answer, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-gameshow-background/50 rounded-lg border border-gameshow-secondary"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-gameshow-primary/20 rounded-full flex items-center justify-center text-sm font-bold text-gameshow-primary">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-gameshow-text">{answer.text}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default QuestionDisplay;
