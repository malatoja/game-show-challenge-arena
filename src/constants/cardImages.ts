
import { CardType } from '@/types/gameTypes';

// Load custom card images from localStorage if available
const getCustomCardImages = (): Partial<Record<CardType, string>> => {
  try {
    const customImages = localStorage.getItem('customCardImages');
    return customImages ? JSON.parse(customImages) : {};
  } catch (error) {
    console.error('Error loading custom card images:', error);
    return {};
  }
};

// Default image paths for cards
const DEFAULT_CARD_IMAGES: Record<CardType, string> = {
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

// Get custom images if available, fallback to defaults
const customImages = typeof window !== 'undefined' ? getCustomCardImages() : {};

// Map of card types to their image paths - override defaults with custom images
export const CARD_IMAGES: Record<CardType, string> = {
  ...DEFAULT_CARD_IMAGES,
  ...customImages
};

// Export default images for reference
export const DEFAULT_CARD_IMAGES_PATHS = DEFAULT_CARD_IMAGES;

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
