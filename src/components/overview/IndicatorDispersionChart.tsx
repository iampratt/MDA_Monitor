import React, { useState } from 'react';
import { DistrictAggregate, GrandAggregate } from '../../types/indicator';
import { INDICATOR_DICTIONARY, getIndicatorById } from '../../data/indicatorDictionary';

interface IndicatorDispersionChartProps {
  districtAggregates: DistrictAggregate[];
  grandAggregate: GrandAggregate;
  onSelectDistrict?: (districtName: string) => void;
}

// Curate key percentage indicators representing different operational pillars
const DEFAULT_DISPERSION_INDICATOR_IDS = [
  'teams_visited_area',      // BG: Coverage
  'working_as_per_mp',        // BH: Microplanning
  'both_da_trained',          // BK: Training
  'sufficient_ida_tablets',   // BL: Logistics
  'supervisor_ever_visited',  // BU: Supervision
  'persons_administered',     // CE: Consumption
  'family_informed_mda',      // BQ: IEC
  'da_reporting_completed'    // CR: Reporting
];

export const IndicatorDispersionChart: React.FC<IndicatorDispersionChartProps> = ({
  districtAggregates,
  grandAggregate,
  onSelectDistrict
}) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const dispersionData = DEFAULT_DISPERSION_INDICATOR_IDS.map(id => {
    const indicator = getIndicatorById(id);
    if (!indicator) return null;

    const stateVal = grandAggregate.indicatorValues[id]?.percentage ?? 0;
    
    // Calculate distribution across all districts
    const districtValues = districtAggregates
      .map(d => ({
        district: d.district,
        val: d.indicatorValues[id]?.percentage ?? null
      }))
      .filter((d): d is { district: string; val: number } => d.val !== null);

    if (districtValues.length === 0) return null;

    districtValues.sort((a, b) => a.val - b.val);

    const minItem = districtValues[0];
    const maxItem = districtValues[districtValues.length - 1];
    const medianVal = districtValues[Math.floor(districtValues.length / 2)].val;
    const spread = maxItem.val - minItem.val;

    return {
      id,
      code: indicator.code,
      name: indicator.name,
      shortName: indicator.shortName,
      category: indicator.category,
      stateVal,
      minDistrict: minItem.district,
      minVal: minItem.val,
      maxDistrict: maxItem.district,
      maxVal: maxItem.val,
      medianVal,
      spread,
      allDistricts: districtValues
    };
  }).filter(Boolean);

  return (
    <div className="card-subtle rounded-xl p-5 bg-white border border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 mb-4 gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            District Variance & Performance Dispersion
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Dumbbell range plot mapping the spread between the lowest-performing and highest-performing districts alongside the state benchmark.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
            <span>Min / Max District</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-mda-700 ring-2 ring-mda-100"></span>
            <span className="font-semibold text-slate-800">State Benchmark</span>
          </div>
        </div>
      </div>

      {/* Dispersion Ranges List */}
      <div className="space-y-4">
        {dispersionData.map(item => {
          if (!item) return null;
          const isHovered = activeTooltip === item.id;

          return (
            <div
              key={item.id}
              onMouseEnter={() => setActiveTooltip(item.id)}
              onMouseLeave={() => setActiveTooltip(null)}
              className="p-3 rounded-lg border border-slate-100 hover:border-slate-300 hover:bg-slate-50/50 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                    {item.code}
                  </span>
                  <span className="text-xs font-bold text-slate-800">
                    {item.shortName}
                  </span>
                  <span className="text-[10px] text-slate-400 hidden md:inline truncate max-w-xs">
                    ({item.category})
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="text-slate-400 text-[11px]">
                    Spread: <strong className="text-slate-700 font-mono">{item.spread.toFixed(1)}%</strong>
                  </span>
                  <span className="text-mda-800 font-bold bg-mda-50 px-2 py-0.5 rounded border border-mda-100 font-mono">
                    State: {item.stateVal.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Range Track */}
              <div className="relative h-7 w-full flex items-center">
                {/* 0-100% Background Track */}
                <div className="absolute inset-x-0 h-1.5 bg-slate-100 rounded-full"></div>

                {/* Grid guidelines at 25%, 50%, 75% */}
                <div className="absolute left-[25%] top-0 bottom-0 w-px bg-slate-200"></div>
                <div className="absolute left-[50%] top-0 bottom-0 w-px bg-slate-200"></div>
                <div className="absolute left-[75%] top-0 bottom-0 w-px bg-slate-200"></div>

                {/* Range Bar connecting Min to Max */}
                <div
                  className="absolute h-2 bg-gradient-to-r from-slate-300 via-slate-400 to-slate-300 rounded-full opacity-80"
                  style={{
                    left: `${Math.max(0, item.minVal)}%`,
                    width: `${Math.max(1, item.maxVal - item.minVal)}%`
                  }}
                ></div>

                {/* Min District Dot */}
                <button
                  type="button"
                  onClick={() => onSelectDistrict?.(item.minDistrict)}
                  title={`Min: ${item.minDistrict} (${item.minVal.toFixed(1)}%)`}
                  className="absolute w-3.5 h-3.5 -ml-1.75 rounded-full bg-slate-600 hover:bg-slate-900 border-2 border-white shadow-xs z-10 transition-transform hover:scale-125 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  style={{ left: `${item.minVal}%` }}
                />

                {/* Max District Dot */}
                <button
                  type="button"
                  onClick={() => onSelectDistrict?.(item.maxDistrict)}
                  title={`Max: ${item.maxDistrict} (${item.maxVal.toFixed(1)}%)`}
                  className="absolute w-3.5 h-3.5 -ml-1.75 rounded-full bg-slate-600 hover:bg-slate-900 border-2 border-white shadow-xs z-10 transition-transform hover:scale-125 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  style={{ left: `${item.maxVal}%` }}
                />

                {/* State Aggregate Benchmark Dot */}
                <div
                  title={`State Aggregate: ${item.stateVal.toFixed(1)}%`}
                  className="absolute w-4.5 h-4.5 -ml-2.25 rounded-full bg-mda-700 border-2 border-white shadow-md z-20 flex items-center justify-center ring-2 ring-mda-200/50"
                  style={{ left: `${item.stateVal}%` }}
                >
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              </div>

              {/* Bottom Labels showing Min District vs Max District */}
              <div className="flex items-center justify-between text-[10px] text-slate-500 mt-0.5">
                <span
                  onClick={() => onSelectDistrict?.(item.minDistrict)}
                  className="cursor-pointer hover:text-slate-900 hover:underline"
                >
                  Min: <span className="font-semibold text-slate-700">{item.minDistrict}</span> ({item.minVal.toFixed(1)}%)
                </span>
                <span
                  onClick={() => onSelectDistrict?.(item.maxDistrict)}
                  className="cursor-pointer hover:text-slate-900 hover:underline"
                >
                  Max: <span className="font-semibold text-slate-700">{item.maxDistrict}</span> ({item.maxVal.toFixed(1)}%)
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Axis Scale Legend */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span>0%</span>
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>100%</span>
      </div>
    </div>
  );
};
