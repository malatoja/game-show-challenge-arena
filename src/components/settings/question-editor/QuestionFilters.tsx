
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RoundType } from '@/types/gameTypes';
import { getAllCategories } from '@/utils/gameUtils';

interface QuestionFiltersProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  roundFilter: RoundType | 'all';
  onRoundFilterChange: (round: RoundType | 'all') => void;
  categoryFilter: string;
  onCategoryFilterChange: (category: string) => void;
  showUsed?: boolean;
  setShowUsed?: (show: boolean) => void;
  showFavorites?: boolean;
  setShowFavorites?: (show: boolean) => void;
  onClearFilters?: () => void;
}

export function QuestionFilters({ 
  searchTerm,
  onSearchTermChange,
  roundFilter,
  onRoundFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  showUsed = false,
  setShowUsed = () => {},
  showFavorites = false,
  setShowFavorites = () => {},
  onClearFilters = () => {}
}: QuestionFiltersProps) {
  const categories = getAllCategories();

  return (
    <div className="bg-gameshow-background/30 p-3 rounded-md border border-gameshow-primary/20 mb-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gameshow-muted h-4 w-4" />
          <Input
            placeholder="Szukaj pytań..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="pl-9 bg-gameshow-background border-gameshow-primary/30"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchTermChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gameshow-muted hover:text-gameshow-text"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <Select value={roundFilter} onValueChange={(value) => onRoundFilterChange(value as RoundType | 'all')}>
          <SelectTrigger className="w-32 bg-gameshow-background border-gameshow-primary/30">
            <SelectValue placeholder="Runda" />
          </SelectTrigger>
          <SelectContent className="bg-gameshow-background border-gameshow-primary/30">
            <SelectItem value="all">Wszystkie</SelectItem>
            <SelectItem value="knowledge">Runda 1: Wiedza</SelectItem>
            <SelectItem value="speed">Runda 2: Szybka</SelectItem>
            <SelectItem value="wheel">Runda 3: Koło</SelectItem>
            <SelectItem value="standard">Standardowa</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={categoryFilter} onValueChange={onCategoryFilterChange}>
          <SelectTrigger className="w-32 bg-gameshow-background border-gameshow-primary/30">
            <SelectValue placeholder="Kategoria" />
          </SelectTrigger>
          <SelectContent className="bg-gameshow-background border-gameshow-primary/30 max-h-[200px]">
            <SelectItem value="all">Wszystkie</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Button 
          variant="outline" 
          className="border-gameshow-primary/30" 
          onClick={onClearFilters}
        >
          Wyczyść filtry
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-4 mt-3">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="show-used" 
            checked={showUsed} 
            onCheckedChange={() => setShowUsed(!showUsed)} 
          />
          <Label htmlFor="show-used">Pokaż użyte</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="show-favorites" 
            checked={showFavorites} 
            onCheckedChange={() => setShowFavorites(!showFavorites)} 
          />
          <Label htmlFor="show-favorites">Tylko ulubione</Label>
        </div>
      </div>
    </div>
  );
}
