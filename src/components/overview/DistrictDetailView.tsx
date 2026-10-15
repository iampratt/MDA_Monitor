import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  MapPin,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  BarChart3,
  Search,
  Filter,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, Cell } from 'recharts';
import { DistrictAggregate, GrandAggregate } from '../../types/indicator';
import { MonitoringRow } from '../../types/dataset';
import { INDICATOR_DICTIONARY, getIndicatorById } from '../../data/indicatorDictionary';
import { calculateRowIndicator } from '../../services/indicatorCalculator';
import { PlanningUnitModal } from './PlanningUnitModal';
import { DistrictProfileBenchmarkChart } from './DistrictProfileBenchmarkChart';

interface DistrictDetailViewProps {
  districtName: string;
  allDistricts: DistrictAggregate[];
  districtAggregate: DistrictAggregate;
  grandAggregate: GrandAggregate;
  rows: MonitoringRow[];
  selectedIndicatorId: string;
  onSelectIndicator: (id: string) => void;
  onSelectDistrict: (districtName: string) => void;
  onBackToState: () => void;
}

export const DistrictDetailView: React.FC<DistrictDetailViewProps> = ({
  districtName,
  allDistricts,
  districtAggregate,
  grandAggregate,
  rows,
  selectedIndicatorId,
  onSelectIndicator,
  onSelectDistrict,
  onBackToState
}) => {
  const [selectedPuRow, setSelectedPuRow] = useState<MonitoringRow | null>(null);
  const [puSearch, setPuSearch] = useState('');

  // Filter detail rows for this district
  const districtRows = useMemo(() => {
    return rows.filter(r => r.district.trim() === districtName.trim());
  }, [rows, districtName]);

  const currentIndicator = getIndicatorById(selectedIndicatorId) || INDICATOR_DICTIONARY[0];
  const districtVal = districtAggregate.indicatorValues[selectedIndicatorId]?.percentage ?? null;
  const stateVal = grandAggregate.indicatorValues[selectedIndicatorId]?.percentage ?? null;

  // Key District Core Indicators
  const visitedAreaVal = districtAggregate.indicatorValues['teams_visited_area']?.formattedPercentage || 'N/A';
  const microplanVal = districtAggregate.indicatorValues['working_as_per_mp']?.formattedPercentage || 'N/A';
  const consumptionVal = districtAggregate.indicatorValues['persons_administered']?.formattedPercentage || 'N/A';
  const supervisorVal = districtAggregate.indicatorValues['supervisor_ever_visited']?.formattedPercentage || 'N/A';

  const totalTeams = districtAggregate.rawSums['D'] || 0;
  const totalMetDA = districtAggregate.rawSums['K'] || 0;

  // Prepare Planning Unit Chart & Table data
  const puData = useMemo(() => {
    return districtRows.map(row => {
      const calc = calculateRowIndicator(row, currentIndicator);
      return {
        row,
        planningUnit: row.planningUnit,
        regime: row.regime || 'IDA',
        teamsMonitored: Number(row.rawMetrics['D'] || 0),
        teamsMetDA: Number(row.rawMetrics['K'] || 0),
        numerator: calc.numerator,
        denominator: calc.denominator,
        percentage: calc.percentage,
        formattedPercentage: calc.formattedPercentage,
        status: calc.status
      };
    });
  }, [districtRows, currentIndicator]);

  // Filtered PU data for search
  const filteredPuData = useMemo(() => {
    if (!puSearch.trim()) return puData;
    const q = puSearch.toLowerCase();
    return puData.filter(p => p.planningUnit.toLowerCase().includes(q));
  }, [puData, puSearch]);

  const getBarColor = (percentage: number | null) => {
    if (percentage !== null && districtVal !== null) {
      return percentage >= districtVal ? '#2563eb' : '#64748b';
    }
    return '#64748b';
  };

  const primaryIndicators = INDICATOR_DICTIONARY.filter(i =>
    i.isPrimaryKpi || ['teams_visited_area', 'working_as_per_mp', 'both_da_trained', 'persons_administered', 'supervisor_ever_visited', 'marker_pen_available'].includes(i.id)
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Breadcrumb & District Switcher Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToState}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>State Overview</span>
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-mda-700" />
            {districtName} District
          </span>
        </div>

        {/* District Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Switch District:</span>
          <select
            value={districtName}
            onChange={e => onSelectDistrict(e.target.value)}
            className="text-xs font-semibold bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-mda-700 shadow-xs"
          >
            {allDistricts.map(d => (
              <option key={d.district} value={d.district}>
                {d.district} ({d.totalPlanningUnits} PUs)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* District Header Card */}
      <div className="card-subtle rounded-xl p-5 bg-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {districtName} District
              </h2>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {districtRows.length} Planning Units
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Field operational evaluation across {districtRows.length} planning units • {totalTeams} teams monitored ({totalMetDA} met DA teams).
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs text-slate-500 font-medium">Active Indicator:</span>
            <select
              value={selectedIndicatorId}
              onChange={e => onSelectIndicator(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-1 focus:ring-mda-700"
            >
              {primaryIndicators.map(i => (
                <option key={i.id} value={i.id}>
                  {i.shortName} ({i.code})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* District Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Teams Visited Area
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold text-slate-900 metric-number">
                {visitedAreaVal}
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              State Avg: {grandAggregate.indicatorValues['teams_visited_area']?.formattedPercentage || 'N/A'}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Microplan Adherence
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold text-slate-900 metric-number">
                {microplanVal}
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              State Avg: {grandAggregate.indicatorValues['working_as_per_mp']?.formattedPercentage || 'N/A'}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Observed Consumption
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold text-slate-900 metric-number">
                {consumptionVal}
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              State Avg: {grandAggregate.indicatorValues['persons_administered']?.formattedPercentage || 'N/A'}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Supervisor Visited
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-bold text-slate-900 metric-number">
                {supervisorVal}
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              State Avg: {grandAggregate.indicatorValues['supervisor_ever_visited']?.formattedPercentage || 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* District vs State Profile Multi-Metric Chart */}
      <DistrictProfileBenchmarkChart
        districtName={districtName}
        districtAggregate={districtAggregate}
        grandAggregate={grandAggregate}
        onSelectIndicator={onSelectIndicator}
      />

      {/* Planning Unit Breakdown Chart */}
      <div className="card-subtle rounded-xl p-5 bg-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-mda-700" />
            <h3 className="text-sm font-bold text-slate-900">
              Planning Units Comparison: {currentIndicator.shortName}
            </h3>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            {districtVal !== null && (
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <span className="w-3.5 h-0.5 bg-blue-600 inline-block border-b border-dashed border-blue-600" />
                District Avg: {districtVal.toFixed(1)}%
              </span>
            )}
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={puData} margin={{ top: 10, right: 20, left: 0, bottom: 25 }}>
              <XAxis
                dataKey="planningUnit"
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
                cursor={{ fill: 'rgba(20, 108, 80, 0.04)' }}
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const item = payload[0].payload;
                  return (
                    <div className="bg-white border border-slate-200 rounded-lg p-2.5 text-xs shadow-md">
                      <p className="font-bold text-slate-900">{item.planningUnit}</p>
                      <p className="text-mda-700 font-bold mt-1">
                        {item.percentage !== null ? `${item.percentage.toFixed(1)}%` : 'N/A'}
                      </p>
                      <p className="text-slate-500 text-[11px] font-mono mt-0.5">
                        {item.numerator} / {item.denominator}
                      </p>
                    </div>
                  );
                }}
              />
              {districtVal !== null && (
                <ReferenceLine
                  y={districtVal}
                  stroke="#2563eb"
                  strokeDasharray="3 3"
                  strokeWidth={1.5}
                />
              )}
              <Bar
                dataKey="percentage"
                barSize={32}
                radius={[4, 4, 0, 0]}
                onClick={(entry: any) => {
                  if (entry && entry.row) setSelectedPuRow(entry.row);
                }}
                cursor="pointer"
              >
                {puData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.percentage)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Planning Units Table */}
      <div className="card-subtle rounded-xl bg-white overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Planning Units in {districtName}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any planning unit or "View Scorecard" to inspect its 360° thematic indicators.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Filter planning unit..."
              value={puSearch}
              onChange={e => setPuSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-mda-700"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-2.5 px-4 w-10 text-center">#</th>
                <th className="py-2.5 px-4">Planning Unit</th>
                <th className="py-2.5 px-3 text-center">Regime</th>
                <th className="py-2.5 px-3 text-right">Teams Monitored</th>
                <th className="py-2.5 px-3 text-right">Met DA Teams</th>
                <th className="py-2.5 px-3 text-right">Numerator</th>
                <th className="py-2.5 px-3 text-right">Denominator</th>
                <th className="py-2.5 px-4 text-right">Calculated %</th>
                <th className="py-2.5 px-4 text-right">vs District Avg</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredPuData.map((item, idx) => (
                <tr
                  key={item.planningUnit}
                  className="hover:bg-slate-50/60 transition-colors cursor-pointer"
                  onClick={() => setSelectedPuRow(item.row)}
                >
                  <td className="py-3 px-4 text-center text-slate-400 font-mono text-[11px]">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                    {item.planningUnit}
                  </td>
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {item.regime}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-600 whitespace-nowrap">
                    {item.teamsMonitored}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-600 whitespace-nowrap">
                    {item.teamsMetDA}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-800 font-medium whitespace-nowrap">
                    {item.numerator}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-600 whitespace-nowrap">
                    {item.denominator}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap font-mono font-bold text-slate-900 text-sm">
                    {item.formattedPercentage}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap font-mono text-xs">
                    {item.percentage !== null && districtVal !== null ? (
                      <span className={`font-semibold ${item.percentage >= districtVal ? 'text-blue-700' : 'text-slate-600'}`}>
                        {item.percentage >= districtVal ? `+${(item.percentage - districtVal).toFixed(1)}%` : `${(item.percentage - districtVal).toFixed(1)}%`}
                      </span>
                    ) : (
                      <span className="text-slate-400">N/A</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedPuRow(item.row);
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-mda-700 hover:text-mda-900 hover:underline"
                    >
                      <span>Scorecard</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Planning Unit Detail Modal */}
      <PlanningUnitModal
        isOpen={Boolean(selectedPuRow)}
        onClose={() => setSelectedPuRow(null)}
        row={selectedPuRow}
      />
    </div>
  );
};
