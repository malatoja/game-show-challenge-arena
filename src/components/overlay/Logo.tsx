
import React from 'react';

export const Logo: React.FC = () => {
  return (
    <div className="absolute top-5 left-5 w-12 h-12 flex justify-center items-center bg-black/50 rounded-full border-2 border-neon-purple animate-pulse-logo">
      <div className="text-lg font-bold text-white text-shadow-neon">GS</div>
    </div>
  );
};
