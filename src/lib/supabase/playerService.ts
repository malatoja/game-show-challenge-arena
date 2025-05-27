
import { supabase } from '@/integrations/supabase/client';
import { Player, Card } from '@/types/gameTypes';

export class PlayerService {
  static async createPlayer(playerData: Omit<Player, 'id'>) {
    const { data, error } = await supabase
      .from('players')
      .insert({
        nickname: playerData.name,
        token: `player-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        life_percent: 100,
        points: 0,
        cards: JSON.stringify(playerData.cards || []),
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
        cards: updates.cards ? JSON.stringify(updates.cards) : undefined,
        is_active: updates.isActive
      })
      .eq('id', playerId)
      .select()
      .single();

    if (error) throw error;
    return this.mapDbPlayerToPlayer(data);
  }

  private static async generatePlayerToken(): Promise<string> {
    const { data, error } = await supabase.rpc('generate_unique_player_token');
    if (error) throw error;
    return data;
  }

  private static mapDbPlayerToPlayer(dbPlayer: any): Player {
    let cards: Card[] = [];
    if (dbPlayer.cards) {
      try {
        cards = typeof dbPlayer.cards === 'string' 
          ? JSON.parse(dbPlayer.cards) 
          : dbPlayer.cards;
      } catch (e) {
        console.error('Error parsing player cards:', e);
        cards = [];
      }
    }

    return {
      id: dbPlayer.id,
      name: dbPlayer.nickname,
      lives: Math.floor((dbPlayer.life_percent || 100) / 33.33),
      points: dbPlayer.points || 0,
      cards,
      isActive: dbPlayer.is_active || false,
      eliminated: (dbPlayer.life_percent || 100) <= 0,
      avatarUrl: dbPlayer.avatar_url,
      avatar: dbPlayer.avatar_url,
      color: dbPlayer.color,
      cameraUrl: dbPlayer.camera_url,
      token: dbPlayer.unique_link_token
    };
  }
}
