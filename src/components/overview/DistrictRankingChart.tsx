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
import { ArrowUpDown, Search, BarChart3, ChevronRight, X, RotateCcw, AlertCircle } from 'lucide-react';

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
  const [quickFilter, setQuickFilter] = useState<'all' | 'above' | 'below'>('all');

  const currentIndicator = getIndicatorById(selectedIndicatorId) || INDICATOR_DICTIONARY[0];
  const stateVal = grandAggregate.indicatorValues[selectedIndicatorId]?.percentage ?? 0;

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

    // Quick filter against real State Average
    if (quickFilter === 'above') {
      filtered = filtered.filter(d => d.percentage >= stateVal);
    } else if (quickFilter === 'below') {
      filtered = filtered.filter(d => d.percentage < stateVal);
    }

    const copy = [...filtered];
    copy.sort((a, b) => {
      if (sortOrder === 'desc') return b.percentage - a.percentage;
      return a.percentage - b.percentage;
    });
    return copy;
  }, [rawChartData, searchDistrict, quickFilter, sortOrder, stateVal]);

  // Bar color based on actual State Average
  const getBarColor = (item: typeof chartData[0]) => {
    return item.percentage >= stateVal ? '#2563eb' : '#64748b';
  };

  const primaryIndicators = INDICATOR_DICTIONARY.filter(i => 
    i.isPrimaryKpi || ['teams_visited_area', 'working_as_per_mp', 'both_da_trained', 'persons_administered', 'supervisor_ever_visited', 'marker_pen_available'].includes(i.id)
  );

  const dynamicHeight = Math.max(320, chartData.length * 24 + 50);

  const handleResetFilters = () => {
    setSearchDistrict('');
    setQuickFilter('all');
  };

  return (
    <div className="card-subtle rounded-xl p-5 bg-white border border-slate-200">
      {/* Header & Controls */}
      <div className="flex flex-col gap-3 pb-4 border-b border-slate-100 mb-4">
        {/* Tier 1: Title & Indicator Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                District Comparative Ranking
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {chartData.length} of {districtAggregates.length} districts
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any bar or district to drill down into planning units.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <label htmlFor="ranking-indicator-select" className="text-xs font-medium text-slate-500">
              Metric:
            </label>
            <select
              id="ranking-indicator-select"
              value={selectedIndicatorId}
              onChange={e => onSelectIndicator(e.target.value)}
              aria-label="Select monitoring indicator for district comparison"
              className="text-xs bg-white border border-slate-200 text-slate-800 font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-mda-700 shadow-xs max-w-[240px] truncate"
            >
              {primaryIndicators.map(ind => (
                <option key={ind.id} value={ind.id}>
                  {ind.shortName} ({ind.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tier 2: Filter Toolbar (Pill Segmented Control + Search + Sort) */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
          {/* Quick Filter Segmented Pills */}
          <div
            role="group"
            aria-label="Filter districts by performance compared to State Average"
            className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium"
          >
            <button
              type="button"
              onClick={() => setQuickFilter('all')}
              aria-pressed={quickFilter === 'all'}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                quickFilter === 'all'
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({rawChartData.length})
            </button>
            <button
              type="button"
              onClick={() => setQuickFilter('above')}
              aria-pressed={quickFilter === 'above'}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                quickFilter === 'above'
                  ? 'bg-white text-blue-700 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Above State Avg ({rawChartData.filter(d => d.percentage >= stateVal).length})
            </button>
            <button
              type="button"
              onClick={() => setQuickFilter('below')}
              aria-pressed={quickFilter === 'below'}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                quickFilter === 'below'
                  ? 'bg-white text-slate-800 font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Below State Avg ({rawChartData.filter(d => d.percentage < stateVal).length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Search with Clear */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search district..."
                value={searchDistrict}
                onChange={e => setSearchDistrict(e.target.value)}
                aria-label="Search districts by name"
                className="pl-8 pr-7 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-mda-700 w-32 sm:w-44 font-medium"
              />
              {searchDistrict && (
                <button
                  type="button"
                  onClick={() => setSearchDistrict('')}
                  aria-label="Clear district search"
                  className="absolute right-2 top-1.5 p-0.5 text-slate-400 hover:text-slate-600 rounded"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Sort Toggle */}
            <button
              type="button"
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              aria-label={`Toggle sort order: currently ${sortOrder === 'desc' ? 'High to Low' : 'Low to High'}`}
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium transition-colors shadow-xs"
              title="Toggle sort direction"
            >
              <ArrowUpDown className="w-3 h-3 text-slate-400" />
              <span>{sortOrder === 'desc' ? 'High to Low' : 'Low to High'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Empty State when no districts match */}
      {chartData.length === 0 ? (
        <div className="py-14 px-4 text-center flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-xl my-3 bg-slate-50/50">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2.5">
            <Search className="w-5 h-5 text-slate-400" />
          </div>
          <h4 className="text-sm font-bold text-slate-800 mb-1">No matching districts found</h4>
          <p className="text-xs text-slate-500 max-w-sm mb-4">
            {searchDistrict
              ? `No districts match the search "${searchDistrict}" in the current filter.`
              : 'No districts match the selected performance filter status.'}
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset filters</span>
          </button>
        </div>
      ) : (
        <>
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
                <ReferenceLine
                  x={stateVal}
                  stroke="#2563eb"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
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
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-600" />
                ≥ State Average
              </span>
              <span className="flex items-center gap-1 font-medium">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-500" />
                &lt; State Average
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-slate-700 font-medium">
                <span className="w-3.5 h-0.5 bg-blue-600 inline-block border-b border-dashed border-blue-600" /> State Avg ({stateVal.toFixed(1)}%)
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
