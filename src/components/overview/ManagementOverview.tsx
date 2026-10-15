import React, { useState } from 'react';
import {
  Users,
  MapPin,
  ClipboardList,
  GraduationCap,
  Pill,
  UserCheck,
  BarChart3,
  Table as TableIcon,
  Layers,
  ArrowRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { DistrictAggregate, GrandAggregate } from '../../types/indicator';
import { MonitoringRow } from '../../types/dataset';
import { INDICATOR_DICTIONARY, CATEGORIES, getIndicatorById } from '../../data/indicatorDictionary';
import { DistrictRankingChart } from './DistrictRankingChart';
import { DistrictTableView } from './DistrictTableView';
import { DistrictDetailView } from './DistrictDetailView';
import { CategoryBreakdown } from './CategoryBreakdown';

interface ManagementOverviewProps {
  districtAggregates: DistrictAggregate[];
  grandAggregate: GrandAggregate;
  rows: MonitoringRow[];
  onNavigateToAnalyst: (filters: { district?: string; indicatorId?: string; category?: string }) => void;
}

export const ManagementOverview: React.FC<ManagementOverviewProps> = ({
  districtAggregates,
  grandAggregate,
  rows,
  onNavigateToAnalyst
}) => {
  // Drill-down state
  const [drilldownDistrict, setDrilldownDistrict] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'ranking' | 'table' | 'thematic'>('ranking');
  const [selectedIndicatorId, setSelectedIndicatorId] = useState('teams_visited_area');

  const totalTeamsMonitored = grandAggregate.rawSums['D'] || 0;
  const totalTeamsMet = grandAggregate.rawSums['K'] || 0;
  const totalPersonsApproached = grandAggregate.rawSums['AJ'] || 0;
  const totalPersonsAdministered = grandAggregate.rawSums['AK'] || 0;

  const visitedArea = grandAggregate.indicatorValues['teams_visited_area'];
  const workingMp = grandAggregate.indicatorValues['working_as_per_mp'];
  const bothTrained = grandAggregate.indicatorValues['both_da_trained'];
  const administered = grandAggregate.indicatorValues['persons_administered'];
  const supervisorVisited = grandAggregate.indicatorValues['supervisor_ever_visited'];

  // Handle District Selection (Drill down)
  const handleSelectDistrict = (districtName: string) => {
    setDrilldownDistrict(districtName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Back to State
  const handleBackToState = () => {
    setDrilldownDistrict(null);
  };

  // If currently drilled down into a specific district
  if (drilldownDistrict) {
    const currentDistrictAgg = districtAggregates.find(
      d => d.district.toLowerCase() === drilldownDistrict.toLowerCase()
    ) || districtAggregates[0];

    return (
      <DistrictDetailView
        districtName={drilldownDistrict}
        allDistricts={districtAggregates}
        districtAggregate={currentDistrictAgg}
        grandAggregate={grandAggregate}
        rows={rows}
        selectedIndicatorId={selectedIndicatorId}
        onSelectIndicator={setSelectedIndicatorId}
        onSelectDistrict={handleSelectDistrict}
        onBackToState={handleBackToState}
      />
    );
  }

  // Define 6 core programmatic KPIs
  const coreMetrics = [
    {
      id: 'sample_size',
      title: 'Teams Monitored',
      value: totalTeamsMonitored.toLocaleString(),
      subtitle: `${grandAggregate.totalPlanningUnits} Planning Units in ${grandAggregate.totalDistricts} Districts`,
      icon: <Users className="w-4 h-4" />,
      isInteractiveIndicator: false
    },
    {
      id: 'teams_visited_area',
      title: 'Visited Assigned Area',
      value: visitedArea?.formattedPercentage || 'N/A',
      target: 95,
      delta: visitedArea?.percentage !== null && visitedArea?.percentage !== undefined ? Math.round((visitedArea.percentage - 95) * 10) / 10 : null,
      status: visitedArea?.status,
      icon: <MapPin className="w-4 h-4" />,
      isInteractiveIndicator: true
    },
    {
      id: 'working_as_per_mp',
      title: 'Microplan Adherence',
      value: workingMp?.formattedPercentage || 'N/A',
      target: 90,
      delta: workingMp?.percentage !== null && workingMp?.percentage !== undefined ? Math.round((workingMp.percentage - 90) * 10) / 10 : null,
      status: workingMp?.status,
      icon: <ClipboardList className="w-4 h-4" />,
      isInteractiveIndicator: true
    },
    {
      id: 'both_da_trained',
      title: 'DA Teams Trained',
      value: bothTrained?.formattedPercentage || 'N/A',
      target: 90,
      delta: bothTrained?.percentage !== null && bothTrained?.percentage !== undefined ? Math.round((bothTrained.percentage - 90) * 10) / 10 : null,
      status: bothTrained?.status,
      icon: <GraduationCap className="w-4 h-4" />,
      isInteractiveIndicator: true
    },
    {
      id: 'persons_administered',
      title: 'Observed Consumption',
      value: administered?.formattedPercentage || 'N/A',
      target: 80,
      delta: administered?.percentage !== null && administered?.percentage !== undefined ? Math.round((administered.percentage - 80) * 10) / 10 : null,
      status: administered?.status,
      icon: <Pill className="w-4 h-4" />,
      isInteractiveIndicator: true
    },
    {
      id: 'supervisor_ever_visited',
      title: 'Checked by Supervisor',
      value: supervisorVisited?.formattedPercentage || 'N/A',
      target: 90,
      delta: supervisorVisited?.percentage !== null && supervisorVisited?.percentage !== undefined ? Math.round((supervisorVisited.percentage - 90) * 10) / 10 : null,
      status: supervisorVisited?.status,
      icon: <UserCheck className="w-4 h-4" />,
      isInteractiveIndicator: true
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Clean Minimalist Executive Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            State Concurrent Monitoring Overview
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Operational field evaluation across {grandAggregate.totalPlanningUnits} planning units in {grandAggregate.totalDistricts} districts.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-slate-500 font-medium">View:</span>
          <div className="inline-flex bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setActiveView('ranking')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                activeView === 'ranking'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Rankings</span>
            </button>
            <button
              onClick={() => setActiveView('table')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                activeView === 'table'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Districts Table</span>
            </button>
            <button
              onClick={() => setActiveView('thematic')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                activeView === 'thematic'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>10 Pillars</span>
            </button>
          </div>
        </div>
      </div>

      {/* Programmatic Key Indicators Ribbon (Clickable Tiles) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Core Programmatic Performance Indicators
          </span>
          <span className="text-[11px] text-slate-400">
            Click metric to focus ranking below
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {coreMetrics.map(metric => {
            const isSelected = metric.isInteractiveIndicator && selectedIndicatorId === metric.id;

            return (
              <div
                key={metric.id}
                onClick={() => {
                  if (metric.isInteractiveIndicator) {
                    setSelectedIndicatorId(metric.id);
                  }
                }}
                className={`p-3.5 rounded-xl border transition-all ${
                  metric.isInteractiveIndicator
                    ? 'cursor-pointer hover:border-slate-300'
                    : 'bg-white border-slate-200'
                } ${
                  isSelected
                    ? 'bg-white border-mda-600 ring-2 ring-mda-600/20 shadow-xs'
                    : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between text-slate-500 mb-1.5">
                  <span className="text-[11px] font-semibold text-slate-600 truncate mr-1" title={metric.title}>
                    {metric.title}
                  </span>
                  <span className={isSelected ? 'text-mda-700' : 'text-slate-400'}>
                    {metric.icon}
                  </span>
                </div>

                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-xl font-bold tracking-tight text-slate-900 metric-number">
                    {metric.value}
                  </span>
                  {metric.delta !== undefined && metric.delta !== null && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        metric.delta >= 0
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {metric.delta >= 0 ? `+${metric.delta}%` : `${metric.delta}%`}
                    </span>
                  )}
                </div>

                {metric.target && (
                  <p className="text-[10px] text-slate-400 mt-1">
                    Target: <strong className="text-slate-600 font-semibold">{metric.target}%</strong>
                  </p>
                )}
                {metric.subtitle && (
                  <p className="text-[10px] text-slate-400 mt-1 truncate" title={metric.subtitle}>
                    {metric.subtitle}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Surface (Progressive Disclosure) */}
      {activeView === 'ranking' && (
        <DistrictRankingChart
          districtAggregates={districtAggregates}
          grandAggregate={grandAggregate}
          selectedIndicatorId={selectedIndicatorId}
          onSelectIndicator={setSelectedIndicatorId}
          onSelectDistrict={handleSelectDistrict}
        />
      )}

      {activeView === 'table' && (
        <DistrictTableView
          districtAggregates={districtAggregates}
          grandAggregate={grandAggregate}
          selectedIndicatorId={selectedIndicatorId}
          onSelectDistrict={handleSelectDistrict}
        />
      )}

      {activeView === 'thematic' && (
        <CategoryBreakdown
          grandAggregate={grandAggregate}
          onSelectCategory={category => onNavigateToAnalyst({ category })}
          onSelectIndicator={indicatorId => {
            setSelectedIndicatorId(indicatorId);
            setActiveView('ranking');
          }}
        />
      )}
    </div>
  );
};
