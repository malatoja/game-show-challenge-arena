
import React from 'react';

interface TimerProps {
  currentTime: number;
  maxTime: number;
  isPulsing?: boolean;
}

export const Timer: React.FC<TimerProps> = ({ currentTime, maxTime, isPulsing = false }) => {
  // Calculate percentage for visual representation
  const percentage = (currentTime / maxTime) * 100;
  
  return (
    <div className={`timer ${isPulsing ? 'timer-pulsing' : ''}`}>
      <div className="timer-circle">
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
        <span className="timer-text">{currentTime}</span>
      </div>
      <style jsx>{`
        .timer {
          position: absolute;
          top: 20px;
          right: 20px;
          z-index: 10;
        }
        
        .timer-circle {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(255, 56, 100, 0.5);
        }
        
        .timer-text {
          position: absolute;
          font-size: 24px;
          font-weight: bold;
          color: white;
          text-shadow: 0 0 5px #FF3864, 0 0 10px #FF3864;
        }
        
        .timer-pulsing {
          animation: fast-pulse 0.5s infinite;
        }
      `}</style>
    </div>
  );
};
