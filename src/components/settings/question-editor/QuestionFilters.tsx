
import React from 'react';
import { RoundType } from '@/types/gameTypes';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WHEEL_CATEGORIES } from '@/constants/gameConstants';

interface QuestionFiltersProps {
  roundFilter: RoundType | 'all';
  categoryFilter: string | 'all';
  searchTerm: string;
  onRoundFilterChange: (value: RoundType | 'all') => void;
  onCategoryFilterChange: (value: string) => void;
  onSearchTermChange: (value: string) => void;
}

export function QuestionFilters({
  roundFilter,
  categoryFilter,
  searchTerm,
  onRoundFilterChange,
  onCategoryFilterChange,
  onSearchTermChange
}: QuestionFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
      <div className="flex-1">
        <Input
          placeholder="Szukaj pytań..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="bg-gameshow-card border-gameshow-primary/30"
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Select
          value={roundFilter}
          onValueChange={(value) => onRoundFilterChange(value as RoundType | 'all')}
        >
          <SelectTrigger className="w-[180px] bg-gameshow-card border-gameshow-primary/30">
            <SelectValue placeholder="Filtruj rundy" />
          </SelectTrigger>
          <SelectContent className="bg-gameshow-card border-gameshow-primary/30">
            <SelectItem value="all">Wszystkie rundy</SelectItem>
            <SelectItem value="knowledge">Runda 1: Wiedza</SelectItem>
            <SelectItem value="speed">Runda 2: Szybka</SelectItem>
            <SelectItem value="wheel">Runda 3: Koło fortuny</SelectItem>
            <SelectItem value="standard">Standardowa</SelectItem>
          </SelectContent>
        </Select>
        
        <Select
          value={categoryFilter}
          onValueChange={(value) => onCategoryFilterChange(value)}
        >
          <SelectTrigger className="w-[180px] bg-gameshow-card border-gameshow-primary/30">
            <SelectValue placeholder="Filtruj kategorie" />
          </SelectTrigger>
          <SelectContent className="bg-gameshow-card border-gameshow-primary/30">
            <SelectItem value="all">Wszystkie kategorie</SelectItem>
            {WHEEL_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
