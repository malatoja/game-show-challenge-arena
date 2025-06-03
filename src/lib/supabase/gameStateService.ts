
import { supabase } from '@/integrations/supabase/client';
import { GameState } from '@/types/gameTypes';

export class GameStateService {
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
}
