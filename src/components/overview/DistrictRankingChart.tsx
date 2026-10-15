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
import { ArrowUpDown, Search, BarChart3, ChevronRight } from 'lucide-react';

interface DistrictRankingChartProps {
  districtAggregates: DistrictAggregate[];
  grandAggregate: GrandAggregate;
  selectedIndicatorId: string;
  onSelectIndicator: (id: string) => void;
  onSelectDistrict: (districtName: string) => void;
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
  const [quickFilter, setQuickFilter] = useState<'all' | 'watchlist' | 'top'>('all');

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

    // Search filter
    if (searchDistrict) {
      const q = searchDistrict.toLowerCase();
      filtered = filtered.filter(d => d.district.toLowerCase().includes(q));
    }

    // Quick filter
    if (quickFilter === 'watchlist') {
      filtered = filtered.filter(d => d.status === 'danger' || d.status === 'warning');
    } else if (quickFilter === 'top') {
      filtered = filtered.filter(d => d.status === 'good');
    }

    const copy = [...filtered];
    copy.sort((a, b) => {
      if (sortOrder === 'desc') return b.percentage - a.percentage;
      return a.percentage - b.percentage;
    });
    return copy;
  }, [rawChartData, searchDistrict, quickFilter, sortOrder]);

  // Refined Color mapper
  const getBarColor = (item: typeof chartData[0]) => {
    if (item.status === 'good') return '#059669'; // Emerald
    if (item.status === 'warning') return '#D97706'; // Amber
    if (item.status === 'danger') return '#E11D48'; // Rose
    return '#64748B';
  };

  const primaryIndicators = INDICATOR_DICTIONARY.filter(i => 
    i.isPrimaryKpi || ['teams_visited_area', 'working_as_per_mp', 'both_da_trained', 'persons_administered', 'supervisor_ever_visited', 'marker_pen_available'].includes(i.id)
  );

  const dynamicHeight = Math.max(380, chartData.length * 24 + 50);

  return (
    <div className="card-subtle rounded-xl p-5 bg-white">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 border-b border-slate-100 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              District Comparative Ranking
            </h3>
            <span className="text-xs font-medium text-slate-500">
              ({chartData.length} of {districtAggregates.length} districts)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Click any bar or district to drill down into planning units.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Filter Pills */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
            <button
              onClick={() => setQuickFilter('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                quickFilter === 'all'
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({rawChartData.length})
            </button>
            <button
              onClick={() => setQuickFilter('watchlist')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                quickFilter === 'watchlist'
                  ? 'bg-white text-rose-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Needs Support ({rawChartData.filter(d => d.status === 'danger' || d.status === 'warning').length})
            </button>
            <button
              onClick={() => setQuickFilter('top')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                quickFilter === 'top'
                  ? 'bg-white text-emerald-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Target Met ({rawChartData.filter(d => d.status === 'good').length})
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="Search..."
              value={searchDistrict}
              onChange={e => setSearchDistrict(e.target.value)}
              className="pl-8 pr-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-mda-700 w-28 sm:w-36 font-medium"
            />
          </div>

          {/* Indicator Selector */}
          <select
            value={selectedIndicatorId}
            onChange={e => onSelectIndicator(e.target.value)}
            className="text-xs bg-white border border-slate-200 text-slate-800 font-semibold rounded-lg px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-mda-700 shadow-xs"
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
            className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium transition-colors shadow-xs"
            title="Toggle sort direction"
          >
            <ArrowUpDown className="w-3 h-3 text-slate-400" />
            <span>{sortOrder === 'desc' ? 'High to Low' : 'Low to High'}</span>
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div style={{ height: `${dynamicHeight}px` }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
          >
            <XAxis
              type="number"
              domain={[0, 100]}
              tickFormatter={v => `${v}%`}
              tick={{ fontSize: 10, fill: '#64748B' }}
              axisLine={{ stroke: '#E2E8F0' }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="district"
              tick={{ fontSize: 11, fill: '#1E293B', fontWeight: 600, cursor: 'pointer' }}
              width={110}
              axisLine={{ stroke: '#E2E8F0' }}
              tickLine={false}
              onClick={(e: any) => {
                if (e && e.value) onSelectDistrict(e.value);
              }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(20, 108, 80, 0.04)' }}
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const d = payload[0].payload;
                const variance = Math.round((d.percentage - stateVal) * 10) / 10;
                return (
                  <div className="bg-white border border-slate-200 rounded-lg p-3 text-xs shadow-md min-w-[180px]">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-1.5">
                      <span className="font-bold text-slate-900">{d.district}</span>
                      <span className="text-[10px] text-slate-500">{d.totalPUs} PUs</span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">{currentIndicator.shortName}:</span>
                        <span className="font-bold text-slate-900">{d.percentage.toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>Counts:</span>
                        <span className="font-mono text-slate-700">
                          {d.numerator} / {d.denominator}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100 mt-1">
                        <span className="text-slate-500">vs State:</span>
                        <span className={`font-semibold ${variance >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                          {variance >= 0 ? `+${variance}%` : `${variance}%`}
                        </span>
                      </div>
                    </div>
                    <p className="text-[10px] text-mda-700 font-semibold mt-2 text-center">
                      Click to drill down into planning units →
                    </p>
                  </div>
                );
              }}
            />
            {targetVal > 0 && (
              <ReferenceLine
                x={targetVal}
                stroke="#059669"
                strokeWidth={1.5}
                strokeDasharray="3 3"
              />
            )}
            <ReferenceLine
              x={stateVal}
              stroke="#D97706"
              strokeWidth={1.5}
              strokeDasharray="2 2"
            />
            <Bar
              dataKey="percentage"
              barSize={16}
              radius={[0, 4, 4, 0]}
              onClick={(entry: any) => {
                if (entry && entry.district) onSelectDistrict(entry.district);
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

      {/* Clean Bottom Legend */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-medium">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-600" />
            Target Met
          </span>
          <span className="flex items-center gap-1 font-medium">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
            Watchlist
          </span>
          <span className="flex items-center gap-1 font-medium">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-600" />
            Needs Attention
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          {targetVal > 0 && (
            <span className="flex items-center gap-1 text-slate-700 font-medium">
              <span className="w-3 h-0.5 bg-emerald-600 inline-block" /> Target ({targetVal}%)
            </span>
          )}
          <span className="flex items-center gap-1 text-slate-700 font-medium">
            <span className="w-3 h-0.5 bg-amber-500 inline-block" /> State Avg ({stateVal.toFixed(1)}%)
          </span>
        </div>
      </div>
    </div>
  );
};
