import React, { useMemo } from 'react';
import { FilterState } from '../../types/filter';
import { MonitoringRow } from '../../types/dataset';
import { GrandAggregate } from '../../types/indicator';
import { getIndicatorById } from '../../data/indicatorDictionary';
import { FilterBar } from './FilterBar';
import { AnalystTable } from './AnalystTable';
import { PuComparisonChart } from './PuComparisonChart';
import { exportRowsToCsv } from '../../services/storageService';
import { calculateAggregateIndicators } from '../../services/indicatorCalculator';
import { StatusBadge } from '../common/StatusBadge';
import { MapPin, Users, Target, Activity } from 'lucide-react';

interface AnalystViewProps {
  rows: MonitoringRow[];
  filterState: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  onResetFilters: () => void;
  grandAggregate: GrandAggregate;
}

export const AnalystView: React.FC<AnalystViewProps> = ({
  rows,
  filterState,
  onFilterChange,
  onResetFilters,
  grandAggregate
}) => {
  // Extract all available districts
  const availableDistricts = useMemo(() => {
    const set = new Set<string>();
    rows.forEach(r => set.add(r.district.trim()));
    return Array.from(set).sort();
  }, [rows]);

  // Extract planning units based on current district filter
  const availablePlanningUnits = useMemo(() => {
    let subset = rows;
    if (filterState.district !== 'all') {
      subset = subset.filter(r => r.district === filterState.district);
    }
    const set = new Set<string>();
    subset.forEach(r => set.add(r.planningUnit.trim()));
    return Array.from(set).sort();
  }, [rows, filterState.district]);

  // Apply all filters to rows
  const filteredRows = useMemo(() => {
    return rows.filter(r => {
      if (filterState.district !== 'all' && r.district !== filterState.district) {
        return false;
      }
      if (filterState.planningUnit !== 'all' && r.planningUnit !== filterState.planningUnit) {
        return false;
      }
      if (filterState.searchQuery) {
        const query = filterState.searchQuery.toLowerCase();
        const distMatch = r.district.toLowerCase().includes(query);
        const puMatch = r.planningUnit.toLowerCase().includes(query);
        if (!distMatch && !puMatch) return false;
      }
      return true;
    });
  }, [rows, filterState.district, filterState.planningUnit, filterState.searchQuery]);

  const currentIndicator = getIndicatorById(filterState.selectedIndicatorId)!;

  // Compute aggregate for the filtered subset
  const filteredAggregate = useMemo(() => {
    return calculateAggregateIndicators(filteredRows);
  }, [filteredRows]);

  const currentIndicatorFilteredVal = filteredAggregate[currentIndicator.id];

  const handleExportCsv = () => {
    const filename = `mda_${filterState.district === 'all' ? 'state' : filterState.district}_${currentIndicator.id}.csv`;
    exportRowsToCsv(filteredRows, filename);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Filter Bar */}
      <FilterBar
        filterState={filterState}
        onFilterChange={onFilterChange}
        onResetFilters={onResetFilters}
        availableDistricts={availableDistricts}
        availablePlanningUnits={availablePlanningUnits}
        onExportCsv={handleExportCsv}
        totalFilteredCount={filteredRows.length}
      />

      {/* Aggregate KPI Summary Strip for the Active Filter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Selected Area */}
        <div className="card-subtle rounded-xl p-4 bg-white flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-surface-subtle text-mda-700">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400">Selected Scope</span>
            <p className="text-sm font-bold text-slate-900 truncate">
              {filterState.district === 'all' ? 'Entire State (All Districts)' : filterState.district}
            </p>
            <p className="text-xs text-slate-500">
              {filteredRows.length} Planning Units
            </p>
          </div>
        </div>

        {/* Teams Monitored */}
        <div className="card-subtle rounded-xl p-4 bg-white flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-surface-subtle text-mda-700">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400">Teams Monitored</span>
            <p className="text-lg font-bold text-slate-900 metric-number">
              {filteredRows.reduce((sum, r) => sum + (Number(r.rawMetrics['D']) || 0), 0).toLocaleString()}
            </p>
            <p className="text-xs text-slate-500">
              {filteredRows.reduce((sum, r) => sum + (Number(r.rawMetrics['K']) || 0), 0).toLocaleString()} Met DA
            </p>
          </div>
        </div>

        {/* Selected Indicator Percentage */}
        <div className="card-subtle rounded-xl p-4 bg-white flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-mda-50 text-mda-700">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400">Filtered Indicator Result</span>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-mda-800 metric-number">
                {currentIndicatorFilteredVal?.formattedPercentage ?? 'N/A'}
              </span>
              {currentIndicatorFilteredVal?.status && (
                <StatusBadge status={currentIndicatorFilteredVal.status} size="sm" />
              )}
            </div>
            <p className="text-[11px] text-slate-500 font-mono">
              Σ({currentIndicatorFilteredVal?.numerator.toLocaleString()}) / Σ({currentIndicatorFilteredVal?.denominator.toLocaleString()})
            </p>
          </div>
        </div>

        {/* Target Benchmark */}
        <div className="card-subtle rounded-xl p-4 bg-white flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-surface-subtle text-mda-700">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400">Target Benchmark</span>
            <p className="text-lg font-bold text-slate-900 metric-number">
              {currentIndicator.target ? `${currentIndicator.target}%` : 'Standard'}
            </p>
            <p className="text-xs text-slate-500">
              {currentIndicator.direction === 'high_is_good' ? 'Higher is better' : 'Lower is better'}
            </p>
          </div>
        </div>
      </div>

      {/* PU Comparison Chart */}
      <PuComparisonChart
        rows={filteredRows}
        indicator={currentIndicator}
        districtFilter={filterState.district}
      />

      {/* Analyst Sortable Table */}
      <AnalystTable
        rows={filteredRows}
        indicator={currentIndicator}
      />
    </div>
  );
};
