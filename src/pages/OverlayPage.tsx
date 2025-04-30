
import React, { useState } from 'react';
import { GameOverlay } from '@/components/overlay/GameOverlay';
import { useSocket } from '@/context/SocketContext';
import CardActivationAnimation from '@/components/animations/CardActivationAnimation';
import { useOverlayState } from '@/hooks/useOverlayState';
import { useDemoModeEffects } from '@/hooks/useDemoModeEffects';
import { DebugControls } from '@/components/overlay/DebugControls';

const OverlayPage = () => {
  // Demo mode for testing without WebSocket
  const [demoMode, setDemoMode] = useState(import.meta.env.DEV);
  const { connected, mockMode } = useSocket();
  
  // Use our custom hook to manage overlay state
  const {
    roundTitle,
    currentTime,
    question,
    showCategoryTable,
    timerPulsing,
    players,
    showCardAnimation,
    activeCardType,
    activePlayerName,
    categories,
    difficulties,
    selectedCategory,
    selectedDifficulty,
    setCurrentTime,
    setTimerPulsing,
    setPlayers,
    setShowCardAnimation,
    setActiveCardType,
    setShowCategoryTable,
    setQuestion,
    setSelectedCategory,
    setSelectedDifficulty
  } = useOverlayState(demoMode);
  
  // Set up demo mode effects
  useDemoModeEffects(
    demoMode,
    setCurrentTime,
    setTimerPulsing,
    setPlayers,
    setSelectedCategory,
    setSelectedDifficulty,
    setShowCategoryTable,
    setQuestion,
    categories,
    difficulties
  );

  // Handle toggling demo mode
  const handleToggleDemoMode = () => {
    setDemoMode(prev => !prev);
  };
  
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Card Activation Animation */}
      <CardActivationAnimation 
        cardType={activeCardType} 
        show={showCardAnimation} 
        playerName={activePlayerName}
        onComplete={() => setShowCardAnimation(false)}
      />
      
      <GameOverlay 
        roundTitle={roundTitle}
        currentTime={currentTime}
        maxTime={30}
        players={players}
        question={question}
        showCategoryTable={showCategoryTable}
        categories={categories}
        difficulties={difficulties}
        selectedCategory={selectedCategory}
        selectedDifficulty={selectedDifficulty}
        timerPulsing={timerPulsing}
      />
      
      {/* Debug controls - only visible during development */}
      <DebugControls 
        demoMode={demoMode}
        connected={connected}
        mockMode={mockMode}
        onToggleDemoMode={handleToggleDemoMode}
      />
    </div>
  );
};

export default OverlayPage;
