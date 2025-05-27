
import { supabase } from '@/integrations/supabase/client';
import { Player, Question, GameState } from '@/types/gameTypes';

export class GameService {
  // Player management
  static async createPlayer(playerData: Omit<Player, 'id'>) {
    const { data, error } = await supabase
      .from('players')
      .insert({
        nickname: playerData.name,
        token: `player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        life_percent: 100,
        points: 0,
        cards: [],
        is_active: false,
        status: 'active',
        unique_link_token: await this.generatePlayerToken()
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapDbPlayerToPlayer(data);
  }

  static async getPlayers() {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('status', 'active');

    if (error) throw error;
    return data.map(this.mapDbPlayerToPlayer);
  }

  static async updatePlayer(playerId: string, updates: Partial<Player>) {
    const { data, error } = await supabase
      .from('players')
      .update({
        nickname: updates.name,
        life_percent: updates.lives ? updates.lives * 33.33 : undefined,
        points: updates.points,
        cards: updates.cards || [],
        is_active: updates.isActive
      })
      .eq('id', playerId)
      .select()
      .single();

    if (error) throw error;
    return this.mapDbPlayerToPlayer(data);
  }

  // Question management
  static async getQuestions() {
    const { data, error } = await supabase
      .from('questions')
      .select(`
        *,
        categories (
          name,
          round
        )
      `);

    if (error) throw error;
    return data.map(this.mapDbQuestionToQuestion);
  }

  static async markQuestionAsUsed(questionId: string, sessionId: string) {
    const { error } = await supabase
      .from('used_questions')
      .insert({
        question_id: questionId,
        session_id: sessionId
      });

    if (error) throw error;
  }

  // Game state management
  static async saveGameState(gameState: Partial<GameState>) {
    const { error } = await supabase
      .from('game_state')
      .upsert({
        current_question: gameState.currentQuestion ? JSON.stringify(gameState.currentQuestion) : null,
        active_player_id: gameState.activePlayerId,
        current_round: this.mapRoundToNumber(gameState.currentRound),
        timer_running: false,
        timer_duration: 30,
        game_paused: false,
        wheel_category: gameState.selectedCategory
      });

    if (error) throw error;
  }

  static async loadGameState() {
    const { data, error } = await supabase
      .from('game_state')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    
    if (!data) return null;

    let currentQuestion = null;
    if (data.current_question) {
      try {
        currentQuestion = JSON.parse(data.current_question as string);
      } catch (e) {
        console.error('Error parsing current question:', e);
      }
    }

    return {
      currentQuestion,
      activePlayerId: data.active_player_id,
      currentRound: this.mapNumberToRound(data.current_round),
      selectedCategory: data.wheel_category,
      wheelSpinning: false,
      gameStarted: true,
      roundActive: !data.game_paused,
      roundStarted: !data.game_paused,
      roundEnded: false
    };
  }

  // Utility methods
  private static async generatePlayerToken(): Promise<string> {
    const { data, error } = await supabase.rpc('generate_unique_player_token');
    if (error) throw error;
    return data;
  }

  private static mapDbPlayerToPlayer(dbPlayer: any): Player {
    return {
      id: dbPlayer.id,
      name: dbPlayer.nickname,
      lives: Math.floor((dbPlayer.life_percent || 100) / 33.33),
      points: dbPlayer.points || 0,
      cards: dbPlayer.cards || [],
      isActive: dbPlayer.is_active || false,
      eliminated: (dbPlayer.life_percent || 100) <= 0,
      avatarUrl: dbPlayer.avatar_url,
      avatar: dbPlayer.avatar_url,
      color: dbPlayer.color,
      cameraUrl: dbPlayer.camera_url,
      token: dbPlayer.unique_link_token
    };
  }

  private static mapDbQuestionToQuestion(dbQuestion: any): Question {
    return {
      id: dbQuestion.id,
      text: dbQuestion.text,
      category: dbQuestion.categories?.name || 'Ogólna',
      answers: dbQuestion.options ? dbQuestion.options.map((opt: any, index: number) => ({
        text: opt,
        isCorrect: opt === dbQuestion.correct_answer
      })) : [],
      correctAnswerIndex: dbQuestion.options ? 
        dbQuestion.options.findIndex((opt: any) => opt === dbQuestion.correct_answer) : 0,
      round: this.mapNumberToRound(dbQuestion.categories?.round || 1),
      difficulty: this.mapDifficultyNumberToString(dbQuestion.difficulty),
      points: dbQuestion.difficulty * 5,
      imageUrl: dbQuestion.image_url,
      used: false
    };
  }

  private static mapRoundToNumber(round?: string): number {
    switch (round) {
      case 'knowledge': return 1;
      case 'speed': return 2;
      case 'wheel': return 3;
      default: return 1;
    }
  }

  private static mapNumberToRound(num: number): 'knowledge' | 'speed' | 'wheel' {
    switch (num) {
      case 2: return 'speed';
      case 3: return 'wheel';
      default: return 'knowledge';
    }
  }

  private static mapDifficultyNumberToString(difficulty: number): 'easy' | 'medium' | 'hard' {
    if (difficulty <= 1) return 'easy';
    if (difficulty <= 2) return 'medium';
    return 'hard';
  }
}
