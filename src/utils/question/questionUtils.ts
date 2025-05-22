
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
export const filterQuestions = (questions: Question[], filters: {
  round?: string;
  category?: string;
  difficulty?: string;
  used?: boolean;
  favorite?: boolean;
  searchTerm?: string;
}): Question[] => {
  return questions.filter(question => {
    if (filters.round && filters.round !== 'all' && question.round !== filters.round) return false;
    if (filters.category && question.category !== filters.category) return false;
    if (filters.difficulty && question.difficulty !== filters.difficulty) return false;
    if (filters.used !== undefined && question.used !== filters.used) return false;
    if (filters.favorite !== undefined && question.favorite !== filters.favorite) return false;
    if (filters.searchTerm && !question.text.toLowerCase().includes(filters.searchTerm.toLowerCase())) return false;
    return true;
  });
};
