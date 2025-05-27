
export type SoundType = 
  | 'round-start' 
  | 'card-activate' 
  | 'correct-answer' 
  | 'wrong-answer' 
  | 'timer-warning' 
  | 'game-over'
  | 'hint';

export interface SoundSettings {
  volume: number;
  muted: boolean;
  enabledSounds: SoundType[];
}
