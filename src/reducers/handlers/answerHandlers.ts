
import { GameState, PlayerId } from '../../types/gameTypes';
import { toast } from 'sonner';
import { MAX_POINTS_PER_QUESTION } from '../../constants/gameConstants';

// Type for reward condition
type RewardCondition = 
  | 'correctAnswer'
  | 'fastAnswer'
  | 'streakAnswer'
  | 'hardQuestion'
  | 'lastLife'
  | 'consecutiveCorrect';

// Type for reward type
type RewardType = 'card' | 'points' | 'life' | 'none';

// Response from reward calculation function
type RewardResponse = {
  shouldReward: boolean;
  rewardType: RewardType;
  cardType?: import('../../types/gameTypes').CardType;
  message?: string;
  points?: number;
};

/**
 * Calculate if a player should be rewarded for their answer
 */
const calculateReward = (
  state: GameState, 
  playerId: PlayerId, 
  isCorrect: boolean
): RewardResponse => {
  const player = state.players.find(p => p.id === playerId);
  
  if (!player) {
    return { shouldReward: false, rewardType: 'none' };
  }
  
  // No rewards for incorrect answers
  if (!isCorrect) {
    return { shouldReward: false, rewardType: 'none' };
  }
  
  // Check for consecutive correct answers (streak)
  const consecutiveCorrect = player.consecutiveCorrect || 0;
  if (consecutiveCorrect >= 2) {
    // Reward card after 3 consecutive correct answers
    if (consecutiveCorrect === 2) {
      return {
        shouldReward: true,
        rewardType: 'card',
        cardType: 'turbo', // Example card type
        message: 'Karta za 3 poprawne odpowiedzi z rzędu!',
        points: 0
      };
    }
    
    // Extra points for consecutive correct answers
    return {
      shouldReward: true,
      rewardType: 'points',
      message: `Bonus za ${consecutiveCorrect + 1} poprawne odpowiedzi z rzędu!`,
      points: 50 * consecutiveCorrect
    };
  }
  
  // No reward for standard correct answer
  return { shouldReward: false, rewardType: 'none', points: 0 };
};

export const handleAnswerQuestion = (state: GameState, playerId: PlayerId, isCorrect: boolean): GameState => {
  const playerIndex = state.players.findIndex(p => p.id === playerId);
  
  if (playerIndex === -1 || !state.currentQuestion) {
    return state;
  }
  
  const player = state.players[playerIndex];
  const questionPoints = state.currentQuestion.points || MAX_POINTS_PER_QUESTION;
  
  // Make a copy of the player object and all players array to modify
  const updatedPlayer = { ...player };
  const updatedPlayers = [...state.players];
  
  // Update player's stats for correct answer
  if (isCorrect) {
    // Add points
    updatedPlayer.points += questionPoints;
    
    // Increment consecutive correct answers counter
    updatedPlayer.consecutiveCorrect = (updatedPlayer.consecutiveCorrect || 0) + 1;
    
    // Check if player should be rewarded
    const rewardResult = calculateReward(state, playerId, isCorrect);
    if (rewardResult.shouldReward) {
      // Apply reward
      if (rewardResult.rewardType === 'card' && rewardResult.cardType) {
        // Award card logic would be added here
        toast.success(rewardResult.message);
      } else if (rewardResult.rewardType === 'points' && rewardResult.points) {
        updatedPlayer.points += rewardResult.points;
        toast.success(`${rewardResult.message} +${rewardResult.points} punktów!`);
      }
    }
    
    toast.success('Poprawna odpowiedź!');
  } else {
    // Handle incorrect answer
    if (state.currentRound !== 'speed') {
      // Lose life in non-speed rounds
      updatedPlayer.lives -= 1;
      
      // Check if player is eliminated
      if (updatedPlayer.lives <= 0) {
        updatedPlayer.eliminated = true;
        toast.error(`${updatedPlayer.name} został wyeliminowany!`);
      }
    }
    
    // Reset consecutive correct answers counter
    updatedPlayer.consecutiveCorrect = 0;
    
    toast.error('Niepoprawna odpowiedź!');
  }
  
  // Update player in the array
  updatedPlayers[playerIndex] = updatedPlayer;
  
  // Mark question as used
  const remainingQuestions = state.remainingQuestions.filter(q => 
    q.id !== state.currentQuestion!.id
  );
  
  const updatedQuestions = state.questions.map(q => 
    q.id === state.currentQuestion!.id ? { ...q, used: true } : q
  );
  
  // Return updated state
  return {
    ...state,
    players: updatedPlayers,
    remainingQuestions,
    questions: updatedQuestions,
  };
};
