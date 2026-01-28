import { useEffect, useState } from 'react';
import { getTimeRemaining } from '@/lib/totp';

interface CountdownRingProps {
  size?: number;
  strokeWidth?: number;
}

export function CountdownRing({ size = 40, strokeWidth = 3 }: CountdownRingProps) {
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(getTimeRemaining());
    }, 100);
    
    return () => clearInterval(interval);
  }, []);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = (timeRemaining / 30) * circumference;
  const isLow = timeRemaining <= 5;
  
  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          className={`transition-all duration-100 ${isLow ? 'text-destructive' : 'text-primary'}`}
        />
      </svg>
      <span className={`absolute text-xs font-mono font-semibold ${isLow ? 'text-destructive' : 'text-muted-foreground'}`}>
        {timeRemaining}
      </span>
    </div>
  );
}
