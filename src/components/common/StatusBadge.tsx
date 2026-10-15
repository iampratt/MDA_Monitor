import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Minus } from 'lucide-react';

interface StatusBadgeProps {
  status: 'good' | 'warning' | 'danger' | 'neutral' | 'no_data';
  text?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, text, size = 'md' }) => {
  const isSm = size === 'sm';
  const padding = isSm ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs font-semibold';

  switch (status) {
    case 'good':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-600/20 ${padding}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
          <span>{text || 'Target Met'}</span>
        </span>
      );
    case 'warning':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-600/25 ${padding}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
          <span>{text || 'Watchlist'}</span>
        </span>
      );
    case 'danger':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold bg-rose-50 text-rose-800 ring-1 ring-inset ring-rose-600/25 ${padding}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
          <span>{text || 'Needs Attention'}</span>
        </span>
      );
    case 'no_data':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-slate-100 text-slate-500 ring-1 ring-inset ring-slate-200 ${padding}`}>
          <Minus className={isSm ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
          <span>{text || 'N/A'}</span>
        </span>
      );
    case 'neutral':
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200 ${padding}`}>
          <span>{text || 'Benchmark'}</span>
        </span>
      );
  }
};
