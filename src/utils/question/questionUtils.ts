
import { Question } from '@/types/gameTypes';

// Function to generate a unique ID for questions
export const generateQuestionId = (): string => {
  return `question-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
};

// Function to filter questions based on search term, round, and category
export const filterQuestions = (
  questions: Question[],
  searchTerm: string,
  roundFilter: import('@/types/gameTypes').RoundType | 'all',
  categoryFilter: string | 'all'
): Question[] => {
  let filteredQuestions = [...questions];

  if (searchTerm) {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    filteredQuestions = filteredQuestions.filter(question =>
      question.text.toLowerCase().includes(lowerCaseSearchTerm) ||
      question.category.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }

  if (roundFilter !== 'all') {
    filteredQuestions = filteredQuestions.filter(question => question.round === roundFilter);
  }

  if (categoryFilter !== 'all') {
    filteredQuestions = filteredQuestions.filter(question => question.category === categoryFilter);
  }

  return filteredQuestions;
};

// Function to sort questions alphabetically by text
export const sortQuestionsAlphabetically = (questions: Question[]): Question[] => {
  return [...questions].sort((a, b) => a.text.localeCompare(b.text));
};
