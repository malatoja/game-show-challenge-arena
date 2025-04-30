
// Default categories
const DEFAULT_CATEGORIES = [
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

// Get all categories from localStorage or use defaults
export const getAllCategories = (): string[] => {
  try {
    const savedCategories = localStorage.getItem('gameShowCategories');
    if (savedCategories) {
      return JSON.parse(savedCategories);
    }
    
    // If no saved categories, store defaults and return them
    localStorage.setItem('gameShowCategories', JSON.stringify(DEFAULT_CATEGORIES));
    return DEFAULT_CATEGORIES;
  } catch (error) {
    console.error('Error loading categories:', error);
    return DEFAULT_CATEGORIES;
  }
};

// Add a new category
export const addCategory = (category: string): string[] => {
  try {
    const categories = getAllCategories();
    
    // Check if category already exists (case insensitive)
    if (categories.some(cat => cat.toLowerCase() === category.toLowerCase())) {
      throw new Error(`Kategoria "${category}" już istnieje`);
    }
    
    // Add new category
    const updatedCategories = [...categories, category];
    localStorage.setItem('gameShowCategories', JSON.stringify(updatedCategories));
    
    return updatedCategories;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

// Remove a category
export const removeCategory = (category: string): string[] => {
  try {
    const categories = getAllCategories();
    
    // Check if it's the last category
    if (categories.length <= 1) {
      throw new Error('Nie można usunąć ostatniej kategorii');
    }
    
    // Remove category
    const updatedCategories = categories.filter(cat => cat !== category);
    localStorage.setItem('gameShowCategories', JSON.stringify(updatedCategories));
    
    return updatedCategories;
  } catch (error) {
    console.error('Error removing category:', error);
    throw error;
  }
};
