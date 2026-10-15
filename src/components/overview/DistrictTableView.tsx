import React, { useState, useMemo } from 'react';
import { DistrictAggregate, GrandAggregate } from '../../types/indicator';
import { getIndicatorById } from '../../data/indicatorDictionary';
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronRight, Search } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

interface DistrictTableViewProps {
  districtAggregates: DistrictAggregate[];
  grandAggregate: GrandAggregate;
  selectedIndicatorId: string;
  onSelectDistrict: (districtName: string) => void;
}

type SortCol = 'rank' | 'district' | 'planningUnits' | 'teamsMonitored' | 'percentage';

export const DistrictTableView: React.FC<DistrictTableViewProps> = ({
  districtAggregates,
  grandAggregate,
  selectedIndicatorId,
  onSelectDistrict
}) => {
  const [sortCol, setSortCol] = useState<SortCol>('percentage');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [search, setSearch] = useState('');

  const currentIndicator = getIndicatorById(selectedIndicatorId);
  const stateVal = grandAggregate.indicatorValues[selectedIndicatorId]?.percentage ?? null;

  const tableData = useMemo(() => {
    return districtAggregates.map(d => {
      const calc = d.indicatorValues[selectedIndicatorId];
      const visited = d.indicatorValues['teams_visited_area']?.formattedPercentage || 'N/A';
      const consumption = d.indicatorValues['persons_administered']?.formattedPercentage || 'N/A';
      const training = d.indicatorValues['both_da_trained']?.formattedPercentage || 'N/A';

      return {
        district: d.district,
        planningUnits: d.totalPlanningUnits,
        teamsMonitored: d.rawSums['D'] || 0,
        teamsMetDA: d.rawSums['K'] || 0,
        numerator: calc?.numerator ?? 0,
        denominator: calc?.denominator ?? 0,
        percentage: calc?.percentage ?? null,
        formattedPercentage: calc?.formattedPercentage ?? 'N/A',
        status: calc?.status ?? 'neutral',
        visited,
        consumption,
        training
      };
    });
  }, [districtAggregates, selectedIndicatorId]);

  // Filter
  const filteredData = useMemo(() => {
    if (!search.trim()) return tableData;
    const q = search.toLowerCase();
    return tableData.filter(d => d.district.toLowerCase().includes(q));
  }, [tableData, search]);

  // Sort
  const sortedData = useMemo(() => {
    const copy = [...filteredData];
    copy.sort((a, b) => {
      let comparison = 0;
      if (sortCol === 'district') {
        comparison = a.district.localeCompare(b.district);
      } else if (sortCol === 'planningUnits') {
        comparison = a.planningUnits - b.planningUnits;
      } else if (sortCol === 'teamsMonitored') {
        comparison = a.teamsMonitored - b.teamsMonitored;
      } else if (sortCol === 'percentage') {
        const valA = a.percentage ?? -999;
        const valB = b.percentage ?? -999;
        comparison = valA - valB;
      }
      return sortDir === 'asc' ? comparison : -comparison;
    });
    return copy;
  }, [filteredData, sortCol, sortDir]);

  const handleSort = (col: SortCol) => {
    if (sortCol === col) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCol(col);
      setSortDir('desc');
    }
  };

  const renderSortIcon = (col: SortCol) => {
    if (sortCol !== col) return <ArrowUpDown className="w-3 h-3 text-slate-300" />;
    return sortDir === 'asc'
      ? <ArrowUp className="w-3 h-3 text-mda-700" />
      : <ArrowDown className="w-3 h-3 text-mda-700" />;
  };

  return (
    <div className="card-subtle rounded-xl bg-white overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            District Performance Summary
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Click any row to drill down into planning units for that district.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Search district..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-mda-700 font-medium"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-500 select-none">
              <th className="py-2.5 px-4 w-10 text-center">#</th>
              <th
                onClick={() => handleSort('district')}
                className="py-2.5 px-4 cursor-pointer hover:text-slate-900"
              >
                <div className="flex items-center gap-1">
                  <span>District</span>
                  {renderSortIcon('district')}
                </div>
              </th>
              <th
                onClick={() => handleSort('planningUnits')}
                className="py-2.5 px-3 text-center cursor-pointer hover:text-slate-900"
              >
                <div className="flex items-center justify-center gap-1">
                  <span>PUs</span>
                  {renderSortIcon('planningUnits')}
                </div>
              </th>
              <th
                onClick={() => handleSort('teamsMonitored')}
                className="py-2.5 px-3 text-right cursor-pointer hover:text-slate-900"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Monitored</span>
                  {renderSortIcon('teamsMonitored')}
                </div>
              </th>
              <th className="py-2.5 px-3 text-right">Visited %</th>
              <th className="py-2.5 px-3 text-right">Consumption %</th>
              <th
                onClick={() => handleSort('percentage')}
                className="py-2.5 px-4 text-right cursor-pointer hover:text-slate-900"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>{currentIndicator?.shortName || 'Selected'} %</span>
                  {renderSortIcon('percentage')}
                </div>
              </th>
              <th className="py-2.5 px-4 text-center">Status</th>
              <th className="py-2.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {sortedData.map((item, idx) => (
              <tr
                key={item.district}
                onClick={() => onSelectDistrict(item.district)}
                className="hover:bg-slate-50/70 cursor-pointer transition-colors group"
              >
                <td className="py-3 px-4 text-center text-slate-400 font-mono text-[11px]">
                  {idx + 1}
                </td>
                <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap group-hover:text-mda-800 transition-colors">
                  {item.district}
                </td>
                <td className="py-3 px-3 text-center font-medium text-slate-600 whitespace-nowrap">
                  {item.planningUnits}
                </td>
                <td className="py-3 px-3 text-right font-mono text-slate-600 whitespace-nowrap">
                  {item.teamsMonitored.toLocaleString()}
                </td>
                <td className="py-3 px-3 text-right font-mono text-slate-700 font-medium whitespace-nowrap">
                  {item.visited}
                </td>
                <td className="py-3 px-3 text-right font-mono text-slate-700 font-medium whitespace-nowrap">
                  {item.consumption}
                </td>
                <td className="py-3 px-4 text-right whitespace-nowrap font-mono font-bold text-slate-900 text-sm">
                  {item.formattedPercentage}
                </td>
                <td className="py-3 px-4 text-center whitespace-nowrap">
                  <StatusBadge status={item.status} size="sm" />
                </td>
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-mda-700 group-hover:text-mda-900">
                    <span>Drill down</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
