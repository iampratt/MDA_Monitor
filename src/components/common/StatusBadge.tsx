import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Minus } from 'lucide-react';

interface StatusBadgeProps {
  status: 'good' | 'warning' | 'danger' | 'neutral' | 'no_data';
  text?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, text, size = 'md' }) => {
  const isSm = size === 'sm';
  const padding = isSm ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  switch (status) {
    case 'good':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 ${padding}`}>
          <CheckCircle2 className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          {text || 'Target Met'}
        </span>
      );
    case 'warning':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60 ${padding}`}>
          <AlertTriangle className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          {text || 'Watchlist'}
        </span>
      );
    case 'danger':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200/60 ${padding}`}>
          <XCircle className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          {text || 'Needs Attention'}
        </span>
      );
    case 'no_data':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-gray-100 text-gray-500 border border-gray-200 ${padding}`}>
          <Minus className={isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
          {text || 'N/A'}
        </span>
      );
    case 'neutral':
    default:
      return (
        <span className={`inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 ${padding}`}>
          {text || 'Informational'}
        </span>
      );
  }
};
