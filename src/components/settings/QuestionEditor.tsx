import React, { useState, useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import { Question, RoundType } from '@/types/gameTypes';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { QuestionFilters } from './question-editor/QuestionFilters';
import { QuestionList } from './question-editor/QuestionList';
import { QuestionEditorDialog } from './question-editor/QuestionEditorDialog';
import { filterQuestions } from '@/utils/question/questionUtils';

interface QuestionEditorProps {
  activeRoundFilter?: RoundType | 'all';
}

export function QuestionEditor({ activeRoundFilter = 'all' }: QuestionEditorProps) {
  const { state, dispatch } = useGame();
  const [filteredRound, setFilteredRound] = useState<RoundType | 'all'>(activeRoundFilter);
  const [filteredCategory, setFilteredCategory] = useState<string | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUsed, setShowUsed] = useState(true);
  const [showFavorites, setShowFavorites] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Update filtered round when activeRoundFilter changes
  React.useEffect(() => {
    setFilteredRound(activeRoundFilter);
  }, [activeRoundFilter]);
  
  // Apply filtering using the utility function
  const filteredQuestions = filterQuestions(state.questions, {
    searchTerm,
    round: filteredRound,
    category: filteredCategory === 'all' ? '' : filteredCategory,
    showUsed: showUsed,
    showFavorites: showFavorites
  });
  
  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setIsDialogOpen(true);
  };
  
  const handleAddNewQuestion = () => {
    // Set default round from active filter if it's not 'all'
    const defaultRound = filteredRound !== 'all' ? filteredRound : 'standard';
    
    setEditingQuestion(null);
    setIsDialogOpen(true);
  };
  
  const handleSaveQuestion = (updatedQuestion: Question) => {
    if (editingQuestion) {
      dispatch({ type: 'UPDATE_QUESTION', question: updatedQuestion });
      toast.success("Pytanie zaktualizowane!");
    } else {
      dispatch({ type: 'ADD_QUESTION', question: updatedQuestion });
      toast.success("Dodano nowe pytanie!");
    }
  };
  
  const handleDeleteQuestion = (questionId: string) => {
    if (confirm('Czy na pewno chcesz usunąć to pytanie?')) {
      dispatch({ type: 'REMOVE_QUESTION', questionId });
      toast.info("Pytanie usunięte");
    }
  };
  
  const handleToggleFavorite = (question: Question) => {
    dispatch({ 
      type: 'UPDATE_QUESTION', 
      question: { 
        ...question, 
        favorite: !question.favorite 
      } 
    });
    
    toast.info(question.favorite 
      ? "Usunięto z ulubionych" 
      : "Dodano do ulubionych"
    );
  };
  
  const handleClearFilters = () => {
    setFilteredRound(activeRoundFilter);
    setFilteredCategory('all');
    setSearchTerm('');
    setShowUsed(true);
    setShowFavorites(false);
  };
  
  return (
    <div className="space-y-4">
      <QuestionFilters
        roundFilter={filteredRound}
        categoryFilter={filteredCategory}
        searchTerm={searchTerm}
        onRoundFilterChange={setFilteredRound}
        onCategoryFilterChange={setFilteredCategory}
        onSearchTermChange={setSearchTerm}
        showUsed={showUsed}
        setShowUsed={setShowUsed}
        showFavorites={showFavorites}
        setShowFavorites={setShowFavorites}
        onClearFilters={handleClearFilters}
      />
      
      <div className="flex justify-between mb-4">
        <Button 
          onClick={handleAddNewQuestion}
          className="bg-neon-green/20 hover:bg-neon-green/30 border border-neon-green text-neon-green"
        >
          <Plus className="h-4 w-4 mr-2" />
          Dodaj pytanie
        </Button>
      </div>
      
      <QuestionList
        questions={filteredQuestions}
        onEditQuestion={handleEditQuestion}
        onDeleteQuestion={handleDeleteQuestion}
        onToggleFavorite={handleToggleFavorite}
      />
      
      <QuestionEditorDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingQuestion={editingQuestion}
        onSaveQuestion={handleSaveQuestion}
      />
    </div>
  );
}

export default QuestionEditor;
