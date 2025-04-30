
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { addCategory, removeCategory } from '@/utils/gameUtils';

interface CategoryManagerProps {
  categories: string[];
  onCategoriesChange: (categories: string[]) => void;
}

export function CategoryManager({ categories, onCategoriesChange }: CategoryManagerProps) {
  const [newCategory, setNewCategory] = useState('');

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast.error('Nazwa kategorii nie może być pusta');
      return;
    }
    
    try {
      const updatedCategories = addCategory(newCategory);
      onCategoriesChange(updatedCategories);
      setNewCategory('');
      toast.success(`Dodano kategorię: ${newCategory}`);
    } catch (error) {
      toast.error((error as Error).message || 'Błąd podczas dodawania kategorii');
    }
  };
  
  const handleRemoveCategory = (categoryToRemove: string) => {
    if (categories.length <= 1) {
      toast.error('Musi istnieć co najmniej jedna kategoria');
      return;
    }
    
    if (confirm(`Czy na pewno chcesz usunąć kategorię "${categoryToRemove}"?`)) {
      try {
        const updatedCategories = removeCategory(categoryToRemove);
        onCategoriesChange(updatedCategories);
        toast.success(`Usunięto kategorię: ${categoryToRemove}`);
      } catch (error) {
        toast.error('Błąd podczas usuwania kategorii');
      }
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Zarządzanie kategoriami pytań</h3>
      
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <div 
            key={category}
            className="bg-gameshow-card flex items-center gap-2 px-3 py-1 rounded-md"
          >
            <span>{category}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={() => handleRemoveCategory(category)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Usuń kategorię</span>
            </Button>
          </div>
        ))}
      </div>
      
      <Separator className="my-4" />
      
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Label htmlFor="new-category">Nowa kategoria</Label>
          <Input
            id="new-category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Nazwa nowej kategorii"
            className="bg-gameshow-card/50"
          />
        </div>
        <Button
          onClick={handleAddCategory}
          disabled={!newCategory.trim()}
        >
          <Plus className="mr-1 h-4 w-4" />
          Dodaj
        </Button>
      </div>
    </div>
  );
}
