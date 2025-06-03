
export type SoundType = 
  | 'round-start' 
  | 'card-activate' 
  | 'card-use'
  | 'correct-answer' 
  | 'correct'
  | 'wrong-answer' 
  | 'incorrect'
  | 'timer-warning' 
  | 'timer-end'
  | 'game-over'
  | 'hint'
  | 'buzzer'
  | 'countdown'
  | 'elimination'
  | 'wheel-spin'
  | 'winner';

export interface SoundSettings {
  volume: number;
  muted: boolean;
  enabledSounds: SoundType[];
}
