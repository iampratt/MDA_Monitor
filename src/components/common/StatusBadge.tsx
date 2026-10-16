import React from 'react';
import { Minus } from 'lucide-react';

interface StatusBadgeProps {
  status: 'good' | 'warning' | 'danger' | 'neutral' | 'no_data';
  text?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, text, size = 'md' }) => {
  const isSm = size === 'sm';
  const padding = isSm ? 'px-2 py-0.5 text-[9.5px]' : 'px-2.5 py-0.5 text-[10.5px]';

  switch (status) {
    case 'good':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-medium uppercase tracking-[0.05em] bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] ${padding}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0" />
          <span>{text || 'Target Met'}</span>
        </span>
      );
    case 'warning':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-medium uppercase tracking-[0.05em] bg-[#FFFBEB] text-[#92400E] border border-[#FDE68A] ${padding}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] shrink-0" />
          <span>{text || 'Watchlist'}</span>
        </span>
      );
    case 'danger':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-medium uppercase tracking-[0.05em] bg-[#FFF1F2] text-[#9F1239] border border-[#FECDD3] ${padding}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-[#F43F5E] shrink-0" />
          <span>{text || 'Attention'}</span>
        </span>
      );
    case 'no_data':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-medium uppercase tracking-[0.05em] bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0] ${padding}`}>
          <Minus className={isSm ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
          <span>{text || 'N/A'}</span>
        </span>
      );
    case 'neutral':
    default:
      if (!text) return null;
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full font-medium uppercase tracking-[0.05em] bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0] ${padding}`}>
          <span>{text}</span>
        </span>
      );
  }
};
