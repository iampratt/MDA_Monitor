import React from 'react';
import { Download, Search, RotateCcw, Filter, MapPin } from 'lucide-react';
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
    <div className="card-subtle rounded-2xl p-5 bg-white shadow-card space-y-4">
      {/* Top Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
        {/* District Selector */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            District Filter
          </label>
          <select
            value={filterState.district}
            onChange={e => {
              onFilterChange({
                district: e.target.value,
                planningUnit: 'all' // Reset PU on district change
              });
            }}
            className="w-full text-xs bg-surface-subtle border border-surface-border text-slate-900 font-semibold rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-mda-700 focus:outline-none shadow-xs transition-colors"
          >
            <option value="all">Entire State ({availableDistricts.length} Districts)</option>
            {availableDistricts.map(d => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Planning Unit Selector */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Planning Unit
          </label>
          <select
            value={filterState.planningUnit}
            onChange={e => onFilterChange({ planningUnit: e.target.value })}
            className="w-full text-xs bg-surface-subtle border border-surface-border text-slate-900 font-semibold rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-mda-700 focus:outline-none shadow-xs transition-colors"
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
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Thematic Category
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
            className="w-full text-xs bg-surface-subtle border border-surface-border text-slate-900 font-semibold rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-mda-700 focus:outline-none shadow-xs transition-colors"
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
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Selected Indicator
          </label>
          <select
            value={filterState.selectedIndicatorId}
            onChange={e => onFilterChange({ selectedIndicatorId: e.target.value })}
            className="w-full text-xs bg-surface-subtle border border-surface-border text-slate-900 font-semibold rounded-xl px-3 py-2.5 focus:ring-2 focus:ring-mda-700 focus:outline-none shadow-xs transition-colors"
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
      <div className="pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search planning unit or district name..."
            value={filterState.searchQuery}
            onChange={e => onFilterChange({ searchQuery: e.target.value })}
            className="w-full pl-9 pr-3 py-2 text-xs bg-surface-subtle border border-surface-border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-mda-700 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs font-medium text-slate-500 mr-2">
            Showing <strong className="text-slate-900 font-bold">{totalFilteredCount}</strong> planning units
          </span>

          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 text-xs px-3 py-2 text-slate-700 hover:text-slate-900 border border-surface-border rounded-xl hover:bg-slate-50 font-medium transition-colors shadow-xs"
            title="Reset filters"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset</span>
          </button>

          <button
            onClick={onExportCsv}
            className="inline-flex items-center gap-2 text-xs font-bold px-3.5 py-2 bg-mda-700 text-white hover:bg-mda-800 rounded-xl transition-all shadow-sm active:scale-98"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
};
