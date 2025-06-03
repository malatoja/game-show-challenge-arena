
import React from 'react';
import { motion } from 'framer-motion';
import { RoundType } from '@/types/gameTypes';

interface CategoryTableProps {
  round: RoundType;
}

export function CategoryTable({ round }: CategoryTableProps) {
  const categories = ['MEMY', 'TRENDY', 'TWITCH', 'INTERNET', 'CIEKAWOSTKI'];
  const difficulties = [10, 20, 30];

  return (
    <div className="w-full h-full bg-gameshow-card rounded-lg border border-gameshow-secondary p-4">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-gameshow-text">
          {round === 'knowledge' ? 'Kategorie' : 
           round === 'speed' ? 'Szybka Runda' : 
           'Koło Fortuny'}
        </h3>
      </div>

      {round === 'knowledge' && (
        <div className="space-y-2">
          {categories.map((category, index) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="grid grid-cols-4 gap-2"
            >
              <div className="col-span-1 bg-gameshow-primary/20 p-2 rounded text-center text-sm font-medium text-gameshow-text">
                {category}
              </div>
              {difficulties.map((difficulty) => (
                <div
                  key={`${category}-${difficulty}`}
                  className="bg-gameshow-background/50 p-2 rounded text-center text-sm text-gameshow-text hover:bg-gameshow-primary/10 transition-colors"
                >
                  {difficulty}
                </div>
              ))}
            </motion.div>
          ))}
        </div>
      )}

      {round === 'speed' && (
        <div className="text-center text-gameshow-muted">
          <p>Szybkie pytania bez kategorii</p>
          <p className="text-sm mt-2">5 sekund na odpowiedź</p>
        </div>
      )}

      {round === 'wheel' && (
        <div className="text-center text-gameshow-muted">
          <p>Kategoria zostanie wybrana przez koło fortuny</p>
        </div>
      )}
    </div>
  );
}

export default CategoryTable;
