
import React from 'react';
import { Player } from '@/types/gameTypes';
import { CategoryTable } from './CategoryTable';
import QuestionPanel from './QuestionPanel';
import { Timer } from './Timer';
import HostCamera from './HostCamera';
import { CardAnimation } from '@/components/animations/CardEffectOverlay';
import BroadcastBar from './BroadcastBar';

interface GameOverlayProps {
  roundTitle: string;
  currentTime: number;
  maxTime: number;
  question: string;
  hint: string;
  showHint: boolean;
  showCategoryTable: boolean;
  timerPulsing: boolean;
  players: Player[];
  categories: string[];
  difficulties: number[];
  selectedCategory: string;
  selectedDifficulty: number;
  hostCameraUrl: string;
  showHostCamera: boolean;
  broadcastBarText?: string;
  broadcastBarEnabled?: boolean;
  broadcastBarPosition?: 'top' | 'bottom';
  broadcastBarColor?: string;
  broadcastBarTextColor?: string;
  broadcastBarAnimation?: 'slide' | 'fade' | 'static';
  broadcastBarSpeed?: number;
}

export const GameOverlay: React.FC<GameOverlayProps> = ({
  roundTitle,
  currentTime,
  maxTime,
  question,
  hint,
  showHint,
  showCategoryTable,
  timerPulsing,
  players,
  categories,
  difficulties,
  selectedCategory,
  selectedDifficulty,
  hostCameraUrl,
  showHostCamera,
  broadcastBarText = 'Witamy w Quiz Show! Trwa runda wiedzy',
  broadcastBarEnabled = true,
  broadcastBarPosition = 'bottom',
  broadcastBarColor = '#000000',
  broadcastBarTextColor = '#ffffff',
  broadcastBarAnimation = 'slide',
  broadcastBarSpeed = 5
}) => {
  return (
    <div className="game-overlay">
      {/* Round Title */}
      <div className="absolute top-4 left-4 text-4xl font-bold text-white drop-shadow-lg">
        {roundTitle}
      </div>
      
      {/* Timer */}
      <div className="absolute top-4 right-4">
        <Timer 
          currentTime={currentTime} 
          maxTime={maxTime} 
          isPulsing={timerPulsing} 
        />
      </div>
      
      {/* Players List */}
      <div className="absolute bottom-4 left-4 text-white drop-shadow-lg">
        <div className="flex items-center space-x-4">
          {players.map((player) => (
            <div key={player.id} className="flex items-center">
              <img
                src={player.avatarUrl || '/avatars/player-1.png'}
                alt={player.name}
                className="w-10 h-10 rounded-full mr-2"
              />
              <div>
                <div className="font-bold">{player.name}</div>
                <div>
                  {player.points} pkt | {player.lives} życia
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Question Area */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full px-8">
        {showCategoryTable ? (
          <CategoryTable 
            categories={categories}
            difficulties={difficulties}
            selectedCategory={selectedCategory}
            selectedDifficulty={selectedDifficulty}
          />
        ) : (
          <QuestionPanel question={question} hint={hint} showHint={showHint} />
        )}
      </div>
      
      {/* Host Camera */}
      {showHostCamera && (
        <div className="absolute bottom-4 right-4 w-64 h-48 rounded-md overflow-hidden shadow-lg">
          <HostCamera url={hostCameraUrl} />
        </div>
      )}
      
      {/* Add BroadcastBar at the end */}
      {broadcastBarEnabled && (
        <BroadcastBar 
          text={broadcastBarText}
          backgroundColor={broadcastBarColor}
          textColor={broadcastBarTextColor}
          animation={broadcastBarAnimation}
          scrollSpeed={broadcastBarSpeed}
          position={broadcastBarPosition}
        />
      )}
    </div>
  );
};

export default GameOverlay;
