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
    <div className="card-subtle rounded-xl p-4 sm:p-5 bg-white border border-surface-border space-y-4">
      {/* Primary Filters Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* District Selector */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
            District
          </label>
          <select
            value={filterState.district}
            onChange={e => {
              onFilterChange({
                district: e.target.value,
                planningUnit: 'all'
              });
            }}
            className="w-full text-xs bg-slate-50/80 border border-slate-200 text-slate-900 font-semibold rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-mda-600/30 focus:border-mda-600 focus:outline-none transition-all"
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
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
            Planning Unit
          </label>
          <select
            value={filterState.planningUnit}
            onChange={e => onFilterChange({ planningUnit: e.target.value })}
            className="w-full text-xs bg-slate-50/80 border border-slate-200 text-slate-900 font-semibold rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-mda-600/30 focus:border-mda-600 focus:outline-none transition-all"
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

        {/* Thematic Category */}
        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
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
            className="w-full text-xs bg-slate-50/80 border border-slate-200 text-slate-900 font-semibold rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-mda-600/30 focus:border-mda-600 focus:outline-none transition-all"
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
        <div>
          <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
            Indicator
          </label>
          <select
            value={filterState.selectedIndicatorId}
            onChange={e => onFilterChange({ selectedIndicatorId: e.target.value })}
            className="w-full text-xs bg-slate-50/80 border border-slate-200 text-slate-900 font-semibold rounded-lg px-2.5 py-2 focus:ring-2 focus:ring-mda-600/30 focus:border-mda-600 focus:outline-none transition-all"
          >
            {indicatorsInCurrentCategory.map(ind => (
              <option key={ind.id} value={ind.id}>
                [{ind.code}] {ind.shortName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search & Actions Bar */}
      <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search planning unit or district..."
            value={filterState.searchQuery}
            onChange={e => onFilterChange({ searchQuery: e.target.value })}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50/80 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-mda-600/30 focus:border-mda-600 font-medium transition-all"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs text-slate-500 mr-1">
            Matching: <strong className="text-slate-800 font-bold">{totalFilteredCount}</strong> PUs
          </span>

          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-50 font-semibold transition-all active:scale-[0.98]"
            title="Reset filters"
          >
            <RotateCcw className="w-3 h-3 text-slate-400" />
            <span>Reset</span>
          </button>

          <button
            onClick={onExportCsv}
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 bg-mda-700 text-white hover:bg-mda-800 rounded-lg transition-all shadow-xs active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-mda-600"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
};
