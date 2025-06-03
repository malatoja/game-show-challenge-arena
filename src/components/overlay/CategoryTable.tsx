
import React from 'react';
import { motion } from 'framer-motion';

interface CategoryTableProps {
  categories: string[];
  difficulties: number[];
  selectedCategory?: string;
  selectedDifficulty?: number;
}

export const CategoryTable: React.FC<CategoryTableProps> = ({
  categories = [],
  difficulties = [],
  selectedCategory = "",
  selectedDifficulty = 0
}) => {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 }
  };

  // Calculate if a cell is selected
  const isSelected = (category: string, difficulty: number) => 
    category === selectedCategory && difficulty === selectedDifficulty;

  // Get cell background based on selected state
  const getCellBackground = (category: string, difficulty: number) => {
    if (isSelected(category, difficulty)) {
      return "bg-gameshow-accent";
    }
    // Alternate colors for better visibility
    return "bg-gameshow-card/80 hover:bg-gameshow-card";
  };

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div
        className="grid grid-cols-1"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Categories header */}
        <div className="grid grid-cols-6 gap-2 mb-4">
          <div className="col-span-1"></div>
          {categories.map((category, index) => (
            <motion.div
              key={category}
              className="text-center font-bold text-lg text-white bg-gameshow-primary/80 py-2 px-1 rounded-t-lg shadow-lg"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              style={{ 
                textShadow: '0 0 5px rgba(255, 255, 255, 0.5)',
                boxShadow: '0 -5px 15px rgba(57, 255, 20, 0.3)'
              }}
            >
              {category}
            </motion.div>
          ))}
        </div>

        {/* Difficulty rows */}
        {difficulties.map((difficulty, rowIndex) => (
          <motion.div 
            key={difficulty} 
            className="grid grid-cols-6 gap-2 mb-2"
            variants={item}
          >
            {/* Difficulty label */}
            <motion.div 
              className="flex items-center justify-center bg-gameshow-secondary/80 font-bold text-white rounded-l-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * rowIndex, duration: 0.5 }}
              style={{ 
                boxShadow: '0 0 10px rgba(255, 56, 100, 0.3)'
              }}
            >
              {difficulty}
            </motion.div>
            
            {/* Category cells for this difficulty */}
            {categories.map((category, colIndex) => (
              <motion.div
                key={`${category}-${difficulty}`}
                className={`aspect-w-1 aspect-h-1 ${getCellBackground(category, difficulty)} flex items-center justify-center ${isSelected(category, difficulty) ? 'text-white' : 'text-white/80'} font-bold text-2xl rounded-md shadow-md cursor-pointer`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  delay: 0.1 * (rowIndex + colIndex), 
                  duration: 0.5 
                }}
                whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(255, 255, 255, 0.5)' }}
                style={{ 
                  aspectRatio: '1',
                  boxShadow: isSelected(category, difficulty) 
                    ? '0 0 15px rgba(57, 255, 20, 0.7), inset 0 0 10px rgba(57, 255, 20, 0.5)' 
                    : '0 0 5px rgba(0, 0, 0, 0.3)'
                }}
              >
                {difficulty}
              </motion.div>
            ))}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};
