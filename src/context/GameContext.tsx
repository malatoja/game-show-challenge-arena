import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GameState, Player, Question, RoundType, PlayerId, CardType } from '../types/gameTypes';
import { INITIAL_LIVES, SAMPLE_QUESTIONS, createCard } from '../constants/gameConstants';
import { toast } from 'sonner';

// Actions
type GameAction = 
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

// Initial state
const initialState: GameState = {
  currentRound: 'knowledge',
  players: [],
  currentPlayerIndex: 0,
  questions: SAMPLE_QUESTIONS,
  remainingQuestions: [...SAMPLE_QUESTIONS],
  roundStarted: false,
  roundEnded: false,
  wheelSpinning: false,
};

// Load saved questions from localStorage if available
const loadQuestionsFromStorage = (): Question[] => {
  try {
    const savedQuestions = localStorage.getItem('gameShowQuestions');
    if (savedQuestions) {
      const parsedQuestions = JSON.parse(savedQuestions) as Question[];
      return parsedQuestions;
    }
  } catch (error) {
    console.error('Error loading questions from localStorage:', error);
  }
  return SAMPLE_QUESTIONS;
};

// Initialize state with saved questions
const initialStateWithSavedQuestions = (): GameState => {
  const loadedQuestions = loadQuestionsFromStorage();
  return {
    ...initialState,
    questions: loadedQuestions,
    remainingQuestions: loadedQuestions.filter(q => !q.used),
  };
};

