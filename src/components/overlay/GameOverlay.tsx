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
  hint?: string;
  showHint?: boolean;
  showCategoryTable?: boolean;
  categories?: string[];
  difficulties?: number[];
  selectedCategory?: string;
  selectedDifficulty?: number;
  timerPulsing?: boolean;
  hostCameraUrl?: string;
  showHostCamera?: boolean;
}

export const GameOverlay: React.FC<GameOverlayProps> = ({
  roundTitle = "RUNDA 1 – ZRÓŻNICOWANA WIEDZA",
  currentTime = 30,
  maxTime = 30,
  players = [],
  question = "",
  hint = "",
  showHint = false,
  showCategoryTable = true,
  categories = ["MEMY", "TRENDY", "TWITCH", "INTERNET", "CIEKAWOSTKI"],
  difficulties = [10, 20, 30],
  selectedCategory = "",
  selectedDifficulty = 0,
  timerPulsing = false,
  hostCameraUrl = "",
  showHostCamera = false,
}) => {
  const [time, setTime] = useState(currentTime);
  
  // Split players into top and bottom rows
  const topRowPlayers = players.slice(0, 5);
  const bottomRowPlayers = players.slice(5, 10);
  
  useEffect(() => {
    setTime(currentTime);
  }, [currentTime]);

  // Check for host camera settings from localStorage
  useEffect(() => {
    const storedHostCamera = localStorage.getItem('hostCameraUrl');
    const storedHostCameraActive = localStorage.getItem('hostCameraActive');
    
    if (storedHostCamera && storedHostCameraActive === 'true') {
      // Set host camera URL and activate it in the overlay
      // (This would be implemented in the actual render components)
    }
  }, []);

  // Check for player camera settings from localStorage
  useEffect(() => {
    const storedPlayerCameras = localStorage.getItem('playerCameras');
    
    if (storedPlayerCameras) {
      try {
        const camerasConfig = JSON.parse(storedPlayerCameras);
        // Here you would update the player camera sources
        // This would integrate with the PlayerCamera component
      } catch (error) {
        console.error('Error parsing player cameras:', error);
      }
    }
  }, []);

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
        isPulsing={timerPulsing}
      />
      
      {/* Host Camera (if active) */}
      {showHostCamera && hostCameraUrl && (
        <div className="host-camera">
          <iframe 
            src={hostCameraUrl}
            title="Host Camera"
            className="host-camera-frame"
            allow="camera; microphone; fullscreen; display-capture; autoplay"
          />
        </div>
      )}
      
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
          <QuestionDisplay 
            question={question} 
            hint={hint}
            showHint={showHint}
          />
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
