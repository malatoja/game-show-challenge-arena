
import { toast } from 'sonner';
import { Question } from '../types/gameTypes';

// Helper functions for the reducers
export const saveQuestionsToStorage = (questions: Question[]): void => {
  try {
    localStorage.setItem('gameShowQuestions', JSON.stringify(questions));
  } catch (error) {
    console.error('Error saving questions to localStorage:', error);
    toast.error('Failed to save questions to storage');
  }
};
