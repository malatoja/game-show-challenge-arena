
import { useState, useEffect } from 'react';
import { Player, CardType } from '@/types/gameTypes';
import { useSocket } from '@/context/SocketContext';
import { toast } from 'sonner';
import { playSound } from '@/lib/soundService';
import { SoundType } from '@/types/soundTypes';
import { SocketEvent } from '@/lib/socket/socketTypes';

export interface OverlayState {
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
  const [question, setQuestion] = useState("");
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
  
  const { on } = useSocket();
  
  useEffect(() => {
    if (demoMode) return;

    // Listen for overlay update events from the host
    on('overlay:update' as SocketEvent, (data: any) => {
      console.log('Overlay update received:', data);
      
      // Update question if provided
      if (data.question) {
        setQuestion(data.question.text);
        // Check if hint exists and set it
        if (data.question.hint) {
          setHint(data.question.hint);
        } else {
          setHint("");
        }
        setShowCategoryTable(false);
      }
      
      // Update time if provided
      if (data.timeRemaining) {
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
        playSound('hint' as SoundType);
        toast.info("Wskazówka dostępna!");
      }
    });

    // Listen for player update events
    on('players:update' as SocketEvent, (updatedPlayers: Player[]) => {
      console.log('Players update received:', updatedPlayers);
      setPlayers(updatedPlayers);
    });

    // Listen for card activation events
    on('card:activate' as SocketEvent, (data: { cardType: CardType, playerName: string }) => {
      console.log('Card activation received:', data.cardType, data.playerName);
      setActiveCardType(data.cardType);
      setActivePlayerName(data.playerName);
      setShowCardAnimation(true);
    });

    // Listen for round start events
    on('round:start' as SocketEvent, (data: { roundType: string, roundName: string }) => {
      console.log('Round start received:', data);
      setRoundTitle(data.roundName || `RUNDA ${data.roundType}`);
      setShowCategoryTable(true);
      setQuestion("");
      setHint("");
    });

  }, [demoMode, on]);

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
    setSelectedDifficulty
  };
};
