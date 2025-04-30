
import React, { useState, useEffect } from 'react';
import { GameOverlay } from '@/components/overlay/GameOverlay';
import { useSocket } from '@/context/SocketContext';
import CardEffectOverlay from '@/components/animations/CardEffectOverlay';
import { useOverlayState } from '@/hooks/useOverlayState';
import { useDemoModeEffects } from '@/hooks/useDemoModeEffects';
import { DebugControls } from '@/components/overlay/DebugControls';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const OverlayPage = () => {
  // Demo mode for testing without WebSocket
  const [demoMode, setDemoMode] = useState(import.meta.env.DEV);
  const { connected, mockMode, setMockMode, connect, reconnect, lastError } = useSocket();
  const [showConnectionAlert, setShowConnectionAlert] = useState(false);
  
  // Use our custom hook to manage overlay state
  const {
    roundTitle,
    currentTime,
    question,
    hint,
    showHint,
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
  
  // Initialize socket connection based on demo mode
  useEffect(() => {
    if (!demoMode) {
      setMockMode(false);
      connect();
      toast.success('Tryb Live: Łączenie z serwerem Socket.IO');
    } else {
      setMockMode(true);
      toast.info('Tryb Demo: Używanie symulowanych danych');
    }
  }, [demoMode, setMockMode, connect]);
  
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
  
  // Show connection alert when not in demo mode and not connected
  useEffect(() => {
    if (!demoMode && !connected) {
      setShowConnectionAlert(true);
    } else {
      setShowConnectionAlert(false);
    }
  }, [demoMode, connected]);
  
  // Handle manual reconnection
  const handleReconnect = () => {
    toast.info('Próba ponownego połączenia...');
    reconnect();
  };
  
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden'}}>
      {/* Connection error alert */}
      {showConnectionAlert && (
        <div className="absolute top-0 left-0 right-0 z-50 p-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>
                Problem z połączeniem WebSocket: {lastError || 'Nie można połączyć się z serwerem'}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleReconnect}
                className="ml-2 flex items-center gap-1"
              >
                <RefreshCw className="h-3 w-3" /> Połącz ponownie
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      )}
      
      {/* Card Activation Animation */}
      <CardEffectOverlay 
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
        hint={hint}
        showHint={showHint}
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
