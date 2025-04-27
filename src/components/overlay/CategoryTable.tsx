
import React from 'react';

interface CategoryTableProps {
  categories: string[];
  difficulties: number[];
  selectedCategory?: string;
  selectedDifficulty?: number;
}

export const CategoryTable: React.FC<CategoryTableProps> = ({
  categories,
  difficulties,
  selectedCategory,
  selectedDifficulty
}) => {
  const categoryColors = [
    '#2E9CCA', // blue
    '#9D4EDD', // purple
    '#FF3864', // pink
    '#FF6B35', // orange
    '#39FF14', // green
    '#FFD700', // yellow
  ];

  return (
    <div className="w-[90%] max-w-[1200px] animate-fade-in">
      <table className="w-full border-separate border-spacing-2">
        <thead>
          <tr>
            <th className="w-[80px]"></th>
            {categories.map((category, index) => (
              <th 
                key={index}
                className="text-center text-xl font-bold p-2.5"
                style={{ 
                  color: categoryColors[index % categoryColors.length],
                  textShadow: `0 0 5px ${categoryColors[index % categoryColors.length]}, 0 0 10px ${categoryColors[index % categoryColors.length]}`
                }}
              >
                {category}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {difficulties.map(difficulty => (
            <tr key={difficulty}>
              <td className="text-center text-lg font-bold text-white text-shadow-neon">+{difficulty}</td>
              {categories.map((category, index) => {
                const isSelected = selectedCategory === category && selectedDifficulty === difficulty;
                return (
                  <td 
                    key={`${category}-${difficulty}`}
                    className={`w-[calc(100%/${categories.length})] h-20 border-2 rounded transition-all duration-300 ${isSelected ? 'animate-pulse' : ''}`}
                    style={{ 
                      borderColor: categoryColors[index % categoryColors.length],
                      backgroundColor: isSelected 
                        ? `rgba(${hexToRgb(categoryColors[index % categoryColors.length])}, 0.3)` 
                        : 'transparent'
                    }}
                  >
                    &nbsp;
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Helper function to convert hex to rgb
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result 
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '255, 255, 255';
}
