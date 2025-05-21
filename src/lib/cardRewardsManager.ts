
import { CardType, Player } from "@/types/gameTypes";

// Types of rewards that can trigger card awards
export type RewardTrigger = 
  | 'consecutiveCorrect' 
  | 'roundComplete' 
  | 'topScore' 
  | 'lastPlace' 
  | 'noLifeLost' 
  | 'custom';

// Reward configuration
interface RewardConfig {
  trigger: RewardTrigger;
  condition: (player: Player, context?: any) => boolean;
  cardTypes: CardType[];
  message: string;
  chance?: number; // 0-1, probability of reward
  cooldown?: number; // Cooldown in milliseconds
}

// Store last award timestamps to enforce cooldowns
const lastRewardTime: Record<string, Record<RewardTrigger, number>> = {};

// Default reward configurations
const defaultRewards: RewardConfig[] = [
  {
    trigger: 'consecutiveCorrect',
    condition: (player) => (player.consecutiveCorrect || 0) >= 3,
    cardTypes: ['turbo', 'refleks2', 'lustro', 'oswiecenie'],
    message: 'za 3 poprawne odpowiedzi z rzędu!',
    chance: 1,
    cooldown: 1000 * 60 * 5 // 5 minutes
  },
  {
    trigger: 'noLifeLost',
    condition: (player, context) => 
      context?.round === 'speed' && player.lives === 3,
    cardTypes: ['kontra', 'skip', 'refleks3'],
    message: 'za ukończenie rundy bez straty życia!',
    chance: 0.7,
    cooldown: 1000 * 60 * 10 // 10 minutes
  },
  {
    trigger: 'topScore',
    condition: (player, context) => {
      if (!context?.players || !context.round) return false;
      const players = context.players as Player[];
      const maxScore = Math.max(...players.map(p => p.points));
      return player.points === maxScore && player.points > 0;
    },
    cardTypes: ['turbo', 'dejavu', 'oswiecenie'],
    message: 'za najwyższy wynik w rundzie!',
    chance: 0.5,
    cooldown: 1000 * 60 * 15 // 15 minutes
  },
  {
    trigger: 'lastPlace',
    condition: (player, context) => {
      if (!context?.players || !context.round) return false;
      
      const players = context.players as Player[];
      const activePlayers = players.filter(p => !p.eliminated);
      
      if (activePlayers.length <= 1) return false;
      
      const minScore = Math.min(...activePlayers.map(p => p.points));
      return player.points === minScore && !player.eliminated;
    },
    cardTypes: ['reanimacja', 'refleks2', 'lustro'],
    message: 'jako pomoc dla gracza z najmniejszą liczbą punktów!',
    chance: 0.8,
    cooldown: 1000 * 60 * 10 // 10 minutes
  }
];

// Custom rewards that can be added at runtime
let customRewards: RewardConfig[] = [];

/**
 * Check if a player qualifies for a card reward
 * @param player The player to check
 * @param trigger The trigger type to check
 * @param context Additional context data (other players, game state, etc.)
 * @returns Object with reward info if qualified, null otherwise
 */
export function checkForReward(player: Player, trigger: RewardTrigger, context?: any): {
  cardType: CardType,
  message: string
} | null {
  // Combine default and custom rewards
  const allRewards = [...defaultRewards, ...customRewards];
  
  // Find matching rewards
  const matchingRewards = allRewards.filter(reward => {
    // Check if trigger matches and if we're past the cooldown
    const lastTime = lastRewardTime[player.id]?.[reward.trigger] || 0;
    const cooldownPassed = !reward.cooldown || (Date.now() - lastTime > reward.cooldown);
    
    return reward.trigger === trigger && cooldownPassed;
  });
  
  // Check if any matching rewards have their conditions met
  for (const reward of matchingRewards) {
    try {
      if (reward.condition(player, context)) {
        // Check probability
        if (reward.chance && Math.random() > reward.chance) {
          continue;
        }
        
        // Choose a random card type from the available options
        const cardType = reward.cardTypes[Math.floor(Math.random() * reward.cardTypes.length)];
        
        // Update the cooldown timestamp
        if (!lastRewardTime[player.id]) {
          lastRewardTime[player.id] = {} as Record<RewardTrigger, number>;
        }
        lastRewardTime[player.id][reward.trigger] = Date.now();
        
        // Return the reward
        return {
          cardType,
          message: reward.message
        };
      }
    } catch (error) {
      console.error('Error evaluating reward condition:', error);
    }
  }
  
  return null;
}

/**
 * Add a custom reward configuration
 * @param rewardConfig The reward configuration to add
 * @returns The ID of the added reward for removal
 */
export function addCustomReward(rewardConfig: RewardConfig): string {
  const id = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  customRewards.push({
    ...rewardConfig,
    trigger: rewardConfig.trigger || 'custom'
  });
  return id;
}

/**
 * Remove a custom reward configuration
 * @param id The ID of the reward to remove
 * @returns True if the reward was removed, false otherwise
 */
export function removeCustomReward(id: string): boolean {
  const initialLength = customRewards.length;
  customRewards = customRewards.filter(r => r.id !== id);
  return customRewards.length < initialLength;
}

/**
 * Reset all cooldowns for a specific player
 * @param playerId The ID of the player
 */
export function resetCooldowns(playerId: string): void {
  if (lastRewardTime[playerId]) {
    delete lastRewardTime[playerId];
  }
}

/**
 * Reset all reward cooldowns
 */
export function resetAllCooldowns(): void {
  Object.keys(lastRewardTime).forEach(key => {
    delete lastRewardTime[key];
  });
}
