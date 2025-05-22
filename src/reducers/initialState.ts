
import { GameState } from '../types/gameTypes';
import { loadQuestions } from '../utils/question/questionUtils';

// Initial empty state
const initialGameState: GameState = {
  gameStarted: false,
  roundActive: false,
  currentRound: 'knowledge',
  players: [],
  questions: [],
  usedQuestions: [],
  remainingQuestions: [],
  currentQuestion: null,
  selectedCategory: '',
  wheelSpinning: false,
  activePlayerId: null
};

// Function to load the initial state with saved questions from localStorage
export const initialStateWithSavedQuestions = (): GameState => {
  const loadedQuestions = loadQuestions();
  
  return {
    ...initialGameState,
    questions: loadedQuestions,
    remainingQuestions: [...loadedQuestions]
  };
};

export default initialGameState;
