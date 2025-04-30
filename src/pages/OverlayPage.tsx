
import React, { useEffect, useState } from 'react';
import { GameOverlay } from '@/components/overlay/GameOverlay';
import { Player } from '@/types/gameTypes';
import { useSocket } from '@/context/SocketContext';
import { soundService } from '@/lib/soundService';

const OverlayPage = () => {
  const [roundTitle, setRoundTitle] = useState("RUNDA 1 – ZRÓŻNICOWANA WIEDZA");
  const [currentTime, setCurrentTime] = useState(30);
  const [question, setQuestion] = useState("");
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
  
  // Categories and difficulties for the game
  const categories = ["MEMY", "TRENDY", "TWITCH", "INTERNET", "CIEKAWOSTKI"];
  const difficulties = [10, 20, 30];
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState(0);

  // Socket connection status and mock mode
  const { on, connected, mockMode } = useSocket();
  
  // Demo mode for testing without WebSocket
  const [demoMode, setDemoMode] = useState(import.meta.env.DEV);
  
  useEffect(() => {
    // Use socket events when not in demo mode
    if (!demoMode) {
      // Listen for round updates
      const unsubRound = on('round:start', (data) => {
        setRoundTitle(data.roundName);
        soundService.play('start_round');
      });
      
      // Listen for question updates
      const unsubQuestion = on('question:show', (data) => {
        setQuestion(data.question.text);
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
          setShowCategoryTable(false);
          soundService.play('question_show');
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
            soundService.playSound('buzzer');
          }
          
          return updatedPlayers;
        });
      });
      
      // Listen for player elimination
      const unsubEliminate = on('player:eliminate', (data) => {
        setPlayers(prevState => {
          return prevState.map(player => 
            player.id === data.playerId 
              ? { ...player, eliminated: true } 
              : player
          );
        });
        soundService.playSound('wrong');
      });
      
      // Listen for confetti animation
      const unsubConfetti = on('overlay:confetti', (data) => {
        // Here you would trigger the confetti animation for the winner
        soundService.playSound('winner');
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
        // Here you would trigger the card animation
        soundService.playSound('card_use');
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
      // Demo mode: Simulate WebSocket updates
      const timer = setInterval(() => {
        setCurrentTime(prev => {
          if (prev <= 0) {
            setTimerPulsing(false);
            return 30;
          }
          
          if (prev <= 5) {
            setTimerPulsing(true);
          } else {
            setTimerPulsing(false);
          }
          
          return prev - 1;
        });
      }, 1000);
      
      // Simulate category selection after 5 seconds
      const categoryTimer = setTimeout(() => {
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
        setSelectedCategory(randomCategory);
        setSelectedDifficulty(randomDifficulty);
        soundService.play('wheel_spin');
      }, 5000);
      
      // Simulate showing question after 8 seconds
      const questionTimer = setTimeout(() => {
        setShowCategoryTable(false);
        setQuestion("Jaki streamer na polskim Twitchu pobił rekord widzów w 2023 roku?");
        soundService.play('question_show');
      }, 8000);
      
      // Simulate activating different players periodically
      const playerTimer = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * players.length);
        setPlayers(prevState => {
          // Capture current state for comparison
          const currentPlayers = prevState;
          
          // Update players with new active state
          const updatedPlayers = currentPlayers.map((player, index) => ({
            ...player,
            isActive: index === randomIndex
          }));
          
          // Play sound if active player changed
          if (!currentPlayers[randomIndex].isActive) {
            soundService.play('buzzer');
          }
          
          return updatedPlayers;
        });
      }, 3000);
      
      return () => {
        clearInterval(timer);
        clearTimeout(categoryTimer);
        clearTimeout(questionTimer);
        clearInterval(playerTimer);
      };
    }
  }, [demoMode, on]);
  
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
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
      
      {/* Demo mode controls - visible only during development */}
      {import.meta.env.DEV && (
        <div style={{ 
          position: 'fixed', 
          bottom: '10px', 
          right: '10px', 
          backgroundColor: 'rgba(0,0,0,0.7)', 
          padding: '10px', 
          borderRadius: '5px',
          zIndex: 1000
        }}>
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => setDemoMode(!demoMode)}
              style={{ 
                padding: '5px 10px', 
                backgroundColor: demoMode ? '#FF3864' : '#39FF14', 
                color: 'white', 
                border: 'none', 
                borderRadius: '3px', 
                cursor: 'pointer' 
              }}
            >
              {demoMode ? 'Demo Mode: ON' : 'Demo Mode: OFF'}
            </button>
            
            {!demoMode && (
              <div className="text-white text-xs">
                Socket: {connected ? 'Connected' : 'Disconnected'} 
                {mockMode && ' (Mock)'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OverlayPage;
