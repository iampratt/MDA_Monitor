import React from 'react';
import { ArrowUpRight, ArrowDownRight, TrendingUp, AlertCircle } from 'lucide-react';
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
      <div className="card-subtle rounded-xl p-5 bg-white">
        <div className="flex items-center justify-between pb-3 border-b border-surface-border mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Highest Performing Districts</h3>
              <p className="text-[11px] text-slate-500">Above or matching state benchmark</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
            Top 5
          </span>
        </div>

        <div className="space-y-2.5">
          {top5.map((item, idx) => (
            <div
              key={item.district}
              onClick={() => onSelectDistrict(item.district)}
              className="flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-subtle cursor-pointer transition-colors border border-transparent hover:border-surface-border"
            >
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="text-xs font-semibold text-slate-800">{item.district}</h4>
                  <p className="text-[10px] text-slate-400">{item.planningUnits} Planning Units</p>
                </div>
              </div>

              <div className="text-right flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 metric-number">
                  {item.val.toFixed(1)}%
                </span>
                <span className="inline-flex items-center text-[10px] font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  <ArrowUpRight className="w-3 h-3" />
                  +{Math.abs(item.delta).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom 5 */}
      <div className="card-subtle rounded-xl p-5 bg-white">
        <div className="flex items-center justify-between pb-3 border-b border-surface-border mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-700">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Districts Needing Support</h3>
              <p className="text-[11px] text-slate-500">Lowest performing on this metric</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
            Bottom 5
          </span>
        </div>

        <div className="space-y-2.5">
          {bottom5.map((item, idx) => (
            <div
              key={item.district}
              onClick={() => onSelectDistrict(item.district)}
              className="flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-subtle cursor-pointer transition-colors border border-transparent hover:border-surface-border"
            >
              <div className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="text-xs font-semibold text-slate-800">{item.district}</h4>
                  <p className="text-[10px] text-slate-400">{item.planningUnits} Planning Units</p>
                </div>
              </div>

              <div className="text-right flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 metric-number">
                  {item.val.toFixed(1)}%
                </span>
                <span className="inline-flex items-center text-[10px] font-medium text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                  <ArrowDownRight className="w-3 h-3" />
                  {item.delta.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
