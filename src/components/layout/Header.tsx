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
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-3 flex items-center justify-between gap-4">
          {/* Brand & Context */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-mda-700 flex items-center justify-center text-white shrink-0">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-slate-900 tracking-tight">
                  MDA Monitor
                </span>
                <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline">
                  • Concurrent Monitoring Dashboard
                </span>
                {isCustomDataset && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    Custom Dataset
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                {dataset.reportingPeriod || dataset.title} • {dataset.districtCount} Districts • {dataset.planningUnitCount} Planning Units
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isCustomDataset && (
              <button
                onClick={onResetBaseline}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 font-medium transition-colors"
                title="Reset to default dataset"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Reset Baseline</span>
              </button>
            )}

            <button
              onClick={onRefresh}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
              title="Refresh active dataset"
              aria-label="Refresh active dataset"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {onOpenReport && (
              <button
                onClick={onOpenReport}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
                title="View compiled percentage summary report and download PDF"
              >
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Summary PDF</span>
              </button>
            )}

            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Admin & Upload</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
