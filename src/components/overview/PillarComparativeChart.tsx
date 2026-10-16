import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import { GrandAggregate } from '../../types/indicator';
import { INDICATOR_DICTIONARY } from '../../data/indicatorDictionary';
import { BarChart3 } from 'lucide-react';

interface PillarComparativeChartProps {
  grandAggregate: GrandAggregate;
  onSelectIndicator?: (indicatorId: string) => void;
}

export const PillarComparativeChart: React.FC<PillarComparativeChartProps> = ({
  grandAggregate,
  onSelectIndicator
}) => {
  // Select primary percentage indicator from each category
  const pillarIndicatorIds = [
    'teams_visited_area',
    'working_as_per_mp',
    'marker_pen_available',
    'both_da_trained',
    'both_da_basic_knowledge',
    'adequate_ivermectin',
    'persons_administered',
    'line_listing_updated',
    'supervisor_ever_visited',
    'teams_not_working'
  ];

  const chartData = pillarIndicatorIds
    .map(id => {
      const ind = INDICATOR_DICTIONARY.find(i => i.id === id);
      const calc = grandAggregate.indicatorValues[id];
      if (!ind || !calc) return null;

      return {
        id: ind.id,
        name: ind.shortName,
        category: ind.category,
        code: ind.code,
        percentage: calc.percentage ?? 0,
        formatted: calc.formattedPercentage,
        numerator: calc.numerator,
        denominator: calc.denominator
      };
    })
    .filter(Boolean) as Array<{
    id: string;
    name: string;
    category: string;
    code: string;
    percentage: number;
    formatted: string;
    numerator: number;
    denominator: number;
  }>;

  // Sort descending by percentage
  chartData.sort((a, b) => b.percentage - a.percentage);

  return (
    <div className="bento-card rounded-xl p-5 bg-white border border-[#EAEAEA] mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#F1F5F9] mb-4 gap-2">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#059669]" />
          <h3 className="text-sm font-serif font-normal text-[#0F172A]">
            Thematic Pillars Performance Overview
          </h3>
        </div>
        <span className="text-xs text-[#64748B]">
          Statewide aggregates across core thematic indicators • Click any bar to inspect
        </span>
      </div>

      <div style={{ height: `${chartData.length * 34 + 40}px` }} className="w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 60, left: 20, bottom: 5 }}
          >
            <XAxis
              type="number"
              domain={[0, 100]}
              tickFormatter={v => `${v}%`}
              tick={{ fontSize: 11, fill: '#64748B' }}
              axisLine={{ stroke: '#E2E8F0' }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={160}
              tick={{ fontSize: 11, fill: '#1E293B', fontWeight: 600 }}
              axisLine={{ stroke: '#E2E8F0' }}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: 'rgba(20, 108, 80, 0.04)' }}
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-white border border-slate-200 rounded-lg p-3 text-xs shadow-lg max-w-xs">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-slate-900">{d.name}</span>
                      <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                        [{d.code}]
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mb-2">{d.category}</p>
                    <div className="space-y-1 border-t border-slate-100 pt-1.5 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-500">State Aggregate:</span>
                        <span className="font-bold text-emerald-700">{d.formatted}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Counts:</span>
                        <span className="font-mono text-slate-700">
                          {d.numerator.toLocaleString()} / {d.denominator.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-[10px] text-mda-700 font-semibold mt-2 text-center">
                      Click bar to view district rankings →
                    </p>
                  </div>
                );
              }}
            />
            <Bar
              dataKey="percentage"
              barSize={18}
              radius={[0, 4, 4, 0]}
              onClick={(entry: any) => {
                if (entry && entry.id && onSelectIndicator) onSelectIndicator(entry.id);
              }}
              cursor="pointer"
            >
              {chartData.map((entry, index) => {
                // Subtle gradient tint based on percentage tier
                const color = entry.percentage >= 80 ? '#059669' : entry.percentage >= 60 ? '#10B981' : '#64748B';
                return <Cell key={`cell-${index}`} fill={color} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
