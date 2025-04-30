
import { CardType } from '@/types/gameTypes';

// Map of card types to their image paths
// In the future, these could be real images instead of placeholders
export const CARD_IMAGES: Record<CardType, string> = {
  'dejavu': '/images/cards/dejavu.png',
  'kontra': '/images/cards/kontra.png',
  'reanimacja': '/images/cards/reanimacja.png',
  'skip': '/images/cards/skip.png',
  'turbo': '/images/cards/turbo.png',
  'refleks2': '/images/cards/refleks2.png',
  'refleks3': '/images/cards/refleks3.png',
  'lustro': '/images/cards/lustro.png',
  'oswiecenie': '/images/cards/oswiecenie.png'
};

// Map of card types to their animation paths
export const CARD_ANIMATIONS: Record<CardType, string> = {
  'dejavu': '/animations/cards/dejavu.webm',
  'kontra': '/animations/cards/kontra.webm',
  'reanimacja': '/animations/cards/reanimacja.webm',
  'skip': '/animations/cards/skip.webm',
  'turbo': '/animations/cards/turbo.webm',
  'refleks2': '/animations/cards/refleks2.webm',
  'refleks3': '/animations/cards/refleks3.webm',
  'lustro': '/animations/cards/lustro.webm',
  'oswiecenie': '/animations/cards/oswiecenie.webm'
};
