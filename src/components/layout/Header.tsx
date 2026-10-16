import React from 'react';
import { Activity, ShieldCheck, RefreshCw, Upload, Database, RotateCcw, FileText } from 'lucide-react';
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
  const formattedDate = new Date(dataset.uploadedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-surface-border sticky top-0 z-40 shadow-[0_1px_3px_0_rgba(15,23,42,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-2.5 sm:py-3 flex items-center justify-between gap-4">
          {/* Brand & Context */}
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Bespoke Geometric Brand Emblem */}
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-mda-800 via-mda-900 to-slate-950 flex items-center justify-center text-white shrink-0 shadow-md ring-1 ring-black/10 overflow-hidden group">
              {/* Subtle ambient concentric radar pattern */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.8)_0%,transparent_70%)]" />
              <svg className="w-5 h-5 text-emerald-300 relative z-10 transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" strokeWidth="1.5" className="opacity-40" />
                <path d="M12 3v3m0 12v3M3 12h3m12 0h3" strokeWidth="1.5" className="opacity-60" />
                <path d="M8 12h2l1.5-3 2.5 6 1.5-3h2.5" strokeWidth="2.2" stroke="white" />
              </svg>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                  MDA Monitor
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-[9.5px] font-black text-emerald-800 uppercase tracking-[0.16em]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Active Surveillance
                </span>
                {isCustomDataset && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/80">
                    Custom Dataset
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                <span className="text-slate-800 font-bold">{dataset.reportingPeriod || dataset.title}</span>
                <span className="mx-1.5 text-slate-300">•</span>
                <span className="font-semibold text-slate-600">{dataset.districtCount} Districts</span>
                <span className="mx-1.5 text-slate-300">•</span>
                <span className="font-semibold text-slate-600">{dataset.planningUnitCount} Planning Units</span>
              </p>
            </div>
          </div>

          {/* Actions with Button-in-Button Architecture */}
          <div className="flex items-center gap-2 shrink-0">
            {isCustomDataset && (
              <button
                onClick={onResetBaseline}
                className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100/80 border border-rose-200/80 font-bold transition-all active:scale-[0.98]"
                title="Reset to default dataset"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                <span className="hidden sm:inline">Reset Baseline</span>
              </button>
            )}

            <button
              onClick={onRefresh}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200/80 transition-all active:scale-[0.97]"
              title="Refresh active dataset"
              aria-label="Refresh active dataset"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {onOpenReport && (
              <button
                onClick={onOpenReport}
                className="group inline-flex items-center gap-2 text-xs font-bold pl-2.5 pr-3 py-1.5 rounded-xl border border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 transition-all shadow-xs active:scale-[0.98]"
                title="View compiled percentage summary report and download PDF"
              >
                <div className="w-5 h-5 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-mda-50 group-hover:text-mda-800 transition-colors">
                  <FileText className="w-3 h-3" />
                </div>
                <span className="hidden sm:inline">Executive PDF</span>
              </button>
            )}

            <button
              onClick={onOpenAdmin}
              className="group inline-flex items-center gap-2 text-xs font-bold pl-2.5 pr-3.5 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-sm active:scale-[0.98]"
            >
              <div className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <Upload className="w-3 h-3 text-slate-200" />
              </div>
              <span>Admin & Upload</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
