
import { Question } from '../../types/gameTypes';

/**
 * Load questions from localStorage or return an empty array if none exist
 */
export const loadQuestions = (): Question[] => {
  const savedQuestions = localStorage.getItem('gameQuestions');
  if (savedQuestions) {
    try {
      return JSON.parse(savedQuestions);
    } catch (error) {
      console.error('Error parsing questions from localStorage:', error);
      return [];
    }
  }
  return [];
};

/**
 * Save questions to localStorage
 */
export const saveQuestions = (questions: Question[]): void => {
  try {
    localStorage.setItem('gameQuestions', JSON.stringify(questions));
  } catch (error) {
    console.error('Error saving questions to localStorage:', error);
  }
};

/**
 * Get all unique categories from questions
 */
export const getUniqueCategories = (questions: Question[]): string[] => {
  const categories = new Set<string>();
  questions.forEach(question => {
    if (question.category) {
      categories.add(question.category);
    }
  });
  return Array.from(categories);
};

/**
 * Filter questions by various criteria
 */
export const filterQuestions = (questions: Question[], filters: {
  round?: string;
  category?: string;
  difficulty?: string;
  used?: boolean;
  favorite?: boolean;
}): Question[] => {
  return questions.filter(question => {
    if (filters.round && filters.round !== 'all' && question.round !== filters.round) return false;
    if (filters.category && question.category !== filters.category) return false;
    if (filters.difficulty && question.difficulty !== filters.difficulty) return false;
    if (filters.used !== undefined && question.used !== filters.used) return false;
    if (filters.favorite !== undefined && question.favorite !== filters.favorite) return false;
    return true;
  });
};
