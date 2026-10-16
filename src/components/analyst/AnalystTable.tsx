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
    if (sortCol !== col) return <ArrowUpDown className="w-3 h-3 text-[#A8A29E]" />;
    return sortDir === 'asc'
      ? <ArrowUp className="w-3 h-3 text-[#111111]" />
      : <ArrowDown className="w-3 h-3 text-[#111111]" />;
  };

  return (
    <div className="bento-card rounded-xl bg-white border border-[#EAEAEA] overflow-hidden">
      {/* Table Header Banner with Formula Details */}
      <div className="p-4 border-b border-[#EAEAEA] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-medium text-[#1F6C9F] bg-[#E1F3FE] px-2 py-0.5 rounded-full border border-[#C5E5FA]">
              {indicator.code}
            </span>
            <h3 className="text-sm font-serif font-normal text-[#111111]">
              {indicator.name}
            </h3>
          </div>
          <p className="text-xs text-[#787774] mt-1 flex items-center gap-1.5 font-normal">
            <Info className="w-3.5 h-3.5 text-[#787774] shrink-0" />
            <span>Formula: <strong>100 × ({indicator.numeratorLabel}) / ({indicator.denominatorLabel})</strong></span>
          </p>
        </div>
      </div>

      {/* Table Wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#F7F6F3] border-b border-[#EAEAEA] text-[#787774] font-medium uppercase text-[10px] tracking-[0.05em] select-none">
              <th className="py-2.5 px-4 w-10 text-center">#</th>
              <th
                onClick={() => handleSort('district')}
                className="py-2.5 px-4 cursor-pointer hover:text-[#111111] whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>District</span>
                  {renderSortIcon('district')}
                </div>
              </th>
              <th
                onClick={() => handleSort('planningUnit')}
                className="py-2.5 px-4 cursor-pointer hover:text-[#111111] whitespace-nowrap"
              >
                <div className="flex items-center gap-1">
                  <span>Planning Unit</span>
                  {renderSortIcon('planningUnit')}
                </div>
              </th>
              <th className="py-2.5 px-3 text-center whitespace-nowrap">Regime</th>
              <th
                onClick={() => handleSort('teamsMonitored')}
                className="py-2.5 px-4 text-right cursor-pointer hover:text-[#111111] whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Monitored</span>
                  {renderSortIcon('teamsMonitored')}
                </div>
              </th>
              <th
                onClick={() => handleSort('numerator')}
                className="py-2.5 px-4 text-right cursor-pointer hover:text-[#111111] whitespace-nowrap"
                title={indicator.numeratorLabel}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Numerator</span>
                  {renderSortIcon('numerator')}
                </div>
              </th>
              <th
                onClick={() => handleSort('denominator')}
                className="py-2.5 px-4 text-right cursor-pointer hover:text-[#111111] whitespace-nowrap"
                title={indicator.denominatorLabel}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Denominator</span>
                  {renderSortIcon('denominator')}
                </div>
              </th>
              <th
                onClick={() => handleSort('percentage')}
                className="py-2.5 px-4 text-right cursor-pointer hover:text-[#111111] whitespace-nowrap min-w-[110px]"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Calculated %</span>
                  {renderSortIcon('percentage')}
                </div>
              </th>
              <th className="py-2.5 px-4 text-center whitespace-nowrap">Metric Code</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAEAEA] text-[#2F3437]">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-[#787774]">
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
                    className="hover:bg-[#FBFBFA] transition-colors"
                  >
                    <td className="py-2.5 px-4 text-center text-[#787774] font-mono text-[11px]">
                      {globalIndex}
                    </td>
                    <td className="py-2.5 px-4 font-medium text-[#111111] whitespace-nowrap">
                      {item.district}
                    </td>
                    <td className="py-2.5 px-4 text-[#2F3437] whitespace-nowrap">
                      {item.planningUnit}
                    </td>
                    <td className="py-2.5 px-3 text-center whitespace-nowrap">
                      <span className={`text-[9.5px] font-mono font-semibold px-2 py-0.5 rounded-full border ${
                        item.regime === 'IDA'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {item.regime}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-[#787774] whitespace-nowrap">
                      {item.teamsMonitored.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-[#111111] font-medium whitespace-nowrap">
                      {item.numerator.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-[#787774] whitespace-nowrap">
                      {item.denominator.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4 text-right whitespace-nowrap font-serif font-medium">
                      {isZeroDen ? (
                        <span className="text-slate-400 font-normal italic">N/A</span>
                      ) : (
                        <div className="flex items-center justify-end">
                          <span className={`text-sm metric-number font-bold px-2 py-0.5 rounded ${
                            item.status === 'good'
                              ? 'text-emerald-800 bg-emerald-50/80'
                              : item.status === 'danger'
                              ? 'text-rose-800 bg-rose-50/80'
                              : item.status === 'warning'
                              ? 'text-amber-800 bg-amber-50/80'
                              : 'text-slate-900'
                          }`}>
                            {item.formattedPercentage}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-center whitespace-nowrap">
                      <span className="font-mono text-[10px] text-[#5A5A58] bg-[#F1F1EF] px-1.5 py-0.5 rounded border border-[#E3E3E0]">
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
      <div className="p-3 border-t border-[#EAEAEA] bg-[#FBFBFA] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#787774]">
        <div className="flex items-center gap-3">
          <span>
            Showing <strong className="text-[#111111] font-medium font-mono">{Math.min(paginatedData.length, tableData.length)}</strong> of <strong className="text-[#111111] font-medium font-mono">{tableData.length}</strong> planning units
          </span>
          <span className="text-[#EAEAEA]">|</span>
          <div className="flex items-center gap-1.5">
            <span>Rows:</span>
            <select
              value={pageSize}
              onChange={e => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="bg-white border border-[#EAEAEA] rounded px-2 py-0.5 text-[#111111] font-medium focus:outline-none focus:border-[#111111]"
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
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-[#EAEAEA] bg-white text-[#111111] hover:bg-[#F7F6F3] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
            <span className="px-2 py-1 font-mono text-[#111111]">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-[#EAEAEA] bg-white text-[#111111] hover:bg-[#F7F6F3] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
