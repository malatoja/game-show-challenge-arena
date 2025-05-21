
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

export interface TimerContextType {
  timerValue: number | undefined;
  isRunning: boolean;
  startTimer: (duration: number) => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  setTimerForRound: (roundType: string) => void;
}

const defaultContext: TimerContextType = {
  timerValue: undefined,
  isRunning: false,
  startTimer: () => {},
  pauseTimer: () => {},
  resumeTimer: () => {},
  stopTimer: () => {},
  resetTimer: () => {},
  setTimerForRound: () => {}
};

const TimerContext = createContext<TimerContextType>(defaultContext);

export const useTimer = () => useContext(TimerContext);

interface TimerProviderProps {
  children: React.ReactNode;
}

export const TimerProvider: React.FC<TimerProviderProps> = ({ children }) => {
  const [timerValue, setTimerValue] = useState<number | undefined>(undefined);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number | null>(null);
  const durationRef = useRef<number>(0);

  const clearTimerInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Reset timer logic
  const resetTimer = useCallback(() => {
    clearTimerInterval();
    setTimerValue(undefined);
    setIsRunning(false);
    startTimeRef.current = null;
    pausedTimeRef.current = null;
    durationRef.current = 0;
  }, [clearTimerInterval]);

  // Start timer with a new duration
  const startTimer = useCallback((duration: number) => {
    resetTimer();
    
    durationRef.current = duration;
    setTimerValue(duration);
    setIsRunning(true);
    
    startTimeRef.current = Date.now();
    
    intervalRef.current = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - (startTimeRef.current || 0)) / 1000);
      const remainingTime = Math.max(0, duration - elapsedSeconds);
      
      setTimerValue(remainingTime);
      
      if (remainingTime === 0) {
        clearTimerInterval();
        setIsRunning(false);
      }
    }, 200); // Update slightly faster than every second for smoother countdown
  }, [resetTimer, clearTimerInterval]);

  // Pause the timer
  const pauseTimer = useCallback(() => {
    if (!isRunning || !startTimeRef.current) return;
    
    clearTimerInterval();
    setIsRunning(false);
    pausedTimeRef.current = Date.now();
  }, [isRunning, clearTimerInterval]);

  // Resume the timer
  const resumeTimer = useCallback(() => {
    if (isRunning || !pausedTimeRef.current || !startTimeRef.current) return;
    
    // Adjust the start time reference by the pause duration
    const pauseDuration = Date.now() - (pausedTimeRef.current || 0);
    startTimeRef.current = startTimeRef.current + pauseDuration;
    pausedTimeRef.current = null;
    setIsRunning(true);
    
    intervalRef.current = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - (startTimeRef.current || 0)) / 1000);
      const remainingTime = Math.max(0, durationRef.current - elapsedSeconds);
      
      setTimerValue(remainingTime);
      
      if (remainingTime === 0) {
        clearTimerInterval();
        setIsRunning(false);
      }
    }, 200);
  }, [isRunning, clearTimerInterval]);

  // Stop the timer
  const stopTimer = useCallback(() => {
    clearTimerInterval();
    setIsRunning(false);
  }, [clearTimerInterval]);

  // Set timer duration based on round type
  const setTimerForRound = useCallback((roundType: string) => {
    let duration = 60; // Default duration
    
    switch (roundType) {
      case 'knowledge':
        duration = 60; // 1 minute for knowledge round
        break;
      case 'speed':
        duration = 30; // 30 seconds for speed round
        break;
      case 'wheel':
        duration = 45; // 45 seconds for wheel round
        break;
      default:
        duration = 60;
        break;
    }
    
    startTimer(duration);
  }, [startTimer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const contextValue: TimerContextType = {
    timerValue,
    isRunning,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer,
    setTimerForRound
  };

  return (
    <TimerContext.Provider value={contextValue}>
      {children}
    </TimerContext.Provider>
  );
};

export default TimerContext;
