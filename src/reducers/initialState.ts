
import { GameState, RoundType } from '../types/gameTypes';
import { toast } from 'sonner';
import { SAMPLE_QUESTIONS } from '../constants/gameConstants';

// Load saved questions from localStorage if available
export const loadQuestionsFromStorage = (): import('../types/gameTypes').Question[] => {
  try {
    const savedQuestions = localStorage.getItem('gameShowQuestions');
    if (savedQuestions) {
      const parsedQuestions = JSON.parse(savedQuestions) as import('../types/gameTypes').Question[];
      return parsedQuestions;
    }
  } catch (error) {
    console.error('Error loading questions from localStorage:', error);
    toast.error('Failed to load saved questions');
  }
  return SAMPLE_QUESTIONS;
};

// Initial state
export const initialState: GameState = {
  currentRound: 'knowledge',
  players: [],
  currentPlayerIndex: 0,
  questions: SAMPLE_QUESTIONS,
  remainingQuestions: [...SAMPLE_QUESTIONS],
  roundStarted: false,
  roundEnded: false,
  wheelSpinning: false,
};

// Initialize state with saved questions
export const initialStateWithSavedQuestions = (): GameState => {
  const loadedQuestions = loadQuestionsFromStorage();
  return {
    ...initialState,
    questions: loadedQuestions,
    remainingQuestions: loadedQuestions.filter(q => !q.used),
  };
};
