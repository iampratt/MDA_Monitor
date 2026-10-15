import React from 'react';

interface ProgressBarProps {
  value: number | null;
  target?: number | null;
  status?: 'good' | 'warning' | 'danger' | 'neutral' | 'no_data';
  height?: 'sm' | 'md' | 'lg';
  showTargetLine?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  target,
  status = 'neutral',
  height = 'md',
  showTargetLine = true
}) => {
  if (value === null || isNaN(value)) {
    return (
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <div className="bg-slate-300 h-full w-0" />
      </div>
    );
  }

  const clampedVal = Math.min(100, Math.max(0, value));

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  }[height];

  let barColor = 'bg-mda-600';
  if (status === 'good') barColor = 'bg-emerald-600';
  else if (status === 'warning') barColor = 'bg-amber-500';
  else if (status === 'danger') barColor = 'bg-rose-600';
  else if (status === 'neutral') barColor = 'bg-slate-500';

  return (
    <div className={`relative w-full bg-slate-100 rounded-full ${heightClasses} overflow-hidden`}>
      <div
        className={`${barColor} ${heightClasses} rounded-full transition-all duration-500 ease-out`}
        style={{ width: `${clampedVal}%` }}
      />
      {showTargetLine && target !== null && target !== undefined && target > 0 && target <= 100 && (
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-slate-900/60 z-10"
          style={{ left: `${target}%` }}
          title={`Target: ${target}%`}
        />
      )}
    </div>
  );
};
