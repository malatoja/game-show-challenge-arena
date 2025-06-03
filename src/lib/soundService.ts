
import { SoundManager } from './soundManager';
import { SoundType } from '@/types/soundTypes';

export function playSound(soundType: SoundType) {
  SoundManager.play(soundType);
}

export function play(soundType: SoundType, volume?: number) {
  if (volume !== undefined) {
    const oldVolume = SoundManager.getVolume();
    SoundManager.setVolume(volume);
    SoundManager.play(soundType);
    SoundManager.setVolume(oldVolume);
  } else {
    SoundManager.play(soundType);
  }
}

export function setVolume(volume: number) {
  SoundManager.setVolume(volume);
}

export function setSoundVolume(volume: number) {
  SoundManager.setVolume(volume);
}

export function muteSounds(muted: boolean) {
  SoundManager.setMuted(muted);
}

export function setEnabled(enabled: boolean) {
  SoundManager.setMuted(!enabled);
}

export function getSoundVolume(): number {
  return SoundManager.getVolume();
}

export function isSoundMuted(): boolean {
  return SoundManager.isMuted();
}

export function setCustomSound(soundType: SoundType, file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const url = URL.createObjectURL(file);
      // In a real implementation, you would save this to local storage or send to server
      console.log(`Setting custom sound for ${soundType}:`, url);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

export function resetSound(soundType: SoundType) {
  // In a real implementation, you would reset to default sound
  console.log(`Resetting sound: ${soundType}`);
}

export function resetAllSounds() {
  // In a real implementation, you would reset all sounds to defaults
  console.log('Resetting all sounds to defaults');
}
