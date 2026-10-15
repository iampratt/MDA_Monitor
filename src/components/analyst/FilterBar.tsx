import React from 'react';
import { Filter, Download, Search, RotateCcw } from 'lucide-react';
import { FilterState } from '../../types/filter';
import { CATEGORIES, INDICATOR_DICTIONARY } from '../../data/indicatorDictionary';

interface FilterBarProps {
  filterState: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  onResetFilters: () => void;
  availableDistricts: string[];
  availablePlanningUnits: string[];
  onExportCsv: () => void;
  totalFilteredCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filterState,
  onFilterChange,
  onResetFilters,
  availableDistricts,
  availablePlanningUnits,
  onExportCsv,
  totalFilteredCount
}) => {
  const indicatorsInCurrentCategory = filterState.category === 'All'
    ? INDICATOR_DICTIONARY
    : INDICATOR_DICTIONARY.filter(i => i.category === filterState.category);

  return (
    <div className="card-subtle rounded-xl p-4 bg-white space-y-4">
      {/* Top Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {/* District Selector */}
        <div>
          <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">
            District
          </label>
          <select
            value={filterState.district}
            onChange={e => {
              onFilterChange({
                district: e.target.value,
                planningUnit: 'all' // Reset PU on district change
              });
            }}
            className="w-full text-xs bg-surface-subtle border border-surface-border text-slate-800 rounded-lg px-3 py-2 focus:ring-2 focus:ring-mda-700 focus:outline-none"
          >
            <option value="all">All Districts ({availableDistricts.length})</option>
            {availableDistricts.map(d => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Planning Unit Selector */}
        <div>
          <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">
            Planning Unit
          </label>
          <select
            value={filterState.planningUnit}
            onChange={e => onFilterChange({ planningUnit: e.target.value })}
            className="w-full text-xs bg-surface-subtle border border-surface-border text-slate-800 rounded-lg px-3 py-2 focus:ring-2 focus:ring-mda-700 focus:outline-none"
          >
            <option value="all">
              {filterState.district === 'all'
                ? `All Planning Units (${availablePlanningUnits.length})`
                : `All in ${filterState.district} (${availablePlanningUnits.length})`}
            </option>
            {availablePlanningUnits.map(pu => (
              <option key={pu} value={pu}>
                {pu}
              </option>
            ))}
          </select>
        </div>

        {/* Category Selector */}
        <div>
          <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">
            Category
          </label>
          <select
            value={filterState.category}
            onChange={e => {
              const newCat = e.target.value as any;
              const matchingInds = newCat === 'All'
                ? INDICATOR_DICTIONARY
                : INDICATOR_DICTIONARY.filter(i => i.category === newCat);
              onFilterChange({
                category: newCat,
                selectedIndicatorId: matchingInds[0]?.id || filterState.selectedIndicatorId
              });
            }}
            className="w-full text-xs bg-surface-subtle border border-surface-border text-slate-800 rounded-lg px-3 py-2 focus:ring-2 focus:ring-mda-700 focus:outline-none"
          >
            <option value="All">All Categories ({CATEGORIES.length})</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Indicator Selector */}
        <div className="lg:col-span-2">
          <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">
            Indicator
          </label>
          <select
            value={filterState.selectedIndicatorId}
            onChange={e => onFilterChange({ selectedIndicatorId: e.target.value })}
            className="w-full text-xs bg-surface-subtle border border-surface-border text-slate-800 rounded-lg px-3 py-2 focus:ring-2 focus:ring-mda-700 focus:outline-none"
          >
            {indicatorsInCurrentCategory.map(ind => (
              <option key={ind.id} value={ind.id}>
                [{ind.code}] {ind.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search & Actions Bar */}
      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search planning unit or district..."
            value={filterState.searchQuery}
            onChange={e => onFilterChange({ searchQuery: e.target.value })}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface-subtle border border-surface-border rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-mda-700"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs text-slate-500 mr-2">
            Showing <strong className="text-slate-800">{totalFilteredCount}</strong> rows
          </span>

          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            title="Reset filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={onExportCsv}
            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-mda-50 text-mda-800 border border-mda-200 hover:bg-mda-100 rounded-lg transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
};
