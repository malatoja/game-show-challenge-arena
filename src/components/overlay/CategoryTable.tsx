
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
  // Map categories to neon colors
  const categoryColors = [
    '#2E9CCA', // blue
    '#9D4EDD', // purple
    '#FF3864', // pink
    '#FF6B35', // orange
    '#39FF14', // green
    '#FFD700', // yellow
  ];

  return (
    <div className="category-table-container">
      <table className="category-table">
        <thead>
          <tr>
            <th className="difficulty-header"></th>
            {categories.map((category, index) => (
              <th 
                key={index}
                className="category-header"
                style={{ color: categoryColors[index % categoryColors.length] }}
              >
                {category}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {difficulties.map(difficulty => (
            <tr key={difficulty}>
              <td className="difficulty-cell">+{difficulty}</td>
              {categories.map((category, index) => {
                const isSelected = selectedCategory === category && selectedDifficulty === difficulty;
                return (
                  <td 
                    key={`${category}-${difficulty}`}
                    className={`category-cell ${isSelected ? 'selected' : ''}`}
                    style={{ 
                      borderColor: categoryColors[index % categoryColors.length],
                      backgroundColor: isSelected ? `rgba(${hexToRgb(categoryColors[index % categoryColors.length])}, 0.3)` : 'transparent'
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
      <style jsx>{`
        .category-table-container {
          width: 90%;
          max-width: 1200px;
          animation: fade-in 0.5s;
        }
        
        .category-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 8px;
        }
        
        .category-header {
          font-size: 20px;
          font-weight: bold;
          text-align: center;
          padding: 10px;
          text-shadow: 0 0 5px currentColor, 0 0 10px currentColor;
        }
        
        .difficulty-header {
          width: 80px;
        }
        
        .difficulty-cell {
          font-size: 18px;
          font-weight: bold;
          text-align: center;
          color: white;
          text-shadow: 0 0 5px white, 0 0 10px rgba(255, 255, 255, 0.5);
        }
        
        .category-cell {
          width: calc(100% / ${categories.length});
          height: 80px;
          border: 2px solid;
          border-radius: 4px;
          transition: all 0.3s ease;
        }
        
        .category-cell.selected {
          animation: pulse 1.5s infinite;
          box-shadow: 0 0 10px currentColor, 0 0 20px currentColor;
        }
      `}</style>
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
