import React, { useEffect, useState } from 'react';
import { GameOverlay } from '@/components/overlay/GameOverlay';
import { Player } from '@/types/gameTypes';
import { websocketService } from '@/lib/websocketService';
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

  // Demo mode for testing without WebSocket
  const [demoMode, setDemoMode] = useState(true);
  
  useEffect(() => {
    // In a real application, connect to WebSocket server
    if (!demoMode) {
      websocketService.connect('ws://localhost:8080')
        .catch(error => console.error('Failed to connect to WebSocket server:', error));
      
      // Set up WebSocket listeners
      websocketService.addListener('QUESTION_UPDATE', (data: any) => {
        setQuestion(data.text);
        setShowCategoryTable(false);
        soundService.play('question_show'); // Fixed to use valid sound type
      });
      
      websocketService.addListener('TIMER_UPDATE', (data: any) => {
        setCurrentTime(data.time);
        setTimerPulsing(data.time <= 5);
        
        if (data.time <= 5 && data.time > 0) {
          soundService.play('timer');
        }
      });
      
      websocketService.addListener('PLAYER_UPDATE', (data: any) => {
        setPlayers(prev => prev.map(player => 
          player.id === data.id ? { ...player, ...data } : player
        ));
        
        if (data.isActive && !prev.find((p: Player) => p.id === data.id)?.isActive) {
          soundService.play('player_join');
        }
      });
      
      websocketService.addListener('CATEGORY_SELECT', (data: any) => {
        setSelectedCategory(data.category);
        setSelectedDifficulty(data.difficulty);
        soundService.play('wheel_spin');
      });
      
      websocketService.addListener('ROUND_UPDATE', (data: any) => {
        setRoundTitle(data.title);
        soundService.play('round_start');
      });
      
      return () => {
        websocketService.disconnect();
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
        soundService.play('question_show'); // Fixed to use valid sound type
      }, 8000);
      
      // Simulate activating different players periodically
      const playerTimer = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * players.length);
        setPlayers(prev => {
          const updatedPlayers = prev.map((player, index) => ({
            ...player,
            isActive: index === randomIndex
          }));
          
          // Play sound if active player changed
          if (!prev[randomIndex].isActive) {
            soundService.play('player_join');
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
  }, [demoMode]);
  
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
      {process.env.NODE_ENV === 'development' && (
        <div style={{ 
          position: 'fixed', 
          bottom: '10px', 
          right: '10px', 
          backgroundColor: 'rgba(0,0,0,0.7)', 
          padding: '10px', 
          borderRadius: '5px',
          zIndex: 1000
        }}>
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
        </div>
      )}
    </div>
  );
};

export default OverlayPage;
