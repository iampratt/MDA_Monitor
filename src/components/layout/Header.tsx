import React from 'react';
import { RefreshCw, Upload, RotateCcw, FileText } from 'lucide-react';
import { DatasetVersion } from '../../types/dataset';

interface HeaderProps {
  dataset: DatasetVersion;
  onOpenAdmin: () => void;
  onOpenReport?: () => void;
  onRefresh: () => void;
  isCustomDataset: boolean;
  onResetBaseline: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  dataset,
  onOpenAdmin,
  onOpenReport,
  onRefresh,
  isCustomDataset,
  onResetBaseline
}) => {
  return (
    <header className="bg-white border-b border-[#EAEAEA] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-3 flex items-center justify-between gap-4">
          {/* Brand & Context */}
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Minimalist Jewel Brand Mark */}
            <div className="w-8 h-8 rounded-md bg-[#14532D] text-[#BBF7D0] flex items-center justify-center font-mono font-bold text-xs tracking-wider shrink-0 select-none shadow-xs border border-[#166534]">
              MDA
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm sm:text-base font-semibold text-[#111111] tracking-tight">
                  MDA Monitor
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] text-[10px] font-medium uppercase tracking-[0.05em]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  Active Surveillance
                </span>
                {isCustomDataset && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#1D4ED8] border border-[#BFDBFE] text-[10px] font-medium tracking-[0.05em] uppercase">
                    Custom Dataset
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#787774] font-normal truncate mt-0.5">
                <span className="text-[#14532D] font-semibold">{dataset.reportingPeriod || dataset.title}</span>
                <span className="mx-1.5 text-[#D4D4D4]">•</span>
                <span className="text-[#2F3437] font-medium">{dataset.districtCount} Districts</span>
                <span className="mx-1.5 text-[#D4D4D4]">•</span>
                <span className="text-[#2F3437] font-medium">{dataset.planningUnitCount} Planning Units</span>
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2 shrink-0">
            {isCustomDataset && (
              <button
                onClick={onResetBaseline}
                className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md text-[#9F1239] bg-[#FFF1F2] hover:bg-[#FFE4E6] border border-[#FECDD3] font-medium transition-all active:scale-[0.98]"
                title="Reset to default dataset"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset Baseline</span>
              </button>
            )}

            <button
              onClick={onRefresh}
              className="p-1.5 text-[#787774] hover:text-[#0F172A] hover:bg-[#F8FAFC] rounded-md border border-[#EAEAEA] transition-all active:scale-[0.98]"
              title="Refresh active dataset"
              aria-label="Refresh active dataset"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {onOpenReport && (
              <button
                onClick={onOpenReport}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border border-[#CBD5E1] bg-white text-[#1E293B] hover:bg-[#F8FAFC] hover:border-[#94A3B8] transition-all active:scale-[0.98]"
                title="View compiled percentage summary report and download PDF"
              >
                <FileText className="w-3.5 h-3.5 text-[#0F766E]" />
                <span className="hidden sm:inline">Executive PDF</span>
              </button>
            )}

            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-md bg-[#0F172A] text-white hover:bg-[#1E293B] transition-all active:scale-[0.98] shadow-xs"
            >
              <Upload className="w-3.5 h-3.5 text-[#94A3B8]" />
              <span>Admin & Upload</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
