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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Top 5 */}
      <div className="p-[3px] rounded-2xl bg-gradient-to-b from-slate-100/90 to-slate-200/50 border border-slate-200/70 shadow-xs">
        <div className="rounded-[13px] p-4 sm:p-5 bg-white border border-slate-100/80 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/50 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">Highest Performing Districts</h3>
                <p className="text-xs text-slate-500">Above State Average ({stateVal.toFixed(1)}%) on {currentIndicator?.shortName}</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full shadow-2xs">
              Top 5
            </span>
          </div>

          <div className="space-y-1.5" role="list" aria-label="Top 5 highest performing districts">
            {top5.map((item, idx) => (
              <div
                key={item.district}
                role="button"
                tabIndex={0}
                onClick={() => onSelectDistrict(item.district)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectDistrict(item.district);
                  }
                }}
                aria-label={`Drill down into ${item.district} (${item.val.toFixed(1)}%)`}
                className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50/50 cursor-pointer transition-all border border-transparent hover:border-emerald-200/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-black flex items-center justify-center font-mono group-hover:bg-emerald-100 group-hover:text-emerald-800 transition-colors">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-emerald-950 transition-colors">
                      {item.district}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {item.planningUnits} Planning Units
                    </p>
                  </div>
                </div>

                <div className="text-right flex items-center gap-2.5">
                  <span className="text-xs font-black text-slate-900 metric-number">
                    {item.val.toFixed(1)}%
                  </span>
                  <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/50">
                    <ArrowUpRight className="w-3 h-3 mr-0.5" />
                    +{Math.abs(item.delta).toFixed(1)}%
                  </span>
                  {/* Button-in-Button nested icon container */}
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all transform group-hover:translate-x-0.5 shadow-2xs">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom 5 */}
      <div className="p-[3px] rounded-2xl bg-gradient-to-b from-slate-100/90 to-slate-200/50 border border-slate-200/70 shadow-xs">
        <div className="rounded-[13px] p-4 sm:p-5 bg-white border border-slate-100/80 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 border border-rose-200/50 flex items-center justify-center">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 tracking-tight">Lowest Performing Districts</h3>
                <p className="text-xs text-slate-500">Below State Average ({stateVal.toFixed(1)}%) on {currentIndicator?.shortName}</p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-rose-800 bg-rose-50 border border-rose-200/60 px-2.5 py-0.5 rounded-full shadow-2xs">
              Bottom 5
            </span>
          </div>

          <div className="space-y-1.5" role="list" aria-label="Bottom 5 districts needing priority support">
            {bottom5.map((item, idx) => (
              <div
                key={item.district}
                role="button"
                tabIndex={0}
                onClick={() => onSelectDistrict(item.district)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectDistrict(item.district);
                  }
                }}
                aria-label={`Drill down into ${item.district} (${item.val.toFixed(1)}%)`}
                className="group flex items-center justify-between p-2.5 rounded-xl hover:bg-rose-50/50 cursor-pointer transition-all border border-transparent hover:border-rose-200/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-600"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-black flex items-center justify-center font-mono group-hover:bg-rose-100 group-hover:text-rose-800 transition-colors">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-rose-950 transition-colors">
                      {item.district}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {item.planningUnits} Planning Units
                    </p>
                  </div>
                </div>

                <div className="text-right flex items-center gap-2.5">
                  <span className="text-xs font-black text-slate-900 metric-number">
                    {item.val.toFixed(1)}%
                  </span>
                  <span className="inline-flex items-center text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200/50">
                    <ArrowDownRight className="w-3 h-3 mr-0.5" />
                    {item.delta.toFixed(1)}%
                  </span>
                  {/* Button-in-Button nested icon container */}
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-rose-600 group-hover:text-white transition-all transform group-hover:translate-x-0.5 shadow-2xs">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
