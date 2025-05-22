
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { RoundType } from '@/types/gameTypes';

export interface TimerContextType {
  timerValue: number;
  isTimerRunning: boolean;
  startTimer: (seconds?: number) => void;
  stopTimer: () => void;
  resetTimer: () => void;
  setTimerValue: (value: number) => void;
  setTimerForRound: (roundType: RoundType) => void;
}

const TimerContext = createContext<TimerContextType>({
  timerValue: 30,
  isTimerRunning: false,
  startTimer: () => {},
  stopTimer: () => {},
  resetTimer: () => {},
  setTimerValue: () => {},
  setTimerForRound: () => {},
});

export const useTimer = () => useContext(TimerContext);

interface TimerProviderProps {
  children: React.ReactNode;
  initialValue?: number;
}

export const TimerProvider: React.FC<TimerProviderProps> = ({ 
  children, 
  initialValue = 30 
}) => {
  const [timerValue, setTimerValue] = useState<number>(initialValue);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  // Start the timer countdown
  const startTimer = useCallback((seconds?: number) => {
    // If seconds are provided, set the timer to that value
    if (seconds !== undefined) {
      setTimerValue(seconds);
    }

    // Clear any existing interval
    if (intervalId) {
      clearInterval(intervalId);
    }

    setIsTimerRunning(true);
    
    // Set up new interval
    const newIntervalId = setInterval(() => {
      setTimerValue(prev => {
        if (prev <= 1) {
          // Time's up - clear interval and stop timer
          clearInterval(newIntervalId);
          setIsTimerRunning(false);
          setIntervalId(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setIntervalId(newIntervalId);
  }, [intervalId]);

  // Stop the timer
  const stopTimer = useCallback(() => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsTimerRunning(false);
  }, [intervalId]);

  // Reset the timer to initial value
  const resetTimer = useCallback(() => {
    stopTimer();
    setTimerValue(initialValue);
  }, [initialValue, stopTimer]);

  // Set timer based on round type
  const setTimerForRound = useCallback((roundType: RoundType) => {
    // Default values for each round type
    const roundTimers = {
      knowledge: 30,
      speed: 15,
      wheel: 45,
      final: 60
    };

    // Get the timer value for the round type, or use default if not found
    const timerValue = roundTimers[roundType] || initialValue;
    
    // Stop any running timer and set the new value
    stopTimer();
    setTimerValue(timerValue);
  }, [initialValue, stopTimer]);

  // The context value
  const contextValue: TimerContextType = {
    timerValue,
    isTimerRunning,
    startTimer,
    stopTimer,
    resetTimer,
    setTimerValue,
    setTimerForRound
  };

  return (
    <TimerContext.Provider value={contextValue}>
      {children}
    </TimerContext.Provider>
  );
};

export default TimerContext;
