
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
  | { type: 'REMOVE_PLAYER'; playerId: PlayerId }
  | { type: 'SPIN_WHEEL'; spinning: boolean }
  | { type: 'SET_CATEGORY'; category: string }
  | { type: 'USE_CARD'; playerId: PlayerId; cardType: CardType }
  | { type: 'AWARD_CARD'; playerId: PlayerId; cardType: CardType }
  | { type: 'RESTART_GAME' };

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

// Reducer
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        roundStarted: false,
        roundEnded: false,
        currentRound: 'knowledge',
        remainingQuestions: [...state.questions],
      };
    
    case 'START_ROUND':
      return {
        ...state,
        currentRound: action.roundType,
        roundStarted: true,
        roundEnded: false,
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
    
    case 'SET_CURRENT_QUESTION':
      return {
        ...state,
        currentQuestion: action.question,
        remainingQuestions: state.remainingQuestions.filter(q => q.id !== action.question.id)
      };
    
    case 'ANSWER_QUESTION': {
      const activePlayer = state.players.find(p => p.id === action.playerId);
      if (!activePlayer) return state;
      
      let pointsToAdd = action.isCorrect ? 10 : 0;
      let newLives = activePlayer.lives;
      
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
      
      return {
        ...state,
        players: state.players.map(player => {
          if (player.id === action.playerId) {
            return {
              ...player,
              points: player.points + pointsToAdd,
              lives: newLives,
              eliminated: newLives <= 0,
              cards: player.cards.map(card => {
                if ((card.type === 'turbo' || card.type === 'reanimacja') && !card.isUsed) {
                  return { ...card, isUsed: true };
                }
                return card;
              })
            };
          }
          return player;
        })
      };
    }
    
    case 'ADD_PLAYER':
      return {
        ...state,
        players: [...state.players, action.player]
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
    
    case 'RESTART_GAME':
      return {
        ...initialState,
        players: state.players.map(player => ({
          ...player,
          points: 0,
          lives: INITIAL_LIVES,
          cards: [],
          eliminated: false,
          isActive: false
        })),
        questions: [...SAMPLE_QUESTIONS],
        remainingQuestions: [...SAMPLE_QUESTIONS]
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
  const [state, dispatch] = useReducer(gameReducer, initialState);
  
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
