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
  Activity,
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
import { TopBottomDistricts } from './TopBottomDistricts';
import { MultiIndicatorComparisonChart } from './MultiIndicatorComparisonChart';
import { IndicatorDispersionChart } from './IndicatorDispersionChart';

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
  const [activeView, setActiveView] = useState<'ranking' | 'multi' | 'table' | 'thematic'>('ranking');
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

  // Define 6 core programmatic KPIs with domain colorways
  const coreMetrics = [
    {
      id: 'sample_size',
      title: 'Teams Monitored',
      value: totalTeamsMonitored.toLocaleString(),
      subtitle: `${grandAggregate.totalPlanningUnits} Planning Units in ${grandAggregate.totalDistricts} Districts`,
      icon: <Users className="w-3.5 h-3.5" />,
      isInteractiveIndicator: false,
      iconBox: 'bg-[#EFF6FF] text-[#2563EB] border-[#DBEAFE]',
      selectedRing: 'border-[#2563EB] ring-1 ring-[#2563EB]/40 bg-[#EFF6FF]/20'
    },
    {
      id: 'teams_visited_area',
      title: 'Visited Assigned Area',
      value: visitedArea?.formattedPercentage || 'N/A',
      subtitle: visitedArea ? `${visitedArea.numerator.toLocaleString()} of ${visitedArea.denominator.toLocaleString()} teams` : '',
      icon: <MapPin className="w-3.5 h-3.5" />,
      isInteractiveIndicator: true,
      iconBox: 'bg-[#ECFDF5] text-[#059669] border-[#A7F3D0]',
      selectedRing: 'border-[#059669] ring-1 ring-[#059669]/40 bg-[#ECFDF5]/20'
    },
    {
      id: 'working_as_per_mp',
      title: 'Microplan Adherence',
      value: workingMp?.formattedPercentage || 'N/A',
      subtitle: workingMp ? `${workingMp.numerator.toLocaleString()} of ${workingMp.denominator.toLocaleString()} teams` : '',
      icon: <ClipboardList className="w-3.5 h-3.5" />,
      isInteractiveIndicator: true,
      iconBox: 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]',
      selectedRing: 'border-[#D97706] ring-1 ring-[#D97706]/40 bg-[#FFFBEB]/20'
    },
    {
      id: 'both_da_trained',
      title: 'DA Teams Trained',
      value: bothTrained?.formattedPercentage || 'N/A',
      subtitle: bothTrained ? `${bothTrained.numerator.toLocaleString()} of ${bothTrained.denominator.toLocaleString()} teams` : '',
      icon: <GraduationCap className="w-3.5 h-3.5" />,
      isInteractiveIndicator: true,
      iconBox: 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]',
      selectedRing: 'border-[#7C3AED] ring-1 ring-[#7C3AED]/40 bg-[#F5F3FF]/20'
    },
    {
      id: 'persons_administered',
      title: 'Observed Consumption',
      value: administered?.formattedPercentage || 'N/A',
      subtitle: administered ? `${administered.numerator.toLocaleString()} of ${administered.denominator.toLocaleString()} persons` : '',
      icon: <Pill className="w-3.5 h-3.5" />,
      isInteractiveIndicator: true,
      iconBox: 'bg-[#FFF1F2] text-[#E11D48] border-[#FECDD3]',
      selectedRing: 'border-[#E11D48] ring-1 ring-[#E11D48]/40 bg-[#FFF1F2]/20'
    },
    {
      id: 'supervisor_ever_visited',
      title: 'Checked by Supervisor',
      value: supervisorVisited?.formattedPercentage || 'N/A',
      subtitle: supervisorVisited ? `${supervisorVisited.numerator.toLocaleString()} of ${supervisorVisited.denominator.toLocaleString()} teams` : '',
      icon: <UserCheck className="w-3.5 h-3.5" />,
      isInteractiveIndicator: true,
      iconBox: 'bg-[#F0FDFA] text-[#0D9488] border-[#99F6E4]',
      selectedRing: 'border-[#0D9488] ring-1 ring-[#0D9488]/40 bg-[#F0FDFA]/20'
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Clean Minimalist Executive Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EAEAEA]">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-normal text-[#111111] tracking-tight">
            State Concurrent Monitoring Overview
          </h2>
          <p className="text-xs text-[#787774] mt-0.5 font-normal">
            Operational field evaluation across {grandAggregate.totalPlanningUnits} planning units in {grandAggregate.totalDistricts} districts.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-[#787774]">View:</span>
          <div
            role="tablist"
            aria-label="Overview perspective views"
            className="inline-flex bg-[#F1F5F9] p-0.5 rounded-md text-xs border border-[#E2E8F0]"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeView === 'ranking'}
              aria-controls="overview-ranking-panel"
              onClick={() => setActiveView('ranking')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded transition-all active:scale-[0.98] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#14532D] ${
                activeView === 'ranking'
                  ? 'bg-[#14532D] text-white font-medium shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Rankings</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeView === 'multi'}
              aria-controls="overview-multi-panel"
              onClick={() => setActiveView('multi')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded transition-all active:scale-[0.98] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#14532D] ${
                activeView === 'multi'
                  ? 'bg-[#14532D] text-white font-medium shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Multi-Metric</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeView === 'table'}
              aria-controls="overview-table-panel"
              onClick={() => setActiveView('table')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded transition-all active:scale-[0.98] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#14532D] ${
                activeView === 'table'
                  ? 'bg-[#14532D] text-white font-medium shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Districts Table</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeView === 'thematic'}
              aria-controls="overview-thematic-panel"
              onClick={() => setActiveView('thematic')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded transition-all active:scale-[0.98] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#14532D] ${
                activeView === 'thematic'
                  ? 'bg-[#14532D] text-white font-medium shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>10 Pillars</span>
            </button>
          </div>
        </div>
      </div>

      {/* Programmatic Key Indicators Ribbon (Clickable Bento Tiles) */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[10.5px] font-medium uppercase tracking-[0.05em] text-[#64748B] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
            Core Programmatic Performance Indicators
          </span>
          <span className="text-[11px] text-[#64748B] font-normal">
            Click metric to focus ranking below
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {coreMetrics.map(metric => {
            const isSelected = metric.isInteractiveIndicator && selectedIndicatorId === metric.id;

            return (
              <div
                key={metric.id}
                role={metric.isInteractiveIndicator ? 'button' : undefined}
                tabIndex={metric.isInteractiveIndicator ? 0 : undefined}
                aria-pressed={metric.isInteractiveIndicator ? isSelected : undefined}
                aria-label={metric.isInteractiveIndicator ? `Filter rankings by ${metric.title}` : undefined}
                onClick={() => {
                  if (metric.isInteractiveIndicator) {
                    setSelectedIndicatorId(metric.id);
                  }
                }}
                onKeyDown={e => {
                  if (metric.isInteractiveIndicator && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    setSelectedIndicatorId(metric.id);
                  }
                }}
                className={`bento-card p-4 rounded-xl border transition-all duration-150 flex flex-col justify-between h-full bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D] ${
                  metric.isInteractiveIndicator
                    ? 'cursor-pointer active:scale-[0.985] group'
                    : ''
                } ${
                  isSelected
                    ? metric.selectedRing
                    : 'border-[#EAEAEA] hover:border-[#CBD5E1]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[#64748B] mb-2.5">
                    <span className="text-[11px] font-medium text-[#1E293B] truncate mr-1" title={metric.title}>
                      {metric.title}
                    </span>
                    <div className={`w-6 h-6 rounded flex items-center justify-center border transition-transform duration-200 group-hover:scale-105 ${metric.iconBox}`}>
                      {metric.icon}
                    </div>
                  </div>

                  <div className="mt-1">
                    <span className="text-2xl font-serif font-normal tracking-tight text-[#0F172A] metric-number">
                      {metric.value}
                    </span>
                  </div>
                </div>

                {metric.subtitle && (
                  <p className="text-[10.5px] text-[#64748B] mt-2 font-normal truncate" title={metric.subtitle}>
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
        <div id="overview-ranking-panel" role="tabpanel" className="space-y-6">
          <DistrictRankingChart
            districtAggregates={districtAggregates}
            grandAggregate={grandAggregate}
            selectedIndicatorId={selectedIndicatorId}
            onSelectIndicator={setSelectedIndicatorId}
            onSelectDistrict={handleSelectDistrict}
          />

          <TopBottomDistricts
            districtAggregates={districtAggregates}
            grandAggregate={grandAggregate}
            selectedIndicatorId={selectedIndicatorId}
            onSelectDistrict={handleSelectDistrict}
          />
        </div>
      )}

      {activeView === 'multi' && (
        <div id="overview-multi-panel" role="tabpanel" className="space-y-6">
          <MultiIndicatorComparisonChart
            districtAggregates={districtAggregates}
            grandAggregate={grandAggregate}
            onSelectDistrict={handleSelectDistrict}
          />

          <IndicatorDispersionChart
            districtAggregates={districtAggregates}
            grandAggregate={grandAggregate}
            onSelectDistrict={handleSelectDistrict}
          />
        </div>
      )}

      {activeView === 'table' && (
        <div id="overview-table-panel" role="tabpanel">
          <DistrictTableView
            districtAggregates={districtAggregates}
            grandAggregate={grandAggregate}
            selectedIndicatorId={selectedIndicatorId}
            onSelectDistrict={handleSelectDistrict}
          />
        </div>
      )}

      {activeView === 'thematic' && (
        <div id="overview-thematic-panel" role="tabpanel">
          <CategoryBreakdown
            grandAggregate={grandAggregate}
            onSelectCategory={category => onNavigateToAnalyst({ category })}
            onSelectIndicator={indicatorId => {
              setSelectedIndicatorId(indicatorId);
              setActiveView('ranking');
            }}
          />
        </div>
      )}
    </div>
  );
};
