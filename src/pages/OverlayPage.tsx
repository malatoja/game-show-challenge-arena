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
import { SocketEvent } from '@/lib/socketService';

const OverlayPage = () => {
  // Demo mode for testing without WebSocket
  const [demoMode, setDemoMode] = useState(import.meta.env.DEV);
  const { connected, mockMode, setMockMode, connect, reconnect, lastError, on } = useSocket();
  const [showConnectionAlert, setShowConnectionAlert] = useState(false);
  const [alertDismissed, setAlertDismissed] = useState(false);
  const [autoReconnectEnabled, setAutoReconnectEnabled] = useState(true);
  const [autoReconnectInterval, setAutoReconnectInterval] = useState<NodeJS.Timeout | null>(null);
  
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
    hostCameraUrl,
    showHostCamera,
    setCurrentTime,
    setTimerPulsing,
    setPlayers,
    setShowCardAnimation,
    setActiveCardType,
    setShowCategoryTable,
    setQuestion,
    setSelectedCategory,
    setSelectedDifficulty,
    setShowHostCamera
  } = useOverlayState(demoMode);
  
  // Add broadcast bar state
  const [broadcastBarText, setBroadcastBarText] = useState('Witamy w Quiz Show! Trwa runda wiedzy');
  const [broadcastBarEnabled, setBroadcastBarEnabled] = useState(true);
  const [broadcastBarPosition, setBroadcastBarPosition] = useState<'top' | 'bottom'>('bottom');
  const [broadcastBarColor, setBroadcastBarColor] = useState('#000000');
  const [broadcastBarTextColor, setBroadcastBarTextColor] = useState('#ffffff');
  const [broadcastBarAnimation, setBroadcastBarAnimation] = useState<'slide' | 'fade' | 'static'>('slide');
  const [broadcastBarSpeed, setBroadcastBarSpeed] = useState(5);
  
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
  
  // Auto-reconnect system
  useEffect(() => {
    // Clear any existing interval when component mounts or connection status changes
    if (autoReconnectInterval) {
      clearInterval(autoReconnectInterval);
      setAutoReconnectInterval(null);
    }
    
    // If we're not connected and auto-reconnect is enabled, start the interval
    if (!connected && !mockMode && !demoMode && autoReconnectEnabled) {
      const interval = setInterval(() => {
        console.log('[Overlay] Attempting auto-reconnect...');
        reconnect();
        toast.info('Próba automatycznego ponownego połączenia...');
      }, 30000); // Try every 30 seconds
      
      setAutoReconnectInterval(interval);
    }
    
    return () => {
      if (autoReconnectInterval) {
        clearInterval(autoReconnectInterval);
      }
    };
  }, [connected, mockMode, demoMode, autoReconnectEnabled, reconnect]);
  
  // Show connection alert when not in demo mode, not connected, and alert not dismissed
  useEffect(() => {
    if (!demoMode && !connected && !alertDismissed) {
      setShowConnectionAlert(true);
    } else {
      setShowConnectionAlert(false);
    }
    
    // If we reconnect successfully, reset the dismissed state
    if (connected) {
      setAlertDismissed(false);
    }
  }, [demoMode, connected, alertDismissed]);
  
  // Handle manual reconnection
  const handleReconnect = () => {
    toast.info('Próba ponownego połączenia...');
    reconnect();
  };
  
  // Handle dismissing alert
  const handleDismissAlert = () => {
    setAlertDismissed(true);
    setShowConnectionAlert(false);
  };
  
  // Toggle auto-reconnect
  const handleToggleAutoReconnect = () => {
    setAutoReconnectEnabled(prev => !prev);
    toast.info(autoReconnectEnabled 
      ? 'Auto-reconnect wyłączony' 
      : 'Auto-reconnect włączony - system będzie próbował połączyć się automatycznie co 30 sekund');
  };
  
  // Load broadcast bar settings from storage
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('infoBarSettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setBroadcastBarEnabled(settings.enabled ?? true);
        setBroadcastBarText(settings.text || broadcastBarText);
        setBroadcastBarAnimation(settings.animation || 'slide');
        setBroadcastBarSpeed(settings.scrollSpeed || 5);
        setBroadcastBarPosition(settings.position || 'bottom');
        setBroadcastBarColor(settings.backgroundColor || '#000000');
        setBroadcastBarTextColor(settings.textColor || '#ffffff');
      }
    } catch (error) {
      console.error('Error loading broadcast bar settings:', error);
    }
  }, []);
  
  // Listen for broadcast bar updates
  useEffect(() => {
    if (demoMode) return;

    const unsubscribe = on('infoBar:update' as SocketEvent, (data: any) => {
      console.log('InfoBar update received:', data);
      
      if (data.text !== undefined) {
        setBroadcastBarText(data.text);
      }
      
      if (data.enabled !== undefined) {
        setBroadcastBarEnabled(data.enabled);
      }
      
      if (data.position !== undefined) {
        setBroadcastBarPosition(data.position);
      }
      
      if (data.backgroundColor !== undefined) {
        setBroadcastBarColor(data.backgroundColor);
      }
      
      if (data.textColor !== undefined) {
        setBroadcastBarTextColor(data.textColor);
      }
      
      if (data.animation !== undefined) {
        setBroadcastBarAnimation(data.animation);
      }
      
      if (data.speed !== undefined) {
        setBroadcastBarSpeed(data.speed);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [demoMode, on]);

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
              <div className="flex space-x-2">
                <Button 
                  variant={autoReconnectEnabled ? "secondary" : "outline"}
                  size="sm" 
                  onClick={() => setAutoReconnectEnabled(prev => !prev)}
                >
                  {autoReconnectEnabled ? 'Auto-reconnect: Włączony' : 'Auto-reconnect: Wyłączony'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={reconnect}
                  className="flex items-center gap-1"
                >
                  <RefreshCw className="h-3 w-3" /> Połącz ponownie
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAlertDismissed(true)}
                >
                  Zamknij
                </Button>
              </div>
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
        hostCameraUrl={hostCameraUrl}
        showHostCamera={showHostCamera}
        broadcastBarText={broadcastBarText}
        broadcastBarEnabled={broadcastBarEnabled}
        broadcastBarPosition={broadcastBarPosition}
        broadcastBarColor={broadcastBarColor}
        broadcastBarTextColor={broadcastBarTextColor}
        broadcastBarAnimation={broadcastBarAnimation}
        broadcastBarSpeed={broadcastBarSpeed}
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
