import React from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp, AlertCircle, ChevronRight } from 'lucide-react';
import { DistrictAggregate, GrandAggregate } from '../../types/indicator';
import { getIndicatorById } from '../../data/indicatorDictionary';

interface TopBottomDistrictsProps {
  districtAggregates: DistrictAggregate[];
  grandAggregate: GrandAggregate;
  selectedIndicatorId: string;
  onSelectDistrict: (district: string) => void;
}

export const TopBottomDistricts: React.FC<TopBottomDistrictsProps> = ({
  districtAggregates,
  grandAggregate,
  selectedIndicatorId,
  onSelectDistrict
}) => {
  const currentIndicator = getIndicatorById(selectedIndicatorId);
  const stateVal = grandAggregate.indicatorValues[selectedIndicatorId]?.percentage ?? 0;

  const sorted = [...districtAggregates].map(d => {
    const val = d.indicatorValues[selectedIndicatorId]?.percentage ?? 0;
    const delta = val - stateVal;
    return {
      district: d.district,
      val,
      delta,
      planningUnits: d.totalPlanningUnits,
      status: d.indicatorValues[selectedIndicatorId]?.status
    };
  }).sort((a, b) => b.val - a.val);

  const top5 = sorted.slice(0, 5);
  const bottom5 = sorted.slice(-5).reverse();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Top 5 */}
      <div className="card-subtle rounded-2xl p-6 bg-white shadow-card">
        <div className="flex items-center justify-between pb-4 border-b border-surface-border mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Highest Performing Districts</h3>
              <p className="text-xs text-slate-500">Above state benchmark on {currentIndicator?.shortName}</p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
            Top 5
          </span>
        </div>

        <div className="space-y-2">
          {top5.map((item, idx) => (
            <div
              key={item.district}
              onClick={() => onSelectDistrict(item.district)}
              className="group flex items-center justify-between p-3 rounded-xl hover:bg-emerald-50/40 cursor-pointer transition-all border border-transparent hover:border-emerald-200/60"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-surface-subtle text-slate-600 text-xs font-black flex items-center justify-center font-mono group-hover:bg-emerald-100 group-hover:text-emerald-800 transition-colors">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-mda-900 transition-colors">
                    {item.district}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {item.planningUnits} Planning Units
                  </p>
                </div>
              </div>

              <div className="text-right flex items-center gap-3">
                <span className="text-sm font-extrabold text-slate-900 metric-number">
                  {item.val.toFixed(1)}%
                </span>
                <span className="inline-flex items-center text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50">
                  <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                  +{Math.abs(item.delta).toFixed(1)}%
                </span>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-mda-700 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom 5 */}
      <div className="card-subtle rounded-2xl p-6 bg-white shadow-card">
        <div className="flex items-center justify-between pb-4 border-b border-surface-border mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-700">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Districts Needing Support</h3>
              <p className="text-xs text-slate-500">Priority for supervisory follow-up</p>
            </div>
          </div>
          <span className="text-xs font-bold text-rose-800 bg-rose-50 border border-rose-200/60 px-2.5 py-0.5 rounded-full">
            Bottom 5
          </span>
        </div>

        <div className="space-y-2">
          {bottom5.map((item, idx) => (
            <div
              key={item.district}
              onClick={() => onSelectDistrict(item.district)}
              className="group flex items-center justify-between p-3 rounded-xl hover:bg-rose-50/40 cursor-pointer transition-all border border-transparent hover:border-rose-200/60"
            >
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-lg bg-surface-subtle text-slate-600 text-xs font-black flex items-center justify-center font-mono group-hover:bg-rose-100 group-hover:text-rose-800 transition-colors">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-rose-900 transition-colors">
                    {item.district}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {item.planningUnits} Planning Units
                  </p>
                </div>
              </div>

              <div className="text-right flex items-center gap-3">
                <span className="text-sm font-extrabold text-slate-900 metric-number">
                  {item.val.toFixed(1)}%
                </span>
                <span className="inline-flex items-center text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/50">
                  <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                  {item.delta.toFixed(1)}%
                </span>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-rose-700 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
