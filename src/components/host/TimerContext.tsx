
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { RoundType } from '@/types/gameTypes';

interface TimerContextType {
  timerValue: number | undefined;
  isPaused: boolean;
  setTimerForRound: (roundType: RoundType) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  extendTimer: (seconds: number) => void;
  isTimeWarning: boolean;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const useTimer = (): TimerContextType => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};

interface TimerProviderProps {
  children: ReactNode;
}

export const TimerProvider: React.FC<TimerProviderProps> = ({ children }) => {
  const [timerValue, setTimerValue] = useState<number | undefined>(undefined);
  const [isPaused, setIsPaused] = useState(true);
  const [intervalId, setIntervalId] = useState<number | undefined>(undefined);
  const [isTimeWarning, setIsTimeWarning] = useState(false);

  const clearTimerInterval = useCallback(() => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(undefined);
    }
  }, [intervalId]);

  // Set up timer based on round type
  const setTimerForRound = useCallback((roundType: RoundType) => {
    clearTimerInterval();
    
    switch (roundType) {
      case 'standard':
        setTimerValue(30); // 30 seconds for regular questions
        break;
      case 'speed':
        setTimerValue(5); // 5 seconds for speed round
        break;
      case 'wheel':
        setTimerValue(30); // 30 seconds for wheel round
        break;
      default:
        setTimerValue(30);
    }
    
    setIsPaused(true);
  }, [clearTimerInterval]);

  // Start the timer
  const startTimer = useCallback(() => {
    if (isPaused) {
      setIsPaused(false);
      
      const id = setInterval(() => {
        setTimerValue((prev) => {
          if (prev === undefined) return undefined;
          if (prev <= 0) {
            clearTimerInterval();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      setIntervalId(id);
    }
  }, [isPaused, clearTimerInterval]);

  // Pause the timer
  const pauseTimer = useCallback(() => {
    setIsPaused(true);
    clearTimerInterval();
  }, [clearTimerInterval]);

  // Reset the timer
  const resetTimer = useCallback(() => {
    setIsPaused(true);
    clearTimerInterval();
    setTimerValue(undefined);
  }, [clearTimerInterval]);

  // Extend the timer (useful for card effects)
  const extendTimer = useCallback((seconds: number) => {
    setTimerValue((prev) => {
      if (prev === undefined) return undefined;
      return prev + seconds;
    });
  }, []);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  // Set warning state when timer < 5 seconds
  useEffect(() => {
    if (timerValue !== undefined && timerValue <= 5 && timerValue > 0) {
      setIsTimeWarning(true);
    } else {
      setIsTimeWarning(false);
    }
  }, [timerValue]);

  const value: TimerContextType = {
    timerValue,
    isPaused,
    setTimerForRound,
    startTimer,
    pauseTimer,
    resetTimer,
    extendTimer,
    isTimeWarning
  };

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
};
