import React from 'react';
import { Clock } from 'lucide-react';

interface GameTimerProps {
  seconds: number;
  isRunning: boolean;
}

export const GameTimer: React.FC<GameTimerProps> = ({ seconds, isRunning }) => {
  const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2">
      <Clock className={`w-5 h-5 ${isRunning ? 'text-cyan-300' : 'text-slate-500'}`} />
      <div className={`text-lg font-bold ${isRunning ? 'text-slate-100' : 'text-slate-500'}`}>
        {formatTime(seconds)}
      </div>
      {isRunning && (
        <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse shadow-lg"></div>
      )}
    </div>
  );
};