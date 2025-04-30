
import { GameState, Player, Question, RoundType, PlayerId, CardType } from '../types/gameTypes';
import { INITIAL_LIVES, SAMPLE_QUESTIONS, createCard } from '../constants/gameConstants';
import { toast } from 'sonner';

// Actions
export type GameAction = 
  | { type: 'START_GAME' }
  | { type: 'START_ROUND'; roundType: RoundType }
  | { type: 'END_ROUND' }
  | { type: 'SET_ACTIVE_PLAYER'; playerId: PlayerId }
  | { type: 'SET_CURRENT_QUESTION'; question: Question }
  | { type: 'ANSWER_QUESTION'; playerId: PlayerId; isCorrect: boolean }
  | { type: 'ADD_PLAYER'; player: Player }
  | { type: 'UPDATE_PLAYER'; player: Player }
  | { type: 'REMOVE_PLAYER'; playerId: PlayerId }
  | { type: 'SPIN_WHEEL'; spinning: boolean }
  | { type: 'SET_CATEGORY'; category: string }
  | { type: 'USE_CARD'; playerId: PlayerId; cardType: CardType }
  | { type: 'AWARD_CARD'; playerId: PlayerId; cardType: CardType }
  | { type: 'ADD_QUESTION'; question: Question }
  | { type: 'UPDATE_QUESTION'; question: Question }
  | { type: 'REMOVE_QUESTION'; questionId: string }
  | { type: 'RESTART_GAME' }
  | { type: 'REVERT_QUESTION'; questionId: string }
  | { type: 'MARK_QUESTION_USED'; questionId: string };

// Helper functions for the reducer
const saveQuestionsToStorage = (questions: Question[]): void => {
  try {
    localStorage.setItem('gameShowQuestions', JSON.stringify(questions));
  } catch (error) {
    console.error('Error saving questions to localStorage:', error);
    toast.error('Failed to save questions to storage');
  }
};

// Game stage handlers
const handleGameStart = (state: GameState): GameState => {
  return {
    ...state,
    roundStarted: false,
    roundEnded: false,
    currentRound: 'knowledge',
    remainingQuestions: [...state.questions.filter(q => !q.used)],
  };
};

const handleRoundStart = (state: GameState, roundType: RoundType): GameState => {
  return {
    ...state,
    currentRound: roundType,
    roundStarted: true,
    roundEnded: false,
    
    // Reset lives if starting Round 3 (Wheel)
    players: roundType === 'wheel' ? 
      state.players.map(player => ({
        ...player,
        lives: INITIAL_LIVES,
      })) : state.players
  };
};

const handleRoundEnd = (state: GameState): GameState => {
  return {
    ...state,
    roundStarted: false,
    roundEnded: true,
  };
};

// Player management
const handleSetActivePlayer = (state: GameState, playerId: PlayerId): GameState => {
  return {
    ...state,
    players: state.players.map(player => ({
      ...player,
      isActive: player.id === playerId
    })),
    currentPlayerIndex: state.players.findIndex(p => p.id === playerId)
  };
};

const handleAddPlayer = (state: GameState, player: Player): GameState => {
  return {
    ...state,
    players: [...state.players, player]
  };
};

const handleUpdatePlayer = (state: GameState, updatedPlayer: Player): GameState => {
  return {
    ...state,
    players: state.players.map(player => 
      player.id === updatedPlayer.id ? updatedPlayer : player
    )
  };
};

const handleRemovePlayer = (state: GameState, playerId: PlayerId): GameState => {
  return {
    ...state,
    players: state.players.filter(player => player.id !== playerId)
  };
};

