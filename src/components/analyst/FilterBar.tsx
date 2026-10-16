import React from 'react';
import { Download, Search, RotateCcw } from 'lucide-react';
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
    <div className="bento-card rounded-xl p-4 sm:p-5 bg-white border border-[#EAEAEA] space-y-4">
      {/* Primary Filters Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* District Selector */}
        <div>
          <label className="block text-[10.5px] font-medium text-[#787774] uppercase tracking-[0.05em] mb-1.5">
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
            className="w-full text-xs bg-[#F7F6F3] border border-[#EAEAEA] text-[#111111] font-normal rounded-md px-2.5 py-2 focus:border-[#111111] focus:outline-none"
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
          <label className="block text-[10.5px] font-medium text-[#787774] uppercase tracking-[0.05em] mb-1.5">
            Planning Unit
          </label>
          <select
            value={filterState.planningUnit}
            onChange={e => onFilterChange({ planningUnit: e.target.value })}
            className="w-full text-xs bg-[#F7F6F3] border border-[#EAEAEA] text-[#111111] font-normal rounded-md px-2.5 py-2 focus:border-[#111111] focus:outline-none"
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
          <label className="block text-[10.5px] font-medium text-[#787774] uppercase tracking-[0.05em] mb-1.5">
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
            className="w-full text-xs bg-[#F7F6F3] border border-[#EAEAEA] text-[#111111] font-normal rounded-md px-2.5 py-2 focus:border-[#111111] focus:outline-none"
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
          <label className="block text-[10.5px] font-medium text-[#787774] uppercase tracking-[0.05em] mb-1.5">
            Indicator
          </label>
          <select
            value={filterState.selectedIndicatorId}
            onChange={e => onFilterChange({ selectedIndicatorId: e.target.value })}
            className="w-full text-xs bg-[#F7F6F3] border border-[#EAEAEA] text-[#111111] font-normal rounded-md px-2.5 py-2 focus:border-[#111111] focus:outline-none"
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
      <div className="pt-3 border-t border-[#EAEAEA] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-[#787774] absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search planning unit or district..."
            value={filterState.searchQuery}
            onChange={e => onFilterChange({ searchQuery: e.target.value })}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#F7F6F3] border border-[#EAEAEA] rounded-md text-[#111111] placeholder-[#787774] focus:outline-none focus:border-[#111111] font-normal"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs text-[#64748B] mr-1">
            Matching: <strong className="text-[#14532D] font-mono font-semibold bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#A7F3D0]">{totalFilteredCount}</strong> PUs
          </span>

          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 text-[#334155] hover:bg-[#F8FAFC] border border-[#CBD5E1] rounded-md font-normal transition-colors"
            title="Reset filters"
          >
            <RotateCcw className="w-3 h-3 text-[#64748B]" />
            <span>Reset</span>
          </button>

          <button
            onClick={onExportCsv}
            className="inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 bg-[#14532D] hover:bg-[#166534] text-white rounded-md transition-all active:scale-[0.98] shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D]"
          >
            <Download className="w-3.5 h-3.5 text-[#BBF7D0]" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
};
