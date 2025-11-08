import React from 'react';

interface FlipClockProps {
  hours: number;
  minutes: number;
  seconds: number;
}

const FlipClock: React.FC<FlipClockProps> = ({ hours, minutes, seconds }) => {
  const formatTime = (unit: number) => unit.toString().padStart(2, '0');

  return (
    <div className="font-mono text-6xl sm:text-8xl lg:text-9xl font-black text-gray-800 dark:text-gray-100 tracking-widest">
      <span>{formatTime(hours)}</span>
      <span className="mx-2 sm:mx-4">:</span>
      <span>{formatTime(minutes)}</span>
      <span className="mx-2 sm:mx-4">:</span>
      <span>{formatTime(seconds)}</span>
    </div>
  );
};

export default FlipClock;