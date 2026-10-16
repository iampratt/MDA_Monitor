import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-[#EAEAEA] mt-16 py-8 text-xs text-[#787774]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#111111]" />
            <span className="font-medium text-[#111111]">MDA Concurrent Monitoring System</span>
            <span className="text-[#CCCCCC]">•</span>
            <span>Mass Drug Administration Elimination Protocol</span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px] text-[#787774]">
            <span>100 × Σ(Num) / Σ(Den)</span>
            <span className="text-[#CCCCCC]">•</span>
            <span>Zero-Denominator Guarded</span>
            <span className="text-[#CCCCCC]">•</span>
            <span>Subtotals Excluded</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-[#EAEAEA] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-[#787774]">
          <p>
            Designed for Public Health Monitoring, Directorate of Health Services & Partner Agencies. Data source: Concurrent Field Monitoring.
          </p>
          <div className="flex items-center gap-1.5 font-mono text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#346538]" />
            <span>Codebase Dataset Mode</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
