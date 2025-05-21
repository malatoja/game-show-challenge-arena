
// Define allowed sound types for the application
export type SoundType = 
  | 'correct'
  | 'incorrect'
  | 'buzzer'
  | 'countdown'
  | 'elimination'
  | 'timer-end'
  | 'wheel-spin'
  | 'card-activate'
  | 'round-start'
  | 'game-over'
  | 'winner'
  | 'hint';

export interface SoundOptions {
  volume?: number;
  loop?: boolean;
  fadeIn?: boolean;
  fadeOut?: boolean;
}
