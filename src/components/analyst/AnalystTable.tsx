import React, { useState } from 'react';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Info,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { MonitoringRow } from '../../types/dataset';
import { IndicatorDefinition } from '../../types/indicator';
import { calculateRowIndicator } from '../../services/indicatorCalculator';

interface AnalystTableProps {
  rows: MonitoringRow[];
  indicator: IndicatorDefinition;
}

type SortCol = 'district' | 'planningUnit' | 'teamsMonitored' | 'numerator' | 'denominator' | 'percentage';

export const AnalystTable: React.FC<AnalystTableProps> = ({ rows, indicator }) => {
  const [sortCol, setSortCol] = useState<SortCol>('percentage');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(15);

  const handleSort = (col: SortCol) => {
    if (sortCol === col) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortCol(col);
      setSortDir('desc');
    }
    setPage(1);
  };

  const tableData = rows.map(r => {
    const calc = calculateRowIndicator(r, indicator);

    return {
      row: r,
      district: r.district,
      planningUnit: r.planningUnit,
      regime: r.regime || 'IDA',
      teamsMonitored: Number(r.rawMetrics['D'] || 0),
      teamsMetDA: Number(r.rawMetrics['K'] || 0),
      numerator: calc.numerator,
      denominator: calc.denominator,
      percentage: calc.percentage,
      formattedPercentage: calc.formattedPercentage,
      status: calc.status
    };
  });

  tableData.sort((a, b) => {
    let comparison = 0;
    if (sortCol === 'district') {
      comparison = a.district.localeCompare(b.district);
    } else if (sortCol === 'planningUnit') {
      comparison = a.planningUnit.localeCompare(b.planningUnit);
    } else if (sortCol === 'teamsMonitored') {
      comparison = a.teamsMonitored - b.teamsMonitored;
    } else if (sortCol === 'numerator') {
      comparison = a.numerator - b.numerator;
    } else if (sortCol === 'denominator') {
      comparison = a.denominator - b.denominator;
    } else if (sortCol === 'percentage') {
      const valA = a.percentage ?? -999;
      const valB = b.percentage ?? -999;
      comparison = valA - valB;
    }
    return sortDir === 'asc' ? comparison : -comparison;
  });

  const actualPageSize = pageSize === -1 ? tableData.length : pageSize;
  const totalPages = Math.ceil(tableData.length / actualPageSize) || 1;
  const paginatedData = tableData.slice((page - 1) * actualPageSize, page * actualPageSize);

  const renderSortIcon = (col: SortCol) => {
    if (sortCol !== col) return <ArrowUpDown className="w-3 h-3 text-slate-300" />;
    return sortDir === 'asc'
      ? <ArrowUp className="w-3 h-3 text-mda-700" />
      : <ArrowDown className="w-3 h-3 text-mda-700" />;
  };

  return (
    <div className="card-subtle rounded-xl bg-white border border-surface-border overflow-hidden">
      {/* Table Header Banner with Formula Details */}
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-mda-800 bg-mda-50 px-2 py-0.5 rounded border border-mda-200/60">
              {indicator.code}
            </span>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              {indicator.name}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Formula: <strong>100 × ({indicator.numeratorLabel}) / ({indicator.denominatorLabel})</strong></span>
          </p>
        </div>
      </div>

      {/* Table Wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-bold uppercase text-[10px] tracking-wider select-none">
              <th className="py-2.5 px-4 w-10 text-center">#</th>
              <th
                onClick={() => handleSort('district')}
                className="py-2.5 px-4 cursor-pointer hover:text-slate-900 whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>District</span>
                  {renderSortIcon('district')}
                </div>
              </th>
              <th
                onClick={() => handleSort('planningUnit')}
                className="py-2.5 px-4 cursor-pointer hover:text-slate-900 whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>Planning Unit</span>
                  {renderSortIcon('planningUnit')}
                </div>
              </th>
              <th className="py-2.5 px-3 text-center whitespace-nowrap">Regime</th>
              <th
                onClick={() => handleSort('teamsMonitored')}
                className="py-2.5 px-4 text-right cursor-pointer hover:text-slate-900 whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Monitored</span>
                  {renderSortIcon('teamsMonitored')}
                </div>
              </th>
              <th
                onClick={() => handleSort('numerator')}
                className="py-2.5 px-4 text-right cursor-pointer hover:text-slate-900 whitespace-nowrap"
                title={indicator.numeratorLabel}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Numerator</span>
                  {renderSortIcon('numerator')}
                </div>
              </th>
              <th
                onClick={() => handleSort('denominator')}
                className="py-2.5 px-4 text-right cursor-pointer hover:text-slate-900 whitespace-nowrap"
                title={indicator.denominatorLabel}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Denominator</span>
                  {renderSortIcon('denominator')}
                </div>
              </th>
              <th
                onClick={() => handleSort('percentage')}
                className="py-2.5 px-4 text-right cursor-pointer hover:text-slate-900 whitespace-nowrap min-w-[110px]"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Calculated %</span>
                  {renderSortIcon('percentage')}
                </div>
              </th>
              <th className="py-2.5 px-4 text-center whitespace-nowrap">Metric Code</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-400">
                  No planning units found matching your search filter.
                </td>
              </tr>
            ) : (
              paginatedData.map((item, idx) => {
                const globalIndex = actualPageSize === -1
                  ? idx + 1
                  : (page - 1) * actualPageSize + idx + 1;
                const isZeroDen = item.denominator === 0;

                return (
                  <tr
                    key={`${item.district}-${item.planningUnit}`}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="py-2.5 px-4 text-center text-slate-400 font-mono text-[11px]">
                      {globalIndex}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {item.district}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-slate-800 whitespace-nowrap">
                      {item.planningUnit}
                    </td>
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {item.regime}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-600 whitespace-nowrap">
                      {item.teamsMonitored.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-800 font-medium whitespace-nowrap">
                      {item.numerator.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-600 whitespace-nowrap">
                      {item.denominator.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4 text-right whitespace-nowrap font-mono">
                      {isZeroDen ? (
                        <span className="text-slate-400 font-normal italic">N/A</span>
                      ) : (
                        <div className="flex items-center justify-end">
                          <span className="font-bold text-slate-900 text-sm">
                            {item.formattedPercentage}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-center whitespace-nowrap">
                      <span className="font-mono text-[10px] text-slate-500 font-bold bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                        {indicator.code}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination & Display Controls */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
        <div className="flex items-center gap-3">
          <span>
            Showing <strong className="text-slate-800 font-bold">{Math.min(paginatedData.length, tableData.length)}</strong> of <strong className="text-slate-800 font-bold">{tableData.length}</strong> planning units
          </span>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5">
            <span>Rows:</span>
            <select
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="bg-white border border-slate-200 rounded px-2 py-0.5 text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-mda-700"
            >
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={-1}>All ({tableData.length})</option>
            </select>
          </div>
        </div>

        {pageSize !== -1 && totalPages > 1 && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
            <span className="px-2 py-1 font-bold text-slate-800">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
