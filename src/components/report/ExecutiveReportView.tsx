import React, { useState, useRef } from 'react';
import {
  Download,
  Printer,
  Share2,
  Check,
  FileText,
  Activity,
  Layers,
  Calendar,
  MapPin,
  Users,
  CheckCircle2,
  BarChart3
} from 'lucide-react';
import { DistrictAggregate, GrandAggregate } from '../../types/indicator';
import { DatasetVersion, MonitoringRow } from '../../types/dataset';
import { CATEGORIES, INDICATOR_DICTIONARY, getIndicatorById } from '../../data/indicatorDictionary';
import { PillarRadarChart } from '../overview/PillarRadarChart';
import { IndicatorDispersionChart } from '../overview/IndicatorDispersionChart';
import { PillarComparativeChart } from '../overview/PillarComparativeChart';
import { generatePdfFromElement } from '../../services/pdfReportGenerator';

interface ExecutiveReportViewProps {
  dataset: DatasetVersion;
  grandAggregate: GrandAggregate;
  districtAggregates: DistrictAggregate[];
  rows: MonitoringRow[];
  onNavigateToIndicator?: (indicatorId: string) => void;
  onNavigateToDistrict?: (districtName: string) => void;
}

export const ExecutiveReportView: React.FC<ExecutiveReportViewProps> = ({
  dataset,
  grandAggregate,
  districtAggregates,
  rows,
  onNavigateToIndicator,
  onNavigateToDistrict
}) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Copy static shareable link to this PDF
  const handleCopyLink = async () => {
    const reportUrl = `${window.location.origin}${window.location.pathname}#/pdf`;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(reportUrl);
      } else {
        const input = document.createElement('input');
        input.value = reportUrl;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    } catch (err) {
      console.error('Failed to copy link', err);
    }
  };

  // Direct PDF Download
  const handleDownloadPdf = async () => {
    if (!reportRef.current) return;
    setIsGeneratingPdf(true);
    try {
      const cleanDate = new Date().toISOString().split('T')[0];
      await generatePdfFromElement(reportRef.current, {
        filename: `MDA_Concurrent_Monitoring_Summary_${cleanDate}.pdf`
      });
    } catch (err) {
      console.error('Error creating PDF:', err);
      // Fallback to native browser print if canvas fails
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Browser Print
  const handlePrint = () => {
    window.print();
  };

  const totalTeams = grandAggregate.rawSums['D'] || 0;
  const totalApproached = grandAggregate.rawSums['AJ'] || 0;
  const totalAdministered = grandAggregate.rawSums['AK'] || 0;

  return (
    <div className="space-y-6">
      {/* Action Bar (Hidden in Print & PDF) */}
      <div className="no-print bg-white p-4 rounded-xl border border-surface-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-4 h-4 text-mda-700" />
            <span>Compiled Executive Summary Report</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Static printable report compiling all 33 percentage indicators across all 10 thematic pillars.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Copy Link to Static Page */}
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-all shadow-xs active:scale-[0.98]"
            title="Copy shareable link to this report page"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Static Link</span>
              </>
            )}
          </button>

          {/* Print / Save PDF */}
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-all shadow-xs active:scale-[0.98]"
            title="Open browser print dialog to print or save as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print View</span>
          </button>

          {/* Direct Download PDF */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-mda-700 text-white text-xs font-bold hover:bg-mda-800 transition-all shadow-xs active:scale-[0.98] disabled:opacity-60"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {/* Main Printable Document Canvas */}
      <div
        ref={reportRef}
        id="executive-report-document"
        className="bg-white p-6 sm:p-10 rounded-2xl border border-surface-border shadow-xs print:border-none print:p-0 print:shadow-none space-y-8"
      >
        {/* Document Header */}
        <div className="border-b border-slate-200 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-mda-50 text-mda-800 border border-mda-200">
                  EXECUTIVE SUMMARY
                </span>
                <span className="text-xs text-slate-400">
                  {dataset.reportingPeriod || 'Concurrent Monitoring Evaluation'}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Mass Drug Administration (MDA) Field Monitoring Summary
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Compiled statistical analysis of all percentage indicators calculated across field observation records.
              </p>
            </div>

            <div className="text-left sm:text-right text-xs text-slate-500 shrink-0">
              <p className="font-semibold text-slate-700">MDA Concurrent Monitoring System</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Generated: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>

          {/* Key Executive Metadata Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-100">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Coverage Territory
              </span>
              <p className="text-base font-bold text-slate-900 mt-0.5 metric-number">
                {grandAggregate.totalDistricts} Districts
              </p>
              <span className="text-[11px] text-slate-500">
                {grandAggregate.totalPlanningUnits} Planning Units
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Teams Monitored
              </span>
              <p className="text-base font-bold text-slate-900 mt-0.5 metric-number">
                {totalTeams.toLocaleString()}
              </p>
              <span className="text-[11px] text-slate-500">
                DA Field Teams
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Observed In Field
              </span>
              <p className="text-base font-bold text-slate-900 mt-0.5 metric-number">
                {totalApproached.toLocaleString()}
              </p>
              <span className="text-[11px] text-slate-500">
                Persons Approached
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                Direct Consumption
              </span>
              <p className="text-base font-bold text-slate-900 mt-0.5 metric-number">
                {totalAdministered.toLocaleString()}
              </p>
              <span className="text-[11px] text-slate-500">
                Persons Administered
              </span>
            </div>
          </div>
        </div>

        {/* Section 1: Multi-Type Visual Analytics (Radar + Dispersion + Pillar Rankings) */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Section 1: Comparative Programmatic Visualizations
            </h2>
            <span className="text-xs text-slate-400">
              Multi-dimensional analysis
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Thematic Spider / Radar Chart */}
            <PillarRadarChart
              grandAggregate={grandAggregate}
              onSelectIndicator={onNavigateToIndicator}
            />

            {/* Indicator Dispersion / Range Plot */}
            <IndicatorDispersionChart
              districtAggregates={districtAggregates}
              grandAggregate={grandAggregate}
              onSelectDistrict={onNavigateToDistrict}
            />
          </div>

          {/* Ranked Horizontal Pillar Bars */}
          <PillarComparativeChart
            grandAggregate={grandAggregate}
            onSelectIndicator={onNavigateToIndicator}
          />
        </div>

        {/* Section 2: Master Compiled Indicator Table (All 33 Percentage Indicators) */}
        <div className="space-y-6 pt-4 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Section 2: Comprehensive Percentage Indicator Inventory
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Complete tabulation of all 33 indicators with real numerator/denominator counts and district dispersion.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500">
              Columns BG through CS (Excel)
            </span>
          </div>

          {/* Grouped by 10 Categories */}
          <div className="space-y-6">
            {CATEGORIES.map(category => {
              const indicators = INDICATOR_DICTIONARY.filter(ind => ind.category === category);
              if (indicators.length === 0) return null;

              return (
                <div key={category} className="border border-slate-200 rounded-xl overflow-hidden page-break-inside-avoid">
                  {/* Category Header */}
                  <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-mda-600"></span>
                      <h3 className="text-xs font-bold text-slate-800">
                        {category}
                      </h3>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {indicators.length} {indicators.length === 1 ? 'Indicator' : 'Indicators'}
                    </span>
                  </div>

                  {/* Indicator Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 bg-white text-[11px] font-semibold text-slate-500">
                          <th className="py-2.5 px-3 w-14">Code</th>
                          <th className="py-2.5 px-3 min-w-[200px]">Indicator Name</th>
                          <th className="py-2.5 px-3 text-right">Numerator / Denominator</th>
                          <th className="py-2.5 px-3 text-right w-24">State %</th>
                          <th className="py-2.5 px-3 w-36">Progress</th>
                          <th className="py-2.5 px-3 text-right min-w-[150px]">District Range (Min &bull; Max)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {indicators.map(ind => {
                          const calcVal = grandAggregate.indicatorValues[ind.id];
                          const pct = calcVal?.percentage ?? null;

                          // Compute min & max district values
                          const distVals = districtAggregates
                            .map(d => ({
                              district: d.district,
                              val: d.indicatorValues[ind.id]?.percentage ?? null
                            }))
                            .filter((d): d is { district: string; val: number } => d.val !== null);

                          let minStr = 'N/A';
                          let maxStr = 'N/A';
                          if (distVals.length > 0) {
                            distVals.sort((a, b) => a.val - b.val);
                            const minD = distVals[0];
                            const maxD = distVals[distVals.length - 1];
                            minStr = `${minD.val.toFixed(1)}% (${minD.district})`;
                            maxStr = `${maxD.val.toFixed(1)}% (${maxD.district})`;
                          }

                          return (
                            <tr key={ind.id} className="hover:bg-slate-50/60 transition-colors">
                              <td className="py-2.5 px-3 font-mono font-bold text-slate-500 text-[11px]">
                                {ind.code}
                              </td>
                              <td className="py-2.5 px-3">
                                <p className="font-semibold text-slate-800">
                                  {ind.name}
                                </p>
                                <p className="text-[10px] text-slate-400 mt-0.5">
                                  {ind.description}
                                </p>
                              </td>
                              <td className="py-2.5 px-3 text-right font-mono text-slate-600 text-[11px] whitespace-nowrap">
                                {calcVal && calcVal.denominator > 0 ? (
                                  <span>
                                    {calcVal.numerator.toLocaleString()} / {calcVal.denominator.toLocaleString()}
                                  </span>
                                ) : (
                                  <span className="text-slate-400">-</span>
                                )}
                              </td>
                              <td className="py-2.5 px-3 text-right font-bold text-slate-900 metric-number text-xs whitespace-nowrap">
                                {pct !== null ? `${pct.toFixed(1)}%` : 'N/A'}
                              </td>
                              <td className="py-2.5 px-3">
                                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-mda-600 rounded-full"
                                    style={{ width: `${Math.min(100, Math.max(0, pct ?? 0))}%` }}
                                  />
                                </div>
                              </td>
                              <td className="py-2.5 px-3 text-right text-[10px] text-slate-500 whitespace-nowrap">
                                <div>Min: {minStr}</div>
                                <div>Max: {maxStr}</div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Report Footer Note */}
        <div className="pt-6 border-t border-slate-200 text-center text-xs text-slate-400">
          <p>
            MDA Concurrent Monitoring Data &bull; Calculated mathematically per National MDA Guidelines from validated field observations.
          </p>
        </div>
      </div>
    </div>
  );
};
