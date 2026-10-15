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
  AlertTriangle,
  Calendar,
  Sparkles
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
      {/* State Executive Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-mda-900 via-mda-800 to-mda-700 text-white p-6 sm:p-8 shadow-card-hover border border-mda-700/50">
        {/* Subtle background pattern decoration */}
        <div className="absolute -right-8 -bottom-8 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute right-24 top-0 w-32 h-32 rounded-full bg-emerald-400/10 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 border border-white/10 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Executive Monitoring Dashboard</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Concurrent Monitoring State Overview
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 mt-1.5 font-medium leading-relaxed">
              Evaluating field operations, drug availability, and beneficiary consumption across 
              {' '}<strong className="text-white font-bold">{grandAggregate.totalPlanningUnits} Planning Units</strong> in 
              {' '}<strong className="text-white font-bold">{grandAggregate.totalDistricts} Districts</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 shrink-0">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3">
              <span className="text-[11px] uppercase tracking-wider text-slate-300 font-bold block">
                Total Teams Monitored
              </span>
              <span className="text-2xl font-black text-white metric-number">
                {totalTeamsMonitored.toLocaleString()}
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3">
              <span className="text-[11px] uppercase tracking-wider text-slate-300 font-bold block">
                Overall Visited %
              </span>
              <span className="text-2xl font-black text-emerald-300 metric-number">
                {visitedArea?.formattedPercentage || 'N/A'}
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3">
              <span className="text-[11px] uppercase tracking-wider text-slate-300 font-bold block">
                Direct Consumption
              </span>
              <span className="text-2xl font-black text-amber-300 metric-number">
                {administered?.formattedPercentage || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Key Executive Metric Cards in a spacious 3-column grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Core Programmatic Performance Indicators
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any card to focus the district ranking chart below on that metric
            </p>
          </div>
          <span className="text-xs font-medium text-slate-500 bg-surface-subtle px-2.5 py-1 rounded-lg border border-surface-border">
            Interactive Selector
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* 1. Teams Monitored */}
          <KpiCard
            title="Total Field Teams Monitored"
            category="Sample Size"
            value={totalTeamsMonitored.toLocaleString()}
            subtitle={`${grandAggregate.totalPlanningUnits} Planning Units in ${grandAggregate.totalDistricts} Districts`}
            status="neutral"
            icon={<Users className="w-5 h-5" />}
            onClick={() => onNavigateToAnalyst({ indicatorId: 'teams_visited_area' })}
          />

          {/* 2. Teams Visited Area */}
          <KpiCard
            title="% Teams Visited Assigned Area"
            category="Coverage"
            value={visitedArea?.formattedPercentage || 'N/A'}
            percentageNumber={visitedArea?.percentage}
            target={95}
            subtitle={`${(grandAggregate.rawSums['E'] || 0).toLocaleString()} of ${totalTeamsMonitored.toLocaleString()} teams active in field`}
            status={visitedArea?.status}
            icon={<MapPin className="w-5 h-5" />}
            isSelected={selectedRankingIndicator === 'teams_visited_area'}
            onClick={() => setSelectedRankingIndicator('teams_visited_area')}
          />

          {/* 3. Working as per MP */}
          <KpiCard
            title="% Teams Working as per Microplan"
            category="Microplanning"
            value={workingMp?.formattedPercentage || 'N/A'}
            percentageNumber={workingMp?.percentage}
            target={90}
            subtitle={`${(grandAggregate.rawSums['S'] || 0).toLocaleString()} of ${totalTeamsMet.toLocaleString()} met DA teams`}
            status={workingMp?.status}
            icon={<ClipboardList className="w-5 h-5" />}
            isSelected={selectedRankingIndicator === 'working_as_per_mp'}
            onClick={() => setSelectedRankingIndicator('working_as_per_mp')}
          />

          {/* 4. Both DA Trained */}
          <KpiCard
            title="% Teams with Both DA Trained"
            category="Training"
            value={bothTrained?.formattedPercentage || 'N/A'}
            percentageNumber={bothTrained?.percentage}
            target={90}
            subtitle={`${(grandAggregate.rawSums['AA'] || 0).toLocaleString()} of ${totalTeamsMet.toLocaleString()} met DA teams`}
            status={bothTrained?.status}
            icon={<GraduationCap className="w-5 h-5" />}
            isSelected={selectedRankingIndicator === 'both_da_trained'}
            onClick={() => setSelectedRankingIndicator('both_da_trained')}
          />

          {/* 5. Drug Administration */}
          <KpiCard
            title="% Persons Consumed Drugs (Observed)"
            category="Drug Administration"
            value={administered?.formattedPercentage || 'N/A'}
            percentageNumber={administered?.percentage}
            target={80}
            subtitle={`${totalPersonsAdministered.toLocaleString()} of ${totalPersonsApproached.toLocaleString()} approached beneficiaries`}
            status={administered?.status}
            icon={<Pill className="w-5 h-5" />}
            isSelected={selectedRankingIndicator === 'persons_administered'}
            onClick={() => setSelectedRankingIndicator('persons_administered')}
          />

          {/* 6. Supervisor Visited */}
          <KpiCard
            title="% Teams Visited by Supervisor"
            category="Supervision"
            value={supervisorVisited?.formattedPercentage || 'N/A'}
            percentageNumber={supervisorVisited?.percentage}
            target={90}
            subtitle={`${(grandAggregate.rawSums['BB'] || 0).toLocaleString()} of ${totalTeamsMet.toLocaleString()} teams checked`}
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
