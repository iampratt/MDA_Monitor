import React from 'react';
import { CATEGORIES, INDICATOR_DICTIONARY } from '../../data/indicatorDictionary';
import { GrandAggregate } from '../../types/indicator';
import { ProgressBar } from '../common/ProgressBar';
import { PillarComparativeChart } from './PillarComparativeChart';
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
    <div className="space-y-6">
      {/* Visual Comparative Pillar Chart */}
      <PillarComparativeChart
        grandAggregate={grandAggregate}
        onSelectIndicator={onSelectIndicator}
      />

      <div className="card-subtle rounded-xl p-5 bg-white border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Detailed Thematic Pillar Breakdown
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Core performance summary across all concurrent monitoring thematic pillars. Click any pillar to view its district rankings.
            </p>
          </div>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {CATEGORIES.map(category => {
          const indicatorsInCat = INDICATOR_DICTIONARY.filter(i => i.category === category);
          if (indicatorsInCat.length === 0) return null;

          const primaryInd = indicatorsInCat.find(i => i.isPrimaryKpi) || indicatorsInCat[0];
          const calcVal = grandAggregate.indicatorValues[primaryInd.id];
          const pct = calcVal?.percentage ?? null;

          return (
            <div
              key={category}
              role="button"
              tabIndex={0}
              onClick={() => onSelectIndicator(primaryInd.id)}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectIndicator(primaryInd.id);
                }
              }}
              aria-label={`View rankings for ${category} pillar, indicator ${primaryInd.shortName}`}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-xs bg-slate-50/30 hover:bg-white transition-all cursor-pointer group flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-mda-600"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-mda-800 transition-colors">
                    {category}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
                    {indicatorsInCat.length} metrics
                  </span>
                </div>

                <div className="mt-1 mb-2 flex items-baseline justify-between">
                  <div className="min-w-0 pr-2">
                    <p className="text-[11px] text-slate-500 font-medium truncate" title={primaryInd.name}>
                      {primaryInd.shortName}
                    </p>
                    <p className="text-lg font-bold text-slate-900 metric-number">
                      {pct !== null ? `${pct.toFixed(1)}%` : 'N/A'}
                    </p>
                  </div>
                  {calcVal && calcVal.denominator > 0 && (
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {calcVal.numerator.toLocaleString()} / {calcVal.denominator.toLocaleString()}
                    </span>
                  )}
                </div>

                <ProgressBar
                  value={pct}
                  target={primaryInd.target}
                  status={calcVal?.status}
                  height="sm"
                  showTargetLine={false}
                />
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="text-[11px] text-mda-700 font-semibold group-hover:underline flex items-center gap-1">
                  <span>View Rankings</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
                <span className="text-[10px] text-slate-400 font-mono font-bold bg-slate-100 px-1 py-0.5 rounded">
                  {primaryInd.code}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
  );
};
