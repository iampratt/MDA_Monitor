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

  // If too many rows (e.g. all 64 across state), slice to 20 or group
  const displayRows = rows.slice(0, 24);

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
    <div className="card-subtle rounded-xl p-5 bg-white">
      <div className="flex items-center justify-between pb-3 border-b border-surface-border mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Planning Unit Comparison • {indicator.name}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {districtFilter === 'all'
              ? `Showing first ${displayRows.length} planning units (select a specific district above to drill down)`
              : `All planning units in ${districtFilter}`}
          </p>
        </div>
        {indicator.target && (
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
            Target: {indicator.target}%
          </span>
        )}
      </div>

      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -10, bottom: 40 }}
          >
            <XAxis
              dataKey="puName"
              interval={0}
              angle={-35}
              textAnchor="end"
              tick={{ fontSize: 10, fill: '#475569' }}
              height={50}
            />
            <YAxis
              domain={[0, 100]}
              tickFormatter={v => `${v}%`}
              tick={{ fontSize: 10, fill: '#64748B' }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-slate-900 text-white rounded-lg p-2.5 text-xs shadow-xl">
                    <p className="font-bold text-emerald-400">{d.puName}</p>
                    <p className="text-slate-300 text-[11px]">{d.district}</p>
                    <p className="mt-1 font-semibold text-white">
                      {indicator.shortName}: {d.val.toFixed(1)}%
                    </p>
                    <p className="text-slate-400 text-[10px]">
                      {indicator.numeratorLabel}: {d.numerator} / {indicator.denominatorLabel}: {d.denominator}
                    </p>
                  </div>
                );
              }}
            />
            {target > 0 && (
              <ReferenceLine
                y={target}
                stroke="#0F766E"
                strokeDasharray="3 3"
              />
            )}
            <Bar dataKey="val" radius={[4, 4, 0, 0]}>
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
