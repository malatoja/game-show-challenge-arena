// Points per question
export const MAX_POINTS_PER_QUESTION = 10;

// Categories for the wheel round
export const WHEEL_CATEGORIES = [
  'Historia',
  'Geografia',
  'Nauka',
  'Sztuka',
  'Sport',
  'Rozrywka',
  'Technologia',
  'Muzyka',
  'Film',
  'Literatura'
];

// Function to create a new card
export const createCard = (type: CardType, description: string): Card => {
  return {
    id: `card-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    type,
    description,
    isUsed: false
  };
};

// Round names
export const ROUND_NAMES: Record<RoundType | 'all', string> = {
  'all': 'Wszystkie rundy',
  'knowledge': 'Runda Wiedzy',
  'speed': 'Runda Szybka',
  'wheel': 'Koło Fortuny',
  'standard': 'Standardowa'
};
