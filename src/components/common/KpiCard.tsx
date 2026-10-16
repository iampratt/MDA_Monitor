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
      className={`rounded-xl border transition-all duration-150 flex flex-col justify-between p-5 bg-white ${
        onClick ? 'cursor-pointer active:scale-[0.985]' : ''
      } ${
        isSelected
          ? 'border-[#14532D] bg-[#F0FDF4]/30 ring-1 ring-[#14532D]/40'
          : 'border-[#EAEAEA] hover:border-[#CBD5E1]'
      }`}
    >
      <div>
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            {icon && (
              <div className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors ${
                isSelected
                  ? 'bg-[#14532D] text-white'
                  : 'bg-[#F8FAFC] text-[#334155] border border-[#E2E8F0]'
              }`}>
                {icon}
              </div>
            )}
            {category && (
              <span className="text-[9.5px] font-medium tracking-[0.05em] uppercase px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                {category}
              </span>
            )}
          </div>

          {status && <StatusBadge status={status} size="sm" />}
        </div>

        {/* Title */}
        <h3 className="text-xs font-medium text-[#1E293B] leading-snug mb-2" title={title}>
          {title}
        </h3>

        {/* Metric Value & Target Comparison */}
        <div className="mt-1 mb-2">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-2xl sm:text-3xl font-serif font-normal tracking-tight text-[#0F172A] metric-number">
              {value}
            </span>

            {target !== null && target !== undefined && (
              <div className="text-right">
                <span className="text-[10.5px] text-[#64748B] block">
                  Target: <strong className="text-[#334155] font-medium">{target}%</strong>
                </span>
                {delta !== null && (
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                    delta >= 0
                      ? 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]'
                      : 'bg-[#FFF1F2] text-[#9F1239] border-[#FECDD3]'
                  }`}>
                    {delta >= 0 ? `+${delta}%` : `${delta}%`}
                  </span>
                )}
              </div>
            )}
          </div>

          {subtitle && (
            <p className="text-[11px] text-[#64748B] mt-1 font-normal truncate" title={subtitle}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Progress Bar Footer */}
      {percentageNumber !== undefined && percentageNumber !== null && (
        <div className="pt-3 border-t border-[#F1F5F9] mt-2">
          <div className="flex items-center justify-between text-[10px] text-[#64748B] mb-1.5 font-normal">
            <span>0%</span>
            <span className="font-medium text-[#334155]">Target {target}%</span>
            <span>100%</span>
          </div>
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
