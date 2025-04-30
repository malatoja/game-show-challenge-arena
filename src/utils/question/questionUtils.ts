
import { Question, RoundType } from '@/types/gameTypes';

/**
 * Generates a unique ID for a question
 */
export const generateQuestionId = (): string => {
  return `q-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

/**
 * Filters questions based on various criteria
 */
export const filterQuestions = (
  questions: Question[],
  filters: {
    searchTerm?: string;
    round?: RoundType | 'all';
    category?: string;
    showUsed?: boolean;
    showFavorites?: boolean;
    difficulty?: 'easy' | 'medium' | 'hard' | '';
  }
): Question[] => {
  return questions.filter(question => {
    // Filter by search term
    if (filters.searchTerm && !question.text.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by round
    if (filters.round && filters.round !== 'all' && question.round !== filters.round) {
      return false;
    }
    
    // Filter by category
    if (filters.category && question.category !== filters.category) {
      return false;
    }
    
    // Filter by used status
    if (!filters.showUsed && question.used) {
      return false;
    }
    
    // Filter by favorites
    if (filters.showFavorites && !question.favorite) {
      return false;
    }
    
    // Filter by difficulty
    if (filters.difficulty && question.difficulty !== filters.difficulty) {
      return false;
    }
    
    return true;
  });
};

/**
 * Sorts questions alphabetically by text
 */
export const sortQuestionsAlphabetically = (questions: Question[]): Question[] => {
  return [...questions].sort((a, b) => a.text.localeCompare(b.text));
};

/**
 * Sorts questions by a specific criterion
 */
export const sortQuestions = (
  questions: Question[],
  sortBy: 'text' | 'category' | 'difficulty' | 'round',
  sortOrder: 'asc' | 'desc' = 'asc'
): Question[] => {
  return [...questions].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'text':
        comparison = a.text.localeCompare(b.text);
        break;
      case 'category':
        comparison = a.category.localeCompare(b.category);
        break;
      case 'difficulty':
        const difficultyValues = { easy: 1, medium: 2, hard: 3 };
        const aValue = a.difficulty ? difficultyValues[a.difficulty] || 2 : 2;
        const bValue = b.difficulty ? difficultyValues[b.difficulty] || 2 : 2;
        comparison = aValue - bValue;
        break;
      case 'round':
        const aRound = a.round || 'standard';
        const bRound = b.round || 'standard';
        comparison = aRound.localeCompare(bRound);
        break;
      default:
        comparison = a.text.localeCompare(b.text);
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });
};
