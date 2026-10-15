import React from 'react';
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
import { MonitoringRow } from '../../types/dataset';
import { IndicatorDefinition } from '../../types/indicator';
import { calculateRowIndicator } from '../../services/indicatorCalculator';
import { BarChart2 } from 'lucide-react';

interface PuComparisonChartProps {
  rows: MonitoringRow[];
  indicator: IndicatorDefinition;
  districtFilter: string;
}

export const PuComparisonChart: React.FC<PuComparisonChartProps> = ({
  rows,
  indicator,
  districtFilter
}) => {
  if (rows.length === 0) return null;

  // If filtered by all districts, show top 24 or filtered subset to prevent crowding
  const displayRows = rows.slice(0, 30);

  const chartData = displayRows.map(row => {
    const calc = calculateRowIndicator(row, indicator);
    return {
      puName: row.planningUnit,
      district: row.district,
      val: calc.percentage ?? 0,
      numerator: calc.numerator,
      denominator: calc.denominator,
      status: calc.status
    };
  });

  const getBarColor = (status: string) => {
    if (status === 'good') return '#10B981';
    if (status === 'warning') return '#F59E0B';
    if (status === 'danger') return '#EF4444';
    return '#64748B';
  };

  const target = indicator.target ?? 90;

  return (
    <div className="card-subtle rounded-2xl p-6 bg-white shadow-card">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-surface-border mb-4 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-surface-subtle text-mda-700">
            <BarChart2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Planning Unit Performance Breakdown • {indicator.shortName}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {districtFilter === 'all'
                ? `Displaying first ${displayRows.length} planning units (select a specific district above to inspect all in that district)`
                : `All ${rows.length} planning units in ${districtFilter}`}
            </p>
          </div>
        </div>

        {indicator.target && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 self-start sm:self-auto">
            Target: {indicator.target}%
          </span>
        )}
      </div>

      <div className="h-[360px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 15, right: 25, left: 10, bottom: 80 }}
          >
            <XAxis
              dataKey="puName"
              interval={0}
              angle={-40}
              textAnchor="end"
              tick={{ fontSize: 10, fill: '#334155', fontWeight: 500 }}
              height={80} // Generous height for rotated text
              tickLine={{ stroke: '#E2E8F0' }}
            />
            <YAxis
              domain={[0, 100]}
              tickFormatter={v => `${v}%`}
              tick={{ fontSize: 10, fill: '#64748B', fontWeight: 500 }}
              width={45} // Clean margin on left
              axisLine={{ stroke: '#E2E8F0' }}
              tickLine={{ stroke: '#E2E8F0' }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(20, 108, 80, 0.05)' }}
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-slate-900 text-white rounded-xl p-3 text-xs shadow-xl border border-slate-800 min-w-[190px]">
                    <p className="font-bold text-emerald-400 text-sm">{d.puName}</p>
                    <p className="text-slate-400 text-[11px] mb-2">{d.district}</p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300">{indicator.shortName}:</span>
                        <span className="font-bold text-white">{d.val.toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Counts:</span>
                        <span className="font-mono text-slate-300">{d.numerator} / {d.denominator}</span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            {target > 0 && (
              <ReferenceLine
                y={target}
                stroke="#0F766E"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                label={{
                  value: `Target: ${target}%`,
                  position: 'top',
                  fill: '#0F766E',
                  fontSize: 10,
                  fontWeight: 700
                }}
              />
            )}
            <Bar
              dataKey="val"
              barSize={Math.max(12, Math.min(24, Math.floor(600 / chartData.length)))}
              radius={[4, 4, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.status)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