// Question management
const handleSetCurrentQuestion = (state: GameState, question: Question): GameState => {
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

const handleAddQuestion = (state: GameState, question: Question): GameState => {
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

const handleUpdateQuestion = (state: GameState, question: Question): GameState => {
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

const handleRemoveQuestion = (state: GameState, questionId: string): GameState => {
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

const handleRevertQuestion = (state: GameState, questionId: string): GameState => {
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

const handleMarkQuestionUsed = (state: GameState, questionId: string): GameState => {
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

// Card management
const handleUseCard = (state: GameState, playerId: PlayerId, cardType: CardType): GameState => {
  const playerIndex = state.players.findIndex(p => p.id === playerId);
  if (playerIndex === -1) return state;
  
  const cardIndex = state.players[playerIndex].cards.findIndex(
    card => card.type === cardType && !card.isUsed
  );
  
  if (cardIndex === -1) return state;
  
  try {
    // Create a deep copy of the players array
    const updatedPlayers = [...state.players];
    const updatedCards = [...updatedPlayers[playerIndex].cards];
    
    // Mark the card as used
    updatedCards[cardIndex] = {
      ...updatedCards[cardIndex],
      isUsed: true
    };
    
    // Update the player's cards
    updatedPlayers[playerIndex] = {
      ...updatedPlayers[playerIndex],
      cards: updatedCards
    };
    
    toast(`${updatedPlayers[playerIndex].name} użył karty ${updatedCards[cardIndex].name}!`);
    
    return {
      ...state,
      players: updatedPlayers
    };
  } catch (error) {
    console.error('Error using card:', error);
    toast.error('Failed to use card');
    return state;
  }
};

const handleAwardCard = (state: GameState, playerId: PlayerId, cardType: CardType): GameState => {
  const player = state.players.find(p => p.id === playerId);
  if (!player) return state;
  
  try {
    const newCard = createCard(cardType);
    
    toast.success(`${player.name} otrzymuje kartę ${newCard.name}!`);
    
    return {
      ...state,
      players: state.players.map(p => {
        if (p.id === playerId) {
          return {
            ...p,
            cards: [...p.cards, newCard]
          };
        }
        return p;
      })
    };
  } catch (error) {
    console.error('Error awarding card:', error);
    toast.error('Failed to award card');
    return state;
  }
};

// This function handles the answer question logic separately
const handleAnswerQuestion = (state: GameState, playerId: PlayerId, isCorrect: boolean): GameState => {
  const activePlayer = state.players.find(p => p.id === playerId);
  if (!activePlayer) return state;
  
  try {
    let pointsToAdd = isCorrect ? 10 : 0;
    let newLives = activePlayer.lives;
    let awardCard = false;
    let cardType: CardType = 'dejavu';
    
    // Check if player has used turbo card
    const turboCardUsed = activePlayer.cards.some(card => 
      card.type === 'turbo' && !card.isUsed);
    
    if (turboCardUsed && isCorrect) {
      pointsToAdd *= 2;
    }
    
    // Handle lives based on round
    if (state.currentRound === 'speed' && !isCorrect) {
      // Check if player has used reanimacja card
      const reanimationCardUsed = activePlayer.cards.some(card => 
        card.type === 'reanimacja' && !card.isUsed);
      
      if (!reanimationCardUsed) {
        newLives -= 1;
      }
    }
    
    // Track consecutive correct answers
    let consecutiveCorrect = activePlayer.consecutiveCorrect || 0;
    
    if (isCorrect) {
      consecutiveCorrect++;
      
      // Award card after 3 consecutive correct answers
      if (consecutiveCorrect >= 3) {
        awardCard = true;
        cardType = 'dejavu';
        consecutiveCorrect = 0; // Reset counter
      }
      
      // Award turbo card if player reaches 50+ points in Round 1
      if (state.currentRound === 'knowledge' && 
          activePlayer.points + pointsToAdd >= 50 && 
          !activePlayer.cards.some(c => c.type === 'turbo')) {
        awardCard = true;
        cardType = 'turbo';
      }
    } else {
      consecutiveCorrect = 0; // Reset on wrong answer
    }
    
    // Toast notification
    if (isCorrect) {
      toast.success(`${activePlayer.name} odpowiedział poprawnie! +${pointsToAdd} punktów`);
    } else {
      if (newLives < activePlayer.lives) {
        toast.error(`${activePlayer.name} odpowiedział błędnie! -1 życie`);
      } else {
        toast.error(`${activePlayer.name} odpowiedział błędnie!`);
      }
    }
    
    // Prepare updated player state
    let updatedPlayers = state.players.map(player => {
      if (player.id === playerId) {
        return {
          ...player,
          points: player.points + pointsToAdd,
          lives: newLives,
          eliminated: newLives <= 0,
          consecutiveCorrect: consecutiveCorrect,
          cards: player.cards.map(card => {
            if ((card.type === 'turbo' || card.type === 'reanimacja') && !card.isUsed) {
              return { ...card, isUsed: true };
            }
            return card;
          })
        };
      }
      return player;
    });
    
    // Award card if conditions met
    if (awardCard) {
      const playerToAwardIndex = updatedPlayers.findIndex(p => p.id === playerId);
      if (playerToAwardIndex !== -1) {
        const playerCards = updatedPlayers[playerToAwardIndex].cards;
        const unusedCards = playerCards.filter(c => !c.isUsed).length;
        
        // Only add if player doesn't have max cards (3)
        if (unusedCards < 3) {
          const newCard = createCard(cardType);
          updatedPlayers[playerToAwardIndex] = {
            ...updatedPlayers[playerToAwardIndex],
            cards: [...playerCards, newCard]
          };
          
          toast.success(`${activePlayer.name} otrzymuje kartę ${newCard.name}!`);
        }
      }
    }
    
    return {
      ...state,
      players: updatedPlayers
    };
  } catch (error) {
    console.error('Error handling question answer:', error);
    toast.error('Failed to process answer');
    return state;
  }
};

// Game restart logic
const handleRestartGame = (state: GameState): GameState => {
  return {
    ...initialStateWithSavedQuestions(),
    players: state.players.map(player => ({
      ...player,
      points: 0,
      lives: INITIAL_LIVES,
      cards: [],
      eliminated: false,
      isActive: false
    }))
  };
};

// Main reducer function
export function gameReducer(state: GameState, action: GameAction): GameState {
  try {
    switch (action.type) {
      case 'START_GAME':
        return handleGameStart(state);
      
      case 'START_ROUND':
        return handleRoundStart(state, action.roundType);
      
      case 'END_ROUND':
        return handleRoundEnd(state);
      
      case 'SET_ACTIVE_PLAYER':
        return handleSetActivePlayer(state, action.playerId);
      
      case 'SET_CURRENT_QUESTION':
        return handleSetCurrentQuestion(state, action.question);
      
      case 'ANSWER_QUESTION':
        return handleAnswerQuestion(state, action.playerId, action.isCorrect);
      
      case 'ADD_PLAYER':
        return handleAddPlayer(state, action.player);

      case 'UPDATE_PLAYER':
        return handleUpdatePlayer(state, action.player);
      
      case 'REMOVE_PLAYER':
        return handleRemovePlayer(state, action.playerId);
      
      case 'SPIN_WHEEL':
        return {
          ...state,
          wheelSpinning: action.spinning
        };
      
      case 'SET_CATEGORY':
        return {
          ...state,
          selectedCategory: action.category
        };
      
      case 'USE_CARD':
        return handleUseCard(state, action.playerId, action.cardType);
      
      case 'AWARD_CARD':
        return handleAwardCard(state, action.playerId, action.cardType);

      case 'ADD_QUESTION':
        return handleAddQuestion(state, action.question);
      
      case 'UPDATE_QUESTION':
        return handleUpdateQuestion(state, action.question);
      
      case 'REMOVE_QUESTION':
        return handleRemoveQuestion(state, action.questionId);
      
      case 'REVERT_QUESTION':
        return handleRevertQuestion(state, action.questionId);

      case 'MARK_QUESTION_USED':
        return handleMarkQuestionUsed(state, action.questionId);
      
      case 'RESTART_GAME':
        return handleRestartGame(state);
      
      default:
        return state;
    }
  } catch (error) {
    console.error('Unhandled error in game reducer:', error);
    toast.error(`An unexpected error occurred: ${(error as Error).message || 'Unknown error'}`);
    return state;
  }
}

// Load saved questions from localStorage if available
export const loadQuestionsFromStorage = (): Question[] => {
  try {
    const savedQuestions = localStorage.getItem('gameShowQuestions');
    if (savedQuestions) {
      const parsedQuestions = JSON.parse(savedQuestions) as Question[];
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
