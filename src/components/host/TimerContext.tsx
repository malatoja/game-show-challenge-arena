
import React, { createContext, useContext, useState, useEffect } from 'react';
import { RoundType } from '@/types/gameTypes';
import { useEvents } from './EventsContext';

type TimerContextType = {
  timer: number;
  isTimerRunning: boolean;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  setTimerForRound: (round: RoundType) => void;
};

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [timer, setTimer] = useState<number>(30);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const { addEvent } = useEvents();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTime => prevTime - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
      addEvent("Czas minął!");
      
      // Play sound effect when timer reaches zero
      const audio = new Audio('/sounds/times_up.mp3');
      audio.play().catch(err => console.error("Error playing sound:", err));
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timer, addEvent]);
  
  const startTimer = () => {
    setIsTimerRunning(true);
    addEvent("Timer uruchomiony");
  };
  
  const stopTimer = () => {
    setIsTimerRunning(false);
    addEvent("Timer zatrzymany");
  };
  
  const resetTimer = () => {
    setTimer(getDefaultTimeForRound('knowledge'));
    setIsTimerRunning(false);
    addEvent("Timer zresetowany");
  };
  
  const setTimerForRound = (round: RoundType) => {
    setTimer(getDefaultTimeForRound(round));
  };
  
  const getDefaultTimeForRound = (round: RoundType): number => {
    switch (round) {
      case 'speed': return 10;
      case 'wheel': return 20;
      case 'knowledge':
      default: return 30;
    }
  };

  return (
    <TimerContext.Provider value={{ 
      timer, 
      isTimerRunning, 
      startTimer, 
      stopTimer, 
      resetTimer,
      setTimerForRound
    }}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
}
