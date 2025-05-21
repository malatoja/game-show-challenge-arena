
import React, { createContext, useContext, useState } from 'react';

// Update the TimerContextType interface to include missing properties
export interface TimerContextType {
  timerValue: number;
  startTimer: (seconds?: number) => void;
  resetTimer: () => void;
  stopTimer: () => void;
  isTimerRunning: boolean;
  setTimerForRound: (roundType: string) => void;
}

const TimerContext = createContext<TimerContextType>({
  timerValue: 0,
  startTimer: () => {},
  resetTimer: () => {},
  stopTimer: () => {},
  isTimerRunning: false,
  setTimerForRound: () => {}
});

export function TimerProvider({ children }: { children: React.ReactNode }) {
  const [timerValue, setTimerValue] = useState(30);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const startTimer = (seconds = 30) => {
    // Clear existing timer if any
    if (intervalId) {
      clearInterval(intervalId);
    }

    setTimerValue(seconds);
    setIsTimerRunning(true);

    const id = setInterval(() => {
      setTimerValue((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          setIntervalId(null);
          setIsTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setIntervalId(id);
  };

  const stopTimer = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    stopTimer();
    setTimerValue(30);
  };

  // Add implementation for setTimerForRound
  const setTimerForRound = (roundType: string) => {
    stopTimer();
    // Different rounds can have different timer values
    switch(roundType) {
      case 'knowledge':
        setTimerValue(60); // 60 seconds for knowledge round
        break;
      case 'speed':
        setTimerValue(15); // 15 seconds for speed round
        break;
      case 'wheel':
        setTimerValue(30); // 30 seconds for wheel round
        break;
      default:
        setTimerValue(30); // Default timer value
    }
    // Don't auto-start the timer, just set the value
  };

  return (
    <TimerContext.Provider
      value={{
        timerValue,
        startTimer,
        resetTimer,
        stopTimer,
        isTimerRunning,
        setTimerForRound
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  return useContext(TimerContext);
}
