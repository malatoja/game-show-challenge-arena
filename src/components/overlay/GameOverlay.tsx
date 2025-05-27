
import React, { useEffect, useState } from 'react';
import { useGame } from '@/context/GameContext';
import { useSocket } from '@/context/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';
import PlayerCameraGrid from './components/PlayerCameraGrid';
import QuestionDisplay from './components/QuestionDisplay';
import HostCamera from './components/HostCamera';
import CategoryTable from './components/CategoryTable';
import FortuneWheel from './components/FortuneWheel';
import { RoundType } from '@/types/gameTypes';

export function GameOverlay() {
  const { state } = useGame();
  const { connected } = useSocket();
  const [currentLayout, setCurrentLayout] = useState<RoundType>('knowledge');
  const [timeRemaining, setTimeRemaining] = useState(30);

  useEffect(() => {
    if (state.currentRound) {
      setCurrentLayout(state.currentRound);
    }
  }, [state.currentRound]);

  // Use timeRemaining from state if available, otherwise use local state
  const displayTime = state.timeRemaining !== undefined ? state.timeRemaining : timeRemaining;

  const activePlayers = state.players.filter(p => !p.eliminated);
  const topPlayers = activePlayers.slice(0, Math.ceil(activePlayers.length / 2));
  const bottomPlayers = activePlayers.slice(Math.ceil(activePlayers.length / 2));

  return (
    <div className="w-full h-screen bg-gradient-to-b from-gameshow-background to-gameshow-background/80 relative overflow-hidden">
      {/* Connection status indicator */}
      <div className={`absolute top-4 right-4 z-50 px-3 py-1 rounded-full text-sm font-medium ${
        connected ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
      }`}>
        {connected ? 'LIVE' : 'OFFLINE'}
      </div>

      {/* Layout based on current round */}
      <div className="h-full flex flex-col">
        {/* Top player row - 360px height */}
        <div className="h-[360px] flex justify-center items-center p-4">
          <PlayerCameraGrid 
            players={topPlayers}
            isTopRow={true}
          />
        </div>

        {/* Middle section - Host, Question, Category/Wheel - 360px height */}
        <div className="h-[360px] flex items-center p-4">
          {/* Host camera - left side */}
          <div className="w-[384px] h-full">
            <HostCamera />
          </div>

          {/* Center content - Question display */}
          <div className="flex-1 h-full mx-4">
            <QuestionDisplay 
              question={state.currentQuestion}
              round={currentLayout}
            />
          </div>

          {/* Right side - Category table or Fortune Wheel */}
          <div className="w-[384px] h-full">
            <AnimatePresence mode="wait">
              {currentLayout === 'wheel' ? (
                <motion.div
                  key="wheel"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="h-full"
                >
                  <FortuneWheel 
                    spinning={state.wheelSpinning}
                    selectedCategory={state.selectedCategory}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="categories"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  className="h-full"
                >
                  <CategoryTable round={currentLayout} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom player row - 360px height */}
        <div className="h-[360px] flex justify-center items-center p-4">
          <PlayerCameraGrid 
            players={bottomPlayers}
            isTopRow={false}
          />
        </div>
      </div>

      {/* Overlay effects and animations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Round indicator */}
        <div className="absolute top-8 left-8 bg-gameshow-primary/20 backdrop-blur-sm px-4 py-2 rounded-lg">
          <span className="text-gameshow-text font-bold">
            RUNDA {currentLayout === 'knowledge' ? '1' : currentLayout === 'speed' ? '2' : '3'}
          </span>
        </div>

        {/* Timer display (if active) */}
        {displayTime && displayTime > 0 && (
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
            <motion.div
              className="bg-red-500/20 backdrop-blur-sm px-6 py-3 rounded-lg border border-red-500"
              animate={{ scale: displayTime <= 5 ? [1, 1.1, 1] : 1 }}
              transition={{ duration: 0.5, repeat: displayTime <= 5 ? Infinity : 0 }}
            >
              <span className="text-red-400 font-bold text-2xl">
                {Math.ceil(displayTime)}
              </span>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

export default GameOverlay;
