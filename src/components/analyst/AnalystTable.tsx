import React, { useState } from 'react';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Info,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Layers
} from 'lucide-react';
import { MonitoringRow } from '../../types/dataset';
import { IndicatorDefinition } from '../../types/indicator';
import { calculateRowIndicator } from '../../services/indicatorCalculator';
import { StatusBadge } from '../common/StatusBadge';

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
    const target = indicator.target;
    const delta = (calc.percentage !== null && target !== null && target !== undefined)
      ? Math.round((calc.percentage - target) * 10) / 10
      : null;

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
      status: calc.status,
      delta
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
    if (sortCol !== col) return <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600" />;
    return sortDir === 'asc'
      ? <ArrowUp className="w-3.5 h-3.5 text-mda-700" />
      : <ArrowDown className="w-3.5 h-3.5 text-mda-700" />;
  };

  return (
    <div className="card-subtle rounded-2xl bg-white shadow-card overflow-hidden">
      {/* Table Header Banner with Formula Details */}
      <div className="p-5 border-b border-surface-border bg-gradient-to-r from-surface-sidebar to-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-xs font-bold text-mda-800 bg-mda-100/90 px-2.5 py-1 rounded-md border border-mda-200">
              {indicator.code}
            </span>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              {indicator.name}
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mt-1.5 font-medium">
            <span className="flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-mda-700" />
              <span><strong>Formula:</strong> 100 × ({indicator.numeratorLabel}) / ({indicator.denominatorLabel})</span>
            </span>
            <span className="text-slate-300">•</span>
            <span>Direction: <strong>{indicator.direction === 'high_is_good' ? 'Higher is better' : 'Lower is better'}</strong></span>
          </div>
        </div>

        {indicator.target && (
          <div className="flex items-center gap-3 shrink-0">
            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-xs">
              Benchmark Target: {indicator.target}%
            </div>
          </div>
        )}
      </div>

      {/* Table Wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/90 border-b border-surface-border text-slate-600 font-bold uppercase text-[10px] tracking-wider">
              <th className="py-3.5 px-4 w-12 text-center">#</th>
              <th
                onClick={() => handleSort('district')}
                className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/80 transition-colors group select-none whitespace-nowrap"
              >
                <div className="flex items-center gap-1.5">
                  <span>District</span>
                  {renderSortIcon('district')}
                </div>
              </th>
              <th
                onClick={() => handleSort('planningUnit')}
                className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/80 transition-colors group select-none whitespace-nowrap"
              >
                <div className="flex items-center gap-1.5">
                  <span>Planning Unit</span>
                  {renderSortIcon('planningUnit')}
                </div>
              </th>
              <th className="py-3.5 px-3 text-center whitespace-nowrap">Regime</th>
              <th
                onClick={() => handleSort('teamsMonitored')}
                className="py-3.5 px-4 text-right cursor-pointer hover:bg-slate-100/80 transition-colors group select-none whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Monitored</span>
                  {renderSortIcon('teamsMonitored')}
                </div>
              </th>
              <th
                onClick={() => handleSort('numerator')}
                className="py-3.5 px-4 text-right cursor-pointer hover:bg-slate-100/80 transition-colors group select-none whitespace-nowrap"
                title={indicator.numeratorLabel}
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Numerator</span>
                  {renderSortIcon('numerator')}
                </div>
              </th>
              <th
                onClick={() => handleSort('denominator')}
                className="py-3.5 px-4 text-right cursor-pointer hover:bg-slate-100/80 transition-colors group select-none whitespace-nowrap"
                title={indicator.denominatorLabel}
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Denominator</span>
                  {renderSortIcon('denominator')}
                </div>
              </th>
              <th
                onClick={() => handleSort('percentage')}
                className="py-3.5 px-4 text-right cursor-pointer hover:bg-slate-100/80 transition-colors group select-none whitespace-nowrap min-w-[120px]"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Calculated %</span>
                  {renderSortIcon('percentage')}
                </div>
              </th>
              <th className="py-3.5 px-4 text-center whitespace-nowrap min-w-[130px]">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border text-slate-700 font-medium">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400">
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
                    className="hover:bg-emerald-50/30 transition-colors"
                  >
                    <td className="py-3 px-4 text-center text-slate-400 font-mono text-[11px]">
                      {globalIndex}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                      {item.district}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800 whitespace-nowrap">
                      {item.planningUnit}
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                        {item.regime}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600 font-semibold whitespace-nowrap">
                      {item.teamsMonitored.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-800 font-semibold whitespace-nowrap">
                      {item.numerator.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600 font-semibold whitespace-nowrap">
                      {item.denominator.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap font-mono">
                      {isZeroDen ? (
                        <span className="text-slate-400 font-normal italic">N/A (0 den)</span>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <span className="font-extrabold text-slate-900 text-sm">
                            {item.formattedPercentage}
                          </span>
                          {item.delta !== null && (
                            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                              item.delta >= 0
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              {item.delta >= 0 ? `+${item.delta}%` : `${item.delta}%`}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination & Display Controls */}
      <div className="p-4 border-t border-surface-border bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
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
              className="bg-white border border-surface-border rounded-md px-2 py-1 text-slate-700 font-semibold focus:outline-none focus:ring-1 focus:ring-mda-700"
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
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-surface-border bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
            <span className="px-3 py-1 font-bold text-slate-800">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-surface-border bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
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