// Reducer
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        roundStarted: false,
        roundEnded: false,
        currentRound: 'knowledge',
        remainingQuestions: [...state.questions.filter(q => !q.used)],
      };
    
    case 'START_ROUND':
      return {
        ...state,
        currentRound: action.roundType,
        roundStarted: true,
        roundEnded: false,
        
        // Reset lives if starting Round 3 (Wheel)
        players: action.roundType === 'wheel' ? 
          state.players.map(player => ({
            ...player,
            lives: INITIAL_LIVES,
          })) : state.players
      };
    
    case 'END_ROUND':
      return {
        ...state,
        roundStarted: false,
        roundEnded: true,
      };
    
    case 'SET_ACTIVE_PLAYER':
      return {
        ...state,
        players: state.players.map(player => ({
          ...player,
          isActive: player.id === action.playerId
        })),
        currentPlayerIndex: state.players.findIndex(p => p.id === action.playerId)
      };
    
    case 'SET_CURRENT_QUESTION': {
      // Automatically mark the question as used
      const updatedQuestions = state.questions.map(q => 
        q.id === action.question.id ? { ...q, used: true } : q
      );
      
      // Save the updated questions to localStorage
      try {
        localStorage.setItem('gameShowQuestions', JSON.stringify(updatedQuestions));
      } catch (error) {
        console.error('Error saving questions to localStorage:', error);
      }
      
      // Remove the question from remaining questions
      return {
        ...state,
        currentQuestion: action.question,
        questions: updatedQuestions,
        remainingQuestions: state.remainingQuestions.filter(q => q.id !== action.question.id)
      };
    }
    
    case 'ANSWER_QUESTION': {
      const activePlayer = state.players.find(p => p.id === action.playerId);
      if (!activePlayer) return state;
      
      let pointsToAdd = action.isCorrect ? 10 : 0;
      let newLives = activePlayer.lives;
      let awardCard = false;
      let cardType: CardType = 'dejavu';
      
      // Check if player has used turbo card
      const turboCardUsed = activePlayer.cards.some(card => 
        card.type === 'turbo' && !card.isUsed);
      
      if (turboCardUsed && action.isCorrect) {
        pointsToAdd *= 2;
      }
      
      // Handle lives based on round
      if (state.currentRound === 'speed' && !action.isCorrect) {
        // Check if player has used reanimacja card
        const reanimationCardUsed = activePlayer.cards.some(card => 
          card.type === 'reanimacja' && !card.isUsed);
        
        if (!reanimationCardUsed) {
          newLives -= 1;
        }
      }
      
      // Track consecutive correct answers
      let consecutiveCorrect = activePlayer.consecutiveCorrect || 0;
      
      if (action.isCorrect) {
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
      if (action.isCorrect) {
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
        if (player.id === action.playerId) {
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
        const playerToAwardIndex = updatedPlayers.findIndex(p => p.id === action.playerId);
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
    }
    
    case 'ADD_PLAYER':
      return {
        ...state,
        players: [...state.players, action.player]
      };

    case 'UPDATE_PLAYER':
      return {
        ...state,
        players: state.players.map(player => 
          player.id === action.player.id ? action.player : player
        )
      };
    
    case 'REMOVE_PLAYER':
      return {
        ...state,
        players: state.players.filter(player => player.id !== action.playerId)
      };
    
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
    
    case 'USE_CARD': {
      const playerIndex = state.players.findIndex(p => p.id === action.playerId);
      if (playerIndex === -1) return state;
      
      const cardIndex = state.players[playerIndex].cards.findIndex(
        card => card.type === action.cardType && !card.isUsed
      );
      
      if (cardIndex === -1) return state;
      
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
    }
    
    case 'AWARD_CARD': {
      const player = state.players.find(p => p.id === action.playerId);
      if (!player) return state;
      
      const newCard = createCard(action.cardType);
      
      toast.success(`${player.name} otrzymuje kartę ${newCard.name}!`);
      
      return {
        ...state,
        players: state.players.map(p => {
          if (p.id === action.playerId) {
            return {
              ...p,
              cards: [...p.cards, newCard]
            };
          }
          return p;
        })
      };
    }

    case 'ADD_QUESTION': {
      const updatedQuestions = [...state.questions, action.question];
      
      // Save questions to localStorage
      try {
        localStorage.setItem('gameShowQuestions', JSON.stringify(updatedQuestions));
      } catch (error) {
        console.error('Error saving questions to localStorage:', error);
      }
      
      return {
        ...state,
        questions: updatedQuestions,
        remainingQuestions: [...state.remainingQuestions, action.question],
      };
    }
    
    case 'UPDATE_QUESTION': {
      const updatedQuestions = state.questions.map(question => 
        question.id === action.question.id ? action.question : question
      );
      
      // Save questions to localStorage
      try {
        localStorage.setItem('gameShowQuestions', JSON.stringify(updatedQuestions));
      } catch (error) {
        console.error('Error saving questions to localStorage:', error);
      }
      
      return {
        ...state,
        questions: updatedQuestions,
        remainingQuestions: state.remainingQuestions.map(question => 
          question.id === action.question.id ? action.question : question
        )
      };
    }
    
    case 'REMOVE_QUESTION': {
      const updatedQuestions = state.questions.filter(question => question.id !== action.questionId);
      
      // Save questions to localStorage
      try {
        localStorage.setItem('gameShowQuestions', JSON.stringify(updatedQuestions));
      } catch (error) {
        console.error('Error saving questions to localStorage:', error);
      }
      
      return {
        ...state,
        questions: updatedQuestions,
        remainingQuestions: state.remainingQuestions.filter(question => question.id !== action.questionId)
      };
    }
    
    case 'REVERT_QUESTION': {
      // Find the question from all questions
      const question = state.questions.find(q => q.id === action.questionId);
      if (!question) return state;

      // Add it back to remaining questions
      return {
        ...state,
        currentQuestion: undefined,
        remainingQuestions: [...state.remainingQuestions, question]
      };
    }

    case 'MARK_QUESTION_USED': {
      // Mark a question as used
      const updatedQuestions = state.questions.map(q => 
        q.id === action.questionId 
          ? { ...q, used: true } 
          : q
      );
      
      // Save questions to localStorage
      try {
        localStorage.setItem('gameShowQuestions', JSON.stringify(updatedQuestions));
      } catch (error) {
        console.error('Error saving questions to localStorage:', error);
      }
      
      return {
        ...state,
        questions: updatedQuestions,
        remainingQuestions: state.remainingQuestions.filter(q => q.id !== action.questionId)
      };
    }
    
    case 'RESTART_GAME':
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
    
    default:
      return state;
  }
}

// Context
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialStateWithSavedQuestions());
  
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

// Hook to use the context
export function useGame() {
  const context = useContext(GameContext);
  
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  
  return context;
}
