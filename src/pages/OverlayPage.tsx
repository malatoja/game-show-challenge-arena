
import React, { useState } from 'react';
import { GameOverlay } from '@/components/overlay/GameOverlay';
import CardEffectOverlay from '@/components/animations/CardEffectOverlay';
import { DebugControls } from '@/components/overlay/DebugControls';
import ConnectionAlert from '@/components/overlay/ConnectionAlert';
import { useOverlayState } from '@/hooks/useOverlayState';
import { useDemoModeEffects } from '@/hooks/useDemoModeEffects';
import { useBroadcastBarState } from '@/hooks/useBroadcastBarState';
import { useConnectionManager } from '@/hooks/useConnectionManager';

const OverlayPage = () => {
  const [demoMode, setDemoMode] = useState(import.meta.env.DEV);
  
  // Connection management
  const connectionManager = useConnectionManager(demoMode);
  
  // Overlay state management
  const overlayState = useOverlayState(demoMode);
  
  // Broadcast bar state
  const broadcastBarState = useBroadcastBarState(demoMode);
  
  // Demo mode effects
  useDemoModeEffects(
    demoMode,
    overlayState.setCurrentTime,
    overlayState.setTimerPulsing,
    overlayState.setPlayers,
    overlayState.setSelectedCategory,
    overlayState.setSelectedDifficulty,
    overlayState.setShowCategoryTable,
    overlayState.setQuestion,
    overlayState.categories,
    overlayState.difficulties
  );

  const handleToggleDemoMode = () => {
    setDemoMode(prev => !prev);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden'}}>
      {/* Connection error alert */}
      {connectionManager.showConnectionAlert && (
        <ConnectionAlert
          lastError={connectionManager.lastError}
          autoReconnectEnabled={connectionManager.autoReconnectEnabled}
          onReconnect={connectionManager.handleReconnect}
          onToggleAutoReconnect={connectionManager.handleToggleAutoReconnect}
          onDismiss={connectionManager.handleDismissAlert}
        />
      )}
      
      {/* Card Activation Animation */}
      <CardEffectOverlay 
        cardType={overlayState.activeCardType} 
        show={overlayState.showCardAnimation} 
        playerName={overlayState.activePlayerName}
        onComplete={() => overlayState.setShowCardAnimation(false)}
      />
      
      <GameOverlay 
        roundTitle={overlayState.roundTitle}
        currentTime={overlayState.currentTime}
        maxTime={30}
        players={overlayState.players}
        question={overlayState.question}
        hint={overlayState.hint}
        showHint={overlayState.showHint}
        showCategoryTable={overlayState.showCategoryTable}
        categories={overlayState.categories}
        difficulties={overlayState.difficulties}
        selectedCategory={overlayState.selectedCategory}
        selectedDifficulty={overlayState.selectedDifficulty}
        timerPulsing={overlayState.timerPulsing}
        hostCameraUrl={overlayState.hostCameraUrl}
        showHostCamera={overlayState.showHostCamera}
        {...broadcastBarState}
      />
      
      {/* Debug controls - only visible during development */}
      <DebugControls 
        demoMode={demoMode}
        connected={connectionManager.connected}
        mockMode={false}
        onToggleDemoMode={handleToggleDemoMode}
      />
    </div>
  );
};

export default OverlayPage;
