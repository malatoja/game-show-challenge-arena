
import { GameState, Question } from '../../types/gameTypes';
import { toast } from 'sonner';
import { saveQuestions } from '../../utils/question/questionUtils';

// Set the current question
export const handleSetCurrentQuestion = (state: GameState, question: Question): GameState => {
  return {
    ...state,
    currentQuestion: question
  };
};

// Add a new question to the questions list
export const handleAddQuestion = (state: GameState, question: Question): GameState => {
  const newQuestions = [...state.questions, question];
  
  // Save to localStorage
  saveQuestions(newQuestions);
  
  return {
    ...state,
    questions: newQuestions,
    remainingQuestions: [...state.remainingQuestions, question]
  };
};

// Update an existing question
export const handleUpdateQuestion = (state: GameState, question: Question): GameState => {
  const updatedQuestions = state.questions.map(q => 
    q.id === question.id ? question : q
  );
  
  // Save to localStorage
  saveQuestions(updatedQuestions);
  
  // Also update in remaining questions if it exists there
  const updatedRemaining = state.remainingQuestions.map(q => 
    q.id === question.id ? question : q
  );
  
  return {
    ...state,
    questions: updatedQuestions,
    remainingQuestions: updatedRemaining,
    // If this is the current question, update it too
    currentQuestion: state.currentQuestion?.id === question.id ? question : state.currentQuestion
  };
};

// Remove a question
export const handleRemoveQuestion = (state: GameState, questionId: string): GameState => {
  const filteredQuestions = state.questions.filter(q => q.id !== questionId);
  
  // Save to localStorage
  saveQuestions(filteredQuestions);
  
  // Also remove from remaining questions
  const filteredRemaining = state.remainingQuestions.filter(q => q.id !== questionId);
  
  return {
    ...state,
    questions: filteredQuestions,
    remainingQuestions: filteredRemaining,
    // If this is the current question, clear it
    currentQuestion: state.currentQuestion?.id === questionId ? null : state.currentQuestion
  };
};

// Revert a used question back to available
export const handleRevertQuestion = (state: GameState, questionId: string): GameState => {
  // Find the question in used questions
  const questionToRevert = state.usedQuestions.find(q => q.id === questionId);
  if (!questionToRevert) return state;
  
  // Remove from used questions
  const updatedUsedQuestions = state.usedQuestions.filter(q => q.id !== questionId);
  
  // Add back to remaining questions
  const updatedRemainingQuestions = [...state.remainingQuestions, questionToRevert];
  
  toast.success(`Pytanie przywrócone do puli dostępnych pytań`);
  
  return {
    ...state,
    usedQuestions: updatedUsedQuestions,
    remainingQuestions: updatedRemainingQuestions
  };
};

// Mark a question as used
export const handleMarkQuestionUsed = (state: GameState, questionId: string): GameState => {
  // Find the question in remaining questions
  const questionToMark = state.remainingQuestions.find(q => q.id === questionId);
  if (!questionToMark) return state;
  
  // Remove from remaining questions
  const updatedRemainingQuestions = state.remainingQuestions.filter(q => q.id !== questionId);
  
  // Add to used questions
  const updatedUsedQuestions = [...state.usedQuestions, questionToMark];
  
  return {
    ...state,
    usedQuestions: updatedUsedQuestions,
    remainingQuestions: updatedRemainingQuestions,
    currentQuestion: null // Clear current question
  };
};

// Set selected category
export const handleSetCategory = (state: GameState, category: string): GameState => {
  return {
    ...state,
    selectedCategory: category
  };
};
