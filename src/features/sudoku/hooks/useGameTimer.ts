import { useEffect, useRef, useState } from 'react';

type TimerControls = {
  seconds: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
  setSeconds: (s: number) => void;
};

export default function useGameTimer(): TimerControls {
  const [seconds, _setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const intervalRef = useRef<number | null>(null);

  const clear = () => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    clear();

    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        _setSeconds((s) => s + 1);
      }, 1000);
    }

    return () => clear();
  }, [isRunning]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => _setSeconds(0);
  const setSeconds = (s: number) => _setSeconds(Math.max(0, Math.floor(s)));

  return { seconds, isRunning, start, pause, reset, setSeconds };
}