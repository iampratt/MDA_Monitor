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
  return (
    <div
      onClick={onClick}
      className={`card-subtle rounded-xl p-5 flex flex-col justify-between transition-all ${
        onClick ? 'cursor-pointer' : ''
      } ${
        isSelected
          ? 'ring-2 ring-mda-700 bg-mda-50/20'
          : 'bg-white'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            {icon && (
              <div className="p-2 rounded-lg bg-surface-subtle text-mda-700">
                {icon}
              </div>
            )}
            <div>
              {category && (
                <span className="text-[11px] font-semibold tracking-wider uppercase text-surface-muted">
                  {category}
                </span>
              )}
              <h3 className="text-sm font-medium text-slate-800 line-clamp-1" title={title}>
                {title}
              </h3>
            </div>
          </div>
          {status && <StatusBadge status={status} size="sm" />}
        </div>

        <div className="mt-2 mb-3">
          <div className="text-2xl font-bold tracking-tight text-slate-900 metric-number flex items-baseline gap-2">
            <span>{value}</span>
            {target !== null && target !== undefined && (
              <span className="text-xs font-normal text-slate-500">
                Target: {target}%
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-0.5 truncate" title={subtitle}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {percentageNumber !== undefined && percentageNumber !== null && (
        <div className="pt-2 border-t border-slate-100">
          <ProgressBar
            value={percentageNumber}
            target={target}
            status={status}
            height="sm"
          />
        </div>
      )}
    </div>
  );
};
