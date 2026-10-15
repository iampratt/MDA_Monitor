import React, { useState } from 'react';
import {
  Users,
  CheckCircle,
  ClipboardList,
  GraduationCap,
  Pill,
  UserCheck,
  ShieldCheck,
  MapPin,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { DistrictAggregate, GrandAggregate } from '../../types/indicator';
import { KpiCard } from '../common/KpiCard';
import { DistrictRankingChart } from './DistrictRankingChart';
import { TopBottomDistricts } from './TopBottomDistricts';
import { CategoryBreakdown } from './CategoryBreakdown';

interface ManagementOverviewProps {
  districtAggregates: DistrictAggregate[];
  grandAggregate: GrandAggregate;
  onNavigateToAnalyst: (filters: { district?: string; indicatorId?: string; category?: string }) => void;
}

export const ManagementOverview: React.FC<ManagementOverviewProps> = ({
  districtAggregates,
  grandAggregate,
  onNavigateToAnalyst
}) => {
  const [selectedRankingIndicator, setSelectedRankingIndicator] = useState('teams_visited_area');

  const visitedArea = grandAggregate.indicatorValues['teams_visited_area'];
  const workingMp = grandAggregate.indicatorValues['working_as_per_mp'];
  const bothTrained = grandAggregate.indicatorValues['both_da_trained'];
  const administered = grandAggregate.indicatorValues['persons_administered'];
  const markerAvailable = grandAggregate.indicatorValues['marker_pen_available'];
  const supervisorVisited = grandAggregate.indicatorValues['supervisor_ever_visited'];

  const totalTeamsMonitored = grandAggregate.rawSums['D'] || 0;
  const totalTeamsMet = grandAggregate.rawSums['K'] || 0;
  const totalPersonsApproached = grandAggregate.rawSums['AJ'] || 0;
  const totalPersonsAdministered = grandAggregate.rawSums['AK'] || 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Executive Metric Cards */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              State Executive Summary • Key Programmatic Performance Indicators
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            {grandAggregate.totalDistricts} Districts • {grandAggregate.totalPlanningUnits} Planning Units
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* 1. Teams Monitored */}
          <KpiCard
            title="Teams Monitored"
            category="Sample"
            value={totalTeamsMonitored.toLocaleString()}
            subtitle={`${grandAggregate.totalPlanningUnits} Planning Units evaluated`}
            status="neutral"
            icon={<Users className="w-5 h-5" />}
            onClick={() => onNavigateToAnalyst({ indicatorId: 'teams_visited_area' })}
          />

          {/* 2. Teams Visited Area */}
          <KpiCard
            title="Teams Visited Area"
            category="Coverage"
            value={visitedArea?.formattedPercentage || 'N/A'}
            percentageNumber={visitedArea?.percentage}
            target={95}
            subtitle={`${(grandAggregate.rawSums['E'] || 0).toLocaleString()} of ${totalTeamsMonitored.toLocaleString()} teams`}
            status={visitedArea?.status}
            icon={<MapPin className="w-5 h-5" />}
            isSelected={selectedRankingIndicator === 'teams_visited_area'}
            onClick={() => setSelectedRankingIndicator('teams_visited_area')}
          />

          {/* 3. Working as per MP */}
          <KpiCard
            title="Working as per MP"
            category="Microplan"
            value={workingMp?.formattedPercentage || 'N/A'}
            percentageNumber={workingMp?.percentage}
            target={90}
            subtitle={`${(grandAggregate.rawSums['S'] || 0).toLocaleString()} of ${totalTeamsMet.toLocaleString()} met`}
            status={workingMp?.status}
            icon={<ClipboardList className="w-5 h-5" />}
            isSelected={selectedRankingIndicator === 'working_as_per_mp'}
            onClick={() => setSelectedRankingIndicator('working_as_per_mp')}
          />

          {/* 4. Both DA Trained */}
          <KpiCard
            title="Both DA Trained"
            category="Training"
            value={bothTrained?.formattedPercentage || 'N/A'}
            percentageNumber={bothTrained?.percentage}
            target={90}
            subtitle={`${(grandAggregate.rawSums['AA'] || 0).toLocaleString()} of ${totalTeamsMet.toLocaleString()} teams`}
            status={bothTrained?.status}
            icon={<GraduationCap className="w-5 h-5" />}
            isSelected={selectedRankingIndicator === 'both_da_trained'}
            onClick={() => setSelectedRankingIndicator('both_da_trained')}
          />

          {/* 5. Drug Administration */}
          <KpiCard
            title="Drug Administration"
            category="Administration"
            value={administered?.formattedPercentage || 'N/A'}
            percentageNumber={administered?.percentage}
            target={80}
            subtitle={`${totalPersonsAdministered.toLocaleString()} of ${totalPersonsApproached.toLocaleString()} approached`}
            status={administered?.status}
            icon={<Pill className="w-5 h-5" />}
            isSelected={selectedRankingIndicator === 'persons_administered'}
            onClick={() => setSelectedRankingIndicator('persons_administered')}
          />

          {/* 6. Supervisor Visited */}
          <KpiCard
            title="Supervisor Visited"
            category="Supervision"
            value={supervisorVisited?.formattedPercentage || 'N/A'}
            percentageNumber={supervisorVisited?.percentage}
            target={90}
            subtitle={`${(grandAggregate.rawSums['BB'] || 0).toLocaleString()} of ${totalTeamsMet.toLocaleString()} visited`}
            status={supervisorVisited?.status}
            icon={<UserCheck className="w-5 h-5" />}
            isSelected={selectedRankingIndicator === 'supervisor_ever_visited'}
            onClick={() => setSelectedRankingIndicator('supervisor_ever_visited')}
          />
        </div>
      </section>

      {/* District Ranking Horizontal Bar Chart */}
      <section>
        <DistrictRankingChart
          districtAggregates={districtAggregates}
          grandAggregate={grandAggregate}
          selectedIndicatorId={selectedRankingIndicator}
          onSelectIndicator={setSelectedRankingIndicator}
          onSelectDistrict={district => onNavigateToAnalyst({ district, indicatorId: selectedRankingIndicator })}
        />
      </section>

      {/* Top 5 and Bottom 5 Districts */}
      <section>
        <TopBottomDistricts
          districtAggregates={districtAggregates}
          grandAggregate={grandAggregate}
          selectedIndicatorId={selectedRankingIndicator}
          onSelectDistrict={district => onNavigateToAnalyst({ district, indicatorId: selectedRankingIndicator })}
        />
      </section>

      {/* Thematic Pillars & Category Breakdown */}
      <section>
        <CategoryBreakdown
          grandAggregate={grandAggregate}
          onSelectCategory={category => onNavigateToAnalyst({ category })}
          onSelectIndicator={indicatorId => onNavigateToAnalyst({ indicatorId })}
        />
      </section>
    </div>
  );
};
