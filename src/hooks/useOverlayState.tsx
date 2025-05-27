
import { useState, useEffect } from 'react';
import { Player, CardType, Question } from '@/types/gameTypes';
import { useSocket } from '@/context/SocketContext';
import { toast } from 'sonner';
import { playSound } from '@/lib/soundService';
import { SoundType } from '@/types/soundTypes';
import { SocketEvent } from '@/lib/socketService';

export interface OverlayState {
  roundTitle: string;
  currentTime: number;
  maxTime: number;
  question: Question | null;
  hint: string;
  showHint: boolean;
  showCategoryTable: boolean;
  timerPulsing: boolean;
  players: Player[];
  categories: string[];
  difficulties: number[];
  selectedCategory: string;
  selectedDifficulty: number;
  showCardAnimation: boolean;
  activeCardType: CardType | null;
  activePlayerName: string;
}

/**
 * Custom hook to manage the state of the overlay component
 * @param demoMode Boolean to indicate if we are in demo mode
 */
export const useOverlayState = (demoMode: boolean) => {
  // Basic state for the overlay
  const [roundTitle, setRoundTitle] = useState("RUNDA 1 – ZRÓŻNICOWANA WIEDZA");
  const [currentTime, setCurrentTime] = useState(30);
  const [maxTime, setMaxTime] = useState(30);
  const [question, setQuestion] = useState<Question | null>(null);
  const [hint, setHint] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [showCategoryTable, setShowCategoryTable] = useState(true);
  const [timerPulsing, setTimerPulsing] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  
  // Card animation state
  const [showCardAnimation, setShowCardAnimation] = useState(false);
  const [activeCardType, setActiveCardType] = useState<CardType | null>(null);
  const [activePlayerName, setActivePlayerName] = useState("");
  
  // Categories and difficulties
  const [categories, setCategories] = useState(["MEMY", "TRENDY", "TWITCH", "INTERNET", "CIEKAWOSTKI"]);
  const [difficulties, setDifficulties] = useState([10, 20, 30]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState(0);
  
  const [hostCameraUrl, setHostCameraUrl] = useState(localStorage.getItem('hostCameraUrl') || '');
  const [showHostCamera, setShowHostCamera] = useState(localStorage.getItem('hostCameraActive') === 'true');
  
  // Last received data timestamps for reconnection handling
  const [lastDataTimestamps, setLastDataTimestamps] = useState<Record<string, number>>({});
  
  const { on, connected } = useSocket();
  
  // Handle WebSocket reconnection - request current state
  useEffect(() => {
    if (connected && !demoMode) {
      // When we reconnect, request current state
      console.log('[Overlay] Connected, requesting current state');
      
      // We don't directly emit here as this could lead to a loop
      // Instead, the host should periodically broadcast state
    }
  }, [connected, demoMode]);
  
  useEffect(() => {
    if (demoMode) return;

    // Listen for overlay update events from the host
    const unsubscribeOverlayUpdate = on('overlay:update' as SocketEvent, (data: any) => {
      console.log('Overlay update received:', data);
      setLastDataTimestamps(prev => ({ ...prev, 'overlay:update': Date.now() }));
      
      // Update question if provided
      if (data.question) {
        setQuestion(data.question);
        // Check if hint exists and set it
        if (data.question.hint) {
          setHint(data.question.hint);
        } else {
          setHint("");
        }
        setShowCategoryTable(false);
      }
      
      // Update time if provided
      if (data.timeRemaining !== undefined) {
        setCurrentTime(data.timeRemaining);
        setMaxTime(data.timeRemaining);
      }
      
      // Update category if provided
      if (data.category) {
        setSelectedCategory(data.category);
      }
      
      // Update difficulty if provided
      if (data.difficulty) {
        setSelectedDifficulty(data.difficulty);
      }
      
      // Show hint if provided
      if (data.showHint) {
        setShowHint(true);
        playSound('hint');
        toast.info("Wskazówka dostępna!");
      }
      
      // Update camera settings if provided
      if (data.hostCamera !== undefined) {
        setShowHostCamera(data.hostCamera.active);
        if (data.hostCamera.url) {
          setHostCameraUrl(data.hostCamera.url);
        }
      }
      
      // Handle timer animation
      if (data.animateTimer) {
        setTimerPulsing(true);
        setTimeout(() => setTimerPulsing(false), 3000);
      }
    });

    // Listen for player update events
    const unsubscribePlayersUpdate = on('players:update' as SocketEvent, (updatedPlayers: any) => {
      console.log('Players update received:', updatedPlayers);
      setLastDataTimestamps(prev => ({ ...prev, 'players:update': Date.now() }));
      setPlayers(updatedPlayers);
    });

    // Listen for card activation events
    const unsubscribeCardActivate = on('card:use' as SocketEvent, (data: any) => {
      if (data && data.cardType && data.playerId) {
        const playerName = players.find(p => p.id === data.playerId)?.name || 'Unknown';
        console.log('Card activation received:', data.cardType, playerName);
        setLastDataTimestamps(prev => ({ ...prev, 'card:activate': Date.now() }));
        setActiveCardType(data.cardType as CardType);
        setActivePlayerName(playerName);
        setShowCardAnimation(true);
        playSound('card-activate');
      }
    });

    // Listen for round start events
    const unsubscribeRoundStart = on('round:start' as SocketEvent, (data: any) => {
      console.log('Round start received:', data);
      setLastDataTimestamps(prev => ({ ...prev, 'round:start': Date.now() }));
      if (data.roundName) {
        setRoundTitle(data.roundName);
      } else if (data.roundType) {
        setRoundTitle(`RUNDA ${data.roundType.toUpperCase()}`);
      }
      setShowCategoryTable(true);
      setQuestion(null);
      setHint("");
      playSound('round-start');
    });

    return () => {
      unsubscribeOverlayUpdate();
      unsubscribePlayersUpdate();
      unsubscribeCardActivate();
      unsubscribeRoundStart();
    };
  }, [demoMode, on, players]);

  return {
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
    showCardAnimation,
    activeCardType,
    activePlayerName,
    setRoundTitle,
    setCurrentTime,
    setTimerPulsing,
    setPlayers,
    setShowCardAnimation,
    setActiveCardType,
    setShowCategoryTable,
    setQuestion,
    setHint,
    setShowHint,
    setSelectedCategory,
    setSelectedDifficulty,
    hostCameraUrl,
    showHostCamera,
    setHostCameraUrl,
    setShowHostCamera,
    lastDataTimestamps
  };
};
