
import { CardType } from "@/types/gameTypes";

// Map of card types to their image URLs
export const CARD_IMAGES: Partial<Record<CardType, string>> = {
  dejavu: '/images/cards/dejavu.webp',
  kontra: '/images/cards/kontra.webp',
  reanimacja: '/images/cards/reanimacja.webp',
  skip: '/images/cards/skip.webp',
  turbo: '/images/cards/turbo.webp',
  refleks2: '/images/cards/refleks2.webp',
  refleks3: '/images/cards/refleks3.webp',
  lustro: '/images/cards/lustro.webp',
  oswiecenie: '/images/cards/oswiecenie.webp'
};

// Default card image paths (used for resetting to defaults)
export const DEFAULT_CARD_IMAGES_PATHS: Partial<Record<CardType, string>> = {
  dejavu: '/images/cards/dejavu.webp',
  kontra: '/images/cards/kontra.webp',
  reanimacja: '/images/cards/reanimacja.webp',
  skip: '/images/cards/skip.webp',
  turbo: '/images/cards/turbo.webp',
  refleks2: '/images/cards/refleks2.webp',
  refleks3: '/images/cards/refleks3.webp',
  lustro: '/images/cards/lustro.webp',
  oswiecenie: '/images/cards/oswiecenie.webp'
};

// Map of card types to their animation videos
export const CARD_ANIMATIONS: Partial<Record<CardType, string>> = {
  dejavu: '/videos/cards/dejavu.webm',
  kontra: '/videos/cards/kontra.webm',
  reanimacja: '/videos/cards/reanimacja.webm',
  skip: '/videos/cards/skip.webm',
  turbo: '/videos/cards/turbo.webm',
  refleks2: '/videos/cards/refleks2.webm',
  refleks3: '/videos/cards/refleks3.webm',
  lustro: '/videos/cards/lustro.webm',
  oswiecenie: '/videos/cards/oswiecenie.webm'
};

// Default card animation paths (used for resetting to defaults)
export const DEFAULT_CARD_ANIMATIONS_PATHS: Partial<Record<CardType, string>> = {
  dejavu: '/videos/cards/dejavu.webm',
  kontra: '/videos/cards/kontra.webm',
  reanimacja: '/videos/cards/reanimacja.webm',
  skip: '/videos/cards/skip.webm',
  turbo: '/videos/cards/turbo.webm',
  refleks2: '/videos/cards/refleks2.webm',
  refleks3: '/videos/cards/refleks3.webm',
  lustro: '/videos/cards/lustro.webm',
  oswiecenie: '/videos/cards/oswiecenie.webm'
};
