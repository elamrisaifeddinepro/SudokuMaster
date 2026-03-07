import { useCallback, useEffect, useRef, useState } from 'react';

export const useGameTimer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  // Browser-friendly type (works in Vite/TS without Node typings assumptions)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Memoized callbacks to keep stable references (prevents useEffect loops in consumers)
  const startTimer = useCallback(() => {
    setIsRunning(true);
  }, []);

  const stopTimer = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const resetTimer = useCallback(() => {
    setSeconds(0);
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  return {
    seconds,
    isRunning,
    startTimer,
    stopTimer,
    resetTimer,
    pauseTimer
  };
};