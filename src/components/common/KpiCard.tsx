import React from 'react';
import { StatusBadge } from './StatusBadge';
import { ProgressBar } from './ProgressBar';

interface KpiCardProps {
  title: string;
  category?: string;
  value: string;
  percentageNumber?: number | null;
  target?: number | null;
  subtitle?: string;
  status?: 'good' | 'warning' | 'danger' | 'neutral' | 'no_data';
  icon?: React.ReactNode;
  onClick?: () => void;
  isSelected?: boolean;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  category,
  value,
  percentageNumber,
  target,
  subtitle,
  status = 'neutral',
  icon,
  onClick,
  isSelected = false
}) => {
  // Calculate variance against target if applicable
  const delta = (percentageNumber !== undefined && percentageNumber !== null && target !== undefined && target !== null)
    ? Math.round((percentageNumber - target) * 10) / 10
    : null;

  return (
    <div
      onClick={onClick}
      className={`card-subtle rounded-xl p-4 sm:p-5 flex flex-col justify-between transition-all relative overflow-hidden group ${
        onClick ? 'cursor-pointer hover:border-mda-500 hover:shadow-card-hover active:scale-[0.985]' : ''
      } ${
        isSelected
          ? 'ring-2 ring-mda-700 border-mda-600 bg-gradient-to-b from-mda-50/50 via-white to-white shadow-card-hover'
          : 'bg-white'
      }`}
    >
      {/* Top Header Row */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            {icon && (
              <div className={`p-2 rounded-lg transition-colors ${
                isSelected
                  ? 'bg-mda-700 text-white shadow-xs'
                  : 'bg-slate-100/80 text-mda-800 group-hover:bg-mda-100/70 group-hover:text-mda-900'
              }`}>
                {icon}
              </div>
            )}
            {category && (
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/50">
                {category}
              </span>
            )}
          </div>

          {status && <StatusBadge status={status} size="sm" />}
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-slate-800 leading-snug mb-2" title={title}>
          {title}
        </h3>

        {/* Metric Value & Target Comparison */}
        <div className="mt-1 mb-3">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900 metric-number">
              {value}
            </span>

            {target !== null && target !== undefined && (
              <div className="text-right">
                <span className="text-[11px] font-medium text-slate-500 block">
                  Target: <strong>{target}%</strong>
                </span>
                {delta !== null && (
                  <span className={`text-[10px] font-bold ${
                    delta >= 0 ? 'text-emerald-700' : 'text-rose-600'
                  }`}>
                    {delta >= 0 ? `+${delta}%` : `${delta}%`}
                  </span>
                )}
              </div>
            )}
          </div>

          {subtitle && (
            <p className="text-xs text-slate-500 mt-1 font-medium truncate" title={subtitle}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Progress Bar Footer */}
      {percentageNumber !== undefined && percentageNumber !== null && (
        <div className="pt-3 border-t border-slate-100 mt-1">
          <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5 font-medium">
            <span>0%</span>
            <span>Target {target}%</span>
            <span>100%</span>
          </div>
          <ProgressBar
            value={percentageNumber}
            target={target}
            status={status}
            height="md"
          />
        </div>
      )}
    </div>
  );
};
