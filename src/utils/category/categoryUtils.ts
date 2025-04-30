
/**
 * Category utility functions for the game
 */

// Get all categories from localStorage with default fallback
export function getAllCategories(): string[] {
  try {
    const storedCategories = localStorage.getItem('gameShowCategories');
    
    if (storedCategories) {
      return JSON.parse(storedCategories);
    } else {
      // Default categories if none stored
      const defaultCategories = [
        'WIEDZA OGÓLNA', 
        'MEMY', 
        'TRENDY', 
        'TWITCH', 
        'INTERNET', 
        'CIEKAWOSTKI', 
        'GRY', 
        'FILMY',
        'MUZYKA',
        'SPORT'
      ];
      
      // Save default categories to localStorage
      localStorage.setItem('gameShowCategories', JSON.stringify(defaultCategories));
      return defaultCategories;
    }
  } catch (error) {
    console.error('Error loading categories:', error);
    return ['WIEDZA OGÓLNA', 'MEMY', 'TRENDY', 'TWITCH', 'INTERNET'];
  }
}

// Add a new category to localStorage
export function addCategory(category: string): string[] {
  try {
    const categories = getAllCategories();
    
    // Check if category already exists
    if (!categories.includes(category)) {
      const newCategories = [...categories, category];
      localStorage.setItem('gameShowCategories', JSON.stringify(newCategories));
      return newCategories;
    }
    
    return categories;
  } catch (error) {
    console.error('Error adding category:', error);
    return getAllCategories();
  }
}

// Remove a category from localStorage
export function removeCategory(category: string): string[] {
  try {
    const categories = getAllCategories();
    const newCategories = categories.filter(c => c !== category);
    localStorage.setItem('gameShowCategories', JSON.stringify(newCategories));
    return newCategories;
  } catch (error) {
    console.error('Error removing category:', error);
    return getAllCategories();
  }
}

// Filter categories by name prefix (for search)
export function filterCategories(filter: string): string[] {
  const categories = getAllCategories();
  
  if (!filter) return categories;
  
  return categories.filter(
    category => category.toLowerCase().includes(filter.toLowerCase())
  );
}
