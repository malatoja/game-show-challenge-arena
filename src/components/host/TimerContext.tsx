
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface TimerContextType {
  timerValue: number;
  isTimerRunning: boolean;
  startTimer: (seconds?: number) => void;
  stopTimer: () => void;
  resetTimer: () => void;
  setTimerValue: (value: number) => void;
}

const TimerContext = createContext<TimerContextType>({
  timerValue: 30,
  isTimerRunning: false,
  startTimer: () => {},
  stopTimer: () => {},
  resetTimer: () => {},
  setTimerValue: () => {},
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

  // The context value
  const contextValue: TimerContextType = {
    timerValue,
    isTimerRunning,
    startTimer,
    stopTimer,
    resetTimer,
    setTimerValue
  };

  return (
    <TimerContext.Provider value={contextValue}>
      {children}
    </TimerContext.Provider>
  );
};

export default TimerContext;
