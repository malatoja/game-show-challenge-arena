
import { GameState, Question } from '../../types/gameTypes';
import { toast } from 'sonner';
import { saveQuestionsToStorage } from '../utils';

// Question management
export const handleSetCurrentQuestion = (state: GameState, question: Question): GameState => {
  try {
    // Automatically mark the question as used
    const updatedQuestions = state.questions.map(q => 
      q.id === question.id ? { ...q, used: true } : q
    );
    
    // Save the updated questions to localStorage
    saveQuestionsToStorage(updatedQuestions);
    
    // Remove the question from remaining questions
    return {
      ...state,
      currentQuestion: question,
      questions: updatedQuestions,
      remainingQuestions: state.remainingQuestions.filter(q => q.id !== question.id)
    };
  } catch (error) {
    console.error('Error setting current question:', error);
    toast.error('Failed to set current question');
    return state;
  }
};

export const handleAddQuestion = (state: GameState, question: Question): GameState => {
  try {
    const updatedQuestions = [...state.questions, question];
    saveQuestionsToStorage(updatedQuestions);
    
    return {
      ...state,
      questions: updatedQuestions,
      remainingQuestions: [...state.remainingQuestions, question],
    };
  } catch (error) {
    console.error('Error adding question:', error);
    toast.error('Failed to add question');
    return state;
  }
};

export const handleUpdateQuestion = (state: GameState, question: Question): GameState => {
  try {
    const updatedQuestions = state.questions.map(q => 
      q.id === question.id ? question : q
    );
    
    saveQuestionsToStorage(updatedQuestions);
    
    return {
      ...state,
      questions: updatedQuestions,
      remainingQuestions: state.remainingQuestions.map(q => 
        q.id === question.id ? question : q
      )
    };
  } catch (error) {
    console.error('Error updating question:', error);
    toast.error('Failed to update question');
    return state;
  }
};

export const handleRemoveQuestion = (state: GameState, questionId: string): GameState => {
  try {
    const updatedQuestions = state.questions.filter(q => q.id !== questionId);
    saveQuestionsToStorage(updatedQuestions);
    
    return {
      ...state,
      questions: updatedQuestions,
      remainingQuestions: state.remainingQuestions.filter(q => q.id !== questionId)
    };
  } catch (error) {
    console.error('Error removing question:', error);
    toast.error('Failed to remove question');
    return state;
  }
};

export const handleRevertQuestion = (state: GameState, questionId: string): GameState => {
  // Find the question from all questions
  const question = state.questions.find(q => q.id === questionId);
  if (!question) return state;

  // Add it back to remaining questions
  return {
    ...state,
    currentQuestion: undefined,
    remainingQuestions: [...state.remainingQuestions, question]
  };
};

export const handleMarkQuestionUsed = (state: GameState, questionId: string): GameState => {
  try {
    // Mark a question as used
    const updatedQuestions = state.questions.map(q => 
      q.id === questionId 
        ? { ...q, used: true } 
        : q
    );
    
    saveQuestionsToStorage(updatedQuestions);
    
    return {
      ...state,
      questions: updatedQuestions,
      remainingQuestions: state.remainingQuestions.filter(q => q.id !== questionId)
    };
  } catch (error) {
    console.error('Error marking question as used:', error);
    toast.error('Failed to mark question as used');
    return state;
  }
};
