
import { SoundManager } from './soundManager';
import { SoundType } from '@/types/soundTypes';

export function playSound(soundType: SoundType) {
  SoundManager.play(soundType);
}

export function setSoundVolume(volume: number) {
  SoundManager.setVolume(volume);
}

export function muteSounds(muted: boolean) {
  SoundManager.setMuted(muted);
}

export function getSoundVolume(): number {
  return SoundManager.getVolume();
}

export function isSoundMuted(): boolean {
  return SoundManager.isMuted();
}
