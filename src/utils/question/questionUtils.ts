
import { Question } from '../../types/gameTypes';

/**
 * Generate a unique ID for a new question
 */
export const generateQuestionId = (): string => {
  return `q-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

/**
 * Sort questions alphabetically by text
 */
export const sortQuestionsAlphabetically = (questions: Question[]): Question[] => {
  return [...questions].sort((a, b) => a.text.localeCompare(b.text));
};

/**
 * Load questions from localStorage or return an empty array if none exist
 */
export const loadQuestions = (): Question[] => {
  try {
    const storedQuestions = localStorage.getItem('gameShowQuestions');
    return storedQuestions ? JSON.parse(storedQuestions) : [];
  } catch (error) {
    console.error('Error loading questions from localStorage:', error);
    return [];
  }
};

/**
 * Save questions to localStorage
 */
export const saveQuestions = (questions: Question[]): void => {
  try {
    localStorage.setItem('gameShowQuestions', JSON.stringify(questions));
  } catch (error) {
    console.error('Error saving questions to localStorage:', error);
  }
};

/**
 * Filter questions based on various criteria
 */
export const filterQuestions = (questions: Question[], filters: {
  round?: string;
  category?: string;
  difficulty?: string;
  used?: boolean;
  favorite?: boolean;
  searchTerm?: string;
  showUsed?: boolean;
  showFavorites?: boolean;
}): Question[] => {
  return questions.filter(question => {
    if (filters.round && filters.round !== 'all' && question.round !== filters.round) return false;
    if (filters.category && filters.category !== 'all' && question.category !== filters.category) return false;
    if (filters.difficulty && question.difficulty !== filters.difficulty) return false;
    
    // Handle used questions filtering
    if (filters.showUsed === false && question.used) return false;
    if (filters.used !== undefined && question.used !== filters.used) return false;
    
    // Handle favorite questions filtering
    if (filters.showFavorites === true && !question.favorite) return false;
    if (filters.favorite !== undefined && question.favorite !== filters.favorite) return false;
    
    // Search term filtering
    if (filters.searchTerm && !question.text.toLowerCase().includes(filters.searchTerm.toLowerCase())) return false;
    
    return true;
  });
};
