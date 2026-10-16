import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import { DistrictAggregate, GrandAggregate } from '../../types/indicator';
import { INDICATOR_DICTIONARY } from '../../data/indicatorDictionary';
import { Layers, ArrowUpDown, ChevronRight } from 'lucide-react';

interface MultiIndicatorComparisonChartProps {
  districtAggregates: DistrictAggregate[];
  grandAggregate: GrandAggregate;
  onSelectDistrict: (district: string) => void;
}

interface MetricPreset {
  id: string;
  name: string;
  indicatorIds: string[];
}

const PRESETS: MetricPreset[] = [
  {
    id: 'execution',
    name: 'Coverage & Delivery',
    indicatorIds: ['teams_visited_area', 'persons_administered', 'supervisor_ever_visited']
  },
  {
    id: 'compliance',
    name: 'Team Readiness & Microplan',
    indicatorIds: ['working_as_per_mp', 'both_da_trained', 'both_da_basic_knowledge']
  },
  {
    id: 'logistics',
    name: 'Logistics Availability',
    indicatorIds: ['marker_pen_available', 'family_reg_available', 'adequate_ivermectin']
  }
];

const METRIC_COLORS = ['#059669', '#0284C7', '#D97706'];

export const MultiIndicatorComparisonChart: React.FC<MultiIndicatorComparisonChartProps> = ({
  districtAggregates,
  grandAggregate,
  onSelectDistrict
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('execution');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const currentPreset = PRESETS.find(p => p.id === selectedPresetId) || PRESETS[0];

  const selectedIndicators = useMemo(() => {
    return currentPreset.indicatorIds
      .map(id => INDICATOR_DICTIONARY.find(i => i.id === id))
      .filter(Boolean) as typeof INDICATOR_DICTIONARY;
  }, [currentPreset]);

  // Primary indicator used for sorting districts
  const primarySortId = currentPreset.indicatorIds[0];

  const chartData = useMemo(() => {
    const list = districtAggregates.map(d => {
      const entry: any = {
        district: d.district,
        totalPUs: d.totalPlanningUnits
      };

      currentPreset.indicatorIds.forEach(id => {
        const calc = d.indicatorValues[id];
        entry[id] = calc?.percentage ?? 0;
        entry[`${id}_raw`] = calc
          ? `${calc.numerator.toLocaleString()} / ${calc.denominator.toLocaleString()}`
          : 'N/A';
      });

      return entry;
    });

    list.sort((a, b) => {
      const valA = a[primarySortId] ?? 0;
      const valB = b[primarySortId] ?? 0;
      return sortOrder === 'desc' ? valB - valA : valA - valB;
    });

    return list;
  }, [districtAggregates, currentPreset, primarySortId, sortOrder]);

  return (
    <div className="card-subtle rounded-xl p-5 bg-white border border-slate-200 shadow-xs">
      {/* Header & Preset Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-slate-100 mb-4 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-mda-700" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Cross-Indicator District Comparison
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare multiple percentage indicators side-by-side across all districts to identify field operational gaps.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Preset Pill Selector */}
          <div
            role="group"
            aria-label="Preset multi-indicator groups"
            className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold"
          >
            {PRESETS.map(preset => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setSelectedPresetId(preset.id)}
                aria-pressed={selectedPresetId === preset.id}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  selectedPresetId === preset.id
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>

          {/* Sort order toggle */}
          <button
            type="button"
            onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
            className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium transition-colors shadow-xs"
            title="Toggle sort direction"
          >
            <ArrowUpDown className="w-3 h-3 text-slate-400" />
            <span>{sortOrder === 'desc' ? 'High to Low' : 'Low to High'}</span>
          </button>
        </div>
      </div>

      {/* Indicator Legend Bar */}
      <div className="flex flex-wrap items-center gap-4 mb-4 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Indicators:
        </span>
        {selectedIndicators.map((ind, idx) => {
          const stateVal = grandAggregate.indicatorValues[ind.id]?.percentage;
          const color = METRIC_COLORS[idx % METRIC_COLORS.length];
          return (
            <div key={ind.id} className="flex items-center gap-1.5 font-medium">
              <span className="w-3 h-3 rounded-xs" style={{ backgroundColor: color }} />
              <span className="text-slate-800 font-semibold">{ind.shortName}:</span>
              <span className="font-mono text-slate-600">
                State Avg {stateVal !== undefined && stateVal !== null ? `${stateVal.toFixed(1)}%` : 'N/A'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 40 }}
          >
            <XAxis
              dataKey="district"
              interval={0}
              angle={-35}
              textAnchor="end"
              tick={{ fontSize: 10, fill: '#334155', fontWeight: 600 }}
              height={50}
              axisLine={{ stroke: '#E2E8F0' }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tickFormatter={v => `${v}%`}
              tick={{ fontSize: 10, fill: '#64748B' }}
              width={40}
              axisLine={{ stroke: '#E2E8F0' }}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-white border border-slate-200 rounded-lg p-3 text-xs shadow-lg max-w-xs">
                    <p className="font-bold text-slate-900 border-b border-slate-100 pb-1 mb-2">
                      {d.district} ({d.totalPUs} Planning Units)
                    </p>
                    <div className="space-y-1.5">
                      {selectedIndicators.map((ind, idx) => {
                        const val = d[ind.id];
                        const raw = d[`${ind.id}_raw`];
                        const color = METRIC_COLORS[idx % METRIC_COLORS.length];
                        return (
                          <div key={ind.id} className="flex items-center justify-between gap-3 text-[11px]">
                            <span className="flex items-center gap-1 font-medium text-slate-700">
                              <span className="w-2 h-2 rounded-xs" style={{ backgroundColor: color }} />
                              {ind.shortName}:
                            </span>
                            <div className="text-right">
                              <span className="font-bold text-slate-900">
                                {val !== undefined ? `${val.toFixed(1)}%` : 'N/A'}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400 block">
                                {raw}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-mda-700 font-semibold mt-2.5 text-center">
                      Click to drill down into planning units →
                    </p>
                  </div>
                );
              }}
            />
            {selectedIndicators.map((ind, idx) => (
              <Bar
                key={ind.id}
                dataKey={ind.id}
                name={ind.shortName}
                fill={METRIC_COLORS[idx % METRIC_COLORS.length]}
                barSize={10}
                radius={[2, 2, 0, 0]}
                onClick={(entry: any) => {
                  if (entry && entry.district) onSelectDistrict(entry.district);
                }}
                cursor="pointer"
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
