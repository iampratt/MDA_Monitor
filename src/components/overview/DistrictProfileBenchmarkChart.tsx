import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { DistrictAggregate, GrandAggregate } from '../../types/indicator';
import { INDICATOR_DICTIONARY } from '../../data/indicatorDictionary';
import { Activity } from 'lucide-react';

interface DistrictProfileBenchmarkChartProps {
  districtName: string;
  districtAggregate: DistrictAggregate;
  grandAggregate: GrandAggregate;
  onSelectIndicator: (indicatorId: string) => void;
}

export const DistrictProfileBenchmarkChart: React.FC<DistrictProfileBenchmarkChartProps> = ({
  districtName,
  districtAggregate,
  grandAggregate,
  onSelectIndicator
}) => {
  const coreIds = [
    'teams_visited_area',
    'working_as_per_mp',
    'both_da_trained',
    'persons_administered',
    'marker_pen_available',
    'supervisor_ever_visited'
  ];

  const chartData = coreIds.map(id => {
    const ind = INDICATOR_DICTIONARY.find(i => i.id === id);
    const distCalc = districtAggregate.indicatorValues[id];
    const stateCalc = grandAggregate.indicatorValues[id];

    const distVal = distCalc?.percentage ?? 0;
    const stateVal = stateCalc?.percentage ?? 0;
    const variance = Math.round((distVal - stateVal) * 10) / 10;

    return {
      id,
      name: ind?.shortName || id,
      districtPct: distVal,
      statePct: stateVal,
      variance,
      districtRaw: distCalc ? `${distCalc.numerator.toLocaleString()} / ${distCalc.denominator.toLocaleString()}` : 'N/A',
      stateRaw: stateCalc ? `${stateCalc.numerator.toLocaleString()} / ${stateCalc.denominator.toLocaleString()}` : 'N/A'
    };
  });

  return (
    <div className="card-subtle rounded-xl p-5 bg-white border border-slate-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 mb-4 gap-2">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-mda-700" />
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            {districtName} vs. State Average Profile
          </h3>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium">
          <span className="flex items-center gap-1.5 text-slate-800 font-semibold">
            <span className="w-3 h-3 rounded-xs bg-blue-600 inline-block" />
            {districtName} %
          </span>
          <span className="flex items-center gap-1.5 text-slate-500">
            <span className="w-3 h-3 rounded-xs bg-slate-300 inline-block" />
            State Avg %
          </span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 25 }}
          >
            <XAxis
              dataKey="name"
              interval={0}
              tick={{ fontSize: 11, fill: '#334155', fontWeight: 600 }}
              axisLine={{ stroke: '#E2E8F0' }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tickFormatter={v => `${v}%`}
              tick={{ fontSize: 11, fill: '#64748B' }}
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
                      {d.name}
                    </p>
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-blue-700">{districtName}:</span>
                        <div className="text-right">
                          <span className="font-bold text-slate-900">{d.districtPct.toFixed(1)}%</span>
                          <span className="text-[10px] text-slate-400 font-mono block">({d.districtRaw})</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-500">State Avg:</span>
                        <div className="text-right">
                          <span className="font-semibold text-slate-700">{d.statePct.toFixed(1)}%</span>
                          <span className="text-[10px] text-slate-400 font-mono block">({d.stateRaw})</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center pt-1 border-t border-slate-100">
                        <span className="text-slate-500">Variance:</span>
                        <span className={`font-bold ${d.variance >= 0 ? 'text-blue-700' : 'text-slate-600'}`}>
                          {d.variance >= 0 ? `+${d.variance}%` : `${d.variance}%`}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
            <Bar
              dataKey="districtPct"
              name={`${districtName} %`}
              fill="#2563eb"
              barSize={18}
              radius={[3, 3, 0, 0]}
              onClick={(entry: any) => {
                if (entry && entry.id) onSelectIndicator(entry.id);
              }}
              cursor="pointer"
            />
            <Bar
              dataKey="statePct"
              name="State Avg %"
              fill="#CBD5E1"
              barSize={18}
              radius={[3, 3, 0, 0]}
              onClick={(entry: any) => {
                if (entry && entry.id) onSelectIndicator(entry.id);
              }}
              cursor="pointer"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
