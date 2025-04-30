
import { useState, useEffect } from 'react';
import { Player, CardType } from '@/types/gameTypes';
import { useSocket } from '@/context/SocketContext';
import { soundService } from '@/lib/soundService';

export const useOverlayState = (demoMode: boolean) => {
  const [roundTitle, setRoundTitle] = useState("RUNDA 1 – ZRÓŻNICOWANA WIEDZA");
  const [currentTime, setCurrentTime] = useState(30);
  const [question, setQuestion] = useState("");
  const [hint, setHint] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [showCategoryTable, setShowCategoryTable] = useState(true);
  const [timerPulsing, setTimerPulsing] = useState(false);
  const [players, setPlayers] = useState<Player[]>([
    { id: "1", name: "Gracz 1", lives: 100, points: 0, cards: [], isActive: true, eliminated: false },
    { id: "2", name: "Gracz 2", lives: 80, points: 0, cards: [], isActive: false, eliminated: false },
    { id: "3", name: "Gracz 3", lives: 60, points: 0, cards: [], isActive: false, eliminated: false },
    { id: "4", name: "Gracz 4", lives: 40, points: 0, cards: [], isActive: false, eliminated: false },
    { id: "5", name: "Gracz 5", lives: 20, points: 0, cards: [], isActive: false, eliminated: false },
    { id: "6", name: "Gracz 6", lives: 90, points: 0, cards: [], isActive: false, eliminated: false },
    { id: "7", name: "Gracz 7", lives: 70, points: 0, cards: [], isActive: false, eliminated: false },
    { id: "8", name: "Gracz 8", lives: 50, points: 0, cards: [], isActive: false, eliminated: false },
    { id: "9", name: "Gracz 9", lives: 30, points: 0, cards: [], isActive: false, eliminated: false },
    { id: "10", name: "Gracz 10", lives: 10, points: 0, cards: [], isActive: false, eliminated: false },
  ]);
  
  // Animation states
  const [showCardAnimation, setShowCardAnimation] = useState(false);
  const [activeCardType, setActiveCardType] = useState<CardType | null>(null);
  const [activePlayerName, setActivePlayerName] = useState<string | undefined>(undefined);
  
  // Categories and difficulties for the game
  const categories = ["MEMY", "TRENDY", "TWITCH", "INTERNET", "CIEKAWOSTKI"];
  const difficulties = [10, 20, 30];
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState(0);

  // Socket connection status and mock mode
  const { on, connected, mockMode } = useSocket();

  useEffect(() => {
    if (!demoMode) {
      // Listen for round updates
      const unsubRound = on('round:start', (data) => {
        setRoundTitle(data.roundName);
        soundService.play('start_round');
      });
      
      // Listen for question updates
      const unsubQuestion = on('question:show', (data) => {
        setQuestion(data.question.text);
        setHint(data.question.hint || "");
        setShowHint(false); // Initially hide hint
        setShowCategoryTable(false);
        soundService.play('question_show');
      });
      
      // Listen for timer updates
      const unsubTimer = on('overlay:update', (data) => {
        if (data.timeRemaining !== undefined) {
          setCurrentTime(data.timeRemaining);
          setTimerPulsing(data.timeRemaining <= 5);
          
          if (data.timeRemaining <= 5 && data.timeRemaining > 0) {
            soundService.play('timer');
          }
        }
        
        if (data.question) {
          setQuestion(data.question.text);
          setHint(data.question.hint || "");
          setShowCategoryTable(false);
          soundService.play('question_show');
        }
        
        if (data.showHint) {
          setShowHint(true);
          soundService.play('hint');
        }
        
        if (data.category) {
          setSelectedCategory(data.category);
          if (data.difficulty) {
            setSelectedDifficulty(data.difficulty);
          }
        }
      });
      
      // Listen for player updates
      const unsubPlayer = on('player:update', (data) => {
        setPlayers(prevState => {
          // First capture the current state for our later comparison
          const currentPlayers = prevState;
          
          // Find the player to update
          const playerIndex = currentPlayers.findIndex(p => p.id === data.player.id);
          if (playerIndex === -1) return currentPlayers; // Player not found
          
          // Create a new array with the updated player
          const updatedPlayers = [...currentPlayers];
          updatedPlayers[playerIndex] = data.player;
          
          return updatedPlayers;
        });
      });
      
      // Listen for active player updates
      const unsubActivePlayer = on('player:active', (data) => {
        setPlayers(prevState => {
          // First capture the current state for our later comparison
          const currentPlayers = prevState;
          
          // Update the players
          const updatedPlayers = currentPlayers.map(player => ({
            ...player,
            isActive: player.id === data.playerId
          }));
          
          // Check if this player's 'isActive' status changed
          const wasNotActive = !currentPlayers.find((p: Player) => p.id === data.playerId)?.isActive;
          if (wasNotActive) {
            soundService.play('buzzer');
          }
          
          return updatedPlayers;
        });
      });
      
      // Listen for player elimination
      const unsubEliminate = on('player:eliminate', (data) => {
        setPlayers(prevState => {
          const updatedPlayers = prevState.map(player => 
            player.id === data.playerId 
              ? { ...player, eliminated: true } 
              : player
          );
          
          // Find player name for animation/sound effect
          const eliminatedPlayer = prevState.find(p => p.id === data.playerId);
          if (eliminatedPlayer) {
            // Play elimination sound
            soundService.play('wrong');
          }
          
          return updatedPlayers;
        });
      });
      
      // Listen for confetti animation
      const unsubConfetti = on('overlay:confetti', (data) => {
        // Here you would trigger the confetti animation for the winner
        soundService.play('winner');
        // Mark winner in players array
        setPlayers(prevState => {
          return prevState.map(player => ({
            ...player,
            isActive: player.id === data.playerId
          }));
        });
      });
      
      // Listen for card usage
      const unsubCardUse = on('card:use', (data) => {
        // Find the player who used the card
        const player = players.find(p => p.id === data.playerId);
        
        if (player) {
          setActivePlayerName(player.name);
          setActiveCardType(data.cardType);
          setShowCardAnimation(true);
          
          // Handle specific card effects
          if (data.cardType === 'oswiecenie') {
            setShowHint(true);
          }
          
          // Auto-hide card animation after 3 seconds
          setTimeout(() => {
            setShowCardAnimation(false);
            setActiveCardType(null);
          }, 3000);
        }
        
        // Play card use sound
        soundService.play('card_use');
      });
      
      return () => {
        // Clean up all listeners when component unmounts
        unsubRound();
        unsubQuestion();
        unsubTimer();
        unsubPlayer();
        unsubActivePlayer();
        unsubEliminate();
        unsubConfetti();
        unsubCardUse();
      };
    } else {
      // Demo mode events are handled in useDemoModeEffects
      return () => {};
    }
  }, [demoMode, on, players]);

  return {
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
    setActivePlayerName,
    setShowCategoryTable,
    setQuestion,
    setHint,
    setShowHint,
    setSelectedCategory,
    setSelectedDifficulty
  };
};
