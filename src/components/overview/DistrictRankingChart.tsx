import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  Cell
} from 'recharts';
import { DistrictAggregate, GrandAggregate } from '../../types/indicator';
import { INDICATOR_DICTIONARY, getIndicatorById } from '../../data/indicatorDictionary';

interface DistrictRankingChartProps {
  districtAggregates: DistrictAggregate[];
  grandAggregate: GrandAggregate;
  selectedIndicatorId: string;
  onSelectIndicator: (id: string) => void;
  onSelectDistrict?: (districtName: string) => void;
}

export const DistrictRankingChart: React.FC<DistrictRankingChartProps> = ({
  districtAggregates,
  grandAggregate,
  selectedIndicatorId,
  onSelectIndicator,
  onSelectDistrict
}) => {
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const currentIndicator = getIndicatorById(selectedIndicatorId) || INDICATOR_DICTIONARY[0];
  const stateVal = grandAggregate.indicatorValues[selectedIndicatorId]?.percentage ?? 0;
  const targetVal = currentIndicator.target ?? 90;

  // Prepare chart data
  const chartData = districtAggregates.map(d => {
    const calc = d.indicatorValues[selectedIndicatorId];
    const val = calc?.percentage ?? 0;
    return {
      district: d.district,
      percentage: val,
      numerator: calc?.numerator ?? 0,
      denominator: calc?.denominator ?? 0,
      status: calc?.status ?? 'neutral',
      totalPUs: d.totalPlanningUnits
    };
  });

  chartData.sort((a, b) => {
    if (sortOrder === 'desc') return b.percentage - a.percentage;
    return a.percentage - b.percentage;
  });

  // Color mapper based on status
  const getBarColor = (item: typeof chartData[0]) => {
    if (item.status === 'good') return '#10B981'; // Emerald
    if (item.status === 'warning') return '#F59E0B'; // Amber
    if (item.status === 'danger') return '#EF4444'; // Red
    return '#64748B';
  };

  const primaryIndicators = INDICATOR_DICTIONARY.filter(i => i.isPrimaryKpi || ['teams_visited_area', 'working_as_per_mp', 'both_da_trained', 'persons_administered', 'supervisor_ever_visited', 'marker_pen_available'].includes(i.id));

  return (
    <div className="card-subtle rounded-xl p-6 bg-white">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-surface-border mb-6">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>District Performance Ranking</span>
            <span className="text-xs font-normal text-slate-500">
              ({districtAggregates.length} Districts)
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Ranked by <strong className="text-slate-700">{currentIndicator.name}</strong> • State Avg:{' '}
            <strong className="text-mda-700">{stateVal.toFixed(1)}%</strong>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Indicator Selector */}
          <select
            value={selectedIndicatorId}
            onChange={e => onSelectIndicator(e.target.value)}
            className="text-xs bg-surface-subtle border border-surface-border text-slate-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-mda-700"
          >
            {primaryIndicators.map(ind => (
              <option key={ind.id} value={ind.id}>
                {ind.shortName} ({ind.code})
              </option>
            ))}
          </select>

          {/* Sort Toggle */}
          <button
            onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-surface-border bg-white hover:bg-surface-subtle text-slate-600 transition-colors"
            title="Toggle sort direction"
          >
            {sortOrder === 'desc' ? 'Highest First' : 'Lowest First'}
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[480px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 90, bottom: 5 }}
          >
            <XAxis
              type="number"
              domain={[0, 100]}
              tickFormatter={v => `${v}%`}
              tick={{ fontSize: 11, fill: '#64748B' }}
            />
            <YAxis
              type="category"
              dataKey="district"
              tick={{ fontSize: 11, fill: '#334155', fontWeight: 500 }}
              width={85}
              onClick={(e: any) => {
                if (e && e.value && onSelectDistrict) {
                  onSelectDistrict(e.value);
                }
              }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const data = payload[0].payload;
                return (
                  <div className="bg-slate-900 text-white rounded-lg p-3 text-xs shadow-xl border border-slate-800">
                    <p className="font-bold text-sm text-white mb-1">{data.district}</p>
                    <p className="text-slate-300">
                      {currentIndicator.name}: <strong className="text-emerald-400">{data.percentage.toFixed(1)}%</strong>
                    </p>
                    <p className="text-slate-400 text-[11px] mt-1">
                      {currentIndicator.numeratorLabel}: {data.numerator.toLocaleString()} / {currentIndicator.denominatorLabel}: {data.denominator.toLocaleString()}
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      Planning Units: {data.totalPUs}
                    </p>
                  </div>
                );
              }}
            />
            {/* Target Reference Line */}
            {targetVal > 0 && (
              <ReferenceLine
                x={targetVal}
                stroke="#0F766E"
                strokeDasharray="4 4"
                label={{
                  value: `Target: ${targetVal}%`,
                  position: 'top',
                  fill: '#0F766E',
                  fontSize: 10,
                  fontWeight: 600
                }}
              />
            )}
            {/* State Average Reference Line */}
            <ReferenceLine
              x={stateVal}
              stroke="#D97706"
              strokeDasharray="3 3"
              label={{
                value: `State: ${stateVal.toFixed(1)}%`,
                position: 'bottom',
                fill: '#D97706',
                fontSize: 10,
                fontWeight: 600
              }}
            />
            <Bar
              dataKey="percentage"
              radius={[0, 4, 4, 0]}
              onClick={(entry: any) => {
                if (entry && entry.district && onSelectDistrict) {
                  onSelectDistrict(entry.district);
                }
              }}
              cursor="pointer"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500" />
            Target Met
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-500" />
            Watchlist
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-500" />
            Needs Attention
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-slate-600">
            <span className="w-3 h-0.5 border-t border-dashed border-[#0F766E]" /> Target
          </span>
          <span className="flex items-center gap-1 text-slate-600">
            <span className="w-3 h-0.5 border-t border-dashed border-[#D97706]" /> State Avg
          </span>
        </div>
      </div>
    </div>
  );
};
