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
      <div className="w-full bg-[#F1F1EF] rounded-full h-1.5 overflow-hidden">
        <div className="bg-[#EAEAEA] h-full w-0" />
      </div>
    );
  }

  const clampedVal = Math.min(100, Math.max(0, value));

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-2.5'
  }[height];

  let barColor = 'bg-[#0F766E]';
  let trackColor = 'bg-[#F1F5F9]';

  if (status === 'good') {
    barColor = 'bg-[#059669]';
    trackColor = 'bg-[#ECFDF5]';
  } else if (status === 'warning') {
    barColor = 'bg-[#D97706]';
    trackColor = 'bg-[#FFFBEB]';
  } else if (status === 'danger') {
    barColor = 'bg-[#E11D48]';
    trackColor = 'bg-[#FFF1F2]';
  } else if (status === 'neutral') {
    barColor = 'bg-[#475569]';
    trackColor = 'bg-[#F1F5F9]';
  }

  return (
    <div className={`relative w-full ${trackColor} rounded-full ${heightClasses} overflow-hidden`}>
      <div
        className={`${barColor} ${heightClasses} rounded-full transition-all duration-300 ease-out`}
        style={{ width: `${clampedVal}%` }}
      />
      {showTargetLine && target !== null && target !== undefined && target > 0 && target <= 100 && (
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-[#0F172A] z-10 opacity-70"
          style={{ left: `calc(${target}% - 1px)` }}
          title={`Target benchmark: ${target}%`}
        />
      )}
    </div>
  );
};
