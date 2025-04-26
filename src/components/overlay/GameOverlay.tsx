
import React, { useEffect, useState } from 'react';
import { Player } from '@/types/gameTypes';
import { Timer } from './Timer';
import { PlayerCamera } from './PlayerCamera';
import { QuestionDisplay } from './QuestionDisplay';
import { CategoryTable } from './CategoryTable';
import { Logo } from './Logo';
import './overlay.css';

interface GameOverlayProps {
  roundTitle?: string;
  currentTime?: number;
  maxTime?: number;
  players?: Player[];
  question?: string;
  showCategoryTable?: boolean;
  categories?: string[];
  difficulties?: number[];
  selectedCategory?: string;
  selectedDifficulty?: number;
}

export const GameOverlay: React.FC<GameOverlayProps> = ({
  roundTitle = "RUNDA 1 – ZRÓŻNICOWANA WIEDZA",
  currentTime = 30,
  maxTime = 30,
  players = [],
  question = "",
  showCategoryTable = true,
  categories = ["MEMY", "TRENDY", "TWITCH", "INTERNET", "CIEKAWOSTKI"],
  difficulties = [10, 20, 30],
  selectedCategory = "",
  selectedDifficulty = 0,
}) => {
  const [time, setTime] = useState(currentTime);
  const [isPulsing, setIsPulsing] = useState(false);
  
  // Split players into top and bottom rows
  const topRowPlayers = players.slice(0, 5);
  const bottomRowPlayers = players.slice(5, 10);
  
  useEffect(() => {
    setTime(currentTime);
    // Set pulsing effect when timer goes below 5 seconds
    setIsPulsing(currentTime <= 5);
  }, [currentTime]);

  return (
    <div className="game-overlay">
      {/* Round Title */}
      <div className="round-title neon-text">
        {roundTitle}
      </div>
      
      {/* Logo */}
      <Logo />
      
      {/* Timer */}
      <Timer 
        currentTime={time} 
        maxTime={maxTime} 
        isPulsing={isPulsing}
      />
      
      {/* Top Row Players */}
      <div className="player-row top-row">
        {topRowPlayers.map((player, index) => (
          <PlayerCamera 
            key={player.id || index}
            player={player}
            position="top"
          />
        ))}
      </div>
      
      {/* Center Content */}
      <div className="center-content">
        {showCategoryTable ? (
          <CategoryTable 
            categories={categories}
            difficulties={difficulties}
            selectedCategory={selectedCategory}
            selectedDifficulty={selectedDifficulty}
          />
        ) : (
          <QuestionDisplay question={question} />
        )}
      </div>
      
      {/* Bottom Row Players */}
      <div className="player-row bottom-row">
        {bottomRowPlayers.map((player, index) => (
          <PlayerCamera 
            key={player.id || index}
            player={player}
            position="bottom"
          />
        ))}
      </div>
    </div>
  );
};
