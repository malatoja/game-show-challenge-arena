
import React from 'react';
import { Question } from '@/types/gameTypes';
import { Button } from '@/components/ui/button';
import { Star, StarOff, Edit, Trash } from 'lucide-react';

interface QuestionItemProps {
  question: Question;
  onEdit: (question: Question) => void;
  onDelete: (questionId: string) => void;
  onToggleFavorite: (question: Question) => void;
}

export function QuestionItem({
  question,
  onEdit,
  onDelete,
  onToggleFavorite
}: QuestionItemProps) {
  return (
    <div 
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
            onClick={() => onToggleFavorite(question)}
            className={question.favorite ? 'text-yellow-400' : 'text-gray-400'}
          >
            {question.favorite ? <Star className="h-4 w-4" /> : <StarOff className="h-4 w-4" />}
          </Button>
          
          <Button 
            size="icon"
            variant="ghost"
            onClick={() => onEdit(question)}
            className="text-blue-400"
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button 
            size="icon"
            variant="ghost"
            onClick={() => onDelete(question.id)}
            className="text-red-400"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
