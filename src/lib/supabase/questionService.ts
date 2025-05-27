
import { supabase } from '@/integrations/supabase/client';
import { Question } from '@/types/gameTypes';

export class QuestionService {
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
