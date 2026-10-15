import React, { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, AlertCircle, Info } from 'lucide-react';
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
  const pageSize = 15;

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

  const totalPages = Math.ceil(tableData.length / pageSize) || 1;
  const paginatedData = tableData.slice((page - 1) * pageSize, page * pageSize);

  const renderSortIcon = (col: SortCol) => {
    if (sortCol !== col) return <ArrowUpDown className="w-3 h-3 text-slate-400" />;
    return sortDir === 'asc'
      ? <ArrowUp className="w-3 h-3 text-mda-700" />
      : <ArrowDown className="w-3 h-3 text-mda-700" />;
  };

  return (
    <div className="card-subtle rounded-xl bg-white overflow-hidden">
      {/* Table Title & Indicator Formula Header */}
      <div className="p-5 border-b border-surface-border bg-surface-sidebar flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-mda-800 bg-mda-100 px-2 py-0.5 rounded">
              {indicator.code}
            </span>
            <h3 className="text-sm font-bold text-slate-900">{indicator.name}</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>
              <strong>Formula:</strong> 100 × ({indicator.numeratorLabel}) / ({indicator.denominatorLabel})
            </span>
          </p>
        </div>

        {indicator.target && (
          <div className="text-right">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              Benchmark Target: {indicator.target}%
            </span>
          </div>
        )}
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 border-b border-surface-border text-slate-600 font-semibold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-3 px-4">#</th>
              <th
                onClick={() => handleSort('district')}
                className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>District</span>
                  {renderSortIcon('district')}
                </div>
              </th>
              <th
                onClick={() => handleSort('planningUnit')}
                className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span>Planning Unit</span>
                  {renderSortIcon('planningUnit')}
                </div>
              </th>
              <th className="py-3 px-4 text-center">Regime</th>
              <th
                onClick={() => handleSort('teamsMonitored')}
                className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Teams Monitored</span>
                  {renderSortIcon('teamsMonitored')}
                </div>
              </th>
              <th
                onClick={() => handleSort('numerator')}
                className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Numerator (Count)</span>
                  {renderSortIcon('numerator')}
                </div>
              </th>
              <th
                onClick={() => handleSort('denominator')}
                className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Denominator (Base)</span>
                  {renderSortIcon('denominator')}
                </div>
              </th>
              <th
                onClick={() => handleSort('percentage')}
                className="py-3 px-4 text-right cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center justify-end gap-1.5">
                  <span>Calculated %</span>
                  {renderSortIcon('percentage')}
                </div>
              </th>
              <th className="py-3 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border text-slate-700">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-400">
                  No planning units found matching the selected filter criteria.
                </td>
              </tr>
            ) : (
              paginatedData.map((item, idx) => {
                const globalIndex = (page - 1) * pageSize + idx + 1;
                const isZeroDen = item.denominator === 0;

                return (
                  <tr
                    key={`${item.district}-${item.planningUnit}`}
                    className="hover:bg-mda-50/20 transition-colors"
                  >
                    <td className="py-2.5 px-4 text-slate-400 font-mono text-[11px]">
                      {globalIndex}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-slate-800">
                      {item.district}
                    </td>
                    <td className="py-2.5 px-4 font-medium text-slate-900">
                      {item.planningUnit}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {item.regime}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-600">
                      {item.teamsMonitored.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-700">
                      {item.numerator.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-slate-700">
                      {item.denominator.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">
                      {isZeroDen ? (
                        <span className="text-slate-400 italic font-normal">N/A (0 den)</span>
                      ) : (
                        item.formattedPercentage
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <StatusBadge status={item.status} size="sm" />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-surface-border flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, tableData.length)} of {tableData.length} records
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-2.5 py-1 rounded border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
            >
              Previous
            </button>
            <span className="px-3 py-1 font-medium text-slate-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-2.5 py-1 rounded border border-slate-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
