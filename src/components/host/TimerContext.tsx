
import React, { createContext, useContext, useState } from 'react';

// Update the TimerContextType interface to include missing properties
export interface TimerContextType {
  timerValue: number;
  startTimer: (seconds?: number) => void;
  resetTimer: () => void;
  stopTimer: () => void;
  isTimerRunning: boolean;
}

const TimerContext = createContext<TimerContextType>({
  timerValue: 0,
  startTimer: () => {},
  resetTimer: () => {},
  stopTimer: () => {},
  isTimerRunning: false
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

  return (
    <TimerContext.Provider
      value={{
        timerValue,
        startTimer,
        resetTimer,
        stopTimer,
        isTimerRunning
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  return useContext(TimerContext);
}
