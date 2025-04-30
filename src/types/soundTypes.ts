
import { SoundType } from '@/lib/soundService';

// Extend the SoundType type to include "question_show"
declare module '@/lib/soundService' {
  export type SoundType = 
    | 'correct' | 'wrong' | 'buzzer' | 'start_round' | 'end_round' 
    | 'card_use' | 'wheel_spin' | 'winner' | 'timer' | 'question_show';
}
