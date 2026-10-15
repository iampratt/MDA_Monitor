import React from 'react';
import { CATEGORIES, INDICATOR_DICTIONARY } from '../../data/indicatorDictionary';
import { GrandAggregate } from '../../types/indicator';
import { ProgressBar } from '../common/ProgressBar';

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
    <div className="card-subtle rounded-xl p-6 bg-white">
      <div className="pb-4 border-b border-surface-border mb-6">
        <h2 className="text-base font-bold text-slate-900 tracking-tight">
          Pillar Readiness & Indicator Categories
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Programmatic performance breakdown across all concurrent monitoring thematic pillars
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              className="p-4 rounded-xl border border-surface-border hover:border-mda-300 hover:shadow-card-hover bg-surface-sidebar hover:bg-white transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800 group-hover:text-mda-800">
                  {category}
                </span>
                <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  {indicatorsInCat.length} metrics
                </span>
              </div>

              <div className="mt-3 mb-2 flex items-baseline justify-between">
                <div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{primaryInd.shortName}</p>
                  <p className="text-lg font-bold text-slate-900 metric-number">
                    {pct !== null ? `${pct.toFixed(1)}%` : 'N/A'}
                  </p>
                </div>
                {primaryInd.target && (
                  <span className="text-[10px] text-slate-400">
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

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="text-[10px] text-mda-700 font-medium group-hover:underline">
                  View in Workbench →
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
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
