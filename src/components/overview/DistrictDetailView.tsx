import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  MapPin,
  ChevronRight,
  BarChart3,
  Search
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
      return percentage >= districtVal ? '#059669' : '#94A3B8';
    }
    return '#94A3B8';
  };

  const primaryIndicators = INDICATOR_DICTIONARY.filter(i =>
    i.isPrimaryKpi || ['teams_visited_area', 'working_as_per_mp', 'both_da_trained', 'persons_administered', 'supervisor_ever_visited', 'marker_pen_available'].includes(i.id)
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Breadcrumb & District Switcher Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EAEAEA]">
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToState}
            className="inline-flex items-center gap-1.5 text-xs font-normal px-2.5 py-1.5 rounded-md bg-white border border-[#EAEAEA] text-[#111111] hover:bg-[#F7F6F3] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#787774]" />
            <span>State Overview</span>
          </button>
          <span className="text-[#CCCCCC]">/</span>
          <span className="text-sm font-medium text-[#111111] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#787774]" />
            {districtName} District
          </span>
        </div>

        {/* District Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#787774]">Switch District:</span>
          <select
            value={districtName}
            onChange={e => onSelectDistrict(e.target.value)}
            className="text-xs font-medium bg-white border border-[#EAEAEA] rounded-md px-2.5 py-1.5 text-[#111111] focus:outline-none focus:border-[#111111]"
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
      <div className="bento-card rounded-xl p-5 bg-white border border-[#EAEAEA]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#EAEAEA]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-serif font-normal text-[#111111] tracking-tight">
                {districtName} District
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F1F1EF] text-[#5A5A58] border border-[#E3E3E0]">
                {districtRows.length} Planning Units
              </span>
            </div>
            <p className="text-xs text-[#787774] mt-1 font-normal">
              Field operational evaluation across {districtRows.length} planning units • {totalTeams} teams monitored ({totalMetDA} met DA teams).
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs text-[#787774]">Active Indicator:</span>
            <select
              value={selectedIndicatorId}
              onChange={e => onSelectIndicator(e.target.value)}
              className="text-xs font-medium bg-white border border-[#EAEAEA] rounded-md px-3 py-1.5 text-[#111111] focus:outline-none focus:border-[#111111]"
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
            <span className="text-[10.5px] font-medium text-[#787774] uppercase tracking-[0.05em] block">
              Teams Visited Area
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-serif font-normal text-[#111111] metric-number">
                {visitedAreaVal}
              </span>
            </div>
            <span className="text-[11px] text-[#787774]">
              State Avg: {grandAggregate.indicatorValues['teams_visited_area']?.formattedPercentage || 'N/A'}
            </span>
          </div>

          <div>
            <span className="text-[10.5px] font-medium text-[#787774] uppercase tracking-[0.05em] block">
              Microplan Adherence
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-serif font-normal text-[#111111] metric-number">
                {microplanVal}
              </span>
            </div>
            <span className="text-[11px] text-[#787774]">
              State Avg: {grandAggregate.indicatorValues['working_as_per_mp']?.formattedPercentage || 'N/A'}
            </span>
          </div>

          <div>
            <span className="text-[10.5px] font-medium text-[#787774] uppercase tracking-[0.05em] block">
              Observed Consumption
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-serif font-normal text-[#111111] metric-number">
                {consumptionVal}
              </span>
            </div>
            <span className="text-[11px] text-[#787774]">
              State Avg: {grandAggregate.indicatorValues['persons_administered']?.formattedPercentage || 'N/A'}
            </span>
          </div>

          <div>
            <span className="text-[10.5px] font-medium text-[#787774] uppercase tracking-[0.05em] block">
              Supervisor Visited
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-serif font-normal text-[#111111] metric-number">
                {supervisorVal}
              </span>
            </div>
            <span className="text-[11px] text-[#787774]">
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
      <div className="bento-card rounded-xl p-5 bg-white border border-[#EAEAEA]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#EAEAEA] mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#111111]" />
            <h3 className="text-sm font-serif font-normal text-[#111111]">
              Planning Units Comparison: {currentIndicator.shortName}
            </h3>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#787774]">
            {districtVal !== null && (
              <span className="flex items-center gap-1.5 text-[#2F3437]">
                <span className="w-3.5 h-0.5 bg-[#111111] inline-block border-b border-dashed border-[#111111]" />
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
                tick={{ fontSize: 10, fill: '#787774' }}
                axisLine={{ stroke: '#EAEAEA' }}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tickFormatter={v => `${v}%`}
                tick={{ fontSize: 10, fill: '#787774' }}
                width={36}
                axisLine={{ stroke: '#EAEAEA' }}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: 'rgba(0, 0, 0, 0.02)' }}
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null;
                  const item = payload[0].payload;
                  return (
                    <div className="bg-white border border-[#EAEAEA] rounded-md p-2.5 text-xs shadow-none">
                      <p className="font-medium text-[#111111]">{item.planningUnit}</p>
                      <p className="font-serif text-[#111111] text-sm mt-1">
                        {item.percentage !== null ? `${item.percentage.toFixed(1)}%` : 'N/A'}
                      </p>
                      <p className="text-[#787774] text-[11px] font-mono mt-0.5">
                        {item.numerator} / {item.denominator}
                      </p>
                    </div>
                  );
                }}
              />
              {districtVal !== null && (
                <ReferenceLine
                  y={districtVal}
                  stroke="#059669"
                  strokeDasharray="3 3"
                  strokeWidth={1.5}
                />
              )}
              <Bar
                dataKey="percentage"
                barSize={24}
                radius={[2, 2, 0, 0]}
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
      <div className="bento-card rounded-xl bg-white border border-[#EAEAEA] overflow-hidden">
        <div className="p-4 border-b border-[#EAEAEA] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-serif font-normal text-[#111111]">
              Planning Units in {districtName}
            </h3>
            <p className="text-xs text-[#787774] mt-0.5">
              Click any planning unit row or Scorecard to view 360° indicator breakdown.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#787774] absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Filter planning unit..."
              value={puSearch}
              onChange={e => setPuSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#F7F6F3] border border-[#EAEAEA] rounded-md text-[#111111] placeholder-[#787774] focus:outline-none focus:border-[#111111]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F7F6F3] border-b border-[#EAEAEA] text-[10px] font-medium uppercase tracking-[0.05em] text-[#787774]">
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
            <tbody className="divide-y divide-[#EAEAEA] text-[#2F3437]">
              {filteredPuData.map((item, idx) => (
                <tr
                  key={item.planningUnit}
                  className="hover:bg-[#FBFBFA] transition-colors cursor-pointer"
                  onClick={() => setSelectedPuRow(item.row)}
                >
                  <td className="py-3 px-4 text-center text-[#787774] font-mono text-[11px]">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-4 font-medium text-[#111111] whitespace-nowrap">
                    {item.planningUnit}
                  </td>
                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-[#F1F1EF] text-[#5A5A58]">
                      {item.regime}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-[#787774] whitespace-nowrap">
                    {item.teamsMonitored}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-[#787774] whitespace-nowrap">
                    {item.teamsMetDA}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-[#111111] font-medium whitespace-nowrap">
                    {item.numerator}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-[#787774] whitespace-nowrap">
                    {item.denominator}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap font-serif font-medium text-[#111111] text-sm">
                    {item.formattedPercentage}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap text-xs">
                    {item.percentage !== null && districtVal !== null ? (
                      <span className={`inline-flex px-1.5 py-0.2 rounded-full font-medium text-[10px] ${
                        item.percentage >= districtVal ? 'bg-[#EDF3EC] text-[#346538]' : 'bg-[#FDEBEC] text-[#9F2F2D]'
                      }`}>
                        {item.percentage >= districtVal ? `+${(item.percentage - districtVal).toFixed(1)}%` : `${(item.percentage - districtVal).toFixed(1)}%`}
                      </span>
                    ) : (
                      <span className="text-[#787774]">N/A</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedPuRow(item.row);
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-[#111111] hover:underline"
                    >
                      <span>Scorecard</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#787774]" />
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
