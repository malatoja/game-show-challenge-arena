
import { GameState, Player } from '@/types/gameTypes';
import { toast } from 'sonner';
import { checkForReward, RewardCondition } from '@/lib/cardRewardsManager';

// Handle answering a question
export const handleAnswerQuestion = (
  state: GameState,
  playerId: string,
  isCorrect: boolean
): GameState => {
  const playerIndex = state.players.findIndex(p => p.id === playerId);
  
  if (playerIndex === -1) {
    console.error(`Player with ID ${playerId} not found`);
    return state;
  }
  
  // Clone the state and players array for immutability
  const newState = { ...state };
  const updatedPlayers = [...state.players];
  const player = { ...updatedPlayers[playerIndex] };
  
  // Handle correct answer
  if (isCorrect) {
    // Calculate points based on round type
    let pointsEarned = 100;
    switch (state.currentRound) {
      case 'knowledge':
        pointsEarned = 100;
        break;
      case 'speed':
        pointsEarned = 150;
        break;
      case 'wheel':
        pointsEarned = 200;
        break;
      default:
        pointsEarned = 100;
    }
    
    // Update player's points
    player.points += pointsEarned;
    
    // Increment consecutive correct answers
    player.consecutiveCorrect = (player.consecutiveCorrect || 0) + 1;
    
    // Check for reward for consecutive correct answers
    if (player.consecutiveCorrect >= 3) {
      const rewardResult = checkForReward(player, 'consecutiveCorrectAnswers');
      
      if (rewardResult.shouldReward && rewardResult.cardType) {
        // Award the player with a card
        player.cards.push({
          type: rewardResult.cardType,
          description: `Card earned for ${rewardResult.message || 'consecutive correct answers'}`,
          isUsed: false
        });
        
        toast.success(`${player.name} otrzymał kartę ${rewardResult.cardType} za serię poprawnych odpowiedzi!`);
        
        // Reset consecutive correct counter after rewarding
        player.consecutiveCorrect = 0;
      }
    }
    
    toast.success(`${player.name} odpowiedział poprawnie! +${pointsEarned} punktów`);
    
    // Check for reward for correct answer
    const rewardResult = checkForReward(player, 'correctAnswer');
    
    if (rewardResult.shouldReward) {
      if (rewardResult.cardType) {
        // Award the player with a card
        player.cards.push({
          type: rewardResult.cardType,
          description: `Card earned for ${rewardResult.message || 'correct answer'}`,
          isUsed: false
        });
        
        toast.success(`${player.name} otrzymał kartę ${rewardResult.cardType}!`);
      }
      
      if (rewardResult.points) {
        // Award bonus points
        player.points += rewardResult.points;
        toast.success(`${player.name} otrzymał ${rewardResult.points} dodatkowych punktów!`);
      }
    }
  } 
  // Handle incorrect answer
  else {
    // Reset consecutive correct answers
    player.consecutiveCorrect = 0;
    
    // Handle life loss based on round type
    let livesToLose = 0;
    
    switch (state.currentRound) {
      case 'knowledge':
        livesToLose = 1;
        break;
      case 'speed':
        livesToLose = 1;
        break;
      case 'wheel':
        livesToLose = 1;
        break;
      default:
        livesToLose = 1;
    }
    
    player.lives = Math.max(0, player.lives - livesToLose);
    
    if (player.lives <= 0) {
      player.eliminated = true;
      toast.error(`${player.name} został wyeliminowany!`);
      
      // Check for reward for elimination (for other players potentially)
      const eliminatingPlayer = state.players.find(p => p.isActive && p.id !== playerId);
      if (eliminatingPlayer) {
        const eliminationReward = checkForReward(eliminatingPlayer, 'elimination');
        
        if (eliminationReward.shouldReward && eliminationReward.cardType) {
          // Update the eliminating player
          const eliminatingPlayerIndex = updatedPlayers.findIndex(p => p.id === eliminatingPlayer.id);
          if (eliminatingPlayerIndex !== -1) {
            const updatedEliminatingPlayer = { ...updatedPlayers[eliminatingPlayerIndex] };
            updatedEliminatingPlayer.cards.push({
              type: eliminationReward.cardType,
              description: `Card earned for ${eliminationReward.message || 'eliminating a player'}`,
              isUsed: false
            });
            
            updatedPlayers[eliminatingPlayerIndex] = updatedEliminatingPlayer;
            toast.success(`${eliminatingPlayer.name} otrzymał kartę ${eliminationReward.cardType} za wyeliminowanie przeciwnika!`);
          }
        }
      }
    } else {
      toast.error(`${player.name} odpowiedział niepoprawnie! -${livesToLose} życie`);
    }
  }
  
  // Mark the current question as used if there is one
  if (newState.currentQuestion) {
    const updatedCurrentQuestion = { ...newState.currentQuestion, used: true };
    newState.currentQuestion = updatedCurrentQuestion;
    
    // Also update the question in the questions array
    const questionIndex = newState.questions.findIndex(q => q.id === updatedCurrentQuestion.id);
    if (questionIndex !== -1) {
      const updatedQuestions = [...newState.questions];
      updatedQuestions[questionIndex] = updatedCurrentQuestion;
      newState.questions = updatedQuestions;
      
      // Update remaining questions to exclude the used one
      newState.remainingQuestions = newState.questions.filter(q => !q.used);
    }
  }
  
  // Update the player in the array
  updatedPlayers[playerIndex] = player;
  newState.players = updatedPlayers;
  
  return newState;
};
