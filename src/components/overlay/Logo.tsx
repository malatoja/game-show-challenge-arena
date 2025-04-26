
import React from 'react';

export const Logo: React.FC = () => {
  return (
    <div className="game-logo">
      <div className="logo-text">GS</div>
      <style jsx>{`
        .game-logo {
          position: absolute;
          top: 20px;
          left: 20px;
          width: 50px;
          height: 50px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          border: 2px solid #9D4EDD;
          box-shadow: 0 0 10px #9D4EDD, 0 0 20px rgba(157, 78, 221, 0.5);
          animation: pulse 2s infinite;
          z-index: 10;
        }
        
        .logo-text {
          font-size: 20px;
          font-weight: bold;
          color: white;
          text-shadow: 0 0 5px #9D4EDD, 0 0 10px #9D4EDD;
        }
      `}</style>
    </div>
  );
};
