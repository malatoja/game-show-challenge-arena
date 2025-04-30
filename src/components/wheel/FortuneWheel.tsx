
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAllCategories } from '@/utils/gameUtils';

interface FortuneWheelProps {
  isSpinning: boolean;
  onSpinEnd?: () => void;
  onSelectCategory?: (category: string) => void;
}

const FortuneWheel = ({ isSpinning, onSpinEnd, onSelectCategory }: FortuneWheelProps) => {
  const [rotation, setRotation] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  
  // Load all available categories
  useEffect(() => {
    const loadedCategories = getAllCategories();
    setCategories(loadedCategories);
  }, []);
  
  // Start spinning animation when isSpinning becomes true
  useEffect(() => {
    if (isSpinning) {
      // Random number of full rotations (3-5) plus a random angle
      const spinDegrees = 1080 + Math.random() * 720; 
      
      setRotation(prevRotation => prevRotation + spinDegrees);
      
      // Calculate which category is selected after spinning
      const finalAngle = (rotation + spinDegrees) % 360;
      const segmentSize = 360 / categories.length;
      const selectedIndex = Math.floor(finalAngle / segmentSize);
      const selected = categories[selectedIndex] || categories[0];
      
      // Wait for animation to finish
      const timer = setTimeout(() => {
        setSelectedCategory(selected);
        if (onSelectCategory) onSelectCategory(selected);
        if (onSpinEnd) onSpinEnd();
      }, 3000); // Match animation duration
      
      return () => clearTimeout(timer);
    }
  }, [isSpinning, categories]);
  
  // Generate wheel segments based on available categories
  const generateWheelSegments = () => {
    return categories.map((category, index) => {
      const segmentAngle = 360 / categories.length;
      const startAngle = index * segmentAngle;
      const endAngle = (index + 1) * segmentAngle;
      
      const color = index % 2 === 0 ? '#3B82F6' : '#2563EB'; // Alternate colors
      
      return (
        <path
          key={category}
          d={describeArc(100, 100, 80, startAngle, endAngle)}
          fill={color}
          stroke="#1E40AF"
          strokeWidth="1"
        />
      );
    });
  };
  
  // Generate category labels
  const generateCategoryLabels = () => {
    return categories.map((category, index) => {
      const segmentAngle = 360 / categories.length;
      const angle = index * segmentAngle + segmentAngle / 2;
      const radians = (angle - 90) * Math.PI / 180; // -90 degrees to start at the top
      
      // Calculate position for text
      const r = 60; // Radius for text placement
      const x = 100 + r * Math.cos(radians);
      const y = 100 + r * Math.sin(radians);
      
      return (
        <text
          key={category}
          x={x}
          y={y}
          fill="white"
          fontWeight="bold"
          fontSize="8"
          textAnchor="middle"
          alignmentBaseline="middle"
          transform={`rotate(${angle}, ${x}, ${y})`}
        >
          {category}
        </text>
      );
    });
  };

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div className="relative">
        {/* Pointer */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
          <svg width="20" height="20" viewBox="0 0 20 20">
            <polygon points="10,0 0,20 20,20" fill="#ef4444" />
          </svg>
        </div>
        
        {/* Wheel */}
        <motion.div
          className="w-full aspect-square"
          animate={{ rotate: rotation }}
          transition={{
            duration: 3,
            ease: "easeOut",
          }}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Wheel segments */}
            {generateWheelSegments()}
            
            {/* Category labels */}
            {generateCategoryLabels()}
            
            {/* Center circle */}
            <circle cx="100" cy="100" r="10" fill="#1E40AF" stroke="#1E3A8A" strokeWidth="1" />
          </svg>
        </motion.div>
        
        {/* Selected category display */}
        {selectedCategory && !isSpinning && (
          <div className="mt-4 text-center">
            <p className="text-lg font-bold">Wybrana kategoria:</p>
            <p className="text-xl text-gameshow-primary">{selectedCategory}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to describe SVG arc path
function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  const d = [
    "M", x, y,
    "L", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    "Z"
  ].join(" ");

  return d;
}

// Helper function to convert polar coordinates to cartesian
function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

export default FortuneWheel;
