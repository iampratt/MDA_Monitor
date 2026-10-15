import React, { useState, useMemo } from 'react';
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
import { ArrowUpDown, Search, BarChart3, Info } from 'lucide-react';

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
  const [searchDistrict, setSearchDistrict] = useState('');

  const currentIndicator = getIndicatorById(selectedIndicatorId) || INDICATOR_DICTIONARY[0];
  const stateVal = grandAggregate.indicatorValues[selectedIndicatorId]?.percentage ?? 0;
  const targetVal = currentIndicator.target ?? 90;

  // Prepare chart data
  const rawChartData = useMemo(() => {
    return districtAggregates.map(d => {
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
  }, [districtAggregates, selectedIndicatorId]);

  // Filter and sort
  const chartData = useMemo(() => {
    let filtered = rawChartData;
    if (searchDistrict) {
      const q = searchDistrict.toLowerCase();
      filtered = filtered.filter(d => d.district.toLowerCase().includes(q));
    }
    const copy = [...filtered];
    copy.sort((a, b) => {
      if (sortOrder === 'desc') return b.percentage - a.percentage;
      return a.percentage - b.percentage;
    });
    return copy;
  }, [rawChartData, searchDistrict, sortOrder]);

  // Color mapper based on status
  const getBarColor = (item: typeof chartData[0]) => {
    if (item.status === 'good') return '#10B981'; // Emerald
    if (item.status === 'warning') return '#F59E0B'; // Amber
    if (item.status === 'danger') return '#EF4444'; // Rose
    return '#64748B';
  };

  const primaryIndicators = INDICATOR_DICTIONARY.filter(i => 
    i.isPrimaryKpi || ['teams_visited_area', 'working_as_per_mp', 'both_da_trained', 'persons_administered', 'supervisor_ever_visited', 'marker_pen_available'].includes(i.id)
  );

  // Dynamic height calculation: minimum 550px, 30px per bar for crisp breathing room
  const dynamicHeight = Math.max(520, chartData.length * 28 + 60);

  return (
    <div className="card-subtle rounded-2xl p-6 bg-white shadow-card">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-surface-border mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-mda-50 text-mda-700">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              District Performance Ranking
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {chartData.length} of {districtAggregates.length} Districts
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Comparing <strong className="text-slate-800">{currentIndicator.name}</strong> • State Average:{' '}
            <strong className="text-mda-700 font-bold">{stateVal.toFixed(1)}%</strong>
            {targetVal > 0 && <span> • Target: <strong className="text-slate-700">{targetVal}%</strong></span>}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Filter district..."
              value={searchDistrict}
              onChange={e => setSearchDistrict(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-surface-subtle border border-surface-border rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-mda-700 w-36 sm:w-44"
            />
          </div>

          {/* Indicator Selector */}
          <select
            value={selectedIndicatorId}
            onChange={e => onSelectIndicator(e.target.value)}
            className="text-xs bg-surface-subtle border border-surface-border text-slate-800 font-medium rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-mda-700 shadow-xs"
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
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-surface-border bg-white hover:bg-surface-subtle text-slate-700 font-medium transition-colors shadow-xs"
            title="Toggle sort direction"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span>{sortOrder === 'desc' ? 'High to Low' : 'Low to High'}</span>
          </button>
        </div>
      </div>

      {/* Chart Container with ample width for labels */}
      <div style={{ height: `${dynamicHeight}px` }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 35, left: 15, bottom: 10 }}
          >
            <XAxis
              type="number"
              domain={[0, 100]}
              tickFormatter={v => `${v}%`}
              tick={{ fontSize: 11, fill: '#64748B', fontWeight: 500 }}
              axisLine={{ stroke: '#E2E8F0' }}
              tickLine={{ stroke: '#E2E8F0' }}
            />
            <YAxis
              type="category"
              dataKey="district"
              tick={{ fontSize: 11, fill: '#1E293B', fontWeight: 600 }}
              width={130} // Expanded from 85 to 130 to guarantee NO truncation
              axisLine={{ stroke: '#E2E8F0' }}
              tickLine={false}
              onClick={(e: any) => {
                if (e && e.value && onSelectDistrict) {
                  onSelectDistrict(e.value);
                }
              }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(20, 108, 80, 0.05)' }}
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const d = payload[0].payload;
                const variance = Math.round((d.percentage - stateVal) * 10) / 10;
                return (
                  <div className="bg-slate-900 text-white rounded-xl p-3 text-xs shadow-xl border border-slate-800 min-w-[200px]">
                    <div className="flex items-center justify-between border-b border-slate-700 pb-1.5 mb-2">
                      <span className="font-bold text-sm text-white">{d.district}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{d.totalPUs} PUs</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">{currentIndicator.shortName}:</span>
                        <span className="font-bold text-emerald-400 text-sm">{d.percentage.toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Counts:</span>
                        <span className="text-slate-300 font-mono">
                          {d.numerator.toLocaleString()} / {d.denominator.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800 mt-1">
                        <span className="text-slate-400">vs State Avg:</span>
                        <span className={`font-semibold ${variance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {variance >= 0 ? `+${variance}%` : `${variance}%`}
                        </span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2 text-center italic">
                      Click to drill-down into district
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
                strokeWidth={1.5}
                strokeDasharray="4 4"
                label={{
                  value: `Target: ${targetVal}%`,
                  position: 'top',
                  fill: '#0F766E',
                  fontSize: 11,
                  fontWeight: 700
                }}
              />
            )}
            {/* State Average Reference Line */}
            <ReferenceLine
              x={stateVal}
              stroke="#D97706"
              strokeWidth={1.5}
              strokeDasharray="3 3"
              label={{
                value: `State: ${stateVal.toFixed(1)}%`,
                position: 'bottom',
                fill: '#D97706',
                fontSize: 11,
                fontWeight: 700
              }}
            />
            <Bar
              dataKey="percentage"
              barSize={18} // Crisp bar thickness
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

      {/* Legend & Footnotes */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-3 h-3 rounded-sm bg-emerald-500" />
            Target Met ({chartData.filter(d => d.status === 'good').length})
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-3 h-3 rounded-sm bg-amber-500" />
            Watchlist ({chartData.filter(d => d.status === 'warning').length})
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <span className="w-3 h-3 rounded-sm bg-rose-500" />
            Needs Attention ({chartData.filter(d => d.status === 'danger').length})
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
            <span className="w-4 h-0.5 border-t-2 border-dashed border-[#0F766E]" /> Target ({targetVal}%)
          </span>
          <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
            <span className="w-4 h-0.5 border-t-2 border-dashed border-[#D97706]" /> State Avg ({stateVal.toFixed(1)}%)
          </span>
        </div>
      </div>
    </div>
  );
};
