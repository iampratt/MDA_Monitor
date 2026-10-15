import React from 'react';
import { Activity, ShieldCheck, RefreshCw, Upload, Database, Check } from 'lucide-react';
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
    <header className="bg-white border-b border-surface-border sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Brand & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-mda-700 flex items-center justify-center text-white shadow-sm ring-4 ring-mda-50">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                  MDA Monitor
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-mda-50 text-mda-800 border border-mda-200/50">
                  <ShieldCheck className="w-3 h-3 text-mda-600" />
                  Concurrent Monitoring
                </span>
                {isCustomDataset && (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    Uploaded Dataset
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {dataset.reportingPeriod || dataset.title}
              </p>
            </div>
          </div>

          {/* Metadata & Actions */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-surface-subtle border border-surface-border text-xs text-slate-600">
              <span><strong>{dataset.districtCount}</strong> Districts</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span><strong>{dataset.planningUnitCount}</strong> Planning Units</span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span>Updated: <strong>{formattedDate}</strong></span>
            </div>

            {isCustomDataset && (
              <button
                onClick={onResetBaseline}
                className="text-xs px-2.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
                title="Reset to original baseline dataset"
              >
                Reset Baseline
              </button>
            )}

            <button
              onClick={onRefresh}
              className="p-1.5 text-slate-600 hover:text-mda-700 hover:bg-mda-50 rounded-lg border border-slate-200 transition-colors"
              title="Refresh active dataset"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-mda-700 text-white hover:bg-mda-800 transition-colors shadow-sm"
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
