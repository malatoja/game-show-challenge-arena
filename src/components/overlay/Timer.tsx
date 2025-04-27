
import React from 'react';

interface TimerProps {
  currentTime: number;
  maxTime: number;
  isPulsing?: boolean;
}

export const Timer: React.FC<TimerProps> = ({ currentTime, maxTime, isPulsing = false }) => {
  const percentage = (currentTime / maxTime) * 100;
  
  return (
    <div className={`absolute top-5 right-5 z-10 ${isPulsing ? 'animate-timer-pulse' : ''}`}>
      <div className="relative flex justify-center items-center w-20 h-20">
        <svg width="80" height="80" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="transparent"
            stroke="#333"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="transparent"
            stroke="#FF3864"
            strokeWidth="8"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - percentage / 100)}`}
            transform="rotate(-90 50 50)"
          />
        </svg>
        <span className="absolute text-2xl font-bold text-white text-shadow-neon">
          {currentTime}
        </span>
      </div>
    </div>
  );
};
