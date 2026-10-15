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

  // Display subset to avoid cramped X-axis
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

  const getBarColor = () => '#2563eb';

  return (
    <div className="card-subtle rounded-xl p-5 bg-white">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 mb-4 gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Planning Unit Comparison • {indicator.shortName}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {districtFilter === 'all'
              ? `Displaying first ${displayRows.length} planning units (select a district above to filter)`
              : `All ${rows.length} planning units in ${districtFilter}`}
          </p>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 0, bottom: 65 }}
          >
            <XAxis
              dataKey="puName"
              interval={0}
              angle={-35}
              textAnchor="end"
              tick={{ fontSize: 10, fill: '#334155', fontWeight: 500 }}
              height={65}
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
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
              cursor={{ fill: 'rgba(20, 108, 80, 0.04)' }}
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const d = payload[0].payload;
                return (
                  <div className="bg-white border border-slate-200 rounded-lg p-2.5 text-xs shadow-md">
                    <p className="font-bold text-slate-900">{d.puName}</p>
                    <p className="text-slate-400 text-[10px] mb-1">{d.district}</p>
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-slate-500">{indicator.shortName}:</span>
                        <span className="font-bold text-slate-900">{d.val.toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Counts:</span>
                        <span className="font-mono text-slate-600">{d.numerator} / {d.denominator}</span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            <Bar
              dataKey="val"
              barSize={Math.max(10, Math.min(22, Math.floor(600 / chartData.length)))}
              radius={[3, 3, 0, 0]}
            >
              {chartData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill="#2563eb" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
