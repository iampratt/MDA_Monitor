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
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-mda-700 via-mda-800 to-mda-950 flex items-center justify-center text-white shrink-0 shadow-xs ring-1 ring-mda-900/10">
              <Activity className="w-4 h-4 text-emerald-300" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                  MDA Monitor
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-200/60 text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Live Campaign
                </span>
                {isCustomDataset && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/80">
                    Custom Dataset
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                <span className="text-slate-700 font-semibold">{dataset.reportingPeriod || dataset.title}</span>
                <span className="mx-1.5 text-slate-300">•</span>
                <span>{dataset.districtCount} Districts</span>
                <span className="mx-1.5 text-slate-300">•</span>
                <span>{dataset.planningUnitCount} Planning Units</span>
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {isCustomDataset && (
              <button
                onClick={onResetBaseline}
                className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100/80 border border-rose-200/80 font-semibold transition-all active:scale-[0.98]"
                title="Reset to default dataset"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                <span className="hidden sm:inline">Reset Baseline</span>
              </button>
            )}

            <button
              onClick={onRefresh}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100/80 rounded-lg border border-slate-200/90 transition-all active:scale-[0.97]"
              title="Refresh active dataset"
              aria-label="Refresh active dataset"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {onOpenReport && (
              <button
                onClick={onOpenReport}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200/90 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-xs active:scale-[0.98]"
                title="View compiled percentage summary report and download PDF"
              >
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Executive PDF</span>
              </button>
            )}

            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 hover:shadow-xs transition-all active:scale-[0.98]"
            >
              <Upload className="w-3.5 h-3.5 text-slate-300" />
              <span>Admin & Upload</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
