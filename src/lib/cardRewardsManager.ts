
import { CardType, Player } from '@/types/gameTypes';

// Define the types for reward conditions and rewards
export type RewardCondition =
  | 'elimination'
  | 'correctAnswer'
  | 'cardUsage'
  | 'roundEnd'
  | 'consecutiveCorrectAnswers'
  | 'consecutiveCorrect'; // Added this to fix the error

export type RewardType =
  | 'cardAward'
  | 'pointsAward'
  | 'livesAward';

// Define the structure for a reward configuration
export interface RewardConfig {
  id: string; // Make sure id is defined
  name: string;
  description: string;
  condition: RewardCondition;
  reward: RewardType;
  cardType?: CardType;
  message?: string; // Add message field
}

// Sample reward configurations
export const rewardConfigs: RewardConfig[] = [
  {
    id: 'reward-1',
    name: 'Elimination Card Reward',
    description: 'Award a random card for eliminating a player.',
    condition: 'elimination',
    reward: 'cardAward',
    message: 'Card awarded for elimination'
  },
  {
    id: 'reward-2',
    name: 'Correct Answer Points',
    description: 'Award 100 points for each correct answer.',
    condition: 'correctAnswer',
    reward: 'pointsAward',
    message: 'Points awarded for correct answer'
  },
  {
    id: 'reward-3',
    name: 'Card Usage Points',
    description: 'Award 50 points for using a card.',
    condition: 'cardUsage',
    reward: 'pointsAward',
    message: 'Points awarded for using a card'
  },
  {
    id: 'reward-4',
    name: 'Round End Card',
    description: 'Award a random card at the end of each round.',
    condition: 'roundEnd',
    reward: 'cardAward',
    message: 'Card awarded for completing the round'
  },
  {
    id: 'reward-5',
    name: 'Consecutive Correct Answers Card',
    description: 'Award a special card for answering 3 questions correctly in a row.',
    condition: 'consecutiveCorrectAnswers',
    reward: 'cardAward',
    cardType: 'turbo', // Example: Award a 'turbo' card
    message: 'Card awarded for consecutive correct answers'
  }
];

// Function to check if a player should receive a reward
export const checkForReward = (
  player: Player, 
  condition: RewardCondition,
  eventDetails?: any // Added to support additional reward context
): { shouldReward: boolean; rewardType: RewardType | null; cardType?: CardType; message?: string } => {
  // Find applicable reward configuration
  const rewardConfig = rewardConfigs.find(config => config.condition === condition);
  
  if (!rewardConfig) {
    return { shouldReward: false, rewardType: null };
  }
  
  // Determine if player should be rewarded based on condition
  const shouldReward = shouldAwardReward(condition, player);
  
  return {
    shouldReward,
    rewardType: shouldReward ? rewardConfig.reward : null,
    cardType: shouldReward ? rewardConfig.cardType || getRandomCardType() : undefined,
    message: shouldReward ? rewardConfig.message : undefined
  };
};

// Function to determine if a player should receive a reward based on the event and reward configurations
export const shouldAwardReward = (
  condition: RewardCondition,
  player: Player,
  eventDetails?: any // More specific type can be defined based on the event
): boolean => {
  // Find the reward configuration for the given condition
  const rewardConfig = rewardConfigs.find(config => config.condition === condition);

  if (!rewardConfig) {
    console.warn(`No reward configuration found for condition: ${condition}`);
    return false;
  }

  // Implement specific logic for each condition
  switch (condition) {
    case 'elimination':
      // Award the reward if a player was eliminated
      return true;

    case 'correctAnswer':
      // Award the reward for each correct answer
      return true;

    case 'cardUsage':
      // Award the reward for using a card
      return true;

    case 'roundEnd':
      // Award the reward at the end of each round
      return true;

    case 'consecutiveCorrectAnswers':
    case 'consecutiveCorrect':
      // Award the reward if the player has answered 3 questions correctly in a row
      const consecutiveCorrect = player.consecutiveCorrect || 0;
      return consecutiveCorrect >= 3;

    default:
      return false;
  }
};

// Function to award the reward to the player
export const awardReward = (
  condition: RewardCondition,
  player: Player,
  eventDetails?: any // More specific type can be defined based on the event
): { cardType?: CardType; points?: number; lives?: number; message?: string } => {
  // Find the reward configuration for the given condition
  const rewardConfig = rewardConfigs.find(config => config.condition === condition);

  if (!rewardConfig) {
    console.warn(`No reward configuration found for condition: ${condition}`);
    return {};
  }

  // Implement specific logic for each reward type
  switch (rewardConfig.reward) {
    case 'cardAward':
      // Award a random card to the player
      return { 
        cardType: rewardConfig.cardType || getRandomCardType(),
        message: rewardConfig.message
      };

    case 'pointsAward':
      // Award points to the player
      return { 
        points: 100,
        message: rewardConfig.message
      };

    case 'livesAward':
      // Award lives to the player
      return { 
        lives: 1,
        message: rewardConfig.message
      };

    default:
      return {};
  }
};

// Function to get a random card type
const getRandomCardType = (): CardType => {
  const cardTypes: CardType[] = [
    'dejavu',
    'kontra',
    'reanimacja',
    'skip',
    'turbo',
    'refleks2',
    'refleks3',
    'lustro',
    'oswiecenie'
  ];
  const randomIndex = Math.floor(Math.random() * cardTypes.length);
  return cardTypes[randomIndex];
};
