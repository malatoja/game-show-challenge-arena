
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
  | 'hint'
  | 'hint-sound'
  | 'card-use'
  | 'correct-answer'
  | 'wrong-answer'
  | 'timeout'
  | 'round-end'
  | 'reward';

export interface SoundOptions {
  volume?: number;
  loop?: boolean;
  fadeIn?: boolean;
  fadeOut?: boolean;
}
