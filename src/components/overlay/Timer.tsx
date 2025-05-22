
import React, { useState, useEffect } from 'react';

export interface TimerProps {
  currentTime: number;
  maxTime: number;
  isPulsing?: boolean;
}

export const Timer: React.FC<TimerProps> = ({ 
  currentTime, 
  maxTime, 
  isPulsing = false 
}) => {
  const [radius] = useState(45);
  const [circumference] = useState(2 * Math.PI * radius);
  
  // Calculate stroke-dashoffset
  const strokeDashoffset = () => {
    const progress = currentTime / maxTime;
    return circumference * (1 - progress);
  };
  
  // Color based on time remaining
  const timerColor = () => {
    const percentage = currentTime / maxTime;
    if (percentage > 0.66) return 'stroke-green-500';
    if (percentage > 0.33) return 'stroke-yellow-500';
    return 'stroke-red-500';
  };
  
  return (
    <div className={`relative ${isPulsing ? 'animate-pulse' : ''}`}>
      <svg width="120" height="120" className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="transparent"
          stroke="#333"
          strokeWidth="10"
        />
        
        {/* Timer circle */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset()}
          className={timerColor()}
          strokeLinecap="round"
        />
      </svg>
      
      {/* Time display */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <span className="text-3xl font-bold text-white">{currentTime}</span>
      </div>
    </div>
  );
};

export default Timer;
