import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip
} from 'recharts';
import { GrandAggregate } from '../../types/indicator';
import { CATEGORIES, INDICATOR_DICTIONARY } from '../../data/indicatorDictionary';

interface PillarRadarChartProps {
  grandAggregate: GrandAggregate;
  onSelectIndicator?: (indicatorId: string) => void;
}

export const PillarRadarChart: React.FC<PillarRadarChartProps> = ({
  grandAggregate,
  onSelectIndicator
}) => {
  const radarData = CATEGORIES.map(category => {
    const indicatorsInCat = INDICATOR_DICTIONARY.filter(i => i.category === category);
    const primaryInd = indicatorsInCat.find(i => i.isPrimaryKpi) || indicatorsInCat[0];
    const calcVal = primaryInd ? grandAggregate.indicatorValues[primaryInd.id] : undefined;
    const pct = calcVal?.percentage ?? 0;

    return {
      category,
      shortLabel: category.length > 18 ? category.split(' ')[0] + '...' : category,
      fullCategory: category,
      primaryIndicatorId: primaryInd?.id,
      primaryIndicatorName: primaryInd?.shortName || primaryInd?.name || '',
      indicatorCode: primaryInd?.code || '',
      percentage: Number(pct.toFixed(1)),
      numerator: calcVal?.numerator ?? 0,
      denominator: calcVal?.denominator ?? 0
    };
  });

  return (
    <div className="card-subtle rounded-xl p-5 bg-white border border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 mb-4 gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            10 Thematic Pillars Balance Profile
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Polar radar mapping statewide performance across all 10 concurrent monitoring thematic pillars.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
          <span className="font-semibold text-slate-700">State Aggregate %</span>
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="72%" data={radarData}>
            <PolarGrid stroke="#E2E8F0" strokeDasharray="3 3" />
            <PolarAngleAxis
              dataKey="shortLabel"
              tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: '#94A3B8', fontSize: 9 }}
              tickFormatter={v => `${v}%`}
              stroke="#CBD5E1"
            />
            <Radar
              name="State Performance"
              dataKey="percentage"
              stroke="#059669"
              fill="#10B981"
              fillOpacity={0.25}
              strokeWidth={2}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-white border border-slate-200 rounded-lg p-3 text-xs shadow-lg max-w-xs">
                    <p className="font-bold text-slate-900 mb-1">{d.fullCategory}</p>
                    <p className="text-slate-500 text-[11px] mb-2">{d.primaryIndicatorName}</p>
                    <div className="flex items-center justify-between gap-4 py-1 border-t border-slate-100">
                      <span className="text-slate-500 font-medium">State Aggregate:</span>
                      <span className="font-bold text-slate-900 metric-number">{d.percentage}%</span>
                    </div>
                    {d.denominator > 0 && (
                      <div className="flex items-center justify-between gap-4 text-slate-400 text-[11px]">
                        <span>Field Counts:</span>
                        <span className="font-mono text-slate-600 font-medium">
                          {d.numerator.toLocaleString()} / {d.denominator.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {onSelectIndicator && d.primaryIndicatorId && (
                      <p className="mt-2 text-[10px] text-mda-700 font-semibold cursor-pointer underline">
                        Click pillar card below to see district rankings &rarr;
                      </p>
                    )}
                  </div>
                );
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
        {radarData.map(item => (
          <div
            key={item.category}
            onClick={() => item.primaryIndicatorId && onSelectIndicator?.(item.primaryIndicatorId)}
            className="p-1.5 rounded bg-slate-50 border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors"
          >
            <p className="text-[10px] text-slate-500 truncate" title={item.fullCategory}>
              {item.category}
            </p>
            <p className="font-bold text-slate-900 metric-number">
              {item.percentage}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
