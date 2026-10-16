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
      {/* Top 5 Highest Performing */}
      <div className="bento-card p-5 bg-white border border-[#EAEAEA] rounded-xl">
        <div className="flex items-center justify-between pb-3.5 border-b border-[#F1F5F9] mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-sm font-serif font-normal text-[#0F172A]">Highest Performing Districts</h3>
              <p className="text-[11px] text-[#64748B]">Above State Benchmark ({stateVal.toFixed(1)}%) • {currentIndicator?.shortName}</p>
            </div>
          </div>
          <span className="text-[10px] font-medium uppercase tracking-[0.05em] text-[#065F46] bg-[#ECFDF5] border border-[#A7F3D0] px-2.5 py-0.5 rounded-full">
            Top 5
          </span>
        </div>

        <div className="space-y-1" role="list" aria-label="Top 5 highest performing districts">
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
              aria-label={`Inspect ${item.district} (${item.val.toFixed(1)}%)`}
              className="group flex items-center justify-between p-2 rounded-lg hover:bg-[#F0FDF4]/50 cursor-pointer transition-colors border border-transparent hover:border-[#BBF7D0] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#059669]"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded bg-[#ECFDF5] text-[#065F46] text-[10.5px] font-mono font-medium flex items-center justify-center border border-[#A7F3D0]">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="text-xs font-medium text-[#1E293B] group-hover:text-[#065F46] transition-colors">
                    {item.district}
                  </h4>
                  <p className="text-[10px] text-[#64748B]">
                    {item.planningUnits} Planning Units
                  </p>
                </div>
              </div>

              <div className="text-right flex items-center gap-2">
                <span className="text-xs font-serif font-medium text-[#0F172A] metric-number">
                  {item.val.toFixed(1)}%
                </span>
                <span className="inline-flex items-center text-[10px] font-medium text-[#065F46] bg-[#ECFDF5] px-1.5 py-0.5 rounded border border-[#A7F3D0]">
                  <ArrowUpRight className="w-3 h-3 mr-0.5" />
                  +{Math.abs(item.delta).toFixed(1)}%
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#CBD5E1] group-hover:text-[#059669] transition-colors ml-1" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom 5 Need Supervisory Focus */}
      <div className="bento-card p-5 bg-white border border-[#EAEAEA] rounded-xl">
        <div className="flex items-center justify-between pb-3.5 border-b border-[#F1F5F9] mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[#FFF1F2] text-[#E11D48] border border-[#FECDD3] flex items-center justify-center">
              <AlertCircle className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-sm font-serif font-normal text-[#0F172A]">Priority Supervisory Focus</h3>
              <p className="text-[11px] text-[#64748B]">Below State Benchmark ({stateVal.toFixed(1)}%) • {currentIndicator?.shortName}</p>
            </div>
          </div>
          <span className="text-[10px] font-medium uppercase tracking-[0.05em] text-[#9F1239] bg-[#FFF1F2] border border-[#FECDD3] px-2.5 py-0.5 rounded-full">
            Bottom 5
          </span>
        </div>

        <div className="space-y-1" role="list" aria-label="Bottom 5 lowest performing districts">
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
              aria-label={`Inspect ${item.district} (${item.val.toFixed(1)}%)`}
              className="group flex items-center justify-between p-2 rounded-lg hover:bg-[#FFF1F2]/50 cursor-pointer transition-colors border border-transparent hover:border-[#FECDD3] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E11D48]"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded bg-[#FFF1F2] text-[#9F1239] text-[10.5px] font-mono font-medium flex items-center justify-center border border-[#FECDD3]">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="text-xs font-medium text-[#1E293B] group-hover:text-[#9F1239] transition-colors">
                    {item.district}
                  </h4>
                  <p className="text-[10px] text-[#64748B]">
                    {item.planningUnits} Planning Units
                  </p>
                </div>
              </div>

              <div className="text-right flex items-center gap-2">
                <span className="text-xs font-serif font-medium text-[#0F172A] metric-number">
                  {item.val.toFixed(1)}%
                </span>
                <span className="inline-flex items-center text-[10px] font-medium text-[#9F1239] bg-[#FFF1F2] px-1.5 py-0.5 rounded border border-[#FECDD3]">
                  <ArrowDownRight className="w-3 h-3 mr-0.5" />
                  -{Math.abs(item.delta).toFixed(1)}%
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-[#CBD5E1] group-hover:text-[#E11D48] transition-colors ml-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
