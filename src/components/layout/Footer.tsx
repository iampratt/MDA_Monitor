import React from 'react';
import { ShieldCheck, Info } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-surface-border mt-12 py-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-mda-700" />
            <span className="font-semibold text-slate-700">MDA Concurrent Monitoring System</span>
            <span>•</span>
            <span>Mass Drug Administration Elimination Protocol</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Formula: 100 × Σ(Num) / Σ(Den)</span>
            <span>•</span>
            <span>Zero-Denominator Guarded</span>
            <span>•</span>
            <span>Subtotals Excluded</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-slate-400">
          <p>
            Designed for Public Health Monitoring, Directorate of Health Services & Partner Agencies. Data source: Concurrent Field Monitoring.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Codebase Dataset Mode</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
