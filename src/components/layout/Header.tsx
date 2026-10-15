import React from 'react';
import { Activity, ShieldCheck, RefreshCw, Upload, Database, RotateCcw } from 'lucide-react';
import { DatasetVersion } from '../../types/dataset';

interface HeaderProps {
  dataset: DatasetVersion;
  onOpenAdmin: () => void;
  onRefresh: () => void;
  isCustomDataset: boolean;
  onResetBaseline: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  dataset,
  onOpenAdmin,
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
    <header className="bg-white/95 backdrop-blur-md border-b border-surface-border sticky top-0 z-40 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Brand & Title */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-mda-600 to-mda-800 flex items-center justify-center text-white shadow-sm ring-4 ring-mda-50/80 shrink-0">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">
                  MDA Monitor
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-full bg-mda-50 text-mda-800 border border-mda-200/60 shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-mda-600" />
                  Concurrent Monitoring
                </span>
                {isCustomDataset && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    Uploaded Dataset
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {dataset.reportingPeriod || dataset.title}
              </p>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <div className="hidden lg:flex items-center gap-3.5 px-3.5 py-1.5 rounded-lg bg-surface-subtle border border-surface-border text-xs text-slate-600 font-medium shadow-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span><strong className="text-slate-900 font-bold">{dataset.districtCount}</strong> Districts</span>
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span><strong className="text-slate-900 font-bold">{dataset.planningUnitCount}</strong> Planning Units</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="text-slate-400">Published: {formattedDate}</span>
            </div>

            {isCustomDataset && (
              <button
                onClick={onResetBaseline}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 font-medium transition-colors"
                title="Reset to original baseline dataset"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Baseline</span>
              </button>
            )}

            <button
              onClick={onRefresh}
              className="p-2 text-slate-500 hover:text-mda-700 hover:bg-mda-50 rounded-lg border border-surface-border transition-colors shadow-xs"
              title="Refresh active dataset"
              aria-label="Refresh active dataset"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-2 text-xs font-semibold px-3.5 py-2 rounded-lg bg-mda-700 text-white hover:bg-mda-800 transition-all shadow-sm hover:shadow active:scale-98"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Admin & Data Upload</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
