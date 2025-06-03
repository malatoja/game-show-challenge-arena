
import { PlayerService } from './playerService';
import { QuestionService } from './questionService';
import { GameStateService } from './gameStateService';
import { Player, Question, GameState } from '@/types/gameTypes';

export class GameService {
  // Player management - delegated to PlayerService
  static async createPlayer(playerData: Omit<Player, 'id'>) {
    return PlayerService.createPlayer(playerData);
  }

  static async getPlayers() {
    return PlayerService.getPlayers();
  }

  static async updatePlayer(playerId: string, updates: Partial<Player>) {
    return PlayerService.updatePlayer(playerId, updates);
  }

  // Question management - delegated to QuestionService
  static async getQuestions() {
    return QuestionService.getQuestions();
  }

  static async markQuestionAsUsed(questionId: string, sessionId: string) {
    return QuestionService.markQuestionAsUsed(questionId, sessionId);
  }

  // Game state management - delegated to GameStateService
  static async saveGameState(gameState: Partial<GameState>) {
    return GameStateService.saveGameState(gameState);
  }

  static async loadGameState() {
    return GameStateService.loadGameState();
  }
}
