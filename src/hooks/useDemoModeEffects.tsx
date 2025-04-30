
import { useEffect } from 'react';
import { playSound } from '@/lib/soundService';

export const useDemoModeEffects = (
  demoMode: boolean,
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>,
  setTimerPulsing: React.Dispatch<React.SetStateAction<boolean>>,
  setPlayers: React.Dispatch<React.SetStateAction<any[]>>,
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>,
  setSelectedDifficulty: React.Dispatch<React.SetStateAction<number>>,
  setShowCategoryTable: React.Dispatch<React.SetStateAction<boolean>>,
  setQuestion: React.Dispatch<React.SetStateAction<string>>,
  categories: string[],
  difficulties: number[]
) => {
  useEffect(() => {
    if (!demoMode) return;
    
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
      playSound('wheel-spin');
    }, 5000);
    
    // Simulate showing question after 8 seconds
    const questionTimer = setTimeout(() => {
      setShowCategoryTable(false);
      setQuestion("Jaki streamer na polskim Twitchu pobił rekord widzów w 2023 roku?");
      playSound('countdown');
    }, 8000);
    
    // Simulate activating different players periodically
    const playerTimer = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * 10); // Assuming 10 players
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
          playSound('buzzer');
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
  }, [demoMode, categories, difficulties, setCurrentTime, setPlayers, setQuestion, setSelectedCategory, setSelectedDifficulty, setShowCategoryTable, setTimerPulsing]);
};
