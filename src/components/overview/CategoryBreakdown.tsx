import React from 'react';
import { CATEGORIES, INDICATOR_DICTIONARY } from '../../data/indicatorDictionary';
import { GrandAggregate } from '../../types/indicator';
import { ProgressBar } from '../common/ProgressBar';
import { Layers, ArrowRight } from 'lucide-react';

interface CategoryBreakdownProps {
  grandAggregate: GrandAggregate;
  onSelectCategory: (category: string) => void;
  onSelectIndicator: (indicatorId: string) => void;
}

export const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  grandAggregate,
  onSelectCategory,
  onSelectIndicator
}) => {
  return (
    <div className="card-subtle rounded-2xl p-6 bg-white shadow-card">
      <div className="flex items-center justify-between pb-4 border-b border-surface-border mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-surface-subtle text-mda-700">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Pillar Readiness & Thematic Categories
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Statewide performance breakdown across all 10 concurrent monitoring thematic areas
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
        {CATEGORIES.map(category => {
          const indicatorsInCat = INDICATOR_DICTIONARY.filter(i => i.category === category);
          if (indicatorsInCat.length === 0) return null;

          // Find representative or primary indicator
          const primaryInd = indicatorsInCat.find(i => i.isPrimaryKpi) || indicatorsInCat[0];
          const calcVal = grandAggregate.indicatorValues[primaryInd.id];
          const pct = calcVal?.percentage ?? null;

          return (
            <div
              key={category}
              onClick={() => onSelectCategory(category)}
              className="p-4.5 rounded-2xl border border-surface-border hover:border-mda-400 hover:shadow-card-hover bg-surface-sidebar hover:bg-white transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-mda-800 transition-colors">
                    {category}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                    {indicatorsInCat.length} metrics
                  </span>
                </div>

                <div className="mt-2 mb-2 flex items-baseline justify-between">
                  <div className="min-w-0 pr-2">
                    <p className="text-[11px] text-slate-500 font-medium truncate" title={primaryInd.name}>
                      {primaryInd.shortName}
                    </p>
                    <p className="text-xl font-black text-slate-900 metric-number">
                      {pct !== null ? `${pct.toFixed(1)}%` : 'N/A'}
                    </p>
                  </div>
                  {primaryInd.target && (
                    <span className="text-[10px] font-semibold text-slate-400 shrink-0">
                      Target: {primaryInd.target}%
                    </span>
                  )}
                </div>

                <ProgressBar
                  value={pct}
                  target={primaryInd.target}
                  status={calcVal?.status}
                  height="sm"
                />
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="text-[11px] text-mda-700 font-bold group-hover:underline flex items-center gap-1">
                  <span>Open in Analyst Workbench</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
                <span className="text-[10px] text-slate-400 font-mono font-bold bg-slate-50 px-1.5 py-0.5 rounded">
                  {primaryInd.code}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
