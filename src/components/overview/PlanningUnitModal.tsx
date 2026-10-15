import React from 'react';
import { X, CheckCircle2, AlertTriangle, AlertCircle, Building2, MapPin, Layers, Users, Pill, GraduationCap, ShieldCheck, ClipboardCheck } from 'lucide-react';
import { MonitoringRow } from '../../types/dataset';
import { INDICATOR_DICTIONARY, CATEGORIES } from '../../data/indicatorDictionary';
import { calculateRowIndicator } from '../../services/indicatorCalculator';
import { ProgressBar } from '../common/ProgressBar';

interface PlanningUnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  row: MonitoringRow | null;
}

export const PlanningUnitModal: React.FC<PlanningUnitModalProps> = ({
  isOpen,
  onClose,
  row
}) => {
  if (!isOpen || !row) return null;

  const totalMonitored = Number(row.rawMetrics['D'] || 0);
  const totalMetDA = Number(row.rawMetrics['K'] || 0);

  // Group all indicators by category for this specific planning unit
  const categoryGroups = CATEGORIES.map(category => {
    const indicators = INDICATOR_DICTIONARY.filter(i => i.category === category);
    const indicatorResults = indicators.map(ind => {
      const calc = calculateRowIndicator(row, ind);
      return {
        indicator: ind,
        calc
      };
    });
    return {
      category,
      indicatorResults
    };
  }).filter(g => g.indicatorResults.length > 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="min-h-full flex items-center justify-center p-3 sm:p-6">
        <div className="relative bg-white rounded-2xl shadow-elevated border border-slate-200/80 w-full max-w-3xl overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-mda-50 text-mda-800 border border-mda-200/50">
                  Planning Unit Scorecard
                </span>
                <span className="text-xs font-medium text-slate-500">
                  {row.regime || 'IDA'} Regime
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                {row.planningUnit}
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>District: <strong className="text-slate-700">{row.district}</strong></span>
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-slate-100 border-b border-slate-100">
            <div className="bg-white p-4">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
                Teams Monitored
              </span>
              <span className="text-xl font-bold text-slate-900 metric-number">
                {totalMonitored}
              </span>
            </div>
            <div className="bg-white p-4">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
                Teams Met DA
              </span>
              <span className="text-xl font-bold text-slate-900 metric-number">
                {totalMetDA}
              </span>
            </div>
            <div className="bg-white p-4">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
                Persons Approached
              </span>
              <span className="text-xl font-bold text-slate-900 metric-number">
                {Number(row.rawMetrics['AJ'] || 0)}
              </span>
            </div>
            <div className="bg-white p-4">
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
                Directly Administered
              </span>
              <span className="text-xl font-bold text-slate-900 metric-number">
                {Number(row.rawMetrics['AK'] || 0)}
              </span>
            </div>
          </div>

          {/* Indicators by Category Body */}
          <div className="p-6 max-h-[65vh] overflow-y-auto space-y-6">
            {categoryGroups.map(group => (
              <div key={group.category} className="space-y-2.5">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    {group.category}
                  </h4>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {group.indicatorResults.length} metrics
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {group.indicatorResults.map(({ indicator, calc }) => {
                    const isNa = calc.percentage === null;
                    return (
                      <div
                        key={indicator.id}
                        className="p-3 rounded-xl border border-slate-100 bg-slate-50/40 hover:bg-white hover:border-slate-200 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className="text-xs font-semibold text-slate-800 leading-tight">
                            {indicator.shortName}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400 font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200">
                            {indicator.code}
                          </span>
                        </div>

                        <div className="flex items-baseline justify-between mt-2">
                          <span className="text-base font-bold text-slate-900 metric-number">
                            {calc.formattedPercentage}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {calc.numerator} / {calc.denominator}
                          </span>
                        </div>

                        {!isNa && (
                          <div className="mt-2">
                            <ProgressBar
                              value={calc.percentage}
                              target={indicator.target}
                              status={calc.status}
                              height="sm"
                              showTargetLine={false}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
            <span>
              Values derived strictly from verified field records without double-counting.
            </span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
