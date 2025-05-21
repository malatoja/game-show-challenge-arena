
import React, { createContext, useContext, useState, useEffect } from 'react';
import { RoundType } from '@/types/gameTypes';

export interface TimerContextType {
  seconds: number;
  setSeconds: (seconds: number) => void;
  isRunning: boolean;
  startTimer: (duration?: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void; // Added
  resetTimer: () => void;
  isTimerRunning: boolean; // Added
  setTimerForRound: (roundType: RoundType) => void; // Added
}

const defaultTimerContext: TimerContextType = {
  seconds: 0,
  setSeconds: () => {},
  isRunning: false,
  startTimer: () => {},
  pauseTimer: () => {},
  resumeTimer: () => {},
  stopTimer: () => {}, // Added
  resetTimer: () => {},
  isTimerRunning: false, // Added
  setTimerForRound: () => {} // Added
};

export const TimerContext = createContext<TimerContextType>(defaultTimerContext);

export const useTimer = () => useContext(TimerContext);

interface TimerProviderProps {
  children: React.ReactNode;
}

export const TimerProvider = ({ children }: TimerProviderProps) => {
  const [seconds, setSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  // Clear interval on unmount
  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  const startTimer = (duration?: number) => {
    if (duration !== undefined) {
      setSeconds(duration);
    }
    
    setIsRunning(true);
    
    const id = setInterval(() => {
      setSeconds(prevSeconds => {
        if (prevSeconds <= 1) {
          clearInterval(id);
          setIsRunning(false);
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);
    
    setIntervalId(id);
  };

  const pauseTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsRunning(false);
  };
  
  const resumeTimer = () => {
    if (!isRunning && seconds > 0) {
      startTimer();
    }
  };
  
  const resetTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsRunning(false);
    setSeconds(0);
  };

  // Added function to stop timer
  const stopTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsRunning(false);
  };

  // Added function to set timer duration based on round type
  const setTimerForRound = (roundType: RoundType) => {
    switch (roundType) {
      case 'knowledge':
        setSeconds(60); // 1 minute for knowledge round
        break;
      case 'speed':
        setSeconds(30); // 30 seconds for speed round
        break;
      case 'wheel':
        setSeconds(45); // 45 seconds for wheel round
        break;
      default:
        setSeconds(60); // Default timer
    }
  };
  
  return (
    <TimerContext.Provider 
      value={{ 
        seconds, 
        setSeconds, 
        isRunning, 
        startTimer, 
        pauseTimer, 
        resumeTimer, 
        stopTimer, 
        resetTimer,
        isTimerRunning: isRunning,
        setTimerForRound
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};
