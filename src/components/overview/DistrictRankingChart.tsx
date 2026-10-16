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
import { ArrowUpDown, Search, RotateCcw, X } from 'lucide-react';

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

  // Strategic color coding for data bars
  const getBarColor = (item: typeof chartData[0]) => {
    return item.percentage >= stateVal ? '#059669' : '#94A3B8';
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
    <div className="bento-card rounded-xl p-5 bg-white border border-[#EAEAEA]">
      {/* Header & Controls */}
      <div className="flex flex-col gap-3 pb-4 border-b border-[#EAEAEA] mb-4">
        {/* Tier 1: Title & Indicator Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-serif font-normal text-[#111111]">
                District Comparative Ranking
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                {chartData.length} of {districtAggregates.length} districts
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Click any bar or district name to inspect planning unit distribution.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <label htmlFor="ranking-indicator-select" className="text-xs text-[#64748B]">
              Metric:
            </label>
            <select
              id="ranking-indicator-select"
              value={selectedIndicatorId}
              onChange={e => onSelectIndicator(e.target.value)}
              aria-label="Select monitoring indicator for district comparison"
              className="text-xs bg-white border border-[#CBD5E1] text-[#0F172A] font-medium rounded-md px-2.5 py-1.5 focus:outline-none focus:border-[#14532D] max-w-[240px] truncate"
            >
              {primaryIndicators.map(ind => (
                <option key={ind.id} value={ind.id}>
                  {ind.shortName} ({ind.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tier 2: Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#F1F5F9]">
          {/* Quick Filter Segmented Buttons with Semantic Tints */}
          <div
            role="group"
            aria-label="Filter districts by performance compared to State Average"
            className="flex items-center bg-[#F1F5F9] p-0.5 rounded-md text-xs border border-[#E2E8F0]"
          >
            <button
              type="button"
              onClick={() => setQuickFilter('all')}
              aria-pressed={quickFilter === 'all'}
              className={`px-2.5 py-1 rounded transition-all active:scale-[0.98] ${
                quickFilter === 'all'
                  ? 'bg-[#0F172A] text-white font-medium shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              All ({rawChartData.length})
            </button>
            <button
              type="button"
              onClick={() => setQuickFilter('above')}
              aria-pressed={quickFilter === 'above'}
              className={`px-2.5 py-1 rounded transition-all active:scale-[0.98] ${
                quickFilter === 'above'
                  ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] font-medium shadow-xs'
                  : 'text-[#059669] hover:bg-[#ECFDF5]/60'
              }`}
            >
              ≥ State Avg ({rawChartData.filter(d => d.percentage >= stateVal).length})
            </button>
            <button
              type="button"
              onClick={() => setQuickFilter('below')}
              aria-pressed={quickFilter === 'below'}
              className={`px-2.5 py-1 rounded transition-all active:scale-[0.98] ${
                quickFilter === 'below'
                  ? 'bg-[#FFF1F2] text-[#9F1239] border border-[#FECDD3] font-medium shadow-xs'
                  : 'text-[#E11D48] hover:bg-[#FFF1F2]/60'
              }`}
            >
              &lt; State Avg ({rawChartData.filter(d => d.percentage < stateVal).length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-2.5 top-2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search district..."
                value={searchDistrict}
                onChange={e => setSearchDistrict(e.target.value)}
                aria-label="Search districts by name"
                className="pl-8 pr-7 py-1 text-xs bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#14532D] w-32 sm:w-44 font-normal"
              />
              {searchDistrict && (
                <button
                  type="button"
                  onClick={() => setSearchDistrict('')}
                  aria-label="Clear district search"
                  className="absolute right-2 top-1.5 p-0.5 text-[#94A3B8] hover:text-[#0F172A] rounded"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Sort Direction Toggle */}
            <button
              type="button"
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              aria-label={`Toggle sort order: currently ${sortOrder === 'desc' ? 'High to Low' : 'Low to High'}`}
              className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#334155] font-normal transition-colors"
              title="Toggle sort direction"
            >
              <ArrowUpDown className="w-3 h-3 text-[#64748B]" />
              <span>{sortOrder === 'desc' ? 'High to Low' : 'Low to High'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Empty State when no districts match */}
      {chartData.length === 0 ? (
        <div className="py-12 px-4 text-center flex flex-col items-center justify-center border border-dashed border-[#E2E8F0] rounded-xl my-3 bg-[#F8FAFC]">
          <div className="w-9 h-9 rounded-md bg-[#F1F5F9] flex items-center justify-center text-[#64748B] mb-2.5">
            <Search className="w-4 h-4 text-[#64748B]" />
          </div>
          <h4 className="text-xs font-medium text-[#0F172A] mb-1">No matching districts found</h4>
          <p className="text-xs text-[#64748B] max-w-sm mb-4">
            {searchDistrict
              ? `No districts match the search "${searchDistrict}" in the current filter.`
              : 'No districts match the selected performance filter status.'}
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-white border border-[#CBD5E1] text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#64748B]" />
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
                  tick={{ fontSize: 11, fill: '#1E293B', fontWeight: 500, cursor: 'pointer' }}
                  width={110}
                  axisLine={{ stroke: '#E2E8F0' }}
                  tickLine={false}
                  onClick={(e: any) => {
                    if (e && e.value) onSelectDistrict(e.value);
                  }}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(5, 150, 105, 0.04)' }}
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const d = payload[0].payload;
                    const variance = Math.round((d.percentage - stateVal) * 10) / 10;
                    return (
                      <div className="bg-white border border-[#E2E8F0] rounded-md p-3 text-xs shadow-md min-w-[190px]">
                        <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-1.5 mb-1.5">
                          <span className="font-semibold text-[#0F172A]">{d.district}</span>
                          <span className="text-[10px] text-[#64748B] font-mono">{d.totalPUs} PUs</span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[#64748B]">{currentIndicator.shortName}:</span>
                            <span className="font-serif text-[#0F172A] font-medium">{d.percentage.toFixed(1)}%</span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                            <span>Counts:</span>
                            <span className="font-mono text-[#334155]">
                              {d.numerator} / {d.denominator}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#F1F5F9] mt-1">
                            <span className="text-[#64748B]">vs State Avg:</span>
                            <span className={`font-medium px-1.5 py-0.2 rounded-full text-[10px] border ${
                              variance >= 0
                                ? 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]'
                                : 'bg-[#FFF1F2] text-[#9F1239] border-[#FECDD3]'
                            }`}>
                              {variance >= 0 ? `+${variance}%` : `${variance}%`}
                            </span>
                          </div>
                        </div>
                        <p className="text-[10px] text-[#059669] font-medium mt-2 text-center border-t border-[#F1F5F9] pt-1.5">
                          Click to inspect planning units →
                        </p>
                      </div>
                    );
                  }}
                />
                <ReferenceLine
                  x={stateVal}
                  stroke="#E11D48"
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                />
                <Bar
                  dataKey="percentage"
                  barSize={16}
                  radius={[0, 3, 3, 0]}
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

          {/* Clean Bottom Legend with Color Indicators */}
          <div className="mt-3 pt-3 border-t border-[#EAEAEA] flex flex-wrap items-center justify-between gap-3 text-xs text-[#64748B]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-normal">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#059669]" />
                <span className="text-[#334155]">≥ State Benchmark</span>
              </span>
              <span className="flex items-center gap-1.5 font-normal">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#94A3B8]" />
                <span className="text-[#334155]">&lt; State Benchmark</span>
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-[#E11D48] font-medium">
                <span className="w-3.5 h-0.5 bg-[#E11D48] inline-block border-b border-dashed border-[#E11D48]" />
                <span>State Average ({stateVal.toFixed(1)}%)</span>
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
